# 🚀 Leave Management System API

API sistem manajemen cuti karyawan yang dibangun menggunakan **AdonisJS v5** dan **MySQL/MariaDB**. Project ini dirancang untuk menangani autentikasi modern, manajemen data karyawan, dan proses pengajuan cuti yang terintegrasi.

## 📌 Fitur Utama

- **Autentikasi Ganda:** Mendukung Login Tradisional (Email/Password) dan Social Auth (**Google & GitHub OAuth**).
- **Manajemen Cuti:** Sistem pengajuan cuti dengan validasi status dan manajemen dokumen/lampiran.
- **Role-Based Access Control (RBAC):** Perbedaan hak akses antara Admin dan Employee melalui Middleware.
- **Secure API:** Proteksi route menggunakan API Tokens (OAT) dan Rate Limiting.
- **File Uploads:** Penanganan upload lampiran untuk pengajuan cuti secara aman.

---

## 🛠️ Tech Stack

- **Framework:** [AdonisJS v5](https://docs.adonisjs.com/guides/introduction)
- **Database:** MySQL
- **ORM:** Lucid ORM
- **Authentication:** Adonis Auth (OAT) & Adonis Ally (Social Auth)
- **Language:** TypeScript

---

## 🏗️ Arsitektur & Alur Sistem

Sistem ini mengikuti pola **MVC (Model-View-Controller)** yang dimodifikasi untuk API-only:

### 1. Arsitektur Folder & Logika

- **Services Pattern:** Logika bisnis berat (seperti proses autentikasi OAuth dan kalkulasi cuti) dipisahkan ke dalam folder `app/Services` agar Controller tetap bersih.
- **Validators:** Semua input user divalidasi dengan ketat menggunakan `app/Validators` untuk memastikan integritas data.
- **Middlewares:**
  - `Auth`: Memastikan request memiliki token yang valid.
  - `AdminOnly`: Membatasi akses fitur tertentu (seperti update status cuti) hanya untuk akun dengan role admin.

### 2. Alur Pengajuan Cuti (Leave Flow)

1. **Request:** Karyawan mengirimkan permohonan melalui endpoint `POST /api/leave`.
2. **Validation:** Sistem mengecek tipe cuti, tanggal, dan lampiran file.
3. **Storage:** Data disimpan dengan status default `pending`.
4. **Approval:** Admin menerima notifikasi/list, kemudian melakukan `PATCH` untuk mengubah status menjadi `approved` atau `rejected`.

### 3. Skema Database

- **Users:** Menyimpan informasi profil, role, dan provider OAuth.
- **LeaveRequests:** Relasi Many-to-One dengan tabel Users, menyimpan detail alasan dan lampiran.
- **ApiTokens:** Mengelola session token yang aktif.

---

## 🚀 Panduan Instalasi

### 1. Clone Project

```bash
git clone [https://github.com/tiswan14/leave-management-api.git](https://github.com/tiswan14/leave-management-api.git)
cd leave-management-api
```
### 2. Install Dependencies

```bash
npm install
# atau jika menggunakan pnpm
pnpm install
```
### 3. Konfigurasi Environment

Salin file **.env.example** menjadi **.env**:
```bash
cp .env.example .env
```

Buka file **.env** dan sesuaikan bagian berikut:
- **DB Credentials** Isi MYSQL_USER, MYSQL_PASSWORD, dan MYSQL_DB_NAME.

- **Social Auth** Masukkan GOOGLE_CLIENT_ID dan SECRET kamu jika ingin mencoba fitur OAuth.

### 4. Database Migration & Seeding

Jalankan migrasi untuk membuat tabel dan seeder untuk data awal:

```bash
node ace migration:run
node ace db:seed
```

### 5. Jalankan Server

```bash
node ace serve --watch
```

API sekarang dapat diakses di **http://localhost:3333**



---

## 📬 API Documentation

Dokumentasi API lengkap tersedia melalui Postman:

🔗 https://documenter.getpostman.com/view/34951789/2sBXirj8is

Dokumentasi ini mencakup:
- Endpoint Auth (Register, Login, OAuth)
- Endpoint Leave Management
- Endpoint Admin (Approval/Rejection)
- Contoh request & response
- Penggunaan Authorization (Bearer Token)