"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import { GraduationCap, User, Calendar, Clock, MapPin, ChevronRight, BookOpen } from "lucide-react";

export default function SiswaKelasPage() {
  const { currentUser, kelas, users, programs } = useData();

  // Filter classes followed by this student (or all if super_admin)
  const enrolledClasses = currentUser.role === "super_admin"
    ? kelas
    : kelas.filter((k) => k.siswaIds?.includes(currentUser.id) || (currentUser.aliasId && k.siswaIds?.includes(currentUser.aliasId)));

  return (
    <PortalLayout title="Kelas Saya">
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C] text-[11px] font-bold uppercase tracking-wider mb-2">
            Rute: /siswa/kelas
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Daftar Kelas yang Diikuti</h2>
          <p className="text-sm text-[#5A6B78] mt-1">
            Lihat jadwal belajar rutin, materi tatap muka, dan tugas-tugas di kelas bimbingan Anda.
          </p>
        </div>

        {enrolledClasses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((item) => {
              const tutor = users.find((u) => u.id === item.tutorId);
              const program = programs.find((p) => p.id === item.programId);

              return (
                <Link
                  key={item.id}
                  href={`/siswa/kelas/${item.id}`}
                  className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:border-[#EA580C]/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] text-[11px] font-bold">
                        {program?.nama || "Program Bimbel"}
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {item.siswaIds.length} Siswa
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors mb-4">
                      {item.nama}
                    </h3>

                    <div className="space-y-2.5 text-xs text-[#5A6B78]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="font-medium text-[#1F2937]">
                          Tutor: {tutor?.nama || "Tutor Langkah Juara"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Setiap {item.hari}</span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>Pukul {item.jam} WITA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{item.tempat}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#EA580C]">
                    <span>Buka Rincian & Materi</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-orange-50 text-[#EA580C] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937] mb-1">
              Belum Terdaftar di Kelas Mana Pun
            </h3>
            <p className="text-xs text-[#5A6B78] mb-5 leading-relaxed">
              Anda belum dimasukkan ke kelas bimbingan aktif. Pastikan pendaftaran program Anda telah disetujui staf administrasi.
            </p>
            <Link
              href="/siswa/program"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold hover:bg-[#c2410c] transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cek Program Belajar</span>
            </Link>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
