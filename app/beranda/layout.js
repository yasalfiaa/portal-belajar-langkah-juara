"use client";

import RouteGuard from "@/components/RouteGuard";

export default function BerandaLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
