"use client";

import RouteGuard from "@/components/RouteGuard";

export default function ProgramLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
