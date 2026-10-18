"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RouteGuard from "@/components/RouteGuard";

export default function SuperAdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dasbor");
  }, [router]);

  return (
    <RouteGuard allowedRoles={["super_admin"]}>
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
        <p className="text-sm text-[#5A6B78]">Mengarahkan ke Dasbor Admin...</p>
      </div>
    </RouteGuard>
  );
}
