"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  Users,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  User,
} from "lucide-react";

export default function DasborStafRoutePage() {
  const { pendaftaran, kelas, users, programs } = useData();

  const pendingRegistrations = pendaftaran.filter((p) => p.status === "menunggu");
  const todaysClasses = kelas;

  return (
    <PortalLayout title="Dasbor Staf Administrasi">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            Rute: /staf/dasbor
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Dasbor Staf</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Ringkasan harian operasional pendaftaran dan jadwal bimbingan belajar Langkah Juara.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Pendaftaran Menunggu */}
          <Link
            href="/staf/pendaftaran?status=menunggu"
            className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                Pendaftaran Menunggu
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#EA580C] tabular-nums group-hover:scale-105 transition-transform">
                  {pendingRegistrations.length}
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">calon siswa</span>
              </div>
              <p className="text-xs text-[#5A6B78] mt-3">
                Memerlukan verifikasi pembayaran di kantor & persetujuan staf
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <ClipboardList className="w-6 h-6" />
            </div>
          </Link>

          {/* Card 2: Total Kelas */}
          <Link
            href="/staf/kelas"
            className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all group flex items-start justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                Total Kelas Terjadwal
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#1F2937] tabular-nums">
                  {kelas.length}
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">kelompok belajar</span>
              </div>
              <p className="text-xs text-[#5A6B78] mt-3">
                Kelola alokasi tutor dan penempatan siswa aktif
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center shrink-0 border border-orange-100">
              <Calendar className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Section: Kelas Hari Ini */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">Kelas Hari Ini</h3>
              <p className="text-xs text-[#5A6B78]">
                Jadwal sesi bimbingan tatap muka & daring yang berlangsung hari ini
              </p>
            </div>
            <Link
              href="/staf/kelas"
              className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
            >
              <span>Kelola Semua Kelas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {todaysClasses.map((item) => {
              const tutor = users.find((u) => u.id === item.tutorId);
              const program = programs.find((p) => p.id === item.programId);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-gray-300 transition-all shadow-xs flex flex-col justify-between"
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
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Tutor: {tutor?.nama || "Belum Ditentukan"}</span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.hari}, Pukul {item.jam} WITA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.tempat}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
                    <Link
                      href={`/staf/kelas/${item.id}`}
                      className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
                    >
                      <span>Rincian & Siswa</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
