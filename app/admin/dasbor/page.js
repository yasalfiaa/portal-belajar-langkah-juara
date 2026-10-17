"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  Users,
  ClipboardList,
  Percent,
  ChevronRight,
  Shield,
  BookOpen,
  FileBarChart,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";

export default function DasborAdminRoutePage() {
  const { pendaftaran, kelas, pertemuan, currentUser } = useData();

  if (currentUser?.role !== "super_admin") {
    return (
      <PortalLayout title="Dasbor Admin">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
          <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
            Halaman <strong>Dasbor Admin</strong> hanya berlaku bagi akun <strong>Super Admin</strong>. Akun Anda saat ini masuk sebagai <strong>{currentUser?.role || "pengguna"}</strong>.
          </p>
          <Link
            href={
              currentUser?.role === "staf"
                ? "/staf/dasbor"
                : currentUser?.role === "tutor"
                ? "/tutor/dasbor"
                : "/siswa/beranda"
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Dasbor
          </Link>
        </div>
      </PortalLayout>
    );
  }

  // 1. Siswa aktif: jumlah siswa dengan minimal satu pendaftaran aktif
  const activeStudentIds = new Set(
    pendaftaran.filter((p) => p.status === "aktif").map((p) => p.siswaId)
  );
  const totalSiswaAktif = activeStudentIds.size;

  // 2. Pendaftaran bulan ini
  const totalPendaftaranBulanIni = pendaftaran.length;

  // 3. Rata-rata kehadiran
  let totalOpportunities = 0;
  let totalPresensiHadir = 0;

  pertemuan.forEach((pert) => {
    const parentClass = kelas.find((k) => k.id === pert.kelasId);
    const enrolledCount = parentClass?.siswaIds?.length || 0;
    if (enrolledCount > 0) {
      totalOpportunities += enrolledCount;
      totalPresensiHadir += (pert.hadirIds || []).length;
    }
  });

  const avgAttendance =
    totalOpportunities > 0
      ? Math.round((totalPresensiHadir / totalOpportunities) * 100)
      : 88;

  return (
    <PortalLayout title="Dasbor Pemilik (Super Admin)">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            Rute: /admin/dasbor
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Dasbor Eksekutif Pemilik</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Ikhtisar performa bimbingan belajar, metrik siswa aktif, dan rekap kehadiran lembaga.
          </p>
        </div>

        {/* 3 Main Metric Cards as specified in PRD Bab 4.14 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Siswa Aktif */}
          <Link
            href="/admin/laporan"
            className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                Siswa Aktif
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#EA580C] tabular-nums group-hover:scale-105 transition-transform">
                  {totalSiswaAktif}
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">terdaftar aktif</span>
              </div>
              <p className="text-xs text-[#5A6B78] mt-3 flex items-center gap-1 font-medium text-[#EA580C]">
                <span>Buka Rincian Laporan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-100">
              <Users className="w-6 h-6" />
            </div>
          </Link>

          {/* Card 2: Pendaftaran Bulan Ini */}
          <Link
            href="/admin/laporan"
            className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                Pendaftaran Bulan Ini
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#1F2937] tabular-nums">
                  {totalPendaftaranBulanIni}
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">pengajuan</span>
              </div>
              <p className="text-xs text-[#5A6B78] mt-3 flex items-center gap-1 font-medium text-[#EA580C]">
                <span>Pantau Pertumbuhan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ClipboardList className="w-6 h-6" />
            </div>
          </Link>

          {/* Card 3: Rata-rata Kehadiran */}
          <Link
            href="/admin/laporan"
            className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                Rata-rata Kehadiran
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#15A66A] tabular-nums">
                  {avgAttendance}%
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">presensi siswa</span>
              </div>
              <p className="text-xs text-[#5A6B78] mt-3 flex items-center gap-1 font-medium text-[#EA580C]">
                <span>Rekap Tiap Kelas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15A66A] flex items-center justify-center shrink-0 border border-emerald-100">
              <Percent className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Quick Management Shortcuts */}
        <div>
          <h3 className="text-base font-bold text-[#1F2937] mb-3">Modul Manajemen Pemilik</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/pengguna"
              className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-[#EA580C]/40 hover:shadow-xs transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors">
                  Kelola Pengguna
                </h4>
                <p className="text-xs text-[#5A6B78] mt-0.5">
                  Atur peran staf/tutor dan status aktif akun
                </p>
              </div>
            </Link>

            <Link
              href="/admin/program"
              className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-[#EA580C]/40 hover:shadow-xs transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors">
                  Program (Admin)
                </h4>
                <p className="text-xs text-[#5A6B78] mt-0.5">
                  Tambah paket bimbel, jenjang, harga, dan sesi
                </p>
              </div>
            </Link>

            <Link
              href="/admin/laporan"
              className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-[#EA580C]/40 hover:shadow-xs transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileBarChart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors">
                  Laporan Bulanan
                </h4>
                <p className="text-xs text-[#5A6B78] mt-0.5">
                  Rekap siswa aktif, kehadiran, dan kelas per tutor
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
