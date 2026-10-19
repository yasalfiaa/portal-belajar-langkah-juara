"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useData, getTugasStatus, formatDateIndo } from "@/context/DataContext";
import {
  FileText,
  Clock,
  ExternalLink,
  ChevronLeft,
  Award,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Edit3,
} from "lucide-react";

function TugasDanNilaiTutorContent({ params }) {
  const unwrappedParams = use(params);
  const tugasId = unwrappedParams.id;

  const { currentUser, tugas, kelas, users, pengumpulan, gradeTugas } = useData();

  const currentTugas = tugas.find((t) => t.id === tugasId);

  // Grading modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [nilaiInput, setNilaiInput] = useState("");
  const [komentarInput, setKomentarInput] = useState("");
  const [errorGrade, setErrorGrade] = useState("");
  const [notification, setNotification] = useState("");

  if (!currentTugas) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1F2937]">Tugas tidak ditemukan</h3>
        <Link
          href="/tutor"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Dasbor Tutor
        </Link>
      </div>
    );
  }

  const currentClass = kelas.find((k) => k.id === currentTugas.kelasId);
  const enrolledStudents = users.filter((u) => currentClass?.siswaIds?.includes(u.id));

  // Business Decision 1: "Bolehkah staf mengubah nilai tugas? Tidak, hanya tutor kelas tersebut dan super admin yang dapat mengisi nilai dan komentar (4.13)"
  const canGrade =
    currentUser.role === "super_admin" ||
    (currentUser.role === "tutor" && currentClass?.tutorId === currentUser.id);

  const openGradeModal = (sub, student) => {
    if (!canGrade) return;
    setSelectedSubmission({ ...sub, studentName: student.nama });
    setNilaiInput(sub.nilai !== null && sub.nilai !== undefined ? String(sub.nilai) : "");
    setKomentarInput(sub.komentar || "");
    setErrorGrade("");
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    setErrorGrade("");

    if (!canGrade) {
      setErrorGrade("Akses ditolak: Staf tidak dapat mengubah atau mengisi nilai tugas.");
      return;
    }

    const val = parseInt(nilaiInput, 10);
    // PRD Validation: nilai bilangan bulat 0 sampai 100
    if (isNaN(val) || val < 0 || val > 100) {
      setErrorGrade("Nilai harus berupa bilangan bulat antara 0 sampai 100.");
      return;
    }

    gradeTugas(selectedSubmission.id, val, komentarInput.trim());
    setSelectedSubmission(null);
    setNotification("Nilai dan komentar berhasil disimpan!");
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <div className="space-y-6">
      <Link
        href={currentClass ? `/tutor/kelas/${currentClass.id}` : "/tutor/tugas"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Kelas {currentClass?.nama}</span>
      </Link>

      {/* Info banner if not canGrade */}
      {!canGrade && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Hanya tutor pengajar kelas ini ({users.find((u) => u.id === currentClass?.tutorId)?.nama}) dan Super Admin yang dapat mengisi atau mengubah nilai tugas.
          </span>
        </div>
      )}

      {notification && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Task Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block mb-1">
              {currentClass?.nama}
            </span>
            <h2 className="text-2xl font-bold text-[#1F2937]">{currentTugas.judul}</h2>
            <p className="text-xs text-[#5A6B78] mt-1 whitespace-pre-line max-w-2xl">
              {currentTugas.deskripsi}
            </p>
          </div>

          <div className="bg-[#F7F5F2] px-4 py-3 rounded-xl border border-gray-200/60 text-xs text-[#5A6B78] shrink-0">
            <div className="flex items-center gap-1.5 font-medium text-amber-700 tabular-nums">
              <Clock className="w-3.5 h-3.5" />
              <span>Batas: {formatDateIndo(currentTugas.batasWaktu)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table as specified in PRD Bab 4.13 */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#EA580C]" />
            <span>Daftar Pengumpulan Tugas Siswa</span>
          </h3>
          <span className="text-xs font-semibold text-[#5A6B78]">
            {enrolledStudents.length} Siswa Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Siswa</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Waktu Kumpul</th>
                <th className="py-3.5 px-6">Tautan Jawaban</th>
                <th className="py-3.5 px-6">Nilai</th>
                <th className="py-3.5 px-6">Komentar Tutor</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {enrolledStudents.map((siswa) => {
                const sub = pengumpulan.find(
                  (p) => p.tugasId === currentTugas.id && p.siswaId === siswa.id
                );
                const status = getTugasStatus(currentTugas, sub);

                return (
                  <tr key={siswa.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#1F2937]">
                      {siswa.nama}
                      <span className="block text-[11px] font-normal text-[#5A6B78]">
                        {siswa.email}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={status} />
                    </td>
                    <td className="py-4 px-6 text-[#5A6B78] tabular-nums">
                      {sub?.dikumpulkanPada ? formatDateIndo(sub.dikumpulkanPada) : "-"}
                    </td>
                    <td className="py-4 px-6">
                      {sub?.tautan ? (
                        <a
                          href={sub.tautan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EA580C] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Jawaban</span>
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Belum mengumpulkan</span>
                      )}
                    </td>
                    <td className="py-4 px-6 tabular-nums font-bold text-sm">
                      {sub?.nilai !== null && sub?.nilai !== undefined ? (
                        <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                          {sub.nilai}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 max-w-xs text-[#5A6B78] truncate">
                      {sub?.komentar || <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {sub ? (
                        <button
                          onClick={() => openGradeModal(sub, siswa)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#c2410c] text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{sub.nilai !== null && sub.nilai !== undefined ? "Ubah Nilai" : "Beri Nilai"}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Menunggu</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Form Nilai & Komentar */}
      <Modal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title={`Penilaian Tugas - ${selectedSubmission?.studentName}`}
      >
        {selectedSubmission && (
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-xs text-[#1F2937]">
              <span className="font-semibold block mb-1">Tautan Jawaban Siswa:</span>
              <a
                href={selectedSubmission.tautan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EA580C] hover:underline flex items-center gap-1 truncate font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{selectedSubmission.tautan}</span>
              </a>
            </div>

            {errorGrade && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorGrade}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Nilai (0 - 100) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={nilaiInput}
                onChange={(e) => setNilaiInput(e.target.value)}
                placeholder="Contoh: 85"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Komentar & Catatan Evaluasi Tutor
              </label>
              <textarea
                rows={3}
                value={komentarInput}
                onChange={(e) => setKomentarInput(e.target.value)}
                placeholder="Beri umpan balik konstruktif untuk memotivasi siswa..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs"
              >
                Simpan Nilai
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function TugasDanNilaiTutorPage({ params }) {
  return (
    <PortalLayout title="Evaluasi Tugas & Nilai">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat evaluasi tugas...</div>}>
        <TugasDanNilaiTutorContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
