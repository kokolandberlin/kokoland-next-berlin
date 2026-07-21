import type { Metadata } from "next";
import Datenschutz from "@/screens/Datenschutz";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function Page() {
  return <Datenschutz />;
}
