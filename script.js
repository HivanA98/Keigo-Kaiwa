// Variabel array kosong yang nantinya akan diisi oleh data dari CSV
let kaiwaData = [];
let currentIndex = 0;

const card = document.getElementById('card');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const btnFlip = document.getElementById('btn-flip');
const btnNext = document.getElementById('btn-next');

// Fungsi asinkron untuk mengambil dan mem-parsing CSV
async function muatDataCSV() {
    try {
        // Melakukan HTTP GET Request ke file CSV di server (atau GitHub Pages)
        const response = await fetch('data.csv');
        const dataTeks = await response.text();
        
        // Algoritma Parsing Dasar: Memecah teks berdasarkan baris baru (Enter)
        const baris = dataTeks.split('\n');
        
        // Loop dimulai dari indeks 1 untuk melewati baris pertama (header CSV)
        for (let i = 1; i < baris.length; i++) {
            // Membersihkan spasi/karakter kosong dan mengabaikan baris jika kosong
            if (baris[i].trim() === '') continue; 
            
            // Memecah setiap baris berdasarkan tanda koma
            const kolom = baris[i].split(',');
            
            // Mengkonstruksi objek data dan memasukkannya ke dalam array
            kaiwaData.push({
                kanji: kolom[0],
                hiragana: kolom[1],
                romaji: kolom[2],
                arti: kolom[3]
            });
        }
        
        // Setelah proses parsing komputasi selesai, muat kartu pertama
        loadCard();
        
    } catch (error) {
        console.error("Gagal memuat atau memproses CSV:", error);
        cardFront.innerHTML = "Gagal memuat data dari server.";
    }
}

function loadCard() {
    if (kaiwaData.length === 0) return; // Keamanan agar tidak error jika data kosong

    const dataSaatIni = kaiwaData[currentIndex];
    
    cardFront.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 28px; margin-bottom: 5px;">${dataSaatIni.kanji}</div>
            <div style="font-size: 18px; color: #555; margin-bottom: 5px;">${dataSaatIni.hiragana}</div>
            <div style="font-size: 16px; color: #888;">${dataSaatIni.romaji}</div>
        </div>
    `;
    
    cardBack.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 22px;">${dataSaatIni.arti}</div>
        </div>
    `;
    
    card.classList.remove('is-flipped'); 
}

// Logika pembalik kartu
function flipCard() {
    card.classList.toggle('is-flipped');
}

// Event Listeners
card.addEventListener('click', flipCard);
btnFlip.addEventListener('click', flipCard);

btnNext.addEventListener('click', () => {
    if (kaiwaData.length > 0) {
        currentIndex = (currentIndex + 1) % kaiwaData.length;
        loadCard();
    }
});

// Panggil fungsi untuk memuat data CSV tepat saat skrip dijalankan
muatDataCSV();