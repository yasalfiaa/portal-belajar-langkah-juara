"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import {
  Home,
  BookOpen,
  GraduationCap,
  FileText,
  User,
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Users,
  Award,
  Shield,
  FileBarChart,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeRole, switchRole, switchUser, currentUser, users, logoutUser } = useData();

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      active
        ? "bg-[#EA580C] text-white shadow-sm shadow-[#EA580C]/30 font-semibold"
        : "text-[#5A6B78] hover:text-[#1F2937] hover:bg-gray-100"
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-gray-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-gray-200/80 px-6 flex items-center justify-between bg-white">
          <Link href="/siswa/beranda" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EA580C] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#1F2937] block leading-tight">
                Langkah Juara
              </span>
              <span className="text-[11px] font-medium text-[#EA580C] tracking-wide uppercase">
                Portal Belajar
              </span>
            </div>
          </Link>
        </div>

        {/* Quick User / Role Selector */}
        <div className="p-3 bg-[#F7F5F2] border-b border-gray-200/80">
          <div className="text-[11px] font-semibold text-[#5A6B78] uppercase tracking-wider mb-1.5 px-1 flex items-center justify-between">
            <span>Simulasi Pengguna:</span>
            <span className="text-[#EA580C] font-bold uppercase">{currentUser?.role || "Belum Masuk"}</span>
          </div>
          <select
            value={currentUser?.id || ""}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-[#1F2937] outline-hidden focus:border-[#EA580C]"
          >
            <option value="">-- Mode Tamu (Belum Masuk) --</option>
            <option value="user-raka">Raka Pratama (Siswa UTBK)</option>
            <option value="user-salsa">Salsabila Putri (Siswa SMP)</option>
            <option value="user-fira">Kak Fira (Staf)</option>
            <option value="user-dimas">Kak Dimas (Tutor UTBK)</option>
            <option value="user-nadia">Kak Nadia (Tutor SMP)</option>
            <option value="user-arif">Pak Arif (Super Admin)</option>
          </select>
        </div>

        {/* Navigation Links according to Rancangan Portal Bimbel.md */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Siswa Section: Tampil untuk Siswa atau Super Admin */}
          {(currentUser?.role === "siswa" || currentUser?.role === "super_admin") && (
            <div>
              <div className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>Siswa</span>
                <span className="text-[10px] text-gray-400 font-normal">/siswa/*</span>
              </div>
              <div className="space-y-1">
                <Link href="/siswa/beranda" className={navItemClass("/siswa/beranda")}>
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Beranda</span>
                </Link>
                <Link href="/siswa/program" className={navItemClass("/siswa/program")}>
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Program</span>
                </Link>
                <Link href="/siswa/kelas" className={navItemClass("/siswa/kelas")}>
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Kelas Saya</span>
                </Link>
                <Link href="/profil" className={navItemClass("/profil")}>
                  <User className="w-4 h-4 shrink-0" />
                  <span>Profil</span>
                </Link>
              </div>
            </div>
          )}

          {/* Staf Section: Tampil untuk Staf atau Super Admin */}
          {(currentUser?.role === "staf" || currentUser?.role === "super_admin") && (
            <div>
              <div className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>Staf</span>
                <span className="text-[10px] text-gray-400 font-normal">/staf/*</span>
              </div>
              <div className="space-y-1">
                <Link href="/staf/dasbor" className={navItemClass("/staf/dasbor")}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dasbor Staf</span>
                </Link>
                <Link href="/staf/pendaftaran" className={navItemClass("/staf/pendaftaran")}>
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Pendaftaran</span>
                </Link>
                <Link href="/staf/kelas" className={navItemClass("/staf/kelas")}>
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  <span>Kelola Kelas</span>
                </Link>
                <Link href="/staf/siswa" className={navItemClass("/staf/siswa")}>
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Data Siswa</span>
                </Link>
                {currentUser?.role === "staf" && (
                  <Link href="/profil" className={navItemClass("/profil")}>
                    <User className="w-4 h-4 shrink-0" />
                    <span>Profil</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Tutor Section: Tampil untuk Tutor atau Super Admin */}
          {(currentUser?.role === "tutor" || currentUser?.role === "super_admin") && (
            <div>
              <div className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>Tutor</span>
                <span className="text-[10px] text-gray-400 font-normal">/tutor/*</span>
              </div>
              <div className="space-y-1">
                <Link href="/tutor/dasbor" className={navItemClass("/tutor/dasbor")}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dasbor Tutor</span>
                </Link>
                <Link href="/tutor/kelas/kelas-1" className={navItemClass("/tutor/kelas")}>
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Kelas yang Diajar</span>
                </Link>
                <Link href="/tutor/tugas" className={navItemClass("/tutor/tugas")}>
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Tugas dan Nilai</span>
                </Link>
                {currentUser?.role === "tutor" && (
                  <Link href="/profil" className={navItemClass("/profil")}>
                    <User className="w-4 h-4 shrink-0" />
                    <span>Profil</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Super Admin Section: HANYA TAMPIL bila akun yang masuk adalah Super Admin */}
          {currentUser?.role === "super_admin" && (
            <div>
              <div className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>Super Admin</span>
                <span className="text-[10px] text-gray-400 font-normal">/admin/*</span>
              </div>
              <div className="space-y-1">
                <Link href="/admin/dasbor" className={navItemClass("/admin/dasbor")}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dasbor Admin</span>
                </Link>
                <Link href="/admin/pengguna" className={navItemClass("/admin/pengguna")}>
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Kelola Pengguna</span>
                </Link>
                <Link href="/admin/program" className={navItemClass("/admin/program")}>
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Program</span>
                </Link>
                <Link href="/admin/laporan" className={navItemClass("/admin/laporan")}>
                  <FileBarChart className="w-4 h-4 shrink-0" />
                  <span>Laporan</span>
                </Link>
                <Link href="/profil" className={navItemClass("/profil")}>
                  <User className="w-4 h-4 shrink-0" />
                  <span>Profil Admin</span>
                </Link>
              </div>
            </div>
          )}

          {/* Public Authentication Pages */}
          <div className="pt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider px-3 mb-2">
              Publik
            </div>
            <div className="space-y-1">
              <Link href="/masuk" className={navItemClass("/masuk")}>
                <LogIn className="w-4 h-4 shrink-0" />
                <span>Masuk (/masuk)</span>
              </Link>
              <Link href="/daftar" className={navItemClass("/daftar")}>
                <FileText className="w-4 h-4 shrink-0" />
                <span>Daftar (/daftar)</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-gray-200/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#EA580C] font-bold flex items-center justify-center text-sm border border-orange-200 shrink-0">
              {currentUser?.nama?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1F2937] truncate leading-tight">
                {currentUser?.nama || "Pengguna"}
              </p>
              <p className="text-xs text-[#5A6B78] truncate">
                {currentUser?.email || "pengguna@langkahjuara.id"}
              </p>
            </div>
            <button
              onClick={async () => {
                await logoutUser();
                router.push("/masuk");
              }}
              title="Keluar / Ganti Akun"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
