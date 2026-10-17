"use client";

import React, { useState, use, Suspense } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Modal from "@/components/Modal";
import { useData } from "@/context/DataContext";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  UserPlus,
  Trash2,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Phone,
} from "lucide-react";

function RincianKelasStafContent({ params }) {
  const unwrappedParams = use(params);
  const classId = unwrappedParams.id;

  const { kelas, programs, users, pendaftaran, addSiswaToKelas, removeSiswaFromKelas } = useData();

  const currentClass = kelas.find((k) => k.id === classId);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSiswaId, setSelectedSiswaId] = useState("");
  const [message, setMessage] = useState("");

  if (!currentClass) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#1F2937]">Kelas tidak ditemukan</h3>
        <Link
          href="/staf/kelas"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Daftar Kelas
        </Link>
      </div>
    );
  }

  const program = programs.find((p) => p.id === currentClass.programId);
  const tutor = users.find((u) => u.id === currentClass.tutorId);

  // Eligible students: registered and active in THIS class's program
  const activeRegistrations = pendaftaran.filter(
    (p) => p.programId === currentClass.programId && p.status === "aktif"
  );
  const eligibleSiswaIds = activeRegistrations.map((p) => p.siswaId);

  // Candidates not yet in this class
  const availableCandidateStudents = users.filter(
    (u) => eligibleSiswaIds.includes(u.id) && !currentClass.siswaIds?.includes(u.id)
  );

  const enrolledStudents = users.filter((u) => currentClass.siswaIds?.includes(u.id));

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!selectedSiswaId) return;

    addSiswaToKelas(currentClass.id, selectedSiswaId);
    setMessage("Siswa berhasil ditambahkan ke kelas!");
    setSelectedSiswaId("");
    setIsAddModalOpen(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const handleRemoveStudent = (siswaId) => {
    removeSiswaFromKelas(currentClass.id, siswaId);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/staf/kelas"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6B78] hover:text-[#EA580C] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali ke Kelola Kelas</span>
      </Link>

      {message && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Class Info Panel */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#EA580C] text-xs font-bold uppercase tracking-wider">
              {program?.nama} ({program?.jenjang})
            </span>
            <h2 className="text-2xl font-bold text-[#1F2937] mt-1">{currentClass.nama}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 mt-5 border-t border-gray-100 text-xs text-[#5A6B78]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Tutor Pengajar</span>
              <span className="font-semibold text-[#1F2937]">{tutor?.nama || "Belum Ditentukan"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Jadwal Sesi</span>
              <span className="font-semibold text-[#1F2937] tabular-nums">
                {currentClass.hari}, {currentClass.jam} WITA
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EA580C]" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Tempat / Ruang</span>
              <span className="font-semibold text-[#1F2937]">{currentClass.tempat}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1F2937] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EA580C]" />
            <span>Daftar Siswa Terdaftar di Kelas Ini</span>
          </h3>
          <span className="text-xs font-bold text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-full tabular-nums">
            {enrolledStudents.length} Siswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Siswa</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Kontak Siswa</th>
                <th className="py-3.5 px-6">No. HP Orang Tua</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {enrolledStudents.length > 0 ? (
                enrolledStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-6 font-semibold text-[#1F2937]">{s.nama}</td>
                    <td className="py-4 px-6 text-[#5A6B78]">{s.email}</td>
                    <td className="py-4 px-6 tabular-nums text-[#1F2937]">{s.noHp || "-"}</td>
                    <td className="py-4 px-6 tabular-nums text-[#1F2937]">
                      {s.noHpOrangTua || "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleRemoveStudent(s.id)}
                        title="Keluarkan dari kelas"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#5A6B78]">
                    Belum ada siswa yang dimasukkan ke kelas ini. Klik tombol "Tambah Siswa".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Siswa */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Tambah Siswa ke ${currentClass.nama}`}
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <p className="text-xs text-[#5A6B78]">
            Sesuai aturan PRD, hanya siswa dengan <strong>pendaftaran berstatus Aktif</strong>{" "}
            pada program <strong>{program?.nama}</strong> yang dapat dimasukkan ke kelas ini.
          </p>

          {availableCandidateStudents.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-2">
                Pilih Siswa yang Memenuhi Syarat:
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableCandidateStudents.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedSiswaId === s.id
                        ? "border-[#EA580C] bg-orange-50/60"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="candidateSiswa"
                      value={s.id}
                      checked={selectedSiswaId === s.id}
                      onChange={() => setSelectedSiswaId(s.id)}
                      className="text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-xs text-[#1F2937] block">
                        {s.nama}
                      </span>
                      <span className="text-[11px] text-[#5A6B78] block">{s.email}</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Pendaftaran Aktif
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 text-center text-xs text-[#5A6B78]">
              Tidak ada siswa baru dengan status pendaftaran aktif untuk program ini.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!selectedSiswaId}
              className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Simpan & Masukkan ke Kelas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function RincianKelasStafPage({ params }) {
  return (
    <PortalLayout title="Rincian Kelas Staf">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat kelas...</div>}>
        <RincianKelasStafContent params={params} />
      </Suspense>
    </PortalLayout>
  );
}
