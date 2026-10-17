"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import { useData } from "@/context/DataContext";
import {
  FileBarChart,
  Calendar,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

function LaporanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBulan = searchParams.get("bulan") || "2026-10";

  const { programs, pendaftaran, kelas, pertemuan, users, currentUser } = useData();

  if (currentUser?.role !== "super_admin") {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
        <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
          Halaman <strong>Laporan (Admin)</strong> hanya berlaku bagi akun <strong>Super Admin</strong>. Akun Anda saat ini masuk sebagai <strong>{currentUser?.role || "pengguna"}</strong>.
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
    );
  }

  const handleMonthChange = (e) => {
    const val = e.target.value;
    router.push(`/admin/laporan?bulan=${val}`);
  };

  // 1. Siswa aktif per program
  // Calculate active students per program
  const activeRegistrations = pendaftaran.filter((p) => p.status === "aktif");

  const programStats = programs.map((prog) => {
    const activeStudentIds = new Set(
      activeRegistrations.filter((p) => p.programId === prog.id).map((p) => p.siswaId)
    );
    return {
      id: prog.id,
      nama: prog.nama,
      jenjang: prog.jenjang,
      siswaAktifCount: activeStudentIds.size,
    };
  });

  // 2. Kehadiran per kelas (rata-rata persentase hadir)
  const classStats = kelas.map((k) => {
    const classPertemuan = pertemuan.filter((p) => p.kelasId === k.id);
    const totalSiswa = k.siswaIds?.length || 0;

    let totalPossibilities = 0;
    let totalPresent = 0;

    classPertemuan.forEach((pert) => {
      totalPossibilities += totalSiswa;
      totalPresent += (pert.hadirIds || []).length;
    });

    const attendanceRate =
      totalPossibilities > 0
        ? Math.round((totalPresent / totalPossibilities) * 100)
        : 100;

    return {
      id: k.id,
      nama: k.nama,
      jumlahSiswa: totalSiswa,
      jumlahPertemuan: classPertemuan.length,
      rataRataHadir: attendanceRate,
    };
  });

  // 3. Jumlah kelas per tutor (jumlah kelas dan jumlah pertemuan bulan itu)
  const tutors = users.filter((u) => u.role === "tutor");
  const tutorStats = tutors.map((tutor) => {
    const tutorClasses = kelas.filter((k) => k.tutorId === tutor.id);
    const tutorClassIds = tutorClasses.map((k) => k.id);
    const tutorPertemuan = pertemuan.filter((p) => tutorClassIds.includes(p.kelasId));

    return {
      id: tutor.id,
      nama: tutor.nama,
      email: tutor.email,
      jumlahKelas: tutorClasses.length,
      jumlahPertemuan: tutorPertemuan.length,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header and Month Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Laporan Rekap Bulanan Bimbel</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Angka dihitung otomatis secara langsung dari data pendaftaran, kelas, dan presensi tatap muka.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs">
          <Calendar className="w-4 h-4 text-[#EA580C]" />
          <label className="text-xs font-semibold text-[#5A6B78]">Pilih Periode:</label>
          <select
            value={selectedBulan}
            onChange={handleMonthChange}
            className="text-xs font-bold text-[#1F2937] bg-transparent outline-hidden cursor-pointer"
          >
            <option value="2026-10">Oktober 2026</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">Agustus 2026</option>
            <option value="2026-11">November 2026</option>
          </select>
        </div>
      </div>

      {/* Tabel 1: Siswa Aktif per Program */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EA580C]" />
              <span>1. Rekap Siswa Aktif per Program</span>
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Distribusi siswa dengan status pendaftaran aktif pada masing-masing paket bimbingan
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Program</th>
                <th className="py-3.5 px-6">Jenjang</th>
                <th className="py-3.5 px-6 text-right">Jumlah Siswa Aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {programStats.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-bold text-[#1F2937]">{p.nama}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[#1F2937] font-semibold text-[11px]">
                      {p.jenjang}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right tabular-nums font-bold text-sm text-[#EA580C]">
                    {p.siswaAktifCount} Siswa
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 2: Kehadiran per Kelas */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#15A66A]" />
              <span>2. Rekap Kehadiran Siswa per Kelas</span>
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Rata-rata persentase presensi hadir dari seluruh sesi pertemuan kelas yang telah diselenggarakan
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Kelas</th>
                <th className="py-3.5 px-6">Jumlah Siswa Terdaftar</th>
                <th className="py-3.5 px-6">Total Sesi Pertemuan</th>
                <th className="py-3.5 px-6 text-right">Rata-Rata Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {classStats.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-bold text-[#1F2937]">{k.nama}</td>
                  <td className="py-4 px-6 tabular-nums font-medium text-[#1F2937]">
                    {k.jumlahSiswa} Siswa
                  </td>
                  <td className="py-4 px-6 tabular-nums font-medium text-[#1F2937]">
                    {k.jumlahPertemuan} Sesi
                  </td>
                  <td className="py-4 px-6 text-right tabular-nums">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full font-bold text-xs bg-green-50 text-[#15A66A] border border-green-200">
                      {k.rataRataHadir}% Hadir
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 3: Jumlah Kelas per Tutor */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#EA580C]" />
              <span>3. Rekap Beban Mengajar per Tutor</span>
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Jumlah kelas yang diampu dan total pertemuan yang telah diajar pada periode bulan terpilih
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Tutor</th>
                <th className="py-3.5 px-6">Email Kontak</th>
                <th className="py-3.5 px-6">Jumlah Kelas Diampu</th>
                <th className="py-3.5 px-6 text-right">Jumlah Pertemuan Terlaksana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {tutorStats.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6 font-bold text-[#1F2937]">{t.nama}</td>
                  <td className="py-4 px-6 text-[#5A6B78]">{t.email}</td>
                  <td className="py-4 px-6 tabular-nums font-semibold text-[#1F2937]">
                    {t.jumlahKelas} Kelas
                  </td>
                  <td className="py-4 px-6 text-right tabular-nums font-bold text-sm text-[#EA580C]">
                    {t.jumlahPertemuan} Pertemuan
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function LaporanAdminPage() {
  return (
    <PortalLayout title="Laporan Bulanan">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat laporan rekapitulasi...</div>}>
        <LaporanContent />
      </Suspense>
    </PortalLayout>
  );
}
