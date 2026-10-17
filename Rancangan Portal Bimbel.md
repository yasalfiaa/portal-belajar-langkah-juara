**Rancangan Teknis Proyek Portal Belajar Langkah Juara**

1\. Matriks Akses:

| Fitur (subbab PRD) | Siswa | Staf | Tutor | Super Admin |
| :---- | ----- | ----- | ----- | ----- |
| Daftar dan Masuk | ✓ | ✓ | ✓ | ✓ |
| Beranda | ✓ | ✕ | ✕ | ✓ |
| Program | ✓ | ✕ | ✕ | ✓ |
| Kelas Saya | ✓ | ✕ | ✕ | ✓ |
| Tugas | ✓ | ✕ | ✕ | ✓ |
| Profil | ✓ | ✓ | ✓ | ✓ |
| Dasbor Staf | ✕ | ✓ | ✕ | ✓ |
| Pendaftaran | ✕ | ✓ | ✕ | ✓ |
| Kelola Kelas | ✕ | ✓ | ✕ | ✓ |
| Data Siswa | ✕ | ✓ | ✕ | ✓ |
| Dasbor Tutor  | ✕ | ✕ | ✓ | ✓ |
| Kelas yang Diajar | ✕ | ✕ | ✓ | ✓ |
| Tugas dan Nilai | ✕ | ✕ | ✓ | ✓ |
| Dasbor Admin | ✕ | ✕ | ✕ | ✓ |
| Kelola Pengguna | ✕ | ✕ | ✕ | ✓ |
| Program  | ✕ | ✕ | ✕ | ✓ |
| Laporan | ✕ | ✕ | ✕ | ✓ |

2\. Peta Route:

| Halaman | Alamat | Peran yang boleh membuka | Belum masuk | Peran lain |
| :---- | :---- | :---- | :---- | :---- |
| Masuk | belajar.langkahjuara.id/masuk | siswa, staf, tutor, super\_admin | ke /daftar | akses diterima selama tidak dinonaktifkan |
| Beranda | belajar.langkahjuara.id/siswa/beranda | siswa, super\_admin | ke /masuk | akses ditolak |
| Program | belajar.langkahjuara.id/siswa/program | siswa, super\_admin | ke /masuk | akses ditolak |
| Kelas Saya | belajar.langkahjuara.id/siswa/kelas/:id | siswa, super\_admin | ke /masuk | staf, tutor diterima dengan id sama |
| Tugas | belajar.langkahjuara.id/siswa/tugas/:id | siswa, super\_admin | ke /masuk | akses ditolak |
| Profil | belajar.langkahjuara.id/profil | siswa, staf, tutor, super\_admin | ke /masuk | akses ditolak |
| Dasbor Staf | belajar.langkahjuara.id/staf/dasbor | staf, super\_admin | ke /masuk | akses ditolak |
| Pendaftaran | belajar.langkahjuara.id/staf/pendaftaran | staf, super\_admin | ke /masuk | akses ditolak |
| Kelola Kelas | belajar.langkahjuara.id/staf/kelas | staf, super\_admin | ke /masuk | akses ditolak |
| Data Siswa | belajar.langkahjuara.id/staf/siswa | staf, super\_admin | ke /masuk | akses ditolak |
| Dasbor Tutor | belajar.langkahjuara.id/tutor/dasbor | tutor, super\_admin | ke /masuk | akses ditolak |
| Kelas yang Diajar | belajar.langkahjuara.id/tutor/kelas/:id | tutor, super\_admin | ke /masuk | akses ditolak |
| Tugas dan Nilai | belajar.langkahjuara.id/tutor/tugas | tutor, super\_admin | ke /masuk | akses ditolak |
| Dasbor Admin | belajar.langkahjuara.id/admin/dasbor | super\_admin | ke /masuk | akses ditolak |
| Kelola Pengguna | belajar.langkahjuara.id/admin/pengguna | super\_admin | ke /masuk | akses ditolak |
| Program | belajar.langkahjuara.id/admin/program | super\_admin | ke /masuk | akses ditolak |
| Laporan | belajar.langkahjuara.id/admin/laporan | super\_admin | ke /masuk | akses ditolak |

3\. Keputusan Bisnis

| Bimbel | Keputusan |
| :---- | :---- |
| Bolehkah staf mengubah nilai tugas? | Tidak, hanya tutor kelas tersebut dan super admin yang dapat mengisi nilai dan komentar (4.13) |
| Bolehkah Kak Dimas membuka kelas Kak Nadia? | Tidak, Kak Dimas memiliki id kelas yang berbeda sehingga akses ditolak (4.12) |
| Bolehkah Raka melihat nilai Salsa? | Tidak, Raka mendaftar di kelas yang berbeda (UTBK) sehingga muncul notifikasi tugas tidak ditemukan (4.5) |
| Halaman mana saja yang boleh dibuka Pak Arif? | Membuka semua halaman peran lain, ditambah mengelola pengguna, program, dan laporan (2.1) |

