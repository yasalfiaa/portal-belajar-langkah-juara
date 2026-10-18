"use client";

import React from "react";
import Link from "next/link";
import { Menu, User, ShieldCheck } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function Header({ onOpenSidebar, title }) {
  const { currentUser, switchUser } = useData();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#1F2937] leading-tight">
            {title || "Portal Belajar Langkah Juara"}
          </h1>
          <p className="text-xs text-[#5A6B78] hidden sm:block">
            Bimbingan Belajar Siswa SMP & SMA Makassar
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Simulation Dropdown */}
        <div className="flex items-center bg-[#F7F5F2] border border-gray-200/80 rounded-xl p-1 text-xs">
          <span className="text-[#5A6B78] px-2 font-semibold hidden md:inline">Akun:</span>
          <select
            value={currentUser?.aliasId || currentUser?.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-transparent font-bold text-[#EA580C] outline-hidden cursor-pointer pr-1"
          >
            <option value="user-raka">Raka (Siswa UTBK)</option>
            <option value="user-salsa">Salsa (Siswa SMP)</option>
            <option value="user-fira">Kak Fira (Staf)</option>
            <option value="user-dimas">Kak Dimas (Tutor UTBK)</option>
            <option value="user-nadia">Kak Nadia (Tutor SMP)</option>
            <option value="user-arif">Pak Arif (Super Admin)</option>
          </select>
        </div>

        {/* User Profile avatar */}
        <Link
          href="/profil"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-[#1F2937]"
        >
          <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentUser?.nama?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-bold text-[#1F2937] leading-none">
              {currentUser?.nama?.split(" ")[0]}
            </span>
            <span className="text-[10px] text-[#5A6B78] uppercase font-semibold">
              {currentUser?.role}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
