// --- BAGIAN 1: Logika Flashcard & CSV (Sama seperti sebelumnya) ---
let kaiwaData = [];
let currentIndex = 0;

const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const btnFlip = document.getElementById('btn-flip');
const btnNext = document.getElementById('btn-next');

async function muatDataCSV() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const dataTeks = await response.text();
        
        const baris = dataTeks.split('\n');
        
        kaiwaData = []; // Reset data
        for (let i = 1; i < baris.length; i++) {
            if (baris[i].trim() === '') continue; 
            const kolom = baris[i].split(',');
            // Validasi sederhana: pastikan ada cukup kolom
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
             cardFront.innerHTML = "Data CSV kosong.";
        }
        
    } catch (error) {
        console.error("Gagal memuat CSV:", error);
        cardFront.innerHTML = "Gagal memuat data. Pastikan dijalankan di local server/GitHub Pages.";
    }
}

function loadCard() {
    if (kaiwaData.length === 0) return;

    const dataSaatIni = kaiwaData[currentIndex];
    
    cardFront.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 28px; margin-bottom: 5px; font-weight: bold;">${dataSaatIni.kanji}</div>
            <div style="font-size: 18px; color: #555; margin-bottom: 5px;">${dataSaatIni.hiragana}</div>
            <div style="font-size: 16px; color: #888;">${dataSaatIni.romaji}</div>
        </div>
    `;
    
    cardBack.innerHTML = `
        <div style="text-align: center; font-weight: 500;">
            <div style="font-size: 22px;">${dataSaatIni.arti}</div>
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

// Panggil fungsi muat data saat pertama kali dijalankan
muatDataCSV();


// --- BAGIAN 2: Logika Pengubah Tema (BARU) ---

const themeSelect = document.getElementById('theme-select');
const bodyElement = document.body;

// Event listener untuk mendeteksi perubahan pada dropdown select
themeSelect.addEventListener('change', (e) => {
    // 1. Ambil nilai tema yang dipilih (misal: 'theme-demonslayer')
    const selectedTheme = e.target.value;

    // 2. Hapus semua kemungkinan kelas tema yang ada sebelumnya agar tidak bertumpuk
    bodyElement.classList.remove('theme-fireworks', 'theme-demonslayer', 'theme-mountain');

    // 3. Tambahkan kelas tema yang baru dipilih ke tag <body>
    bodyElement.classList.add(selectedTheme);
});