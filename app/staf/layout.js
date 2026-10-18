"use client";

import RouteGuard from "@/components/RouteGuard";

export default function StafLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["staf", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
