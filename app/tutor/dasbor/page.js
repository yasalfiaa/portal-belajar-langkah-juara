"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Award,
} from "lucide-react";

export default function DasborTutorRoutePage() {
  const { currentUser, kelas, programs } = useData();

  // If user is tutor, filter by current tutor, or default to all tutor-assigned classes
  const tutorClasses = currentUser.role === "tutor"
    ? kelas.filter((k) => k.tutorId === currentUser.id)
    : kelas;

  const todaysTutorClasses = tutorClasses;

  return (
    <PortalLayout title="Dasbor Tutor">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            Rute: /tutor/dasbor
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Dasbor Pengajar</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Kelola sesi bimbingan tatap muka, catat presensi siswa, serta berikan nilai dan umpan balik tugas.
          </p>
        </div>

        {/* Section 1: Kelas Hari Ini */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2937]">Kelas Hari Ini</h3>
            <span className="text-xs text-[#5A6B78] font-semibold">
              {todaysTutorClasses.length} sesi terjadwal
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {todaysTutorClasses.map((item) => {
              const program = programs.find((p) => p.id === item.programId);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-[#EA580C]/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                        {program?.nama || "Program"}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {item.siswaIds?.length || 0} Siswa
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#1F2937] mb-2">{item.nama}</h4>

                    <div className="space-y-1.5 text-xs text-[#5A6B78]">
                      <div className="flex items-center gap-2 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.hari}, {item.jam} WITA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.tempat}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-[#5A6B78]">
                      Presensi & Evaluasi
                    </span>
                    <Link
                      href={`/tutor/kelas/${item.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Buka Kelas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Semua Kelas Saya */}
        <div>
          <div className="mb-3">
            <h3 className="text-base font-bold text-[#1F2937]">Semua Kelas Saya</h3>
            <p className="text-xs text-[#5A6B78]">
              Daftar seluruh kelompok belajar yang Anda ampu di Langkah Juara
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100">
            {tutorClasses.map((item) => {
              const program = programs.find((p) => p.id === item.programId);
              return (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#1F2937]">{item.nama}</span>
                      <span className="text-xs text-[#5A6B78]">({program?.nama})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6B78]">
                      <span>{item.hari}, {item.jam} WITA</span>
                      <span>•</span>
                      <span>{item.tempat}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#EA580C]">{item.siswaIds?.length || 0} Siswa</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tutor/kelas/${item.id}`}
                      className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#EA580C] hover:text-[#EA580C] text-xs font-semibold text-[#1F2937] transition-colors"
                    >
                      Kelola Kelas
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
