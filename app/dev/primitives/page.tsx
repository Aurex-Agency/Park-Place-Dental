import type { Metadata } from "next";
import { PrimitivesSandbox } from "./sandbox";

export const metadata: Metadata = {
  title: "Dev — Motion Primitives",
  robots: { index: false, follow: false },
};

export default function PrimitivesPage() {
  return <PrimitivesSandbox />;
}
