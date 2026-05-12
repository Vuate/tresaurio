import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function PersonalizedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-route="dashboard">{children}</div>;
}
