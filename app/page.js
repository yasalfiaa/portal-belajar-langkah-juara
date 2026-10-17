"use client";

import React from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  ClipboardList,
  LayoutDashboard,
  Shield,
  BookOpen,
  CheckCircle2,
  LogIn,
  UserPlus,
  AlertTriangle,
  HelpCircle,
  Lock,
} from "lucide-react";

export default function RootHomePage() {
  const { switchUser } = useData();

  const rolePortals = [
    {
      role: "siswa",
      title: "Portal Siswa",
      description: "Jadwal kelas berikutnya, materi bimbingan, kumpulkan tautan tugas, dan pantau nilai.",
      path: "/siswa/beranda",
      icon: GraduationCap,
      color: "from-orange-500 to-amber-500",
      pages: [
        { name: "Beranda Siswa", url: "/siswa/beranda" },
        { name: "Katalog Program", url: "/siswa/program" },
        { name: "Kelas Saya", url: "/siswa/kelas" },
        { name: "Rincian Kelas & Materi", url: "/siswa/kelas/kelas-1" },
        { name: "Rincian & Kumpul Tugas", url: "/siswa/tugas/tugas-1" },
        { name: "Profil Siswa", url: "/profil" },
      ],
    },
    {
      role: "staf",
      title: "Dasbor Staf Administrasi",
      description: "Verifikasi pendaftaran menunggu, susun kelas bimbingan, dan data kontak orang tua.",
      path: "/staf/dasbor",
      icon: ClipboardList,
      color: "from-blue-600 to-cyan-600",
      pages: [
        { name: "Dasbor Staf", url: "/staf/dasbor" },
        { name: "Kelola Pendaftaran", url: "/staf/pendaftaran" },
        { name: "Kelola Kelas (Daftar)", url: "/staf/kelas" },
        { name: "Rincian & Tambah Siswa", url: "/staf/kelas/kelas-1" },
        { name: "Direktori Data Siswa", url: "/staf/siswa" },
      ],
    },
    {
      role: "tutor",
      title: "Dasbor Tutor Pengajar",
      description: "Jadwal sesi kelas hari ini, buat pertemuan, catat presensi hadir, dan berikan nilai.",
      path: "/tutor/dasbor",
      icon: LayoutDashboard,
      color: "from-amber-500 to-orange-600",
      pages: [
        { name: "Dasbor Tutor", url: "/tutor/dasbor" },
        { name: "Kelas yang Diajar & Presensi", url: "/tutor/kelas/kelas-1" },
        { name: "Tugas dan Nilai (Ringkasan)", url: "/tutor/tugas" },
        { name: "Evaluasi & Penilaian Tugas", url: "/tutor/tugas/tugas-1" },
      ],
    },
    {
      role: "super_admin",
      title: "Dasbor Super Admin (Pemilik)",
      description: "Metrik siswa aktif, kelola peran pengguna, katalog program belajar, dan laporan bulanan.",
      path: "/admin/dasbor",
      icon: Shield,
      color: "from-purple-600 to-indigo-600",
      pages: [
        { name: "Dasbor Eksekutif Admin", url: "/admin/dasbor" },
        { name: "Kelola Pengguna & Peran", url: "/admin/pengguna" },
        { name: "Edit Pengguna", url: "/admin/pengguna/user-nadia" },
        { name: "Program Belajar (Admin)", url: "/admin/program" },
        { name: "Laporan Bulanan Rekap", url: "/admin/laporan" },
      ],
    },
  ];

  const businessDecisions = [
    {
      question: "Bolehkah staf mengubah nilai tugas?",
      decision: "Tidak, hanya tutor kelas tersebut dan super admin yang dapat mengisi nilai dan komentar (4.13)",
      testAction: "Uji: Masuk sebagai Kak Fira (Staf) lalu buka /tutor/tugas/tugas-1 -> Form penilaian dinonaktifkan.",
      userId: "user-fira",
      targetUrl: "/tutor/tugas/tugas-1",
    },
    {
      question: "Bolehkah Kak Dimas membuka kelas Kak Nadia?",
      decision: "Tidak, Kak Dimas memiliki id kelas yang berbeda sehingga akses ditolak (4.12)",
      testAction: "Uji: Masuk sebagai Kak Dimas lalu buka kelas Matematika SMP B (/tutor/kelas/kelas-2) -> Akses Ditolak.",
      userId: "user-dimas",
      targetUrl: "/tutor/kelas/kelas-2",
    },
    {
      question: "Bolehkah Raka melihat nilai Salsa?",
      decision: "Tidak, Raka mendaftar di kelas yang berbeda (UTBK) sehingga muncul notifikasi tugas tidak ditemukan (4.5)",
      testAction: "Uji: Masuk sebagai Raka lalu buka tugas Matematika SMP (/siswa/tugas/tugas-2) -> Tugas tidak ditemukan.",
      userId: "user-raka",
      targetUrl: "/siswa/tugas/tugas-2",
    },
    {
      question: "Halaman mana saja yang boleh dibuka Pak Arif?",
      decision: "Membuka semua halaman peran lain, ditambah mengelola pengguna, program, dan laporan (2.1)",
      testAction: "Uji: Masuk sebagai Pak Arif (Admin) -> Menu /admin/pengguna tampil & dapat mengedit hak akses. Masuk sebagai selain Admin (Siswa/Staf/Tutor) -> Alamat ini tidak tampil di dasbor, dan bila dibuka langsung akses ditolak.",
      userId: "user-arif",
      targetUrl: "/admin/pengguna",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EA580C] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#1F2937] block leading-tight">
                Langkah Juara
              </span>
              <span className="text-[11px] font-semibold text-[#EA580C] tracking-wide uppercase">
                Portal Belajar Makassar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/masuk"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#1F2937] hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/daftar"
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Siswa</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#EA580C] text-xs font-bold mb-4 border border-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sesuai Dokumen Rancangan Portal Bimbel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F2937] tracking-tight leading-tight">
            Portal Belajar <span className="text-[#EA580C]">Langkah Juara</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#5A6B78] leading-relaxed">
            Struktur rute halaman dan keputusan bisnis telah disesuaikan sepenuhnya dengan <strong>Dokumen Rancangan Portal Bimbel</strong> (Peta Route, Matriks Akses, dan 4 Keputusan Bisnis).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              href="/siswa/beranda"
              onClick={() => switchUser("user-raka")}
              className="px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-bold shadow-md shadow-[#EA580C]/20 transition-all flex items-center gap-2"
            >
              <span>Buka Beranda Siswa (/siswa/beranda)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/masuk"
              className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-[#1F2937] hover:bg-gray-50 text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Halaman Masuk (/masuk)</span>
            </Link>
          </div>
        </div>

        {/* 4 Keputusan Bisnis Interactive Section */}
        <div className="bg-white rounded-3xl border border-orange-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F2937]">
                Penerapan 4 Keputusan Bisnis (Bab 3 Rancangan)
              </h3>
              <p className="text-xs text-[#5A6B78]">
                Setiap aturan bisnis telah diterapkan pada sistem dan dapat diuji secara langsung:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessDecisions.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-white hover:border-[#EA580C]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase tracking-wider mb-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>Pertanyaan Bisnis #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1F2937] mb-2">{item.question}</h4>
                  <div className="p-3 rounded-xl bg-white border border-gray-200/60 text-xs text-[#1F2937] font-medium mb-3">
                    <strong className="text-red-600 block mb-0.5">Keputusan:</strong>
                    {item.decision}
                  </div>
                  <p className="text-[11px] text-[#5A6B78]">{item.testAction}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex justify-end">
                  <Link
                    href={item.targetUrl}
                    onClick={() => switchUser(item.userId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Uji Keputusan Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Role Portals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rolePortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.role}
                className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-[#EA580C]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${portal.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#1F2937]">{portal.title}</h2>
                        <span className="text-xs font-semibold text-[#EA580C] uppercase tracking-wider">
                          Peran: {portal.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5A6B78] leading-relaxed mb-5">
                    {portal.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                      Peta Route ({portal.title}):
                    </span>
                    {portal.pages.map((pg, idx) => (
                      <Link
                        key={idx}
                        href={pg.url}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#1F2937] hover:bg-orange-50 hover:text-[#EA580C] transition-colors"
                      >
                        <span>{pg.name}</span>
                        <code className="text-[11px] font-mono text-[#5A6B78] bg-gray-100 px-2 py-0.5 rounded-md">
                          {pg.url}
                        </code>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100">
                  <Link
                    href={portal.path}
                    className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#EA580C] text-[#1F2937] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Buka {portal.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Peta Route Complete Reference Table (Bab 2 Dokumen Rancangan) */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-base font-bold text-[#1F2937]">
              Peta Route Lengkap (Bab 2 Dokumen Rancangan)
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Daftar seluruh alamat halaman persis sesuai tabel pada dokumen rancangan teknis:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3 px-6">Halaman</th>
                  <th className="py-3 px-6">Alamat (Route)</th>
                  <th className="py-3 px-6">Peran yang Boleh Membuka</th>
                  <th className="py-3 px-6 text-right">Buka Halaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {[
                  { name: "Masuk", url: "/masuk", roles: "siswa, staf, tutor, super_admin" },
                  { name: "Beranda", url: "/siswa/beranda", roles: "siswa, super_admin" },
                  { name: "Program", url: "/siswa/program", roles: "siswa, super_admin" },
                  { name: "Kelas Saya", url: "/siswa/kelas", roles: "siswa, super_admin" },
                  { name: "Rincian Kelas", url: "/siswa/kelas/kelas-1", roles: "siswa, super_admin (staf/tutor id sama)" },
                  { name: "Tugas", url: "/siswa/tugas/tugas-1", roles: "siswa, super_admin" },
                  { name: "Profil", url: "/profil", roles: "siswa, staf, tutor, super_admin" },
                  { name: "Dasbor Staf", url: "/staf/dasbor", roles: "staf, super_admin" },
                  { name: "Pendaftaran", url: "/staf/pendaftaran", roles: "staf, super_admin" },
                  { name: "Kelola Kelas", url: "/staf/kelas", roles: "staf, super_admin" },
                  { name: "Data Siswa", url: "/staf/siswa", roles: "staf, super_admin" },
                  { name: "Dasbor Tutor", url: "/tutor/dasbor", roles: "tutor, super_admin" },
                  { name: "Kelas yang Diajar", url: "/tutor/kelas/kelas-1", roles: "tutor, super_admin" },
                  { name: "Tugas dan Nilai", url: "/tutor/tugas", roles: "tutor, super_admin" },
                  { name: "Evaluasi Tugas", url: "/tutor/tugas/tugas-1", roles: "tutor, super_admin" },
                  { name: "Dasbor Admin", url: "/admin/dasbor", roles: "super_admin" },
                  { name: "Kelola Pengguna", url: "/admin/pengguna", roles: "super_admin" },
                  { name: "Program (Admin)", url: "/admin/program", roles: "super_admin" },
                  { name: "Laporan", url: "/admin/laporan", roles: "super_admin" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-6 font-bold text-[#1F2937]">{row.name}</td>
                    <td className="py-3 px-6 font-mono text-[#EA580C] text-[11px] font-semibold">
                      {row.url}
                    </td>
                    <td className="py-3 px-6 text-[#5A6B78]">{row.roles}</td>
                    <td className="py-3 px-6 text-right">
                      <Link
                        href={row.url}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
                      >
                        <span>Buka</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
