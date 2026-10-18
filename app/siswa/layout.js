"use client";

import RouteGuard from "@/components/RouteGuard";

export default function SiswaLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
