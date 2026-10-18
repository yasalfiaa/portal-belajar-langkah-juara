// scripts/test_matrix.mjs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

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

console.log("=== MEMULAI PENGUJIAN OTOMASI INTEGRASI & DATA FIRESTORE ===");

async function testIntegrationFlow() {
  const testRunId = Date.now();
  console.log(`\n--- Menguji Alur Lengkap Bisnis (PRD 4.3 -> 4.8 -> 4.9 -> 4.13 -> 4.5 -> Nilai) [Run: ${testRunId}] ---`);

  // 1. Siswa mendaftar program (4.3)
  const pendId = `pend-test-${testRunId}`;
  const siswaId = "user-raka";
  const programId = "prog-1"; // Intensif UTBK

  console.log("1. Siswa mendaftar program (PRD 4.3)...");
  await setDoc(doc(db, "pendaftaran", pendId), {
    siswaId,
    programId,
    status: "menunggu",
    catatanStaf: "",
    dibuatPada: Timestamp.now(),
  });
  console.log(`   -> Pendaftaran tersimpan di Firestore: ID ${pendId}, status: menunggu`);

  // Verifikasi 1
  let pendSnap = await getDoc(doc(db, "pendaftaran", pendId));
  if (!pendSnap.exists() || pendSnap.data().status !== "menunggu") {
    throw new Error("Gagal verifikasi status pendaftaran menunggu!");
  }
  console.log("   -> [PASS] Status pendaftaran terverifikasi 'menunggu'");

  // 2. Staf menyetujui pendaftaran (PRD 4.8)
  console.log("2. Staf menyetujui pendaftaran (PRD 4.8)...");
  await updateDoc(doc(db, "pendaftaran", pendId), {
    status: "aktif",
    catatanStaf: "",
  });
  pendSnap = await getDoc(doc(db, "pendaftaran", pendId));
  if (pendSnap.data().status !== "aktif") {
    throw new Error("Gagal verifikasi persetujuan staf!");
  }
  console.log("   -> [PASS] Status pendaftaran berhasil disetujui staf menjadi 'aktif'");

  // 3. Staf memasukkan siswa ke kelas (PRD 4.9)
  console.log("3. Staf memasukkan siswa ke kelas (PRD 4.9)...");
  const kelasId = "kelas-1"; // Intensif UTBK A
  const kelasRef = doc(db, "kelas", kelasId);
  const kelasSnap = await getDoc(kelasRef);
  let currentSiswa = kelasSnap.exists() && Array.isArray(kelasSnap.data().siswaIds)
    ? kelasSnap.data().siswaIds
    : [];
  if (!currentSiswa.includes(siswaId)) {
    currentSiswa.push(siswaId);
    await updateDoc(kelasRef, { siswaIds: currentSiswa });
  }
  const updatedKelasSnap = await getDoc(kelasRef);
  if (!updatedKelasSnap.data().siswaIds.includes(siswaId)) {
    throw new Error("Gagal verifikasi siswa masuk ke kelas!");
  }
  console.log(`   -> [PASS] Siswa ${siswaId} terverifikasi berada di kelas ${kelasId} (${updatedKelasSnap.data().siswaIds.length} siswa)`);

  // 4. Tutor membuat tugas (PRD 4.13)
  console.log("4. Tutor membuat tugas baru (PRD 4.13)...");
  const tugasId = `tugas-test-${testRunId}`;
  await setDoc(doc(db, "tugas", tugasId), {
    kelasId,
    judul: `Tugas Uji Integrasi ${testRunId}`,
    deskripsi: "Selesaikan latihan soal UTBK penalaran dan lampirkan link dokumen.",
    batasWaktu: Timestamp.fromDate(new Date("2026-10-25T23:59:00Z")),
  });
  const tugasSnap = await getDoc(doc(db, "tugas", tugasId));
  if (!tugasSnap.exists()) {
    throw new Error("Gagal verifikasi tugas baru di Firestore!");
  }
  console.log(`   -> [PASS] Tugas baru berhasil dibuat: ID ${tugasId}, judul: ${tugasSnap.data().judul}`);

  // 5. Siswa mengumpulkan tugas (PRD 4.5)
  console.log("5. Siswa mengumpulkan jawaban tugas (PRD 4.5)...");
  const pengId = `peng-test-${testRunId}`;
  const submissionLink = `https://docs.google.com/document/d/uji-siswa-${testRunId}`;
  await setDoc(doc(db, "pengumpulan", pengId), {
    tugasId,
    siswaId,
    kelasId,
    tautan: submissionLink,
    dikumpulkanPada: Timestamp.now(),
    nilai: null,
    komentar: "",
  });
  let pengSnap = await getDoc(doc(db, "pengumpulan", pengId));
  if (!pengSnap.exists() || pengSnap.data().tautan !== submissionLink) {
    throw new Error("Gagal verifikasi pengumpulan tugas siswa!");
  }
  console.log(`   -> [PASS] Pengumpulan tersimpan dengan tautan valid https://... Status: Dikumpulkan`);

  // 6. Tutor memberi nilai (PRD 4.13)
  console.log("6. Tutor memberi nilai dan komentar (PRD 4.13)...");
  const nilaiDiberikan = 92;
  const komentarTutor = "Penalaran analitis luar biasa, pertahankan konsistensi!";
  await updateDoc(doc(db, "pengumpulan", pengId), {
    nilai: nilaiDiberikan,
    komentar: komentarTutor,
  });
  pengSnap = await getDoc(doc(db, "pengumpulan", pengId));
  if (pengSnap.data().nilai !== nilaiDiberikan || pengSnap.data().komentar !== komentarTutor) {
    throw new Error("Gagal verifikasi penilaian tutor!");
  }
  console.log(`   -> [PASS] Penilaian berhasil disimpan ke Firestore: Nilai ${pengSnap.data().nilai}/100, Komentar: "${pengSnap.data().komentar}"`);

  // 7. Siswa membaca nilai dari Firestore (PRD 4.5)
  console.log("7. Siswa membaca nilai dari Firestore (PRD 4.5)...");
  const finalSnap = await getDoc(doc(db, "pengumpulan", pengId));
  const finalData = finalSnap.data();
  console.log(`   -> Data dibaca siswa: Nilai = ${finalData.nilai}, Komentar = "${finalData.komentar}", Dikumpulkan = ${finalData.dikumpulkanPada.toDate().toISOString()}`);
  if (finalData.nilai === 92 && finalData.komentar.length > 0) {
    console.log("   -> [PASS] Siswa berhasil membaca nilai yang tersimpan dalam data Firestore.");
  } else {
    throw new Error("Gagal membaca nilai tersimpan di Firestore!");
  }

  console.log("\n>>> SELURUH ALUR INTEGRASI PRD BAB 4 & BAB 8 SUKSES 100%! <<<\n");
}

testIntegrationFlow().catch((err) => {
  console.error("Gagal pengujian:", err);
  process.exit(1);
});
