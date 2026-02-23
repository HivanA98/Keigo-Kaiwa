// --- BAGIAN 1: Logika Flashcard & Data CSV ---
let kaiwaData = [];
let currentIndex = 0;

const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const btnFlip = document.getElementById('btn-flip');
const btnNext = document.getElementById('btn-next');

async function muatDataCSV() {
    try {
        // Mengambil CSV terbaru secara paksa, tanpa mempedulikan cache
        const response = await fetch('data.csv', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const dataTeks = await response.text();
        
        // Membersihkan karakter \r (Windows) agar tidak merusak data saat di-parse
        const baris = dataTeks.replace(/\r/g, '').split('\n');
        
        kaiwaData = []; 
        for (let i = 1; i < baris.length; i++) {
            if (baris[i].trim() === '') continue; 
            
            // Perbaikan Algoritma Split: Mengamankan pemisahan koma
            // Jika ada teks diapit kutip, kita hindari pemisahan yang salah, 
            // tapi untuk struktur dasar Anda, split biasa cukup aman jika tidak ada koma di dalam teks arti.
            const kolom = baris[i].split(',');
            if(kolom.length >= 4) {
                 kaiwaData.push({
                    kanji: kolom[0],
                    hiragana: kolom[1],
                    romaji: kolom[2],
                    arti: kolom[3]
                });
            }
        }
        
        if (kaiwaData.length > 0) {
            loadCard();
        } else {
             cardFront.innerHTML = "<div class='card-content-wrapper'><div class='card-content-inner'>Data CSV kosong.</div></div>";
        }
        
    } catch (error) {
        console.error("Gagal memuat CSV:", error);
        cardFront.innerHTML = "<div class='card-content-wrapper'><div class='card-content-inner'>Gagal memuat data CSV. Pastikan file ada.</div></div>";
    }
}

function loadCard() {
    if (kaiwaData.length === 0) return;

    const dataSaatIni = kaiwaData[currentIndex];
    
    // Injeksi dengan struktur DOM 2 lapis (mencegah bug animasi 3D vs Scroll)
    cardFront.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-content-inner">
                <div style="font-size: 24px; line-height: 1.4; margin-bottom: 10px; font-weight: bold;">${dataSaatIni.kanji}</div>
                <div style="font-size: 16px; color: #555; margin-bottom: 5px;">${dataSaatIni.hiragana}</div>
                <div style="font-size: 14px; color: #888;">${dataSaatIni.romaji}</div>
            </div>
        </div>
    `;
    
    cardBack.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-content-inner">
                <div style="font-size: 20px; font-weight: 500; line-height: 1.5;">${dataSaatIni.arti}</div>
            </div>
        </div>
    `;
    
    card.classList.remove('is-flipped'); 
}

function flipCard() {
    card.classList.toggle('is-flipped');
}

card.addEventListener('click', flipCard);
btnFlip.addEventListener('click', flipCard);

btnNext.addEventListener('click', () => {
    if (kaiwaData.length > 0) {
        currentIndex = (currentIndex + 1) % kaiwaData.length;
        loadCard();
    }
});

// Jalankan pemuatan data
muatDataCSV();

// --- BAGIAN 2: Logika Pengubah Tema (Anti-Tumpuk) ---
const themeSelect = document.getElementById('theme-select');
const bodyElement = document.body;

themeSelect.addEventListener('change', (e) => {
    // Solusi O(1): Menimpa seluruh kelas di <body> agar tema lama otomatis terbuang
    bodyElement.className = e.target.value;
});