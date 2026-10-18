"use client";

import RouteGuard from "@/components/RouteGuard";

export default function TugasLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
