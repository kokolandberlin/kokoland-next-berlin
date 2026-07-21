// Derives a customer-facing tracking stage from the raw fields
// get_public_order_status returns. Two tracks: delivery orders go through
// the rider handoff, everything else (takeaway/dine-in) stops at "ready".

export type OrderType = "dine_in" | "takeaway" | "delivery";
export type KitchenStatus = "new" | "preparing" | "ready" | "served";
export type DeliveryStatus = "pending" | "assigned" | "picked_up" | "delivered" | "failed";

export interface PublicOrderStatus {
  order_number: string;
  order_type: OrderType;
  status: string;
  kitchen_status: KitchenStatus;
  items: { name: string; qty: number; price: number }[];
  total: number;
  created_at: string;
  delivery_status?: DeliveryStatus;
  eta?: string | null;
  rider_lat?: number | null;
  rider_lng?: number | null;
  rider_location_at?: string | null;
}

export interface Stage {
  key: string;
  label: string;
}

const TAKEAWAY_STAGES: Stage[] = [
  { key: "placed", label: "Order placed" },
  { key: "preparing", label: "Preparing your food" },
  { key: "ready", label: "Ready for pickup" },
  { key: "served", label: "Picked up" },
];

const DELIVERY_STAGES: Stage[] = [
  { key: "placed", label: "Order placed" },
  { key: "preparing", label: "Preparing your food" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

/** Index into the stage list for this order's current state, plus the list itself. */
export function deriveStage(o: PublicOrderStatus): { stages: Stage[]; index: number; failed: boolean } {
  const isDelivery = o.order_type === "delivery";
  const stages = isDelivery ? DELIVERY_STAGES : TAKEAWAY_STAGES;

  if (isDelivery) {
    if (o.delivery_status === "failed") return { stages, index: 2, failed: true };
    if (o.delivery_status === "delivered") return { stages, index: 3, failed: false };
    if (o.delivery_status === "picked_up") return { stages, index: 2, failed: false };
    if (o.kitchen_status === "preparing" || o.kitchen_status === "ready") return { stages, index: 1, failed: false };
    return { stages, index: 0, failed: false };
  }

  if (o.kitchen_status === "served") return { stages, index: 3, failed: false };
  if (o.kitchen_status === "ready") return { stages, index: 2, failed: false };
  if (o.kitchen_status === "preparing") return { stages, index: 1, failed: false };
  return { stages, index: 0, failed: false };
}

/** Once true, polling should stop — nothing further will change. */
export function isTerminal(o: PublicOrderStatus): boolean {
  if (o.status === "void" || o.status === "refunded") return true;
  if (o.order_type === "delivery") {
    return o.delivery_status === "delivered" || o.delivery_status === "failed";
  }
  return o.kitchen_status === "served";
}

/** Map should only render once a rider is actually en route with a known position. */
export function hasLiveLocation(o: PublicOrderStatus): boolean {
  return (
    o.order_type === "delivery" &&
    o.delivery_status === "picked_up" &&
    typeof o.rider_lat === "number" &&
    typeof o.rider_lng === "number"
  );
}
