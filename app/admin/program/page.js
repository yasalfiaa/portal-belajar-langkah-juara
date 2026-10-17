"use client";

import React, { useState } from "react";
import Link from "next/link";
import PortalLayout from "@/components/PortalLayout";
import Modal from "@/components/Modal";
import { useData, formatRupiah } from "@/context/DataContext";
import { BookOpen, Plus, Check, X, CheckCircle, AlertCircle, AlertTriangle, ChevronLeft } from "lucide-react";

export default function ProgramAdminPage() {
  const { programs, addProgram, updateProgram, currentUser } = useData();

  if (currentUser?.role !== "super_admin") {
    return (
      <PortalLayout title="Program Admin">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-red-900">Akses Ditolak</h3>
          <p className="text-xs text-red-700 mt-2 mb-6 leading-relaxed">
            Halaman <strong>Program (Admin)</strong> hanya berlaku bagi akun <strong>Super Admin</strong>. Akun Anda saat ini masuk sebagai <strong>{currentUser?.role || "pengguna"}</strong>.
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
      </PortalLayout>
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [jenjang, setJenjang] = useState("SMA");
  const [jumlahPertemuan, setJumlahPertemuan] = useState("");
  const [harga, setHarga] = useState("");
  const [aktif, setAktif] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [notification, setNotification] = useState("");

  const handleTambahProgram = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const jml = parseInt(jumlahPertemuan, 10);
    const hrg = parseInt(harga, 10);

    // PRD Validation: jumlah pertemuan dan harga berupa angka lebih dari 0
    if (!nama.trim()) {
      setErrorMsg("Nama program wajib diisi.");
      return;
    }
    if (isNaN(jml) || jml <= 0) {
      setErrorMsg("Jumlah pertemuan harus berupa angka lebih dari 0.");
      return;
    }
    if (isNaN(hrg) || hrg <= 0) {
      setErrorMsg("Harga harus berupa angka lebih dari 0.");
      return;
    }

    addProgram({
      nama: nama.trim(),
      jenjang,
      jumlahPertemuan: jml,
      harga: hrg,
      aktif,
    });

    setNama("");
    setJumlahPertemuan("");
    setHarga("");
    setAktif(true);
    setIsModalOpen(false);
    setNotification("Program belajar baru berhasil ditambahkan!");
    setTimeout(() => setNotification(""), 3500);
  };

  const handleToggleAktif = (progId, currentStatus) => {
    updateProgram(progId, { aktif: !currentStatus });
  };

  return (
    <PortalLayout title="Kelola Program (Admin)">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Katalog Program Bimbingan</h2>
            <p className="text-sm text-[#5A6B78] mt-0.5">
              Tambah dan atur program belajar, tarif biaya, serta status keterlihatan bagi siswa.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        </div>

        {notification && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Table as specified in PRD Bab 4.16 */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Nama Program</th>
                  <th className="py-3.5 px-6">Jenjang</th>
                  <th className="py-3.5 px-6">Jumlah Pertemuan</th>
                  <th className="py-3.5 px-6">Harga</th>
                  <th className="py-3.5 px-6">Status Tampil (Aktif)</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#1F2937]">{p.nama}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[#1F2937] font-semibold text-[11px]">
                        {p.jenjang}
                      </span>
                    </td>
                    <td className="py-4 px-6 tabular-nums text-[#1F2937] font-medium">
                      {p.jumlahPertemuan} sesi
                    </td>
                    <td className="py-4 px-6 tabular-nums font-bold text-[#1F2937]">
                      {formatRupiah(p.harga)}
                    </td>
                    <td className="py-4 px-6">
                      {p.aktif ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          Aktif (Tampil di Siswa)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleAktif(p.id, p.aktif)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          p.aktif
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                      >
                        {p.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Tambah Program */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Tambah Program Bimbingan Baru"
        >
          <form onSubmit={handleTambahProgram} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Nama Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Intensif UTBK"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                Jenjang Pendidikan <span className="text-red-500">*</span>
              </label>
              <select
                value={jenjang}
                onChange={(e) => setJenjang(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] bg-white"
              >
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Jumlah Pertemuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={jumlahPertemuan}
                  onChange={(e) => setJumlahPertemuan(e.target.value)}
                  placeholder="Contoh: 24"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
                  Harga (Rupiah) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Contoh: 1500000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#EA580C] tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aktif}
                  onChange={(e) => setAktif(e.target.checked)}
                  className="rounded text-[#EA580C] focus:ring-[#EA580C] w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-[#1F2937] block">
                    Langsung Tampilkan Program ke Siswa (Aktif)
                  </span>
                  <span className="text-[11px] text-[#5A6B78]">
                    Hanya program aktif yang dapat dipilih oleh siswa pada halaman /program.
                  </span>
                </div>
              </label>
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
                Simpan Program
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PortalLayout>
  );
}
