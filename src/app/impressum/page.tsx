import type { Metadata } from "next";
import Impressum from "@/screens/Impressum";

export const metadata: Metadata = { title: "Impressum" };

export default function Page() {
  return <Impressum />;
}
