"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { ShieldAlert, ChevronLeft } from "lucide-react";

const roleLabels = {
  siswa: "Siswa",
  staf: "Staf Administrasi",
  tutor: "Tutor Pengajar",
  super_admin: "Super Admin",
};

const homeRoutes = {
  siswa: "/siswa/beranda",
  staf: "/staf/dasbor",
  tutor: "/tutor/dasbor",
  super_admin: "/admin/dasbor",
};

function RedirectTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const { authUser, currentUser, authLoading } = useData();
  const isAuthenticated = Boolean(authUser || currentUser);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const redirectTarget = encodeURIComponent(pathname);
      router.replace(`/masuk?redirect=${redirectTarget}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

  return null;
}

export default function RouteGuard({ allowedRoles = [], children }) {
  const { authUser, currentUser, activeRole, authLoading } = useData();

  const userRole = currentUser?.role || activeRole;
  const isAuthenticated = Boolean(authUser || currentUser);

  let content = null;

  if (authLoading || (isAuthenticated && !userRole)) {
    content = (
      <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-sm w-full shadow-xs">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-[#1F2937] mb-1">Memuat...</h3>
          <p className="text-xs text-[#5A6B78] leading-relaxed">
            Sedang memeriksa status autentikasi dan peran akun...
          </p>
        </div>
      </div>
    );
  } else if (!isAuthenticated) {
    content = (
      <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-sm w-full shadow-xs">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-[#1F2937] mb-1">Mengarahkan ke Halaman Masuk...</h3>
          <p className="text-xs text-[#5A6B78] leading-relaxed">
            Silakan masuk terlebih dahulu untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  } else {
    const isAllowed = userRole === "super_admin" || allowedRoles.includes(userRole);

    if (!isAllowed) {
      const currentRoleLabel = roleLabels[userRole] || userRole || "Pengguna";
      const allowedRoleNames = allowedRoles.map((r) => roleLabels[r] || r).join(" atau ");

      content = (
        <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl border border-red-200/90 p-8 sm:p-10 text-center max-w-md w-full shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
              Akses Ditolak
            </span>
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              Anda Tidak Memiliki Hak Akses
            </h2>
            <p className="text-sm text-[#5A6B78] mb-6 leading-relaxed">
              Halaman ini hanya dapat diakses oleh peran <strong>{allowedRoleNames}</strong>. Akun Anda saat ini masuk dengan hak akses sebagai <strong>{currentRoleLabel}</strong>.
            </p>
            <div className="space-y-3">
              <Link
                href={homeRoutes[userRole] || "/siswa/beranda"}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold transition-colors shadow-sm shadow-[#EA580C]/20"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Dasbor Saya
              </Link>
              <Link
                href="/masuk"
                className="inline-flex items-center justify-center w-full px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#5A6B78] hover:bg-gray-50 transition-colors"
              >
                Ganti Akun Lain
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      content = children;
    }
  }

  return (
    <>
      <Suspense fallback={null}>
        <RedirectTracker />
      </Suspense>
      {content}
    </>
  );
}
