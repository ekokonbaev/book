// Инициализация AOS
AOS.init({
    duration: 800,
    once: true
});

// Данные о книгах
const books = [
    {
        title: 'Самурай без меча',
        author: 'Китами Масао',
        image: 'img/Самурай.jpg',
        pdf: 'pdf/samuray_bez_mecha-pdf.pdf',
        audio: 'audio/00_01.mp3'
    },
    {
        title: 'Алишер Навои',
        author: 'Алишер Навои',
        image: 'img/Алишер.jpg',
        pdf: '#'
    },
    {
        title: 'Чынгыз Айтматов',
        author: 'Чынгыза Айтматов',
        image: 'img/Чынгыз.jpg',
        pdf: '#'
    },
    {
        title: 'Лев Толстой',
        author: 'Лев Толстой',
        image: 'img/лев толстой.jpg',
        pdf: '#'
    }
];

// Класс управления аудиоплеером
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrackIndex = 0;

        this.playerElement = document.getElementById('globalAudioPlayer');
        this.playPauseBtn = document.getElementById('playPause');
        this.prevBtn = document.getElementById('prevTrack');
        this.nextBtn = document.getElementById('nextTrack');
        this.progressBar = this.playerElement?.querySelector('.progress');
        this.progressBarContainer = this.playerElement?.querySelector('.progress-bar');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.durationSpan = document.getElementById('duration');
        this.trackTitle = document.getElementById('trackTitle');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.playPauseBtn?.addEventListener('click', () => this.togglePlay());
        this.prevBtn?.addEventListener('click', () => this.playPrevious());
        this.nextBtn?.addEventListener('click', () => this.playNext());

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationSpan.textContent = this.formatTime(this.audio.duration);
            this.trackTitle.textContent = this.getTrackName(this.playlist[this.currentTrackIndex]);
        });

        this.progressBarContainer?.addEventListener('click', (e) => {
            const rect = this.progressBarContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = pos * this.audio.duration;
        });
    }

    showPlayer() {
        this.playerElement?.classList.add('visible');
    }

    hidePlayer() {
        this.playerElement?.classList.remove('visible');
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            this.audio.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    playTrack(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentTrackIndex = index;
            this.audio.src = this.playlist[index];
            this.audio.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    playNext() {
        // Перезапуск текущего трека (один трек в плейлисте)
        this.audio.currentTime = 0;
        this.audio.play();
    }

    playPrevious() {
        // Аналогично playNext()
        this.audio.currentTime = 0;
        this.audio.play();
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeSpan.textContent = this.formatTime(this.audio.currentTime);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    getTrackName(url) {
        return url?.split('/').pop().replace(/\.[^/.]+$/, '') || '';
    }

    loadPlaylist(tracks) {
        this.playlist = tracks;
        if (tracks.length > 0) {
            this.playTrack(0);
            this.showPlayer();
        } else {
            this.hidePlayer();
        }
    }
}

// Инициализация плеера
const player = new AudioPlayer();

// Загрузка карточек книг
function loadBooks() {
    const booksContainer = document.getElementById('booksContainer');
    if (!booksContainer) return;

    booksContainer.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-aos', 'fade-up');

        const audioButton = book.audio ? `
            <a href="#" class="listen-btn" data-audio-path="${book.audio}">
                <i class="fas fa-headphones"></i> Слушать
            </a>
        ` : '';

        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">Автор: ${book.author}</p>
                <div class="book-actions">
                    <a href="${book.pdf}" target="_blank" class="read-btn">
                        <i class="fas fa-book-open"></i> Читать
                    </a>
                    ${audioButton}
                    <a href="${book.pdf}" download class="download-btn">
                        <i class="fas fa-download"></i> Скачать
                    </a>
                </div>
            </div>
        `;

        booksContainer.appendChild(bookCard);
    });

    // Назначение событий на кнопки "Слушать"
    document.querySelectorAll('.listen-btn').forEach(button => {
        button.addEventListener('click', handleAudioButtonClick);
    });
}

// Обработка кнопки "Слушать"
function handleAudioButtonClick(event) {
    event.preventDefault();
    const audioPath = event.currentTarget.getAttribute('data-audio-path');
    if (audioPath) {
        player.loadPlaylist([audioPath]);
    }
}

// Загрузка при старте страницы
document.addEventListener('DOMContentLoaded', loadBooks);
