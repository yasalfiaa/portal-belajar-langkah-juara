"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import { useData, formatDateIndo } from "@/context/DataContext";
import { Award, Clock, ChevronRight, CheckCircle2, FileText } from "lucide-react";

export default function TugasDanNilaiTutorOverviewPage() {
  const { currentUser, kelas, tugas, pengumpulan } = useData();

  // If tutor, get classes assigned to them (or all if super admin)
  const tutorClasses = currentUser.role === "tutor"
    ? kelas.filter((k) => k.tutorId === currentUser.id || k.tutorId === currentUser.aliasId)
    : kelas;

  const tutorClassIds = tutorClasses.map((k) => k.id);
  const relevantTugas = tugas.filter((t) => tutorClassIds.includes(t.kelasId));

  return (
    <PortalLayout title="Tugas dan Nilai">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Daftar Tugas dan Penilaian</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Pilih tugas dari kelas bimbingan yang Anda ampu untuk memeriksa pengumpulan dan memberikan nilai.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Judul Tugas</th>
                  <th className="py-3.5 px-6">Kelas Bimbingan</th>
                  <th className="py-3.5 px-6">Batas Waktu</th>
                  <th className="py-3.5 px-6">Status Pengumpulan</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {relevantTugas.length > 0 ? (
                  relevantTugas.map((t) => {
                    const classObj = kelas.find((k) => k.id === t.kelasId);
                    const totalStudents = classObj?.siswaIds?.length || 0;
                    const submissions = pengumpulan.filter((p) => p.tugasId === t.id);
                    const gradedSubmissions = submissions.filter(
                      (p) => p.nilai !== null && p.nilai !== undefined && p.nilai !== ""
                    );

                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#1F2937]">
                          <Link
                            href={`/tutor/tugas/${t.id}`}
                            className="hover:text-[#EA580C] transition-colors"
                          >
                            {t.judul}
                          </Link>
                          <p className="text-[11px] font-normal text-[#5A6B78] line-clamp-1 mt-0.5">
                            {t.deskripsi}
                          </p>
                        </td>
                        <td className="py-4 px-6 font-medium text-[#1F2937]">
                          {classObj?.nama || "-"}
                        </td>
                        <td className="py-4 px-6 tabular-nums text-amber-700 font-medium">
                          {formatDateIndo(t.batasWaktu)}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-[#1F2937] tabular-nums">
                            {submissions.length} / {totalStudents} Terkumpul
                          </span>
                          <span className="text-[11px] text-green-700 block font-medium mt-0.5 tabular-nums">
                            {gradedSubmissions.length} Dinilai
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/tutor/tugas/${t.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Buka & Nilai</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-[#5A6B78]">
                      Belum ada tugas yang dibuat untuk kelas yang Anda ampu.
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
