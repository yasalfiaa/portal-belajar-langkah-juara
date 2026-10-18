"use client";

import RouteGuard from "@/components/RouteGuard";

export default function AdminLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["super_admin"]}>
      {children}
    </RouteGuard>
  );
}
