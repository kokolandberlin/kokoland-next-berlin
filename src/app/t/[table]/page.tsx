import type { Metadata } from "next";
import TableEntry from "@/screens/TableEntry";

// The page a table's QR code opens: private, never indexed.
export const metadata: Metadata = {
  title: "Order at your table",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TableEntry />;
}
