"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function Header({ onOpenSidebar, title }) {
  const { currentUser } = useData();

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

        {title && (
          <div>
            <h1 className="text-lg font-bold text-[#1F2937] leading-tight">
              {title}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
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
              {currentUser?.nama?.split(" ")[0] || "Tamu"}
            </span>
            <span className="text-[10px] text-[#5A6B78] uppercase font-semibold">
              {currentUser?.role || "Belum Masuk"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
