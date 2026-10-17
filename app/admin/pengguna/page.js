"use client";

import React, { useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import { Users, Search, Shield, ChevronRight, Check, X, AlertTriangle, ChevronLeft } from "lucide-react";

export default function KelolaPenggunaAdminPage() {
  const { users, currentUser } = useData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");

  // Otorisasi: Halaman kelola pengguna dan edit hak akses hanya berlaku untuk Super Admin
  if (currentUser?.role !== "super_admin") {
    return (
      <PortalLayout title="Kelola Pengguna">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
          <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
            Halaman <strong>Kelola Pengguna</strong> dan bagian <strong>Edit Hak Akses</strong> hanya berlaku apabila akun yang terdaftar adalah <strong>Super Admin</strong>. Akun Anda saat ini masuk sebagai <strong>{currentUser?.role || "pengguna"}</strong>.
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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "semua" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "staf":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "tutor":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "siswa":
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <PortalLayout title="Kelola Pengguna">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Kelola Akun & Hak Akses Pengguna</h2>
            <p className="text-sm text-[#5A6B78] mt-0.5">
              Atur hak akses peran (Siswa, Staf, Tutor, Super Admin) dan kontrol status aktif akun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#EA580C] shadow-xs"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#EA580C] font-medium text-[#1F2937] shadow-xs"
            >
              <option value="semua">Semua Peran</option>
              <option value="siswa">Siswa</option>
              <option value="staf">Staf</option>
              <option value="tutor">Tutor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Table as specified in PRD Bab 4.15 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Nama Pengguna</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Peran</th>
                  <th className="py-3.5 px-6">Status Akun</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1F2937]">
                        <Link
                          href={`/admin/pengguna/${u.id}`}
                          className="hover:text-[#EA580C] transition-colors"
                        >
                          {u.nama}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-[#5A6B78]">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {u.aktif ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/pengguna/${u.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[#1F2937] hover:bg-orange-50 hover:border-orange-200 hover:text-[#EA580C] text-xs font-semibold transition-colors"
                        >
                          <span>Edit Hak Akses</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-[#5A6B78]">
                      Tidak ada pengguna yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
