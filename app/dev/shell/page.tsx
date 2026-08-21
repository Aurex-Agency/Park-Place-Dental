import type { Metadata } from "next";
import { ShellSandbox } from "./sandbox";

export const metadata: Metadata = {
  title: "Dev — Shell Harness",
  robots: { index: false, follow: false },
};

export default function DevShellPage() {
  return <ShellSandbox />;
}
