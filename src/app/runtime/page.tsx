import type { Metadata } from "next";
import { RuntimeDashboard } from "./runtime-dashboard";

export const metadata: Metadata = {
  title: "Runtime",
};

export default function RuntimePage() {
  return <RuntimeDashboard />;
}
