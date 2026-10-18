"use client";

import RouteGuard from "@/components/RouteGuard";

export default function TutorLayout({ children }) {
  return (
    <RouteGuard allowedRoles={["tutor", "super_admin"]}>
      {children}
    </RouteGuard>
  );
}
