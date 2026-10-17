"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import { Users, Search, Phone, Mail, BookOpen } from "lucide-react";

export default function DataSiswaStafPage() {
  const { users, pendaftaran, programs } = useData();

  const [searchQuery, setSearchQuery] = useState("");

  // Only users who are siswa
  const allStudents = users.filter((u) => u.role === "siswa");

  const filteredStudents = allStudents.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.nama.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <PortalLayout title="Data Siswa">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Direktori Siswa & Kontak Orang Tua</h2>
            <p className="text-sm text-[#5A6B78] mt-0.5">
              Halaman hanya-baca staf untuk koordinasi kehadiran dan komunikasi dengan wali murid.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 shadow-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Nama Siswa</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Nomor HP Orang Tua</th>
                  <th className="py-3.5 px-6">Program Aktif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((siswa) => {
                    // Active programs for this student
                    const activePends = pendaftaran.filter(
                      (p) => p.siswaId === siswa.id && p.status === "aktif"
                    );
                    const activeProgramsList = activePends
                      .map((p) => programs.find((pr) => pr.id === p.programId)?.nama)
                      .filter(Boolean);

                    return (
                      <tr key={siswa.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-[#1F2937]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-xs">
                              {siswa.nama.charAt(0)}
                            </div>
                            <span>{siswa.nama}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[#5A6B78]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{siswa.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 tabular-nums font-medium text-[#1F2937]">
                          {siswa.noHpOrangTua ? (
                            <a
                              href={`https://wa.me/${siswa.noHpOrangTua.replace(/^0/, "62")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{siswa.noHpOrangTua}</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Belum diisi</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {activeProgramsList.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {activeProgramsList.map((progName, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200"
                                >
                                  {progName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Belum ada program aktif</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-[#5A6B78]">
                      Tidak ditemukan siswa dengan kata kunci "{searchQuery}".
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
