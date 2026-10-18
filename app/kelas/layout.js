"use client";

import RouteGuard from "@/components/RouteGuard";

export default function KelasLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
