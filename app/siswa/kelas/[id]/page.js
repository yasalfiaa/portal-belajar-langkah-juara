"use client";

import React, { use, Suspense } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { useData, getTugasStatus, formatDateIndo } from "@/context/DataContext";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

function SiswaKelasDetailContent({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const { kelas, users, programs, pertemuan, tugas, pengumpulan, currentUser } = useData();

  const currentClass = kelas.find((k) => k.id === classId);

  if (!currentClass) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1F2937]">Kelas tidak ditemukan</h3>
        <p className="text-sm text-[#5A6B78] mt-1 mb-6">
          ID kelas yang Anda tuju tidak terdaftar di sistem Langkah Juara.
        </p>
        <Link
          href="/siswa/kelas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Kelas Saya
        </Link>
      </div>
    );
  }

  const tutor = users.find((u) => u.id === currentClass.tutorId);
  const program = programs.find((p) => p.id === currentClass.programId);

  const classPertemuan = pertemuan
    .filter((p) => p.kelasId === classId)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const classTugas = tugas
    .filter((t) => t.kelasId === classId)
    .map((t) => {
      const studentSub = pengumpulan.find(
        (p) => p.tugasId === t.id && p.siswaId === currentUser.id
      );
      const status = getTugasStatus(t, studentSub);
      return { ...t, status, studentSub };
    });

  return (
    <div className="space-y-6">
      <Link
        href="/siswa/kelas"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Kelas (/siswa/kelas)</span>
      </Link>

      {/* Header Info Panel */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
                {program?.nama || "Program Belajar"}
              </span>
              <span className="text-xs text-[#5A6B78] font-medium">
                Jenjang {program?.jenjang || "-"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">{currentClass.nama}</h2>
          </div>

          <div className="flex items-center gap-3 bg-[#F7F5F2] px-4 py-3 rounded-xl border border-gray-200/60">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-sm">
              {tutor?.nama?.charAt(0) || "T"}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider block">
                Tutor Pengajar
              </span>
              <span className="text-sm font-bold text-[#1F2937]">
                {tutor?.nama || "Tutor Langkah Juara"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-gray-100 text-xs text-[#5A6B78]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Hari Belajar</span>
              <span className="font-semibold text-[#1F2937]">{currentClass.hari}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Waktu Pertemuan</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">{currentClass.jam} WITA</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Ruang / Tautan Daring</span>
              <span className="font-semibold text-[#1F2937]">{currentClass.tempat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Pertemuan & Tugas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daftar Pertemuan */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EA580C]" />
              <span>Daftar Pertemuan & Materi</span>
            </h3>
            <span className="text-xs font-semibold text-[#5A6B78]">
              {classPertemuan.length} Pertemuan
            </span>
          </div>

          {classPertemuan.length > 0 ? (
            <div className="space-y-3">
              {classPertemuan.map((p, index) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 bg-gray-50/50 hover:bg-white transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
                        Pertemuan #{classPertemuan.length - index}
                      </span>
                      <span className="text-xs text-[#5A6B78] tabular-nums">
                        • {p.tanggal}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1F2937]">{p.topik}</h4>
                  </div>

                  {p.materiUrl ? (
                    <a
                      href={p.materiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-orange-50 text-[#EA580C] hover:bg-orange-100 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors border border-orange-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Materi</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Tidak ada materi</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5A6B78] py-8 text-center">
              Belum ada catatan pertemuan untuk kelas ini.
            </p>
          )}
        </div>

        {/* Daftar Tugas */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#EA580C]" />
              <span>Daftar Tugas</span>
            </h3>
            <span className="text-xs font-semibold text-[#5A6B78]">
              {classTugas.length} Tugas
            </span>
          </div>

          {classTugas.length > 0 ? (
            <div className="space-y-3">
              {classTugas.map((t) => (
                <Link
                  key={t.id}
                  href={`/siswa/tugas/${t.id}`}
                  className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 bg-gray-50/50 hover:bg-white transition-all flex items-center justify-between gap-3 block group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={t.status} />
                      <span className="text-xs text-amber-700 font-medium tabular-nums">
                        Batas: {formatDateIndo(t.batasWaktu)}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors">
                      {t.judul}
                    </h4>
                    {t.studentSub?.nilai !== null && t.studentSub?.nilai !== undefined && (
                      <p className="text-xs font-bold text-green-700 mt-1 tabular-nums">
                        Nilai: {t.studentSub.nilai}/100
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#EA580C] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#5A6B78] py-8 text-center">
              Belum ada tugas yang diberikan untuk kelas ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiswaKelasDetailPage({ params }) {
  return (
    <PortalLayout title="Rincian Kelas Siswa">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat rincian kelas...</div>}>
        <SiswaKelasDetailContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
