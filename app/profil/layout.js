"use client";

import RouteGuard from "@/components/RouteGuard";

export default function ProfilLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["siswa", "staf", "tutor", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
