"use client";

import React from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { useData, getTugasStatus, formatDateIndo } from "@/context/DataContext";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SiswaBerandaPage() {
  const { currentUser, kelas, tugas, pengumpulan } = useData();

  // Find classes where currentUser is in siswaIds
  const myClasses = currentUser
    ? kelas.filter(
        (k) =>
          k.siswaIds?.includes(currentUser.id) ||
          (currentUser.aliasId && k.siswaIds?.includes(currentUser.aliasId))
      )
    : [];
  const nextClass = myClasses.length > 0 ? myClasses[0] : null;

  // Find tasks belonging to student's enrolled classes
  const myClassIds = myClasses.map((k) => k.id);
  const myTugas = tugas.filter((t) => myClassIds.includes(t.kelasId));

  const uncompletedTasks = myTugas
    .map((t) => {
      const studentSubmission = currentUser
        ? pengumpulan.find(
            (p) =>
              p.tugasId === t.id &&
              (p.siswaId === currentUser.id ||
                (currentUser.aliasId && p.siswaId === currentUser.aliasId))
          )
        : null;
      const status = getTugasStatus(t, studentSubmission);
      return { ...t, status, studentSubmission };
    })
    .filter((t) => t.status === "Belum dikumpulkan" || t.status === "Terlambat")
    .sort((a, b) => new Date(a.batasWaktu) - new Date(b.batasWaktu));

  return (
    <PortalLayout title="Beranda Siswa">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Siswa • /siswa/beranda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {currentUser?.nama || "Siswa"}! 👋
            </h2>
            <p className="text-orange-100 text-sm mt-1 max-w-xl">
              Pantau jadwal kelas bimbingan mendatang, materi tatap muka, dan tugas yang harus dikumpulkan tepat waktu.
            </p>
          </div>
          <Link
            href="/siswa/program"
            className="px-5 py-2.5 rounded-xl bg-white text-[#EA580C] hover:bg-orange-50 font-bold text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Lihat Program Belajar</span>
          </Link>
        </div>

        {/* Section 1: Kelas Berikutnya */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2937]">Kelas Berikutnya</h3>
            {myClasses.length > 0 && (
              <Link href="/siswa/kelas" className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center">
                <span>Semua Kelas</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}
          </div>

          {nextClass ? (
            <Link
              href={`/siswa/kelas/${nextClass.id}`}
              className="block bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 hover:border-[#EA580C]/50 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider block">
                      Jadwal Mendatang
                    </span>
                    <h4 className="text-lg font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors">
                      {nextClass.nama}
                    </h4>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-[#5A6B78]">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {nextClass.hari}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {nextClass.jam} WITA
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {nextClass.tempat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-[#EA580C] self-end sm:self-center">
                  <span>Buka Rincian Kelas</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center">
              <div className="w-12 h-12 bg-orange-50 text-[#EA580C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#1F2937] mb-1">
                Anda belum terdaftar di kelas mana pun
              </h4>
              <p className="text-xs text-[#5A6B78] mb-4 max-w-sm mx-auto">
                Ajukan pendaftaran program bimbingan belajar untuk dimasukkan ke jadwal kelas aktif oleh staf.
              </p>
              <Link
                href="/siswa/program"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold hover:bg-[#c2410c] transition-colors"
              >
                <span>Lihat Program</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Tugas Belum Dikumpulkan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-[#1F2937]">Tugas Belum Dikumpulkan</h3>
            <span className="text-xs text-[#5A6B78]">
              {uncompletedTasks.length} tugas menunggu
            </span>
          </div>

          {uncompletedTasks.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {uncompletedTasks.map((t) => {
                const classObj = kelas.find((k) => k.id === t.kelasId);
                return (
                  <Link
                    key={t.id}
                    href={`/siswa/tugas/${t.id}`}
                    className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-[#EA580C]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-[#5A6B78]">
                          {classObj?.nama || "Kelas Bimbingan"}
                        </span>
                        <StatusBadge status={t.status} />
                      </div>
                      <h4 className="text-sm font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors line-clamp-1">
                        {t.judul}
                      </h4>
                      <p className="text-xs text-[#5A6B78] mt-1 line-clamp-2">
                        {t.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Batas: {formatDateIndo(t.batasWaktu)}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#EA580C] group-hover:translate-x-0.5 transition-transform flex items-center">
                        Kumpulkan
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1F2937]">Semua tugas sudah dikumpulkan!</p>
              <p className="text-xs text-[#5A6B78] mt-0.5">
                Hebat! Tidak ada tugas yang tertunda untuk saat ini.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
