import type { Metadata } from "next";

import { HubOverlay } from "@/components/overlay/HubOverlay";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HubOverlay />;
}
