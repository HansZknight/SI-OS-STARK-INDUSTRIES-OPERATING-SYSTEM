# 🚀 Stark Industries Operating System (J.A.R.V.I.S)

![J.A.R.V.I.S Banner](https://img.shields.io/badge/System-J.A.R.V.I.S%20Active-00d8ff?style=for-the-badge&logo=react&logoColor=white) ![Status](https://img.shields.io/badge/Status-Online-green?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-Mark_III-red?style=for-the-badge)

Selamat datang di repositori pusat **Stark Industries Operating System**. Ini adalah sistem asisten virtual berbasis kecerdasan buatan terpadu yang terinspirasi dari J.A.R.V.I.S (Just A Rather Very Intelligent System) milik Tony Stark.

Dibangun dengan antarmuka React yang futuristik dan ditenagai oleh mesin *Google Gemini AI*, sistem ini memiliki "Jembatan" (Bridge) Python yang memungkinkan J.A.R.V.I.S untuk berinteraksi langsung dengan sistem operasi (OS) komputer Anda.

---

## ✨ Fitur Utama

### 🧠 Kecerdasan & Kepribadian (AI Core)
* **Powered by Gemini Flash 2.0:** Respon super cepat dan pintar dengan pemahaman bahasa alami yang luar biasa.
* **Persona Adaptif:** Dilengkapi dengan *Normal Mode, Focus Mode, Sarcasm Mode*, hingga *Developer Mode*. Membalas seperti halnya kepala pelayan AI sejati.
* **Context Awareness (Kesadaran Sistem):** J.A.R.V.I.S secara *real-time* membaca suhu, penggunaan CPU, RAM, dan status Baterai Anda tanpa perlu diperintah. Jika Anda bertanya, "Bagaimana status sistem kita?", ia sudah memegang datanya.

### 🎙️ Suara & Audio (Neural Voice)
* **High-Fidelity Neural TTS:** Menggunakan Edge-TTS (`en-GB-ThomasNeural`) untuk menghasilkan suara British pria yang sangat berkelas, natural, dan mirip dengan versi film.
* **Wake-Word Detection:** Cukup sebutkan **"J.A.R.V.I.S"**, **"Hey Jarvis"**, atau **"Friday"** di Web/Mobile untuk membangunkannya tanpa sentuhan.
* **Global Shortcut:** Tekan `Ctrl + Space` di mana saja saat menggunakan Desktop App (Developer Mode) untuk memanggil UI seketika layaknya Spotlight.

### 💻 Kendali Sistem Operasi Penuh (Python Bridge)
Berkat arsitektur `stark-bridge` (Flask server) yang menjembatani Web App dengan Sistem Windows Anda, J.A.R.V.I.S memiliki kemampuan level dewa:
* **Force Kill App:** *"Jarvis, tutup paksa Valorant/Chrome."*
* **Window Management:** Minimalkan semua jendela, tutup window.
* **Akses Cepat:** Membuka VS Code, Spotify, WhatsApp, Task Manager, dsb.
* **Kontrol Perangkat Keras:** Mengatur Volume, Brightness, mengambil Selfie dari Webcam.
* **Otomasi OS:** Menggeser/men-scroll layar, mengetikkan teks, hingga *Lock* komputer.

### 📱 Multi-Platform & Universal Network (0.0.0.0)
* **Desktop App:** Berjalan mulus sebagai Aplikasi Desktop native via Electron (bebas border, transparansi).
* **Web & Mobile Ready:** Anda bisa mengakses OS ini melalui jaringan WiFi lokal dari layar HP Anda (UI akan otomatis menyesuaikan layar). Anda bisa memerintah PC Anda dari atas kasur menggunakan HP!

---

## 🗣️ Daftar Perintah (Voice & Text Commands)

Karena J.A.R.V.I.S ditenagai oleh NLP (Natural Language Processing) dari Gemini, **Anda tidak perlu menghafal perintah baku**. Bicaralah secara natural. Berikut adalah panduan perintah yang didukung:

### 1. Perintah Sistem Eksekusi (OS Level)
Anda bebas mencampur atau memilih antara bahasa Indonesia dan Inggris.
- **Force Kill Aplikasi:**
  - 🇮🇩 *"Jarvis, tolong tutup paksa Valorant."* / *"Matikan aplikasi Chrome."*
  - 🇬🇧 *"Jarvis, force kill Valorant."* / *"Terminate the Chrome process."*
- **Akses Cepat Aplikasi:**
  - 🇮🇩 *"Buka Spotify."* / *"Tolong buka Task Manager."*
  - 🇬🇧 *"Open WhatsApp."* / *"Launch VS Code."*
- **Volume & Media:**
  - 🇮🇩 *"Kecilkan volume."* / *"Skip lagu ini."* / *"Pause lagunya."*
  - 🇬🇧 *"Volume up."* / *"Next track."* / *"Play the music."*
- **Navigasi Layar:**
  - 🇮🇩 *"Scroll ke bawah."* / *"Tutup semua jendela (minimize)."*
  - 🇬🇧 *"Scroll up."* / *"Clear the screen."* / *"Show desktop."*
- **Utilitas Windows & Tema:**
  - 🇮🇩 *"Buka folder Downloads."* / *"Nyalakan mode gelap (Dark Mode)."* / *"Ambil screenshot."*
  - 🇬🇧 *"Open Documents."* / *"Toggle dark mode."* / *"Take a screenshot."*
- **Keamanan (Protokol Ekstrem):**
  - 🇮🇩 *"Jarvis, aktifkan mode Lockdown sekarang!"* (Lock PC, mute volume, minimize all)
  - 🇬🇧 *"Initiate Lockdown Protocol!"*

### 2. Kesadaran Sistem (Context & Diagnostics)
Sistem otomatis tahu keadaan PC Anda tanpa perlu menjalankan program terpisah.
- 🇮🇩 *"Berapa sisa baterai kita?"* / *"Apakah RAM kita kepenuhan?"* / *"Status sistem saat ini?"*
- 🇬🇧 *"What is our battery level?"* / *"Are we running out of memory?"* / *"Give me a system diagnostic."*

- **Terjemahan & Analisis Teks:**
  - 🇮🇩 *(Sorot teks)* *"Terjemahkan teks yang saya highlight ini."*
  - 🇬🇧 *(Sorot teks)* *"Translate this text to English."*
- **Clipboard Intel (Mata-mata Teks Siluman):**
  - 🇮🇩 *(Setelah menekan Ctrl+C pada teks apa saja)* *"Jarvis, tolong rangkum clipboard saya."* atau *"Analisis teks yang baru saya copy."*
  - 🇬🇧 *"Translate my clipboard content to German."*
- **Mengetik Otomatis:**
  - 🇮🇩 *"Jarvis, tolong ketikkan kalimat ini: Saya sedang rapat."*
  - 🇬🇧 *"Jarvis, type this for me: I will be late."*
- **Timer / Alarm:**
  - 🇮🇩 *"Pasang alarm 5 menit."* / *"Set timer 10 menit."*
  - 🇬🇧 *"Set a timer for 10 minutes."*
- **Membaca Teks (Text-to-Speech):**
  - 🇮🇩 *(Blok teks)* *"Tolong bacakan tulisan ini."*
  - 🇬🇧 *(Highlight text)* *"Read this for me."*
- **Pencarian Web / Media:**
  - 🇮🇩 *"Cari ini di Google."* / *"Putar lagu Hans Zimmer di Spotify."*
  - 🇬🇧 *"Search this on Google."* / *"Search YouTube for Iron Man trailer."*

### 4. Dashboard Eksternal & Keamanan (External Integrations)
J.A.R.V.I.S juga terhubung dengan *dashboard* pemantauan global.
- **Cuaca Global (Earth Nullschool):**
  - 🇮🇩 *"Tolong buka radar cuaca global."* / *"Buka peta cuaca."*
  - 🇬🇧 *"Open the global weather radar."* / *"Show me the weather map."*
- **Kamera Keamanan (EarthCam):**
  - 🇮🇩 *"Buka sistem kamera keamanan."* / *"Tampilkan kamera global."*
  - 🇬🇧 *"Open the security cameras."* / *"Show me EarthCam."*
- **Pasar Kripto & Saham (TradingView):**
  - 🇮🇩 *"Buka dashboard pasar saham."* / *"Tampilkan grafik kripto."*
  - 🇬🇧 *"Open the trading market dashboard."* / *"Show me crypto charts."*

### 5. Perintah *Roleplay* Iron Man (Opsional)
J.A.R.V.I.S memiliki banyak *Easter Egg* tersembunyi yang akan memicu respon keren ala film Iron Man. Cobalah sapa dia dengan kalimat-kalimat ini:
- 🇬🇧 *"Initiate emergency protocol!"*
- 🇬🇧 *"Suit up!"* atau *"Activate armor!"*
- 🇬🇧 *"Check Arc Reactor status!"*
- 🇬🇧 *"Engage combat mode!"*
- 🇬🇧 *"Activate Developer mode"* / *"Switch to Sarcasm mode"*

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

**Frontend:**
* React + Vite (Kecepatan dan modularitas antarmuka)
* TailwindCSS + Glassmorphism UI (Efek kaca transparan dan futuristik ala Stark)
* Electron.js (Untuk membungkus Web App menjadi Aplikasi Desktop `.exe`)

**Backend (Stark Local Bridge):**
* Python 3.14 + Flask (Jembatan komunikasi REST API)
* `edge-tts` (Sintesis suara *text-to-speech* Neural)
* `SpeechRecognition` & `sounddevice` (Input Mikrofon yang solid, menghindari masalah kompilasi C++)
* `psutil` (Monitoring Baterai, CPU, dan Memori)

---

## ⚙️ Panduan Instalasi & Menjalankan

### Persiapan
1. Pastikan **Node.js** dan **Python** (beserta `pip`) sudah terinstal.
2. Clone/Download repositori ini.
3. Buka terminal di dalam folder ini dan jalankan perintah:
   ```bash
   npm install
   ```
4. Instal *requirements* untuk Python Bridge:
   ```bash
   pip install flask edge-tts psutil SpeechRecognition sounddevice scipy
   ```

### 🚀 Cara Menghidupkan J.A.R.V.I.S

Karena arsitekturnya terpisah, Anda harus menyalakan Backend (Bridge) dan Frontend secara bersamaan. Kami sudah menyediakan *script* otomatis untuk ini.

**Langkah 1: Jalankan Bridge & Server**
Klik ganda pada file `start.bat` di direktori utama. File ini akan:
1. Membuka server Python (`stark-bridge/server.py`) di *background*.
2. Membuka server Vite / React.
3. Membuka Aplikasi Desktop Electron secara otomatis!

**Langkah 2: Selesai!**
J.A.R.V.I.S sudah online.
- Gunakan `Ctrl + Space` di keyboard untuk memunculkan J.A.R.V.I.S.
- Atau, buka URL Lokal (misal: `http://192.168.x.x:3000`) dari peramban (Browser) HP Anda yang terhubung di WiFi yang sama.

---

## 🔒 Privasi & Keamanan
J.A.R.V.I.S berkomunikasi langsung dengan Gemini API (dari perangkat Anda) dan mengeksekusi *command line* melalui Python Bridge lokal. Jangan mengekspos Port 5000 (Bridge) ke jaringan publik (Internet Terbuka), karena siapapun yang bisa mengakses URL tersebut dapat mengeksekusi perintah di PC Anda!

---
> *"Sometimes you gotta run before you can walk." — Tony Stark*
