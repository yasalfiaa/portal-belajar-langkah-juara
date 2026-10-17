"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useData, formatDateIndo } from "@/context/DataContext";
import { Check, X, Filter, MessageSquare, AlertCircle } from "lucide-react";

function PendaftaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "semua";

  const { pendaftaran, users, programs, updatePendaftaranStatus } = useData();

  // Modal for rejection note
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPendaftaran, setSelectedPendaftaran] = useState(null);
  const [catatanStaf, setCatatanStaf] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const handleFilterChange = (newStatus) => {
    if (newStatus === "semua") {
      router.push("/staf/pendaftaran");
    } else {
      router.push(`/staf/pendaftaran?status=${newStatus}`);
    }
  };

  const handleApprove = (id) => {
    updatePendaftaranStatus(id, "aktif", "");
  };

  const openRejectModal = (item) => {
    setSelectedPendaftaran(item);
    setCatatanStaf("");
    setErrorModal("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!catatanStaf.trim()) {
      setErrorModal("Catatan Staf wajib diisi saat menolak pendaftaran.");
      return;
    }
    updatePendaftaranStatus(selectedPendaftaran.id, "ditolak", catatanStaf.trim());
    setRejectModalOpen(false);
  };

  // Filter items
  const filteredList = pendaftaran.filter((item) => {
    if (statusFilter === "semua") return true;
    return item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Daftar Pendaftaran Program</h2>
          <p className="text-sm text-[#5A6B78] mt-0.5">
            Verifikasi pembayaran fisik di kantor dan putuskan status pendaftaran siswa.
          </p>
        </div>

        {/* Filter Pills with query param sync */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200/80 shadow-xs self-start">
          {[
            { key: "semua", label: "Semua" },
            { key: "menunggu", label: "Menunggu" },
            { key: "aktif", label: "Aktif" },
            { key: "ditolak", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? "bg-[#EA580C] text-white shadow-xs"
                  : "text-[#5A6B78] hover:text-[#1F2937] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-[#5A6B78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Siswa</th>
                <th className="py-3.5 px-6">Program</th>
                <th className="py-3.5 px-6">Tanggal Pengajuan</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi Staf</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredList.length > 0 ? (
                filteredList.map((item) => {
                  const student = users.find((u) => u.id === item.siswaId);
                  const program = programs.find((p) => p.id === item.programId);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[#1F2937]">
                        {student?.nama || "Siswa Tidak Ditemukan"}
                        <span className="block text-[11px] font-normal text-[#5A6B78]">
                          {student?.email}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-[#1F2937]">
                          {program?.nama || "Program"}
                        </span>
                        <span className="text-[11px] text-[#5A6B78] block">
                          Jenjang {program?.jenjang}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#5A6B78] tabular-nums">
                        {formatDateIndo(item.dibuatPada)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={item.status} />
                        {item.status === "ditolak" && item.catatanStaf && (
                          <div className="mt-1 text-[11px] text-red-700 italic max-w-xs">
                            "{item.catatanStaf}"
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {item.status === "menunggu" ? (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => openRejectModal(item)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Selesai</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-[#5A6B78]">
                    Tidak ada data pendaftaran dengan filter "{statusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Pendaftaran Siswa"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="text-xs text-[#5A6B78]">
            Anda akan menolak pengajuan program ini. Sesuai PRD,{" "}
            <strong>Catatan Staf wajib diisi</strong> agar siswa mengetahui alasan penolakan.
          </p>

          {errorModal && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorModal}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-1">
              Catatan Staf <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={catatanStaf}
              onChange={(e) => setCatatanStaf(e.target.value)}
              placeholder="Contoh: Belum menyelesaikan administrasi pendaftaran atau jenjang kelas tidak sesuai."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A6B78] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
            >
              Konfirmasi Tolak
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function PendaftaranPage() {
  return (
    <PortalLayout title="Kelola Pendaftaran">
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#5A6B78]">Memuat pendaftaran...</div>}>
        <PendaftaranContent />
      </Suspense>
    </PortalLayout>
  );
}
