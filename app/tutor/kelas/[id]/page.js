"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { useData, formatDateIndo } from "@/context/DataContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Award,
} from "lucide-react";

function KelasYangDiajarTutorContent({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const {
    currentUser,
    kelas,
    programs,
    users,
    pertemuan,
    tugas,
    addPertemuan,
    updatePertemuanPresensi,
    addTugas,
  } = useData();

  const currentClass = kelas.find((k) => k.id === classId);

  // Modals state
  const [isPertemuanModalOpen, setIsPertemuanModalOpen] = useState(false);
  const [isTugasModalOpen, setIsTugasModalOpen] = useState(false);

  // New Pertemuan form
  const [tanggal, setTanggal] = useState("2026-10-17");
  const [topik, setTopik] = useState("");
  const [materiUrl, setMateriUrl] = useState("");
  const [errorPertemuan, setErrorPertemuan] = useState("");

  // New Tugas form
  const [judulTugas, setJudulTugas] = useState("");
  const [deskripsiTugas, setDeskripsiTugas] = useState("");
  const [batasWaktuTugas, setBatasWaktuTugas] = useState("");
  const [errorTugas, setErrorTugas] = useState("");

  const [notification, setNotification] = useState("");

  if (!currentClass) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1F2937]">Kelas tidak ditemukan</h3>
        <Link
          href="/tutor/dasbor"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Dasbor Tutor
        </Link>
      </div>
    );
  }

  // Business Decision 2: "Bolehkah Kak Dimas membuka kelas Kak Nadia? Tidak, Kak Dimas memiliki id kelas yang berbeda sehingga akses ditolak (4.12)"
  const isClassTutor = currentClass.tutorId === currentUser.id;
  const canAccessClass = currentUser.role === "super_admin" || isClassTutor;

  if (!canAccessClass) {
    const classTutorObj = users.find((u) => u.id === currentClass.tutorId);
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
        <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
          Anda tidak mengampu kelas ini. Sesuai <strong>Keputusan Bisnis 4.12</strong>, seorang tutor hanya dapat membuka dan mengelola kelas yang ia ajar sendiri (kelas ini diampu oleh {classTutorObj?.nama || "tutor lain"}).
        </p>
        <Link
          href="/tutor/dasbor"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Dasbor Tutor
        </Link>
      </div>
    );
  }

  const program = programs.find((p) => p.id === currentClass.programId);
  const enrolledStudents = users.filter((u) => currentClass.siswaIds?.includes(u.id));
  const classPertemuan = pertemuan.filter((p) => p.kelasId === classId);
  const classTugas = tugas.filter((t) => t.kelasId === classId);

  // Handle Create Pertemuan
  const handleCreatePertemuan = (e) => {
    e.preventDefault();
    setErrorPertemuan("");

    if (!tanggal || !topik.trim()) {
      setErrorPertemuan("Tanggal dan Topik wajib diisi.");
      return;
    }

    if (materiUrl && !materiUrl.trim().startsWith("https://")) {
      setErrorPertemuan("Tautan materi wajib diawali https://");
      return;
    }

    addPertemuan({
      kelasId: currentClass.id,
      tanggal,
      topik: topik.trim(),
      materiUrl: materiUrl.trim(),
    });

    setTopik("");
    setMateriUrl("");
    setIsPertemuanModalOpen(false);
    setNotification("Pertemuan baru berhasil dibuat!");
    setTimeout(() => setNotification(""), 3000);
  };

  // Handle Create Tugas
  const handleCreateTugas = (e) => {
    e.preventDefault();
    setErrorTugas("");

    if (!judulTugas.trim() || !deskripsiTugas.trim() || !batasWaktuTugas) {
      setErrorTugas("Judul, Deskripsi, dan Batas Waktu wajib diisi.");
      return;
    }

    addTugas({
      kelasId: currentClass.id,
      judul: judulTugas.trim(),
      deskripsi: deskripsiTugas.trim(),
      batasWaktu: batasWaktuTugas,
    });

    setJudulTugas("");
    setDeskripsiTugas("");
    setBatasWaktuTugas("");
    setIsTugasModalOpen(false);
    setNotification("Tugas baru berhasil diterbitkan untuk siswa!");
    setTimeout(() => setNotification(""), 3000);
  };

  // Handle Attendance Toggle
  const toggleStudentAttendance = (pertId, studentId) => {
    const pert = pertemuan.find((p) => p.id === pertId);
    if (!pert) return;

    const currentHadir = pert.hadirIds || [];
    const isPresent = currentHadir.includes(studentId);
    const updatedHadir = isPresent
      ? currentHadir.filter((id) => id !== studentId)
      : [...currentHadir, studentId];

    updatePertemuanPresensi(pertId, updatedHadir);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/tutor"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Dasbor Tutor</span>
      </Link>

      {notification && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
              {program?.nama} ({program?.jenjang})
            </span>
            <h2 className="text-2xl font-bold text-[#1F2937] mt-1">{currentClass.nama}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPertemuanModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pertemuan</span>
            </button>
            <button
              onClick={() => setIsTugasModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#EA580C] text-[#EA580C] hover:bg-orange-50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tugas</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-gray-100 text-xs text-[#5A6B78]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Hari & Jam</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">
                {currentClass.hari}, {currentClass.jam} WITA
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Lokasi / Ruang</span>
              <span className="font-semibold text-[#1F2937]">{currentClass.tempat}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Siswa</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">
                {enrolledStudents.length} Siswa Terdaftar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Pertemuan & Presensi */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#EA580C]" />
              <span>Pertemuan & Presensi Kehadiran</span>
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Centang siswa yang hadir pada setiap tanggal sesi tatap muka
            </p>
          </div>
          <button
            onClick={() => setIsPertemuanModalOpen(true)}
            className="text-xs font-bold text-[#EA580C] hover:underline"
          >
            + Tambah Sesi
          </button>
        </div>

        {classPertemuan.length > 0 ? (
          <div className="space-y-4">
            {classPertemuan.map((pert, idx) => {
              const hadirCount = pert.hadirIds?.length || 0;
              return (
                <div
                  key={pert.id}
                  className="p-5 rounded-xl border border-gray-200/70 bg-gray-50/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                          Sesi #{classPertemuan.length - idx}
                        </span>
                        <span className="text-xs text-[#5A6B78] tabular-nums font-medium">
                          • {pert.tanggal}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1F2937] mt-0.5">{pert.topik}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {pert.materiUrl && (
                        <a
                          href={pert.materiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Materi</span>
                        </a>
                      )}
                      <span className="text-xs font-bold text-[#1F2937] bg-white px-2.5 py-1 rounded-lg border border-gray-200 tabular-nums">
                        Hadir: {hadirCount} / {enrolledStudents.length}
                      </span>
                    </div>
                  </div>

                  {/* Presensi Checkboxes */}
                  <div className="pt-3 border-t border-gray-200/60">
                    <span className="text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider block mb-2">
                      Presensi Siswa:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {enrolledStudents.map((s) => {
                        const isHadir = pert.hadirIds?.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isHadir
                                ? "bg-green-50 border-green-300 text-green-900 font-semibold"
                                : "bg-white border-gray-200 text-[#5A6B78] hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isHadir}
                              onChange={() => toggleStudentAttendance(pert.id, s.id)}
                              className="rounded text-[#15A66A] focus:ring-[#15A66A]"
                            />
                            <span className="truncate">{s.nama}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#5A6B78] py-8 text-center">
            Belum ada pertemuan. Klik tombol "Buat Pertemuan" untuk memulai.
          </p>
        )}
      </div>

      {/* Section 2: Tugas Kelas */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#EA580C]" />
              <span>Daftar Tugas & Penilaian</span>
            </h3>
            <p className="text-xs text-[#5A6B78] mt-0.5">
              Buka tugas untuk melihat jawaban siswa dan memberikan nilai evaluasi
            </p>
          </div>
          <button
            onClick={() => setIsTugasModalOpen(true)}
            className="text-xs font-bold text-[#EA580C] hover:underline"
          >
            + Buat Tugas
          </button>
        </div>

        {classTugas.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {classTugas.map((t) => (
              <div
                key={t.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#1F2937]">{t.judul}</h4>
                  <p className="text-xs text-[#5A6B78] line-clamp-1 mt-0.5">{t.deskripsi}</p>
                  <span className="text-xs text-amber-700 font-medium tabular-nums mt-1 block">
                    Batas Pengumpulan: {formatDateIndo(t.batasWaktu)}
                  </span>
                </div>

                <Link
                  href={`/tutor/tugas/${t.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors flex items-center gap-1 self-start sm:self-center shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Periksa & Nilai</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5A6B78] py-8 text-center">
            Belum ada tugas untuk kelas ini. Klik "Buat Tugas" di atas.
          </p>
        )}
      </div>

      {/* Modal: Buat Pertemuan */}
      <Modal
        isOpen={isPertemuanModalOpen}
        onClose={() => setIsPertemuanModalOpen(false)}
        title="Buat Pertemuan Kelas Baru"
      >
        <form onSubmit={handleCreatePertemuan} className="space-y-4">
          {errorPertemuan && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorPertemuan}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Tanggal Pertemuan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Topik Materi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Persamaan Linear Satu Variabel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Tautan Materi (Opsional)
            </label>
            <input
              type="url"
              value={materiUrl}
              onChange={(e) => setMateriUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
            <span className="text-[11px] text-[#5A6B78] mt-1 block">
              Bila diisi, wajib diawali <code className="text-[#EA580C]">https://</code>
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsPertemuanModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs"
            >
              Simpan Pertemuan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Buat Tugas */}
      <Modal
        isOpen={isTugasModalOpen}
        onClose={() => setIsTugasModalOpen(false)}
        title="Buat Tugas Bimbingan"
      >
        <form onSubmit={handleCreateTugas} className="space-y-4">
          {errorTugas && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorTugas}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Judul Tugas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={judulTugas}
              onChange={(e) => setJudulTugas(e.target.value)}
              placeholder="Contoh: Latihan Penalaran Umum 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Deskripsi / Petunjuk <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={deskripsiTugas}
              onChange={(e) => setDeskripsiTugas(e.target.value)}
              placeholder="Petunjuk pengerjaan dan format pengumpulan..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Batas Waktu Pengumpulan <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={batasWaktuTugas}
              onChange={(e) => setBatasWaktuTugas(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsTugasModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs"
            >
              Terbitkan Tugas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function KelasYangDiajarTutorPage({ params }) {
  return (
    <PortalLayout title="Kelas Pengajar">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat kelas pengajar...</div>}>
        <KelasYangDiajarTutorContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
