Link to - Pratinjau Tautan Palsu di Media Sosial dan Aplikasi Pesan
Tujuan

Proyek ini dibuat untuk tujuan hiburan. Anda dapat mengirimkan sebuah tautan kepada teman Anda yang seolah-olah mengarah ke situs "Anak Kucing Lucu", tetapi saat tautan tersebut dibuka, mereka akan diarahkan ke sesuatu yang jauh lebih menarik. 😉

Cara Kerja

Saat server menerima permintaan HTTP, server akan memeriksa nilai User-Agent.

Jika User-Agent terdeteksi sebagai bot (misalnya bot dari media sosial atau aplikasi pesan) yang bertugas mengambil metadata Open Graph dari sebuah halaman web—seperti judul, deskripsi, dan gambar pratinjau—maka server akan mengirimkan halaman yang berisi metadata Open Graph tersebut.

Namun, jika User-Agent bukan bot, server akan mengirimkan respons HTTP dengan header Location, sehingga browser pengguna akan langsung dialihkan (redirect) ke alamat tujuan yang sebenarnya.

Singkatnya
Bot media sosial (Facebook, WhatsApp, Telegram, Discord, X, dll.) → Melihat judul, deskripsi, dan gambar yang Anda tentukan sebagai pratinjau tautan.
Pengguna yang mengklik tautan → Tidak melihat halaman tersebut, melainkan langsung diarahkan ke URL tujuan sebenarnya melalui proses redirect.
