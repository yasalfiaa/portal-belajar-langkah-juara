// scripts/seedFirestore.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlQtPhDzHGtgryf4FycyXAxuPlmSFKhZ8",
  authDomain: "bimbel-langkah-juara-b3b1f.firebaseapp.com",
  projectId: "bimbel-langkah-juara-b3b1f",
  storageBucket: "bimbel-langkah-juara-b3b1f.firebasestorage.app",
  messagingSenderId: "810821470449",
  appId: "1:810821470449:web:e86d8cfb535ff3626cc150",
  measurementId: "G-N1J8L06YNP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Menginisialisasi koneksi ke Cloud Firestore bimbel-langkah-juara-b3b1f...");

// Koleksi: users (PRD 7.1)
const users = [
  {
    id: "user-raka",
    nama: "Raka Pratama",
    email: "raka@example.com",
    noHp: "081234567890",
    noHpOrangTua: "081298765432",
    role: "siswa",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-09-01T08:00:00Z")),
  },
  {
    id: "user-salsa",
    nama: "Salsabila Putri",
    email: "salsa@example.com",
    noHp: "081345678901",
    noHpOrangTua: "081398765431",
    role: "siswa",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-09-05T08:00:00Z")),
  },
  {
    id: "user-fira",
    nama: "Kak Fira",
    email: "fira@langkahjuara.id",
    noHp: "081456789012",
    noHpOrangTua: "",
    role: "staf",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-08-01T08:00:00Z")),
  },
  {
    id: "user-dimas",
    nama: "Kak Dimas",
    email: "dimas@langkahjuara.id",
    noHp: "081567890123",
    noHpOrangTua: "",
    role: "tutor",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-08-01T08:00:00Z")),
  },
  {
    id: "user-nadia",
    nama: "Kak Nadia",
    email: "nadia@langkahjuara.id",
    noHp: "081678901234",
    noHpOrangTua: "",
    role: "tutor",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-08-01T08:00:00Z")),
  },
  {
    id: "user-arif",
    nama: "Pak Arif",
    email: "arif@langkahjuara.id",
    noHp: "081789012345",
    noHpOrangTua: "",
    role: "super_admin",
    aktif: true,
    dibuatPada: Timestamp.fromDate(new Date("2026-07-01T08:00:00Z")),
  },
];

// Koleksi: program (PRD 7.1)
const programs = [
  {
    id: "prog-1",
    nama: "Intensif UTBK",
    jenjang: "SMA",
    jumlahPertemuan: 24,
    harga: 1500000,
    aktif: true,
  },
  {
    id: "prog-2",
    nama: "Matematika SMP",
    jenjang: "SMP",
    jumlahPertemuan: 16,
    harga: 850000,
    aktif: true,
  },
  {
    id: "prog-3",
    nama: "Sains Terpadu SMA",
    jenjang: "SMA",
    jumlahPertemuan: 20,
    harga: 1200000,
    aktif: true,
  },
  {
    id: "prog-4",
    nama: "Bahasa Inggris SMP",
    jenjang: "SMP",
    jumlahPertemuan: 12,
    harga: 700000,
    aktif: false,
  },
];

// Koleksi: pendaftaran (PRD 7.1)
const pendaftaran = [
  {
    id: "pend-1",
    siswaId: "user-raka",
    programId: "prog-1",
    status: "aktif",
    catatanStaf: "",
    dibuatPada: Timestamp.fromDate(new Date("2026-10-01T09:00:00Z")),
  },
  {
    id: "pend-2",
    siswaId: "user-salsa",
    programId: "prog-2",
    status: "aktif",
    catatanStaf: "",
    dibuatPada: Timestamp.fromDate(new Date("2026-10-02T10:15:00Z")),
  },
  {
    id: "pend-3",
    siswaId: "user-raka",
    programId: "prog-3",
    status: "menunggu",
    catatanStaf: "",
    dibuatPada: Timestamp.fromDate(new Date("2026-10-15T11:30:00Z")),
  },
  {
    id: "pend-4",
    siswaId: "user-salsa",
    programId: "prog-1",
    status: "ditolak",
    catatanStaf: "Jenjang siswa (SMP) belum memenuhi prasyarat Intensif UTBK SMA.",
    dibuatPada: Timestamp.fromDate(new Date("2026-10-05T14:20:00Z")),
  },
  {
    id: "pend-5",
    siswaId: "user-raka",
    programId: "prog-2",
    status: "menunggu",
    catatanStaf: "",
    dibuatPada: Timestamp.fromDate(new Date("2026-10-17T08:45:00Z")),
  },
];

// Koleksi: kelas (PRD 7.1)
const kelas = [
  {
    id: "kelas-1",
    nama: "Intensif UTBK A",
    programId: "prog-1",
    tutorId: "user-dimas",
    siswaIds: ["user-raka"],
    hari: "Selasa",
    jam: "16.00",
    tempat: "Ruang 2",
  },
  {
    id: "kelas-2",
    nama: "Matematika SMP B",
    programId: "prog-2",
    tutorId: "user-nadia",
    siswaIds: ["user-salsa"],
    hari: "Rabu",
    jam: "15.30",
    tempat: "Ruang 1",
  },
];

// Koleksi: pertemuan (PRD 7.1)
const pertemuan = [
  {
    id: "pert-1",
    kelasId: "kelas-2",
    tanggal: "2026-10-07",
    topik: "Persamaan Linear Satu Variabel",
    materiUrl: "https://drive.google.com/file/d/materi-persamaan-linear",
    hadirIds: ["user-salsa"],
  },
  {
    id: "pert-2",
    kelasId: "kelas-1",
    tanggal: "2026-10-08",
    topik: "Strategi Penalaran Umum UTBK",
    materiUrl: "https://drive.google.com/file/d/materi-penalaran-umum",
    hadirIds: ["user-raka"],
  },
  {
    id: "pert-3",
    kelasId: "kelas-1",
    tanggal: "2026-10-15",
    topik: "Bedah Soal TPS Kuantitatif",
    materiUrl: "https://drive.google.com/file/d/materi-kuantitatif",
    hadirIds: ["user-raka"],
  },
];

// Koleksi: tugas (PRD 7.1)
const tugas = [
  {
    id: "tugas-1",
    kelasId: "kelas-1",
    judul: "Latihan Penalaran Umum 3",
    deskripsi: "Kerjakan 20 butir soal penalaran umum pada tautan materi pertemuan 2 dan kumpulkan tautan lembar jawaban Google Drive/Docs.",
    batasWaktu: Timestamp.fromDate(new Date("2026-10-25T23:59:00Z")),
  },
  {
    id: "tugas-2",
    kelasId: "kelas-2",
    judul: "Tugas Mandiri 1: Persamaan Linear",
    deskripsi: "Selesaikan 5 soal pemecahan masalah bab persamaan linear pada buku pegangan siswa halaman 45.",
    batasWaktu: Timestamp.fromDate(new Date("2026-10-20T20:00:00Z")),
  },
  {
    id: "tugas-3",
    kelasId: "kelas-1",
    judul: "Try Out Kuantitatif Mandiri",
    deskripsi: "Latihan mandiri paket 1 TPS UTBK materi aljabar dan aritmetika.",
    batasWaktu: Timestamp.fromDate(new Date("2026-10-12T18:00:00Z")),
  },
];

// Koleksi: pengumpulan (PRD 7.1)
const pengumpulan = [
  {
    id: "peng-1",
    tugasId: "tugas-1",
    siswaId: "user-raka",
    kelasId: "kelas-1",
    tautan: "https://docs.google.com/document/d/jawaban-raka-tugas1",
    dikumpulkanPada: Timestamp.fromDate(new Date("2026-10-16T14:30:00Z")),
    nilai: 85,
    komentar: "Analisis sudah sangat baik dan terstruktur! Pertahankan ketelitian pada nomor 14.",
  },
  {
    id: "peng-2",
    tugasId: "tugas-2",
    siswaId: "user-salsa",
    kelasId: "kelas-2",
    tautan: "https://drive.google.com/file/d/jawaban-salsa-soal-mandiri",
    dikumpulkanPada: Timestamp.fromDate(new Date("2026-10-17T09:15:00Z")),
    nilai: null,
    komentar: "",
  },
];

async function seed() {
  try {
    console.log("1. Menyemai koleksi 'users'...");
    for (const item of users) {
      const { id, ...data } = item;
      await setDoc(doc(db, "users", id), data);
      console.log(`   - users/${id} (${data.nama}) OK`);
    }

    console.log("2. Menyemai koleksi 'program'...");
    for (const item of programs) {
      const { id, ...data } = item;
      await setDoc(doc(db, "program", id), data);
      console.log(`   - program/${id} (${data.nama}) OK`);
    }

    console.log("3. Menyemai koleksi 'pendaftaran'...");
    for (const item of pendaftaran) {
      const { id, ...data } = item;
      await setDoc(doc(db, "pendaftaran", id), data);
      console.log(`   - pendaftaran/${id} (${data.siswaId} -> ${data.programId}) OK`);
    }

    console.log("4. Menyemai koleksi 'kelas'...");
    for (const item of kelas) {
      const { id, ...data } = item;
      await setDoc(doc(db, "kelas", id), data);
      console.log(`   - kelas/${id} (${data.nama}) OK`);
    }

    console.log("5. Menyemai koleksi 'pertemuan'...");
    for (const item of pertemuan) {
      const { id, ...data } = item;
      await setDoc(doc(db, "pertemuan", id), data);
      console.log(`   - pertemuan/${id} (${data.topik}) OK`);
    }

    console.log("6. Menyemai koleksi 'tugas'...");
    for (const item of tugas) {
      const { id, ...data } = item;
      await setDoc(doc(db, "tugas", id), data);
      console.log(`   - tugas/${id} (${data.judul}) OK`);
    }

    console.log("7. Menyemai koleksi 'pengumpulan'...");
    for (const item of pengumpulan) {
      const { id, ...data } = item;
      await setDoc(doc(db, "pengumpulan", id), data);
      console.log(`   - pengumpulan/${id} (tugas: ${data.tugasId}, siswa: ${data.siswaId}) OK`);
    }

    console.log("\n>>> Seluruh 7 koleksi PRD 7.1 berhasil disemai ke Cloud Firestore! <<<");
    process.exit(0);
  } catch (error) {
    console.error("Gagal menyemai Firestore:", error);
    process.exit(1);
  }
}

seed();
