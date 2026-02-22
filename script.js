// --- BAGIAN 1: Logika Flashcard & CSV ---
let kaiwaData = [];
let currentIndex = 0;

const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const btnFlip = document.getElementById('btn-flip');
const btnNext = document.getElementById('btn-next');

async function muatDataCSV() {
    try {
        // Parameter { cache: 'no-store' } memaksa browser mengambil file terbaru dari server
        const response = await fetch('data.csv', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const dataTeks = await response.text();
        
        // Membersihkan karakter \r bawaan Windows dan memecah per baris
        const baris = dataTeks.replace(/\r/g, '').split('\n');
        
        kaiwaData = []; 
        for (let i = 1; i < baris.length; i++) {
            if (baris[i].trim() === '') continue; 
            
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
             cardFront.innerHTML = "Data CSV kosong atau gagal dibaca.";
        }
        
    } catch (error) {
        console.error("Gagal memuat CSV:", error);
        cardFront.innerHTML = "Gagal memuat data. Periksa koneksi atau file CSV.";
    }
}

function loadCard() {
    if (kaiwaData.length === 0) return;

    const dataSaatIni = kaiwaData[currentIndex];
    
    // Membungkus teks bagian depan dengan div struktural yang baru
    cardFront.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-content-inner">
                <div style="font-size: 26px; margin-bottom: 10px; font-weight: bold; line-height: 1.3;">${dataSaatIni.kanji}</div>
                <div style="font-size: 16px; color: #555; margin-bottom: 5px;">${dataSaatIni.hiragana}</div>
                <div style="font-size: 14px; color: #888;">${dataSaatIni.romaji}</div>
            </div>
        </div>
    `;
    
    // Membungkus teks bagian belakang (arti) dengan div struktural yang baru
    cardBack.innerHTML = `
        <div class="card-content-wrapper">
            <div class="card-content-inner">
                <div style="font-size: 20px; font-weight: 500; line-height: 1.4;">${dataSaatIni.arti}</div>
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

muatDataCSV();

// --- BAGIAN 2: Logika Pengubah Tema ---

const themeSelect = document.getElementById('theme-select');
const bodyElement = document.body;

// Event listener untuk mendeteksi perubahan pada dropdown select
themeSelect.addEventListener('change', (e) => {
    // Solusi Dinamis: Menimpa seluruh class di <body> dengan value yang dipilih.
    // Ini secara otomatis akan membuang tema lama dan memasang tema baru,
    // berapapun jumlah tema yang Anda tambahkan di masa depan.
    bodyElement.className = e.target.value;
});