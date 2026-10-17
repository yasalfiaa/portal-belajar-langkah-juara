"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import Modal from "@/components/Modal";
import { useData } from "@/context/DataContext";
import { Plus, Users, Calendar, Clock, MapPin, ChevronRight, User } from "lucide-react";

export default function KelolaKelasStafPage() {
  const router = useRouter();
  const { kelas, programs, users, addKelas } = useData();

  // Create class modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [programId, setProgramId] = useState(programs[0]?.id || "");
  const [tutorId, setTutorId] = useState("");
  const [hari, setHari] = useState("Senin");
  const [jam, setJam] = useState("16.00");
  const [tempat, setTempat] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const tutors = users.filter((u) => u.role === "tutor");

  const handleBuatKelas = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!namaKelas.trim() || !programId || !tutorId || !hari || !jam || !tempat.trim()) {
      setErrorMsg("Semua kolom bertanda * wajib diisi.");
      return;
    }

    const created = addKelas({
      nama: namaKelas.trim(),
      programId,
      tutorId,
      hari,
      jam,
      tempat: tempat.trim(),
    });

    setIsModalOpen(false);
    // Route to class detail as per Bab 4.9 Step 2
    router.push(`/staf/kelas/${created.id}`);
  };

  return (
    <PortalLayout title="Kelola Kelas">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Daftar Kelompok Kelas</h2>
            <p className="text-sm text-[#5A6B78] mt-0.5">
              Atur kelas bimbingan, alokasikan tutor pengampu, dan jadwalkan sesi tatap muka.
            </p>
          </div>

          <button
            onClick={() => {
              if (tutors.length > 0 && !tutorId) setTutorId(tutors[0].id);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kelas</span>
          </button>
        </div>

        {/* Table as specified in Bab 4.9 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Nama Kelas</th>
                  <th className="py-3.5 px-6">Program</th>
                  <th className="py-3.5 px-6">Tutor</th>
                  <th className="py-3.5 px-6">Hari & Jam</th>
                  <th className="py-3.5 px-6">Jumlah Siswa</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {kelas.map((item) => {
                  const program = programs.find((p) => p.id === item.programId);
                  const tutor = users.find((u) => u.id === item.tutorId);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1F2937]">
                        <Link
                          href={`/staf/kelas/${item.id}`}
                          className="hover:text-[#EA580C] transition-colors"
                        >
                          {item.nama}
                        </Link>
                        <span className="block text-[11px] font-normal text-[#5A6B78]">
                          Lokasi: {item.tempat}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-[#1F2937]">
                          {program?.nama || "-"}
                        </span>
                        <span className="block text-[11px] text-[#5A6B78]">
                          {program?.jenjang}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[#1F2937]">
                          {tutor?.nama || "Belum Ditentukan"}
                        </span>
                      </td>
                      <td className="py-4 px-6 tabular-nums">
                        <span className="font-medium text-[#1F2937] block">{item.hari}</span>
                        <span className="text-[#5A6B78] text-[11px]">{item.jam} WITA</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-[#EA580C] font-bold text-xs tabular-nums">
                          <Users className="w-3.5 h-3.5" />
                          {item.siswaIds?.length || 0} Siswa
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/staf/kelas/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-[#1F2937] hover:bg-orange-50 hover:border-orange-200 hover:text-[#EA580C] text-xs font-semibold transition-colors"
                        >
                          <span>Rincian & Siswa</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Buat Kelas */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Buat Kelas Bimbingan Baru"
        >
          <form onSubmit={handleBuatKelas} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Nama Kelas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaKelas}
                onChange={(e) => setNamaKelas(e.target.value)}
                placeholder="Contoh: Intensif UTBK A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] bg-white"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} ({p.jenjang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Tutor Pengajar <span className="text-red-500">*</span>
                </label>
                <select
                  value={tutorId}
                  onChange={(e) => setTutorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] bg-white"
                >
                  <option value="">Pilih Tutor...</option>
                  {tutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Hari <span className="text-red-500">*</span>
                </label>
                <select
                  value={hari}
                  onChange={(e) => setHari(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] bg-white"
                >
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Jam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jam}
                  onChange={(e) => setJam(e.target.value)}
                  placeholder="Contoh: 16.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Tempat (Ruang / Tautan Daring) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tempat}
                onChange={(e) => setTempat(e.target.value)}
                placeholder="Contoh: Ruang 2 atau Google Meet"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-xs"
              >
                Simpan Kelas
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PortalLayout>
  );
}
