"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import MasukPage from "./masuk/page";

export default function RootHomePage() {
  const router = useRouter();
  const { authUser, currentUser, activeRole, authLoading } = useData();

  useEffect(() => {
    if (!authLoading && authUser) {
      const role = currentUser?.role || activeRole || "siswa";
      if (role === "siswa") router.replace("/siswa/beranda");
      else if (role === "staf") router.replace("/staf/dasbor");
      else if (role === "tutor") router.replace("/tutor/dasbor");
      else if (role === "super_admin") router.replace("/admin/dasbor");
    }
  }, [authUser, currentUser, activeRole, authLoading, router]);

  // Halaman pengguna sebelum login menyajikan split-screen portal masuk & landing
  return <MasukPage />;
}
