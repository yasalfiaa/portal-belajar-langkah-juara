"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const initialUsers = [
  { id: "user-raka", nama: "Raka Pratama", email: "raka@langkahjuara.id", noHp: "081234567890", noHpOrangTua: "081298765432", role: "siswa", aktif: true, dibuatPada: "2026-09-01T08:00:00" },
  { id: "user-salsa", nama: "Salsabila Putri", email: "salsa@langkahjuara.id", noHp: "081345678901", noHpOrangTua: "081398765431", role: "siswa", aktif: true, dibuatPada: "2026-09-05T08:00:00" },
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

// Fungsi deduplikasi pengguna berdasarkan email agar tidak tercatat ganda di localhost
export function deduplicateUsers(userList) {
  if (!Array.isArray(userList)) return [];
  const emailMap = new Map();

  for (const user of userList) {
    if (!user) continue;
    // Bersihkan akun mock berdomain @example.* yang tidak terdaftar di database Firebase
    if (user.email && (user.email.includes("@example.") || user.email.endsWith(".example"))) {
      continue;
    }

    // Gunakan email (lowercase) sebagai kunci unik, atau id jika email tidak ada
    const emailKey = user.email ? user.email.toLowerCase().trim() : user.id;

    if (!emailMap.has(emailKey)) {
      emailMap.set(emailKey, user);
    } else {
      const existing = emailMap.get(emailKey);
      // Cek apakah salah satunya adalah UID Firebase Auth asli (bukan awalan tiruan "user-")
      const isAuthUid = !user.id.startsWith("user-");
      const existingIsAuthUid = !existing.id.startsWith("user-");

      if (isAuthUid && !existingIsAuthUid) {
        // user adalah UID Firebase Auth asli, existing adalah dokumen seed lama
        emailMap.set(emailKey, {
          ...existing,
          ...user,
          id: user.id, // UID asli menjadi ID utama
          aliasId: existing.id, // ID seed lama disimpan sebagai alias agar relasi kelas tidak putus
          role: user.role || existing.role,
          aktif: user.aktif !== undefined ? user.aktif : existing.aktif,
        });
      } else if (!isAuthUid && existingIsAuthUid) {
        // existing adalah UID asli, user adalah seed lama
        emailMap.set(emailKey, {
          ...user,
          ...existing,
          id: existing.id,
          aliasId: user.id,
          role: existing.role || user.role,
          aktif: existing.aktif !== undefined ? existing.aktif : user.aktif,
        });
      } else {
        emailMap.set(emailKey, { ...existing, ...user });
      }
    }
  }

  return Array.from(emailMap.values());
}

export function toIsoDateString(val) {
  if (!val) return "";
  if (val.toDate && typeof val.toDate === "function") {
    return val.toDate().toISOString();
  }
  return String(val);
}

export function mergeRemoteOverLocal(localList, remoteList) {
  if (!Array.isArray(localList)) return remoteList || [];
  if (!Array.isArray(remoteList)) return localList || [];
  const map = new Map(localList.map((item) => [item.id, item]));
  remoteList.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(() => deduplicateUsers(initialUsers));
  const [programs, setPrograms] = useState(initialPrograms);
  const [pendaftaran, setPendaftaran] = useState(initialPendaftaran);
  const [kelas, setKelas] = useState(initialKelas);
  const [pertemuan, setPertemuan] = useState(initialPertemuan);
  const [tugas, setTugas] = useState(initialTugas);
  const [pengumpulan, setPengumpulan] = useState(initialPengumpulan);
  const [activeRole, setActiveRole] = useState(null); // null sampai role selesai dibaca dari users/{uid}
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sinkronisasi data awal dari Cloud Firestore untuk semua 7 koleksi
  useEffect(() => {
    async function fetchAllFirestoreData() {
      // 1. users
      try {
        const snap = await getDocs(collection(db, "users"));
        if (!snap.empty) {
          const remoteUsers = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              dibuatPada: toIsoDateString(data.dibuatPada),
            };
          });
          setUsers((prev) => deduplicateUsers([...prev, ...remoteUsers]));
        }
      } catch (e) {
        console.warn("Gagal memuat dokumen users dari Firestore:", e);
      }

      // 2. program (koleksi "program" sesuai PRD 7.1)
      try {
        const snap = await getDocs(collection(db, "program"));
        if (!snap.empty) {
          const remotePrograms = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              harga: Number(data.harga || 0),
              jumlahPertemuan: Number(data.jumlahPertemuan || 0),
              aktif: data.aktif !== false,
            };
          });
          setPrograms((prev) => mergeRemoteOverLocal(prev, remotePrograms));
        }
      } catch (e) {
        console.warn("Gagal memuat program dari Firestore:", e);
      }

      // 3. pendaftaran
      try {
        const snap = await getDocs(collection(db, "pendaftaran"));
        if (!snap.empty) {
          const remotePendaftaran = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              dibuatPada: toIsoDateString(data.dibuatPada),
            };
          });
          setPendaftaran((prev) => mergeRemoteOverLocal(prev, remotePendaftaran));
        }
      } catch (e) {
        console.warn("Gagal memuat pendaftaran dari Firestore:", e);
      }

      // 4. kelas
      try {
        const snap = await getDocs(collection(db, "kelas"));
        if (!snap.empty) {
          const remoteKelas = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setKelas((prev) => mergeRemoteOverLocal(prev, remoteKelas));
        }
      } catch (e) {
        console.warn("Gagal memuat kelas dari Firestore:", e);
      }

      // 5. pertemuan
      try {
        const snap = await getDocs(collection(db, "pertemuan"));
        if (!snap.empty) {
          const remotePertemuan = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setPertemuan((prev) => mergeRemoteOverLocal(prev, remotePertemuan));
        }
      } catch (e) {
        console.warn("Gagal memuat pertemuan dari Firestore:", e);
      }

      // 6. tugas
      try {
        const snap = await getDocs(collection(db, "tugas"));
        if (!snap.empty) {
          const remoteTugas = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              batasWaktu: toIsoDateString(data.batasWaktu),
            };
          });
          setTugas((prev) => mergeRemoteOverLocal(prev, remoteTugas));
        }
      } catch (e) {
        console.warn("Gagal memuat tugas dari Firestore:", e);
      }

      // 7. pengumpulan
      try {
        const snap = await getDocs(collection(db, "pengumpulan"));
        if (!snap.empty) {
          const remotePengumpulan = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              dikumpulkanPada: toIsoDateString(data.dikumpulkanPada),
            };
          });
          setPengumpulan((prev) => mergeRemoteOverLocal(prev, remotePengumpulan));
        }
      } catch (e) {
        console.warn("Gagal memuat pengumpulan dari Firestore:", e);
      }
    }

    fetchAllFirestoreData();
  }, []);

  // Memeriksa dokumen users/{uid}. Bila belum ada, buat dokumen dengan field sesuai PRD 7.1.
  // Bila sudah ada, jangan diubah. Pastikan gunakan dokumen yang dipasang secara manual.
  // Jangan simpan kata sandi di dokumen ini.
  const syncOrInitUserDocument = async (firebaseUser, fallbackData = {}) => {
    if (!firebaseUser) return null;

    const userDocRef = doc(db, "users", firebaseUser.uid);
    let profile = null;

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        // Bila sudah ada, JANGAN DIUBAH. Gunakan dokumen yang ada di Firestore secara langsung.
        const data = snap.data();
        profile = {
          id: firebaseUser.uid,
          ...data,
          dibuatPada: data.dibuatPada?.toDate ? data.dibuatPada.toDate().toISOString() : data.dibuatPada,
        };
      } else {
        // Bila belum ada, buat dokumen dengan field sesuai PRD 7.1 dan role "staf, siswa, dan tutor"
        const emailLower = (firebaseUser.email || fallbackData.email || "").toLowerCase();

        // Cek apakah ada dokumen acuan manual (misal user-fira, user-dimas, user-nadia, dsb)
        const manualMatch =
          users.find((u) => u.email && u.email.toLowerCase() === emailLower) ||
          initialUsers.find((u) => u.email && u.email.toLowerCase() === emailLower);

        let assignedRole = fallbackData.role || manualMatch?.role;
        if (!assignedRole) {
          if (emailLower === "fira@langkahjuara.id" || emailLower.startsWith("staf")) {
            assignedRole = "staf";
          } else if (
            emailLower === "dimas@langkahjuara.id" ||
            emailLower === "nadia@langkahjuara.id" ||
            emailLower.startsWith("tutor")
          ) {
            assignedRole = "tutor";
          } else if (emailLower === "arif@langkahjuara.id" || emailLower.startsWith("admin")) {
            assignedRole = "super_admin";
          } else {
            assignedRole = "siswa";
          }
        }

        const assignedNama =
          fallbackData.nama?.trim() ||
          manualMatch?.nama ||
          firebaseUser.displayName ||
          (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Pengguna");

        // PRD 7.1: nama, email, noHp, noHpOrangTua, role, aktif, dibuatPada
        // PENTING: KATA SANDI TIDAK PERNAH DISIMPAN DI DOKUMEN INI
        const newDocData = {
          nama: assignedNama,
          email: firebaseUser.email || fallbackData.email || "",
          noHp: fallbackData.noHp || manualMatch?.noHp || "",
          noHpOrangTua: fallbackData.noHpOrangTua || manualMatch?.noHpOrangTua || "",
          role: assignedRole,
          aktif: true,
          dibuatPada: Timestamp.now(),
        };

        await setDoc(userDocRef, newDocData);
        profile = {
          id: firebaseUser.uid,
          ...newDocData,
          dibuatPada: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi dokumen users/{uid}:", err);
      profile = {
        id: firebaseUser.uid,
        nama: fallbackData.nama || firebaseUser.displayName || "Pengguna",
        email: firebaseUser.email || "",
        noHp: fallbackData.noHp || "",
        noHpOrangTua: fallbackData.noHpOrangTua || "",
        role: fallbackData.role || "siswa",
        aktif: true,
        dibuatPada: new Date().toISOString(),
      };
    }

    if (profile.aktif === false) {
      await signOut(auth);
      throw new Error("Akun Anda dinonaktifkan. Hubungi staf Langkah Juara.");
    }

    setCurrentUserId(profile.id);
    setActiveRole(profile.role);
    setUsers((prev) => deduplicateUsers([profile, ...prev]));

    return profile;
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthUser(firebaseUser);
      if (firebaseUser) {
        try {
          await syncOrInitUserDocument(firebaseUser);
        } catch (e) {
          console.warn("Gagal inisialisasi sesi login:", e);
        }
      } else {
        // Jika tidak ada sesi Firebase Auth, periksa apakah ada sesi simulasi pengujian lokal
        try {
          const savedSimId = typeof window !== "undefined" ? localStorage.getItem("langkah_juara_sim_user") : null;
          if (savedSimId) {
            const u = users.find((item) => item.id === savedSimId || item.aliasId === savedSimId);
            if (u) {
              setCurrentUserId(u.id);
              setActiveRole(u.role);
            } else {
              setCurrentUserId(null);
              setActiveRole(null);
            }
          } else {
            setCurrentUserId(null);
            setActiveRole(null);
          }
        } catch (e) {
          setCurrentUserId(null);
          setActiveRole(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("langkah_juara_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.users) setUsers((prev) => deduplicateUsers([...prev, ...parsed.users]));
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

  // Adjust active user when role changes (simulation)
  const switchRole = (role) => {
    setActiveRole(role);
    const u = users.find((item) => item.role === role);
    if (u) {
      setCurrentUserId(u.id);
      try {
        localStorage.setItem("langkah_juara_sim_user", u.id);
      } catch (e) {}
    } else {
      if (role === "siswa") setCurrentUserId("user-raka");
      else if (role === "staf") setCurrentUserId("user-fira");
      else if (role === "tutor") setCurrentUserId("user-dimas");
      else if (role === "super_admin") setCurrentUserId("user-arif");
    }
  };

  const switchUser = (userId) => {
    if (!userId) {
      setCurrentUserId(null);
      setActiveRole(null);
      try {
        localStorage.removeItem("langkah_juara_sim_user");
      } catch (e) {}
      return;
    }
    const u = users.find((item) => item.id === userId || item.aliasId === userId);
    if (u) {
      setCurrentUserId(u.id);
      setActiveRole(u.role);
      try {
        localStorage.setItem("langkah_juara_sim_user", u.id);
      } catch (e) {}
    }
  };

  // Firebase Authentication Methods
  const registerWithEmail = async ({ nama, email, password, noHp, noHpOrangTua, role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile = await syncOrInitUserDocument(cred.user, {
      nama,
      email,
      noHp,
      noHpOrangTua,
      role: role || "siswa",
    });
    return profile;
  };

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await syncOrInitUserDocument(cred.user, { email });
    return profile;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await syncOrInitUserDocument(cred.user);
    return profile;
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Gagal logout:", err);
    }
    setAuthUser(null);
    setCurrentUserId(null);
    setActiveRole(null);
    try {
      localStorage.removeItem("langkah_juara_sim_user");
    } catch (e) {}
  };

  const currentUser = currentUserId
    ? users.find((u) => u.id === currentUserId || u.aliasId === currentUserId) || null
    : null;

  // Helper Methods & Firestore Cloud Sync
  const addPendaftaran = (programId, siswaId = currentUser?.id) => {
    // Check if already waiting or active
    const existing = pendaftaran.find(
      (p) =>
        p.programId === programId &&
        (p.siswaId === siswaId || (currentUser?.aliasId && p.siswaId === currentUser.aliasId)) &&
        (p.status === "menunggu" || p.status === "aktif")
    );
    if (existing) {
      return { success: false, message: "Pendaftaran untuk program ini sudah diajukan atau masih aktif." };
    }

    const newId = `pend-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newPendaftaran = {
      id: newId,
      siswaId,
      programId,
      status: "menunggu",
      catatanStaf: "",
      dibuatPada: nowIso,
    };
    setPendaftaran((prev) => [newPendaftaran, ...prev]);

    // Firestore Sync: dibuatPada disimpan sebagai Timestamp sesuai PRD 7.1
    try {
      const firestoreData = {
        siswaId,
        programId,
        status: "menunggu",
        catatanStaf: "",
        dibuatPada: Timestamp.now(),
      };
      setDoc(doc(db, "pendaftaran", newId), firestoreData).catch((err) => {
        console.warn("Gagal menyimpan pendaftaran ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi simpan pendaftaran Firestore:", e);
    }

    return { success: true, message: "Pendaftaran terkirim. Selesaikan pembayaran di kantor Langkah Juara." };
  };

  const updatePendaftaranStatus = (pendaftaranId, status, catatanStaf = "") => {
    setPendaftaran((prev) =>
      prev.map((p) => (p.id === pendaftaranId ? { ...p, status, catatanStaf } : p))
    );

    // Firestore Sync: update status dan catatan staf
    try {
      setDoc(
        doc(db, "pendaftaran", pendaftaranId),
        { status, catatanStaf },
        { merge: true }
      ).catch((err) => {
        console.warn("Gagal memperbarui status pendaftaran di Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi update status pendaftaran Firestore:", e);
    }
  };

  const addKelas = (kelasData) => {
    const newId = `kelas-${Date.now()}`;
    const newK = {
      id: newId,
      siswaIds: [],
      ...kelasData,
    };
    setKelas((prev) => [newK, ...prev]);

    // Firestore Sync: simpan kelas ke koleksi "kelas"
    try {
      const { id, ...firestoreData } = newK;
      setDoc(doc(db, "kelas", newId), {
        ...firestoreData,
        siswaIds: Array.isArray(newK.siswaIds) ? newK.siswaIds : [],
      }).catch((err) => {
        console.warn("Gagal menyimpan kelas ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi simpan kelas Firestore:", e);
    }

    return newK;
  };

  const addSiswaToKelas = (kelasId, siswaId) => {
    let updatedSiswaIds = null;
    setKelas((prev) =>
      prev.map((k) => {
        if (k.id === kelasId) {
          if (!k.siswaIds.includes(siswaId)) {
            const nextList = [...k.siswaIds, siswaId];
            updatedSiswaIds = nextList;
            return { ...k, siswaIds: nextList };
          }
        }
        return k;
      })
    );

    // Firestore Sync: update array siswaIds di kelas
    if (updatedSiswaIds) {
      try {
        setDoc(
          doc(db, "kelas", kelasId),
          { siswaIds: updatedSiswaIds },
          { merge: true }
        ).catch((err) => {
          console.warn("Gagal memperbarui siswa kelas di Firestore:", err);
        });
      } catch (e) {
        console.warn("Gagal inisiasi update siswa kelas Firestore:", e);
      }
    }
  };

  const removeSiswaFromKelas = (kelasId, siswaId) => {
    let updatedSiswaIds = null;
    setKelas((prev) =>
      prev.map((k) => {
        if (k.id === kelasId) {
          const nextList = k.siswaIds.filter((id) => id !== siswaId);
          updatedSiswaIds = nextList;
          return { ...k, siswaIds: nextList };
        }
        return k;
      })
    );

    // Firestore Sync: update array siswaIds di kelas setelah penghapusan
    if (updatedSiswaIds) {
      try {
        setDoc(
          doc(db, "kelas", kelasId),
          { siswaIds: updatedSiswaIds },
          { merge: true }
        ).catch((err) => {
          console.warn("Gagal memperbarui hapus siswa kelas di Firestore:", err);
        });
      } catch (e) {
        console.warn("Gagal inisiasi hapus siswa kelas Firestore:", e);
      }
    }
  };

  const addPertemuan = (pertemuanData) => {
    const newId = `pert-${Date.now()}`;
    const newPert = {
      id: newId,
      hadirIds: [],
      ...pertemuanData,
    };
    setPertemuan((prev) => [newPert, ...prev]);

    // Firestore Sync: simpan pertemuan baru ke koleksi "pertemuan"
    try {
      const { id, ...firestoreData } = newPert;
      setDoc(doc(db, "pertemuan", newId), {
        ...firestoreData,
        hadirIds: Array.isArray(newPert.hadirIds) ? newPert.hadirIds : [],
      }).catch((err) => {
        console.warn("Gagal menyimpan pertemuan ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi simpan pertemuan Firestore:", e);
    }

    return newPert;
  };

  const updatePertemuanPresensi = (pertemuanId, hadirIds) => {
    setPertemuan((prev) =>
      prev.map((p) => (p.id === pertemuanId ? { ...p, hadirIds } : p))
    );

    // Firestore Sync: update daftar hadirIds di pertemuan
    try {
      setDoc(
        doc(db, "pertemuan", pertemuanId),
        { hadirIds: Array.isArray(hadirIds) ? hadirIds : [] },
        { merge: true }
      ).catch((err) => {
        console.warn("Gagal memperbarui presensi di Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi presensi Firestore:", e);
    }
  };

  const addTugas = (tugasData) => {
    const newId = `tugas-${Date.now()}`;
    const newTugas = {
      id: newId,
      ...tugasData,
    };
    setTugas((prev) => [newTugas, ...prev]);

    // Firestore Sync: batasWaktu disimpan sebagai Timestamp sesuai PRD 7.1
    try {
      let deadlineTimestamp;
      if (tugasData.batasWaktu) {
        deadlineTimestamp = Timestamp.fromDate(new Date(tugasData.batasWaktu));
      } else {
        deadlineTimestamp = Timestamp.now();
      }

      const firestoreData = {
        kelasId: tugasData.kelasId || "",
        judul: tugasData.judul || "",
        deskripsi: tugasData.deskripsi || "",
        batasWaktu: deadlineTimestamp,
      };

      setDoc(doc(db, "tugas", newId), firestoreData).catch((err) => {
        console.warn("Gagal menyimpan tugas ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi simpan tugas Firestore:", e);
    }

    return newTugas;
  };

  const submitTugas = (tugasId, siswaId, tautan, kelasId) => {
    const existing = pengumpulan.find((p) => p.tugasId === tugasId && p.siswaId === siswaId);
    const nowIso = new Date().toISOString();

    if (existing) {
      setPengumpulan((prev) =>
        prev.map((p) =>
          p.id === existing.id
            ? { ...p, tautan, dikumpulkanPada: nowIso }
            : p
        )
      );

      // Firestore Sync: perbarui submission tugas dengan dikumpulkanPada sebagai Timestamp
      try {
        setDoc(
          doc(db, "pengumpulan", existing.id),
          {
            tautan,
            dikumpulkanPada: Timestamp.now(),
          },
          { merge: true }
        ).catch((err) => {
          console.warn("Gagal memperbarui pengumpulan tugas ke Firestore:", err);
        });
      } catch (e) {
        console.warn("Gagal inisiasi update pengumpulan Firestore:", e);
      }
    } else {
      const newId = `peng-${Date.now()}`;
      const newPeng = {
        id: newId,
        tugasId,
        siswaId,
        kelasId: kelasId || "",
        tautan,
        dikumpulkanPada: nowIso,
        nilai: null,
        komentar: "",
      };
      setPengumpulan((prev) => [newPeng, ...prev]);

      // Firestore Sync: simpan pengumpulan baru dengan dikumpulkanPada sebagai Timestamp sesuai PRD 7.1
      try {
        const firestoreData = {
          tugasId,
          siswaId,
          kelasId: kelasId || "",
          tautan,
          dikumpulkanPada: Timestamp.now(),
          nilai: null,
          komentar: "",
        };
        setDoc(doc(db, "pengumpulan", newId), firestoreData).catch((err) => {
          console.warn("Gagal menyimpan pengumpulan tugas ke Firestore:", err);
        });
      } catch (e) {
        console.warn("Gagal inisiasi pengumpulan Firestore:", e);
      }
    }
  };

  const gradeTugas = (pengumpulanId, nilai, komentar) => {
    const numNilai = nilai !== null && nilai !== undefined && nilai !== "" ? Number(nilai) : null;
    setPengumpulan((prev) =>
      prev.map((p) =>
        p.id === pengumpulanId ? { ...p, nilai: numNilai, komentar } : p
      )
    );

    // Firestore Sync: simpan nilai dan komentar tugas ke pengumpulan
    try {
      setDoc(
        doc(db, "pengumpulan", pengumpulanId),
        {
          nilai: numNilai,
          komentar: komentar || "",
        },
        { merge: true }
      ).catch((err) => {
        console.warn("Gagal menyimpan penilaian tugas ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi penilaian tugas Firestore:", e);
    }
  };

  const updateUserProfile = async (userId, updatedFields) => {
    // 1. Update state lokal segera agar UI responsif
    setUsers((prev) =>
      prev.map((u) => (u.id === userId || u.aliasId === userId ? { ...u, ...updatedFields } : u))
    );

    // Cari objek pengguna untuk mendapatkan ID dokumen Firestore (UID asli)
    const userToUpdate = users.find((u) => u.id === userId || u.aliasId === userId);
    const targetDocId = userToUpdate?.id || userId;

    // Jika pengguna yang diubah adalah pengguna aktif dan peran diubah, sesuaikan activeRole
    if (userToUpdate && (currentUserId === userToUpdate.id || currentUserId === userToUpdate.aliasId)) {
      if (updatedFields.role) {
        setActiveRole(updatedFields.role);
      }
    }

    // 2. Simpan perubahan ke Cloud Firestore (users/{targetDocId})
    try {
      const userDocRef = doc(db, "users", targetDocId);
      await setDoc(userDocRef, updatedFields, { merge: true });

      // Jika ada alias ID lama yang terdaftar terpisah di Firestore, sinkronkan juga jika ada
      if (userToUpdate?.aliasId && userToUpdate.aliasId !== targetDocId) {
        try {
          const aliasDocRef = doc(db, "users", userToUpdate.aliasId);
          const aliasSnap = await getDoc(aliasDocRef);
          if (aliasSnap.exists()) {
            await setDoc(aliasDocRef, updatedFields, { merge: true });
          }
        } catch (_) {
          // Lewati jika alias bukan dokumen terpisah
        }
      }
    } catch (err) {
      console.error("Gagal menyimpan perubahan pengguna ke Cloud Firestore:", err);
      throw err;
    }
  };

  const deleteUser = async (userId) => {
    // Cari objek pengguna untuk mendapatkan ID dokumen Firestore (UID asli)
    const userToDelete = users.find((u) => u.id === userId || u.aliasId === userId);
    const targetDocId = userToDelete?.id || userId;

    // 1. Hapus dari state lokal
    setUsers((prev) => prev.filter((u) => u.id !== userId && u.aliasId !== userId));

    // 2. Hapus dokumen dari Cloud Firestore
    try {
      const userDocRef = doc(db, "users", targetDocId);
      await deleteDoc(userDocRef);

      if (userToDelete?.aliasId && userToDelete.aliasId !== targetDocId) {
        try {
          await deleteDoc(doc(db, "users", userToDelete.aliasId));
        } catch (_) {
          // Lewati jika alias bukan dokumen terpisah
        }
      }
    } catch (err) {
      console.warn("Gagal menghapus dokumen user dari Firestore:", err);
      throw err;
    }
  };

  const addProgram = (programData) => {
    const newId = `prog-${Date.now()}`;
    const newProg = {
      id: newId,
      ...programData,
      harga: Number(programData.harga),
      jumlahPertemuan: Number(programData.jumlahPertemuan),
      aktif: programData.aktif !== false,
    };
    setPrograms((prev) => [newProg, ...prev]);

    // Firestore Sync: simpan ke koleksi "program"
    try {
      const { id, ...firestoreData } = newProg;
      setDoc(doc(db, "program", newId), firestoreData).catch((err) => {
        console.warn("Gagal menyimpan program baru ke Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi simpan program Firestore:", e);
    }

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

    // Firestore Sync: perbarui field di dokumen "program"
    try {
      const cleanFields = { ...updatedFields };
      if (cleanFields.harga !== undefined) cleanFields.harga = Number(cleanFields.harga);
      if (cleanFields.jumlahPertemuan !== undefined) cleanFields.jumlahPertemuan = Number(cleanFields.jumlahPertemuan);
      delete cleanFields.id;
      setDoc(doc(db, "program", programId), cleanFields, { merge: true }).catch((err) => {
        console.warn("Gagal memperbarui program di Firestore:", err);
      });
    } catch (e) {
      console.warn("Gagal inisiasi update program Firestore:", e);
    }
  };

  const deleteProgram = async (programId) => {
    setPrograms((prev) => prev.filter((p) => p.id !== programId));
    try {
      await deleteDoc(doc(db, "program", programId));
    } catch (e) {
      console.warn("Gagal menghapus program dari Firestore:", e);
    }
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
        authUser,
        authLoading,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        logoutUser,
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
        deleteUser,
        addProgram,
        updateProgram,
        deleteProgram,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Terjemahan pesan error Firebase Authentication ke Bahasa Indonesia yang ramah
export function getFirebaseErrorMessage(error) {
  if (!error) return "Terjadi kesalahan. Silakan coba lagi.";
  const code = error.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau kata sandi tidak cocok. Silakan periksa kembali.";
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/invalid-email":
      return "Format alamat email tidak valid.";
    case "auth/popup-closed-by-user":
      return "Jendela masuk Google ditutup sebelum proses selesai.";
    case "auth/cancelled-popup-request":
      return "Proses masuk dengan Google dibatalkan.";
    case "auth/network-request-failed":
      return "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    case "auth/operation-not-allowed":
      return "Metode masuk ini belum diaktifkan di konsol Firebase (Authentication > Sign-in method).";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.";
    default:
      return error.message || "Gagal memproses autentikasi.";
  }
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
