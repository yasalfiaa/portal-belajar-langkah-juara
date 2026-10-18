"use client";

import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import StatusBadge from "@/components/StatusBadge";
import { useData, formatRupiah, formatDateIndo } from "@/context/DataContext";
import { BookOpen, Calendar, Check, AlertCircle, Sparkles, Send } from "lucide-react";

export default function SiswaProgramPage() {
  const { programs, pendaftaran, currentUser, addPendaftaran } = useData();
  const [notification, setNotification] = useState(null);

  // Active programs only for student view
  const activePrograms = programs.filter((p) => p.aktif);

  // Student's submissions
  const myPendaftaran = pendaftaran.filter((p) => p.siswaId === currentUser.id || p.siswaId === currentUser.aliasId);

  const handleAjukan = (programId) => {
    const result = addPendaftaran(programId, currentUser.id);
    setNotification(result);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const getPendaftaranStatusForProgram = (progId) => {
    return myPendaftaran.find(
      (p) => p.programId === progId && (p.status === "menunggu" || p.status === "aktif")
    );
  };

  return (
    <PortalLayout title="Program Belajar Siswa">
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C] text-[11px] font-bold uppercase tracking-wider mb-2">
            Rute: /siswa/program
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Pilihan Program Belajar</h2>
          <p className="text-sm text-[#5A6B78] mt-1">
            Pilih program bimbingan belajar berkualitas untuk jenjang SMP dan SMA sesuai kebutuhan Anda.
          </p>
        </div>

        {notification && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all ${
              notification.success
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            {notification.success ? (
              <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{notification.message}</p>
              {notification.success && (
                <p className="text-xs text-green-700 mt-0.5">
                  Status pengajuan dapat Anda pantau pada tabel Pendaftaran Saya di bawah.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activePrograms.map((prog) => {
            const currentSub = getPendaftaranStatusForProgram(prog.id);
            const isPendingOrActive = !!currentSub;

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between hover:border-[#EA580C]/40 hover:shadow-md transition-all relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#EA580C] text-xs font-bold uppercase tracking-wider border border-orange-100">
                      {prog.jenjang}
                    </span>
                    <span className="text-xs text-[#5A6B78] font-medium flex items-center gap-1 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {prog.jumlahPertemuan} Pertemuan
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#EA580C] transition-colors mb-2">
                    {prog.nama}
                  </h3>

                  <div className="my-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-[#5A6B78] block">Biaya Program</span>
                    <span className="text-xl font-extrabold text-[#1F2937] tabular-nums">
                      {formatRupiah(prog.harga)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {isPendingOrActive ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-[#5A6B78] text-xs font-semibold text-center flex items-center justify-center gap-2">
                      <span>Sudah Diajukan:</span>
                      <StatusBadge status={currentSub.status} />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAjukan(prog.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-sm shadow-[#EA580C]/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ajukan Pendaftaran</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section: Pendaftaran Saya */}
        <div className="pt-4">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#1F2937]">Pendaftaran Saya</h3>
            <p className="text-xs text-[#5A6B78]">
              Riwayat pengajuan program dan status persetujuan staf Langkah Juara
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
            {myPendaftaran.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {myPendaftaran.map((item) => {
                  const programObj = programs.find((p) => p.id === item.programId);
                  return (
                    <div key={item.id} className="p-5 sm:p-6 hover:bg-gray-50/60 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[#1F2937]">
                              {programObj?.nama || "Program"}
                            </span>
                            <span className="text-xs text-[#5A6B78] font-medium">
                              ({programObj?.jenjang || "-"})
                            </span>
                          </div>
                          <p className="text-xs text-[#5A6B78] tabular-nums">
                            Diajukan pada: {formatDateIndo(item.dibuatPada)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={item.status} />
                          {item.status === "ditolak" && (
                            <button
                              onClick={() => handleAjukan(item.programId)}
                              className="text-xs font-semibold text-[#EA580C] hover:underline"
                            >
                              Ajukan Ulang
                            </button>
                          )}
                        </div>
                      </div>

                      {item.status === "ditolak" && item.catatanStaf && (
                        <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs text-red-800">
                          <span className="font-bold block mb-0.5">Catatan Staf:</span>
                          {item.catatanStaf}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-[#5A6B78]">
                Anda belum memiliki riwayat pengajuan program. Pilih program di atas untuk mendaftar.
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
