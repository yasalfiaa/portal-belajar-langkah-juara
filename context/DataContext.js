"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const initialUsers = [
  { id: "user-raka", nama: "Raka Pratama", email: "raka@example.com", noHp: "081234567890", noHpOrangTua: "081298765432", role: "siswa", aktif: true, dibuatPada: "2026-09-01T08:00:00" },
  { id: "user-salsa", nama: "Salsabila Putri", email: "salsa@example.com", noHp: "081345678901", noHpOrangTua: "081398765431", role: "siswa", aktif: true, dibuatPada: "2026-09-05T08:00:00" },
  { id: "user-fira", nama: "Kak Fira", email: "fira@langkahjuara.id", noHp: "081456789012", noHpOrangTua: "", role: "staf", aktif: true, dibuatPada: "2026-08-01T08:00:00" },
  { id: "user-dimas", nama: "Kak Dimas", email: "dimas@langkahjuara.id", noHp: "081567890123", noHpOrangTua: "", role: "tutor", aktif: true, dibuatPada: "2026-08-01T08:00:00" },
  { id: "user-nadia", nama: "Kak Nadia", email: "nadia@langkahjuara.id", noHp: "081678901234", noHpOrangTua: "", role: "tutor", aktif: true, dibuatPada: "2026-08-01T08:00:00" },
  { id: "user-arif", nama: "Pak Arif", email: "arif@langkahjuara.id", noHp: "081789012345", noHpOrangTua: "", role: "super_admin", aktif: true, dibuatPada: "2026-07-01T08:00:00" },
];

const initialPrograms = [
  { id: "prog-1", nama: "Intensif UTBK", jenjang: "SMA", jumlahPertemuan: 24, harga: 1500000, aktif: true },
  { id: "prog-2", nama: "Matematika SMP", jenjang: "SMP", jumlahPertemuan: 16, harga: 850000, aktif: true },
  { id: "prog-3", nama: "Sains Terpadu SMA", jenjang: "SMA", jumlahPertemuan: 20, harga: 1200000, aktif: true },
  { id: "prog-4", nama: "Bahasa Inggris SMP", jenjang: "SMP", jumlahPertemuan: 12, harga: 700000, aktif: false },
];

const initialPendaftaran = [
  { id: "pend-1", siswaId: "user-raka", programId: "prog-1", status: "aktif", catatanStaf: "", dibuatPada: "2026-10-01T09:00:00" },
  { id: "pend-2", siswaId: "user-salsa", programId: "prog-2", status: "aktif", catatanStaf: "", dibuatPada: "2026-10-02T10:15:00" },
  { id: "pend-3", siswaId: "user-raka", programId: "prog-3", status: "menunggu", catatanStaf: "", dibuatPada: "2026-10-15T11:30:00" },
  { id: "pend-4", siswaId: "user-salsa", programId: "prog-1", status: "ditolak", catatanStaf: "Jenjang siswa (SMP) belum memenuhi prasyarat Intensif UTBK SMA.", dibuatPada: "2026-10-05T14:20:00" },
  { id: "pend-5", siswaId: "user-raka", programId: "prog-2", status: "menunggu", catatanStaf: "", dibuatPada: "2026-10-17T08:45:00" },
];

const initialKelas = [
  { id: "kelas-1", nama: "Intensif UTBK A", programId: "prog-1", tutorId: "user-dimas", siswaIds: ["user-raka"], hari: "Selasa", jam: "16.00", tempat: "Ruang 2" },
  { id: "kelas-2", nama: "Matematika SMP B", programId: "prog-2", tutorId: "user-nadia", siswaIds: ["user-salsa"], hari: "Rabu", jam: "15.30", tempat: "Ruang 1" },
];

const initialPertemuan = [
  { id: "pert-1", kelasId: "kelas-2", tanggal: "2026-10-07", topik: "Persamaan Linear Satu Variabel", materiUrl: "https://drive.google.com/file/d/materi-persamaan-linear", hadirIds: ["user-salsa"] },
  { id: "pert-2", kelasId: "kelas-1", tanggal: "2026-10-08", topik: "Strategi Penalaran Umum UTBK", materiUrl: "https://drive.google.com/file/d/materi-penalaran-umum", hadirIds: ["user-raka"] },
  { id: "pert-3", kelasId: "kelas-1", tanggal: "2026-10-15", topik: "Bedah Soal TPS Kuantitatif", materiUrl: "https://drive.google.com/file/d/materi-kuantitatif", hadirIds: ["user-raka"] },
];

const initialTugas = [
  { id: "tugas-1", kelasId: "kelas-1", judul: "Latihan Penalaran Umum 3", deskripsi: "Kerjakan 20 butir soal penalaran umum pada tautan materi pertemuan 2 dan kumpulkan tautan lembar jawaban Google Drive/Docs.", batasWaktu: "2026-10-25T23:59:00" },
  { id: "tugas-2", kelasId: "kelas-2", judul: "Tugas Mandiri 1: Persamaan Linear", deskripsi: "Selesaikan 5 soal pemecahan masalah bab persamaan linear pada buku pegangan siswa halaman 45.", batasWaktu: "2026-10-20T20:00:00" },
  { id: "tugas-3", kelasId: "kelas-1", judul: "Try Out Kuantitatif Mandiri", deskripsi: "Latihan mandiri paket 1 TPS UTBK materi aljabar dan aritmetika.", batasWaktu: "2026-10-12T18:00:00" },
];

const initialPengumpulan = [
  { id: "peng-1", tugasId: "tugas-1", siswaId: "user-raka", kelasId: "kelas-1", tautan: "https://docs.google.com/document/d/jawaban-raka-tugas1", dikumpulkanPada: "2026-10-16T14:30:00", nilai: 85, komentar: "Analisis sudah sangat baik dan terstruktur! Pertahankan ketelitian pada nomor 14." },
  { id: "peng-2", tugasId: "tugas-2", siswaId: "user-salsa", kelasId: "kelas-2", tautan: "https://drive.google.com/file/d/jawaban-salsa-soal-mandiri", dikumpulkanPada: "2026-10-17T09:15:00", nilai: null, komentar: "" },
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [programs, setPrograms] = useState(initialPrograms);
  const [pendaftaran, setPendaftaran] = useState(initialPendaftaran);
  const [kelas, setKelas] = useState(initialKelas);
  const [pertemuan, setPertemuan] = useState(initialPertemuan);
  const [tugas, setTugas] = useState(initialTugas);
  const [pengumpulan, setPengumpulan] = useState(initialPengumpulan);
  const [activeRole, setActiveRole] = useState("siswa"); // "siswa" | "staf" | "tutor" | "super_admin"
  const [currentUserId, setCurrentUserId] = useState("user-raka");

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("langkah_juara_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.programs) setPrograms(parsed.programs);
        if (parsed.pendaftaran) setPendaftaran(parsed.pendaftaran);
        if (parsed.kelas) setKelas(parsed.kelas);
        if (parsed.pertemuan) setPertemuan(parsed.pertemuan);
        if (parsed.tugas) setTugas(parsed.tugas);
        if (parsed.pengumpulan) setPengumpulan(parsed.pengumpulan);
      }
    } catch (e) {
      console.warn("Gagal memuat local storage:", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        "langkah_juara_data",
        JSON.stringify({ users, programs, pendaftaran, kelas, pertemuan, tugas, pengumpulan })
      );
    } catch (e) {
      console.warn("Gagal menyimpan local storage:", e);
    }
  }, [users, programs, pendaftaran, kelas, pertemuan, tugas, pengumpulan]);

  // Adjust active user when role changes
  const switchRole = (role) => {
    setActiveRole(role);
    if (role === "siswa") setCurrentUserId("user-raka");
    else if (role === "staf") setCurrentUserId("user-fira");
    else if (role === "tutor") setCurrentUserId("user-dimas");
    else if (role === "super_admin") setCurrentUserId("user-arif");
  };

  const switchUser = (userId) => {
    const u = users.find((item) => item.id === userId);
    if (u) {
      setCurrentUserId(u.id);
      setActiveRole(u.role);
    }
  };

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Helper Methods
  const addPendaftaran = (programId, siswaId = currentUser.id) => {
    // Check if already waiting or active
    const existing = pendaftaran.find(
      (p) => p.programId === programId && p.siswaId === siswaId && (p.status === "menunggu" || p.status === "aktif")
    );
    if (existing) {
      return { success: false, message: "Pendaftaran untuk program ini sudah diajukan atau masih aktif." };
    }

    const newPendaftaran = {
      id: `pend-${Date.now()}`,
      siswaId,
      programId,
      status: "menunggu",
      catatanStaf: "",
      dibuatPada: new Date().toISOString(),
    };
    setPendaftaran((prev) => [newPendaftaran, ...prev]);
    return { success: true, message: "Pendaftaran terkirim. Selesaikan pembayaran di kantor Langkah Juara." };
  };

  const updatePendaftaranStatus = (pendaftaranId, status, catatanStaf = "") => {
    setPendaftaran((prev) =>
      prev.map((p) => (p.id === pendaftaranId ? { ...p, status, catatanStaf } : p))
    );
  };

  const addKelas = (kelasData) => {
    const newK = {
      id: `kelas-${Date.now()}`,
      siswaIds: [],
      ...kelasData,
    };
    setKelas((prev) => [newK, ...prev]);
    return newK;
  };

  const addSiswaToKelas = (kelasId, siswaId) => {
    setKelas((prev) =>
      prev.map((k) => {
        if (k.id === kelasId) {
          if (!k.siswaIds.includes(siswaId)) {
            return { ...k, siswaIds: [...k.siswaIds, siswaId] };
          }
        }
        return k;
      })
    );
  };

  const removeSiswaFromKelas = (kelasId, siswaId) => {
    setKelas((prev) =>
      prev.map((k) => {
        if (k.id === kelasId) {
          return { ...k, siswaIds: k.siswaIds.filter((id) => id !== siswaId) };
        }
        return k;
      })
    );
  };

  const addPertemuan = (pertemuanData) => {
    const newPert = {
      id: `pert-${Date.now()}`,
      hadirIds: [],
      ...pertemuanData,
    };
    setPertemuan((prev) => [newPert, ...prev]);
    return newPert;
  };

  const updatePertemuanPresensi = (pertemuanId, hadirIds) => {
    setPertemuan((prev) =>
      prev.map((p) => (p.id === pertemuanId ? { ...p, hadirIds } : p))
    );
  };

  const addTugas = (tugasData) => {
    const newTugas = {
      id: `tugas-${Date.now()}`,
      ...tugasData,
    };
    setTugas((prev) => [newTugas, ...prev]);
    return newTugas;
  };

  const submitTugas = (tugasId, siswaId, tautan, kelasId) => {
    const existing = pengumpulan.find((p) => p.tugasId === tugasId && p.siswaId === siswaId);
    if (existing) {
      setPengumpulan((prev) =>
        prev.map((p) =>
          p.id === existing.id
            ? { ...p, tautan, dikumpulkanPada: new Date().toISOString() }
            : p
        )
      );
    } else {
      const newPeng = {
        id: `peng-${Date.now()}`,
        tugasId,
        siswaId,
        kelasId: kelasId || "",
        tautan,
        dikumpulkanPada: new Date().toISOString(),
        nilai: null,
        komentar: "",
      };
      setPengumpulan((prev) => [newPeng, ...prev]);
    }
  };

  const gradeTugas = (pengumpulanId, nilai, komentar) => {
    setPengumpulan((prev) =>
      prev.map((p) =>
        p.id === pengumpulanId ? { ...p, nilai: Number(nilai), komentar } : p
      )
    );
  };

  const updateUserProfile = (userId, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedFields } : u))
    );
  };

  const addProgram = (programData) => {
    const newProg = {
      id: `prog-${Date.now()}`,
      ...programData,
      harga: Number(programData.harga),
      jumlahPertemuan: Number(programData.jumlahPertemuan),
      aktif: programData.aktif !== false,
    };
    setPrograms((prev) => [newProg, ...prev]);
    return newProg;
  };

  const updateProgram = (programId, updatedFields) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              ...updatedFields,
              harga: updatedFields.harga !== undefined ? Number(updatedFields.harga) : p.harga,
              jumlahPertemuan: updatedFields.jumlahPertemuan !== undefined ? Number(updatedFields.jumlahPertemuan) : p.jumlahPertemuan,
            }
          : p
      )
    );
  };

  const resetAllData = () => {
    setUsers(initialUsers);
    setPrograms(initialPrograms);
    setPendaftaran(initialPendaftaran);
    setKelas(initialKelas);
    setPertemuan(initialPertemuan);
    setTugas(initialTugas);
    setPengumpulan(initialPengumpulan);
    localStorage.removeItem("langkah_juara_data");
  };

  return (
    <DataContext.Provider
      value={{
        users,
        programs,
        pendaftaran,
        kelas,
        pertemuan,
        tugas,
        pengumpulan,
        currentUser,
        currentUserId,
        setCurrentUserId,
        activeRole,
        switchRole,
        switchUser,
        addPendaftaran,
        updatePendaftaranStatus,
        addKelas,
        addSiswaToKelas,
        removeSiswaFromKelas,
        addPertemuan,
        updatePertemuanPresensi,
        addTugas,
        submitTugas,
        gradeTugas,
        updateUserProfile,
        addProgram,
        updateProgram,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// Helper calculation functions as per PRD Bab 4.5 & Bab 5.2
export function getTugasStatus(tugas, pengumpulanSiswa, referenceDate) {
  if (pengumpulanSiswa) {
    if (
      pengumpulanSiswa.nilai !== null &&
      pengumpulanSiswa.nilai !== undefined &&
      pengumpulanSiswa.nilai !== ""
    ) {
      return "Dinilai";
    }
    return "Dikumpulkan";
  }
  if (!tugas?.batasWaktu) return "Belum dikumpulkan";
  // Deterministic reference date for 2026-10 (matching PRD context) prevents prerender errors
  const now = referenceDate || new Date("2026-10-17T12:00:00");
  const deadline = new Date(tugas.batasWaktu);
  if (now > deadline) {
    return "Terlambat";
  }
  return "Belum dikumpulkan";
}

export function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}

export function formatDateIndo(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
