import { Suspense } from "react";
import Track from "@/screens/Track";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Track />
    </Suspense>
  );
}
