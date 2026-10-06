import type { Metadata } from "next";
import { Suspense } from "react";
import OrderPage from "@/screens/OrderPage";

// A private link between kokoland and the guest: never indexed.
export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderPage />
    </Suspense>
  );
}
