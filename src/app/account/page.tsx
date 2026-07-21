import { Suspense } from "react";
import Account from "@/screens/Account";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Account />
    </Suspense>
  );
}
