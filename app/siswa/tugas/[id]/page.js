"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { useData, getTugasStatus, formatDateIndo } from "@/context/DataContext";
import {
  Clock,
  ExternalLink,
  ChevronLeft,
  Send,
  AlertTriangle,
  Award,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

function SiswaTugasDetailContent({ params }) {
  const unwrappedParams = use(params);
  const tugasId = unwrappedParams.id;

  const { tugas, kelas, pengumpulan, currentUser, submitTugas } = useData();

  const currentTugas = tugas.find((t) => t.id === tugasId);

  // Business Decision 3: "Bolehkah Raka melihat nilai Salsa? Tidak, Raka mendaftar di kelas yang berbeda (UTBK) sehingga muncul notifikasi tugas tidak ditemukan (4.5)"
  const currentClass = currentTugas ? kelas.find((k) => k.id === currentTugas.kelasId) : null;
  const isEnrolledInClass = currentUser
    ? Boolean(
        currentClass?.siswaIds?.includes(currentUser.id) ||
          (currentUser.aliasId && currentClass?.siswaIds?.includes(currentUser.aliasId))
      )
    : false;
  const canAccess = currentUser?.role === "super_admin" || isEnrolledInClass;

  const mySubmission =
    currentTugas && currentUser
      ? pengumpulan.find(
          (p) =>
            p.tugasId === tugasId &&
            (p.siswaId === currentUser.id ||
              (currentUser.aliasId && p.siswaId === currentUser.aliasId))
        )
      : null;

  const [tautanInput, setTautanInput] = useState(mySubmission?.tautan || "");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!currentTugas || !canAccess) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937]">Tugas tidak ditemukan</h3>
        <p className="text-xs text-[#5A6B78] mt-2 mb-6 leading-relaxed">
          {currentTugas && !isEnrolledInClass
            ? `Anda tidak terdaftar di kelas tugas ini (${currentClass?.nama}). Sesuai Keputusan Bisnis 4.5, nilai dan tugas kelas lain tidak dapat diakses oleh siswa dari program berbeda.`
            : "ID tugas yang Anda tuju tidak terdaftar di sistem Langkah Juara."}
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/siswa/beranda"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Beranda Siswa
          </Link>
          {currentTugas && !isEnrolledInClass && (
            <p className="text-[11px] text-gray-400 italic">
              Petunjuk uji: Ganti akun di header ke Salsa untuk melihat tugas ini, atau Pak Arif (Super Admin).
            </p>
          )}
        </div>
      </div>
    );
  }

  const status = getTugasStatus(currentTugas, mySubmission);
  const isPastDeadline = new Date("2026-10-17T12:00:00") > new Date(currentTugas.batasWaktu);
  const isGraded = status === "Dinilai";

  const handleKumpulkan = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const trimmed = tautanInput.trim();
    if (!trimmed.startsWith("https://")) {
      setErrorMsg("Tautan jawaban wajib diawali dengan https:// (misal Google Drive atau Docs).");
      return;
    }

    if (isPastDeadline && status !== "Dikumpulkan") {
      setErrorMsg("Batas waktu pengumpulan telah lewat. Pengumpulan tidak dapat dikirim.");
      return;
    }

    if (isGraded) {
      setErrorMsg("Tugas ini telah dinilai oleh tutor dan tidak dapat diubah lagi.");
      return;
    }

    submitTugas(currentTugas.id, currentUser.id, trimmed, currentTugas.kelasId);
    setSuccessMsg("Tautan jawaban berhasil disimpan! Status tugas berubah menjadi Dikumpulkan.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href={currentClass ? `/siswa/kelas/${currentClass.id}` : "/siswa/beranda"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Kelas {currentClass?.nama}</span>
      </Link>

      {/* Task Details Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block mb-1">
              {currentClass?.nama || "Kelas Bimbingan"}
            </span>
            <h2 className="text-2xl font-bold text-[#1F2937]">{currentTugas.judul}</h2>
          </div>
          <div className="shrink-0">
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="py-6 border-b border-gray-100">
          <h4 className="text-xs font-bold text-[#5A6B78] uppercase tracking-wider mb-2">
            Deskripsi Tugas
          </h4>
          <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-line">
            {currentTugas.deskripsi}
          </p>
        </div>

        <div className="py-4 border-b border-gray-100 flex items-center gap-2 text-xs text-[#5A6B78]">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Batas Waktu:{" "}
            <strong className="text-[#1F2937] tabular-nums">
              {formatDateIndo(currentTugas.batasWaktu)}
            </strong>
          </span>
        </div>

        {/* Nilai dan Komentar Tutor bila sudah dinilai */}
        {isGraded && (
          <div className="mt-6 p-5 rounded-2xl bg-green-50 border border-green-200">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 text-green-900 font-bold text-base">
                <Award className="w-5 h-5 text-green-700" />
                <span>Nilai Tugas Anda</span>
              </div>
              <div className="text-2xl font-black text-green-800 tabular-nums bg-white px-3 py-1 rounded-xl border border-green-300 shadow-xs">
                {mySubmission.nilai} <span className="text-sm font-normal text-green-700">/ 100</span>
              </div>
            </div>
            {mySubmission.komentar && (
              <div className="text-xs text-green-900 bg-white/70 p-3 rounded-xl border border-green-200/60 mt-2">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-green-700" />
                  <span>Catatan & Komentar Tutor:</span>
                </div>
                <p className="italic">{mySubmission.komentar}</p>
              </div>
            )}
          </div>
        )}

        {/* Submission Form */}
        <div className="mt-6 pt-2">
          <h4 className="text-sm font-bold text-[#1F2937] mb-2">
            {mySubmission ? "Tautan Jawaban Anda" : "Kumpulkan Jawaban Tugas"}
          </h4>
          <p className="text-xs text-[#5A6B78] mb-4">
            Cantumkan tautan publik berkas jawaban Anda (Google Docs, Google Drive, atau tautan PDF).
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleKumpulkan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Tautan Jawaban <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  disabled={isGraded}
                  value={tautanInput}
                  onChange={(e) => setTautanInput(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-[#5A6B78] mt-1 block">
                Format harus diawali dengan <code className="text-[#EA580C]">https://</code>
              </span>
            </div>

            {!isGraded && (
              <button
                type="submit"
                disabled={isPastDeadline && status !== "Dikumpulkan"}
                className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{mySubmission ? "Perbarui Tautan Jawaban" : "Kumpulkan"}</span>
              </button>
            )}
          </form>

          {mySubmission?.tautan && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={mySubmission.tautan}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka tautan jawaban yang dikumpulkan</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiswaTugasDetailPage({ params }) {
  return (
    <PortalLayout title="Rincian Tugas Siswa">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat tugas...</div>}>
        <SiswaTugasDetailContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
