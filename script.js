const ADMIN_CODE = "0706666670";
const USER_CODE = "55555";
let isAdmin = false;
let isAuthenticated = false;
let currentLanguage = 'az';
let videos = JSON.parse(localStorage.getItem('azVideos')) || [];
let pdfFiles = JSON.parse(localStorage.getItem('azPdfFiles')) || [];
let filteredVideos = [];

const translations = {
    az: {
        mainTitle: 'Azərbaycanca Öyrən',
        adminTitle: 'Admin Panel',
        videoManageTitle: 'Video İdarə Et',
        pdfManageTitle: 'PDF İdarə Et',
        adminCode: 'Kod daxil edin',
        addVideo: 'Video Əlavə Et',
        deleteVideo: 'Video Sil',
        videoTitle: 'Video başlığı',
        uploadPdf: 'PDF Yükləyin',
        deletePdf: 'PDF Sil',
        videosTitle: 'Videolar',
        pdfTitle: 'PDF Materialları',
        noVideos: 'Video yoxdur',
        noPdf: 'PDF yoxdur',
        pleaseLogin: 'Zəhmə olmasa giriş edin!',
        footerText: '© 2026 Azərbaycanca Öyrən. Bütün hüquqlar qorunur.',
        invalidCode: 'Kod yanlışdır!',
        invalidUrl: 'YouTube linki yanlışdır!',
        confirmDelete: 'Silmək istəyirsiniz?',
        confirmDeletePdf: 'PDF silmək istəyirsiniz?',
        selectPdf: 'Zəhmə olmasa PDF seçin!',
        pdfName: 'PDF adı',
        searchPlaceholder: 'Videoları axtar...',
        loading: 'Yüklənir...',
        success: 'Uğurlu!'
    },
    ru: {
        mainTitle: 'Научитесь азербайджанскому',
        adminTitle: 'Панель администратора',
        videoManageTitle: 'Управление видео',
        pdfManageTitle: 'Управление PDF',
        adminCode: 'Введите код',
        addVideo: 'Добавить видео',
        deleteVideo: 'Удалить видео',
        videoTitle: 'Название видео',
        uploadPdf: 'Загрузить PDF',
        deletePdf: 'Удалить PDF',
        videosTitle: 'Видео',
        pdfTitle: 'PDF материалы',
        noVideos: 'Нет видео',
        noPdf: 'PDF нет',
        pleaseLogin: 'Пожалуйста, войдите!',
        footerText: '© 2026 Научитесь азербайджанскому. Все права защищены.',
        invalidCode: 'Неверный код!',
        invalidUrl: 'Неверная YouTube ссылка!',
        confirmDelete: 'Удалить?',
        confirmDeletePdf: 'Удалить PDF?',
        selectPdf: 'Выберите PDF файл!',
        pdfName: 'Название PDF',
        searchPlaceholder: 'Искать видео...',
        loading: 'Загрузка...',
        success: 'Успешно!'
    },
    en: {
        mainTitle: 'Learn Azerbaijani',
        adminTitle: 'Admin Panel',
        videoManageTitle: 'Manage Videos',
        pdfManageTitle: 'Manage PDF',
        adminCode: 'Enter code',
        addVideo: 'Add Video',
        deleteVideo: 'Delete Video',
        videoTitle: 'Video title',
        uploadPdf: 'Upload PDF',
        deletePdf: 'Delete PDF',
        videosTitle: 'Videos',
        pdfTitle: 'PDF Materials',
        noVideos: 'No videos',
        noPdf: 'No PDF',
        pleaseLogin: 'Please login!',
        footerText: '© 2026 Learn Azerbaijani. All rights reserved.',
        invalidCode: 'Wrong code!',
        invalidUrl: 'Invalid YouTube link!',
        confirmDelete: 'Delete?',
        confirmDeletePdf: 'Delete PDF?',
        selectPdf: 'Please select a PDF file!',
        pdfName: 'PDF name',
        searchPlaceholder: 'Search videos...',
        loading: 'Loading...',
        success: 'Success!'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    updateUI();
}

function authenticate() {
    const code = document.getElementById('adminCode').value.trim();
    
    console.log('Введённый код:', code);
    console.log('Админ код:', ADMIN_CODE);
    console.log('Пользовательский код:', USER_CODE);
    
    if (code === ADMIN_CODE) {
        isAdmin = true;
        isAuthenticated = true;
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminCode').value = '';
        showAdminPanel();
        console.log('✅ Админ режим активирован!');
    } else if (code === USER_CODE) {
        isAdmin = false;
        isAuthenticated = true;
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('adminCode').value = '';
        showUserPanel();
        console.log('✅ Пользовательский режим активирован!');
    } else {
        alert(translations[currentLanguage].invalidCode);
        document.getElementById('adminCode').value = '';
        isAuthenticated = false;
        console.log('❌ Неверный код!');
    }
}

function addVideo() {
    if (!isAdmin) {
        alert(translations[currentLanguage].pleaseLogin);
        return;
    }

    const url = document.getElementById('videoUrl').value.trim();
    const title = document.getElementById('videoTitle').value.trim();
    
    console.log('URL:', url);
    console.log('Название:', title);
    
    if (!url) {
        alert('Пожалуйста, введите YouTube URL!');
        return;
    }
    
    if (!title) {
        alert('Пожалуйста, введите название видео!');
        return;
    }
    
    const embedUrl = getYouTubeEmbedUrl(url);
    console.log('Embed URL:', embedUrl);
    
    if (embedUrl) {
        videos.push({ url: embedUrl, title, id: Date.now() });
        localStorage.setItem('azVideos', JSON.stringify(videos));
        console.log('✅ Видео добавлено! Всего видео:', videos.length);
        alert('✅ Видео успешно добавлено!');
        showAdminPanel();
        document.getElementById('videoUrl').value = '';
        document.getElementById('videoTitle').value = '';
        document.getElementById('searchInput').value = '';
    } else {
        alert(translations[currentLanguage].invalidUrl);
    }
}

function deleteVideo(id) {
    if (!isAdmin) {
        alert(translations[currentLanguage].pleaseLogin);
        return;
    }

    if (confirm(translations[currentLanguage].confirmDelete)) {
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('azVideos', JSON.stringify(videos));
        showAdminPanel();
        console.log('✅ Видео удалено!');
    }
}

function uploadPdf() {
    if (!isAdmin) {
        alert(translations[currentLanguage].pleaseLogin);
        return;
    }

    const input = document.getElementById('pdfInput');
    const pdfName = document.getElementById('pdfName').value.trim();
    const file = input.files[0];
    
    if (!file) {
        alert(translations[currentLanguage].selectPdf);
        return;
    }
    
    if (!pdfName) {
        alert('Пожалуйста, введите название PDF!');
        return;
    }
    
    if (file.type !== 'application/pdf') {
        alert('Это не PDF файл! Выберите PDF файл.');
        return;
    }

    console.log('Начинается загрузка PDF:', file.name, 'Размер:', Math.round(file.size / 1024 / 1024 * 100) / 100, 'МБ');
    
    const uploadBtn = document.getElementById('uploadPdfBtn');
    const originalText = uploadBtn.textContent;
    uploadBtn.textContent = translations[currentLanguage].loading;
    uploadBtn.disabled = true;
    
    const reader = new FileReader();
    
    reader.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            uploadBtn.textContent = `${translations[currentLanguage].loading} ${percentComplete}%`;
        }
    };
    
    reader.onload = function(e) {
        try {
            const pdfData = e.target.result;
            
            if (pdfData.length > 5242880) {
                saveToIndexedDB(pdfName, pdfData, file.name);
            } else {
                pdfFiles.push({
                    id: Date.now(),
                    name: pdfName,
                    data: pdfData,
                    originalFileName: file.name,
                    size: file.size,
                    uploadDate: new Date().toLocaleString(),
                    source: 'localStorage'
                });
                localStorage.setItem('azPdfFiles', JSON.stringify(pdfFiles));
                console.log('✅ PDF сохранён в localStorage!');
                alert('✅ PDF успешно загружен!');
                showAdminPanel();
            }
            
            input.value = '';
            document.getElementById('pdfName').value = '';
            uploadBtn.textContent = originalText;
            uploadBtn.disabled = false;
        } catch (error) {
            console.error('Ошибка при сохранении PDF:', error);
            alert('Ошибка при сохранении PDF! Попробуйте позже.');
            uploadBtn.textContent = originalText;
            uploadBtn.disabled = false;
        }
    };
    
    reader.onerror = function() {
        alert('Ошибка при чтении файла!');
        console.error('Ошибка FileReader');
        uploadBtn.textContent = originalText;
        uploadBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

function saveToIndexedDB(name, data, originalFileName) {
    const dbRequest = indexedDB.open('AzerbaijaniDB', 1);
    
    dbRequest.onerror = function() {
        console.error('Ошибка при открытии IndexedDB');
        alert('Ошибка при сохранении! Файл может быть слишком большой.');
    };
    
    dbRequest.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['pdfs'], 'readwrite');
        const store = transaction.objectStore('pdfs');
        
        const pdfObject = {
            id: Date.now(),
            name: name,
            data: data,
            originalFileName: originalFileName,
            uploadDate: new Date().toLocaleString()
        };
        
        store.add(pdfObject);
        
        transaction.oncomplete = function() {
            console.log('✅ PDF сохранён в IndexedDB!');
            pdfFiles.push({ id: pdfObject.id, name: name, source: 'indexeddb' });
            localStorage.setItem('azPdfFiles', JSON.stringify(pdfFiles));
            alert('✅ PDF успешно загружен!');
            showAdminPanel();
        };
    };
    
    dbRequest.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pdfs')) {
            db.createObjectStore('pdfs', { keyPath: 'id' });
        }
    };
}

function deletePdf(id) {
    if (!isAdmin) {
        alert(translations[currentLanguage].pleaseLogin);
        return;
    }

    if (confirm(translations[currentLanguage].confirmDeletePdf)) {
        pdfFiles = pdfFiles.filter(p => p.id !== id);
        localStorage.setItem('azPdfFiles', JSON.stringify(pdfFiles));
        
        const dbRequest = indexedDB.open('AzerbaijaniDB', 1);
        dbRequest.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['pdfs'], 'readwrite');
            const store = transaction.objectStore('pdfs');
            store.delete(id);
        };
        
        showAdminPanel();
        console.log('✅ PDF удалён!');
    }
}

function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    
    url = url.trim();
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=([^&\s]+))/,
        /(?:youtu\.be\/([^&\s]+))/,
        /(?:youtube\.com\/embed\/([^&\s]+))/,
        /(?:youtube\.com\/v\/([^&\s]+))/,
        /(?:^|\/)([a-zA-Z0-9_-]{11})(?:$|\s)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            const videoId = match[1];
            console.log('✅ Найден YouTube ID:', videoId);
            return `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
    }
    
    console.log('❌ YouTube ID не найден в URL:', url);
    return null;
}

function getPdfData(id, source) {
    return new Promise((resolve) => {
        if (source === 'localStorage') {
            const found = pdfFiles.find(p => p.id === id);
            resolve(found ? found.data : null);
        } else if (source === 'indexeddb') {
            const dbRequest = indexedDB.open('AzerbaijaniDB', 1);
            dbRequest.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['pdfs'], 'readonly');
                const store = transaction.objectStore('pdfs');
                const request = store.get(id);
                
                request.onsuccess = function() {
                    resolve(request.result ? request.result.data : null);
                };
            };
        }
    });
}

function viewPdf(id, source) {
    getPdfData(id, source).then(data => {
        if (data) {
            const pdfWindow = window.open('');
            pdfWindow.document.write(`
                <html>
                <head>
                    <title>PDF</title>
                </head>
                <body style="margin: 0;">
                    <embed src="${data}" type="application/pdf" width="100%" height="100%" style="height: 100vh;">
                </body>
                </html>
            `);
        } else {
            alert('Ошибка при загрузке PDF!');
        }
    });
}

function filterVideos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        if (isAdmin) {
            showAdminPanel();
        } else {
            showUserPanel();
        }
        return;
    }
    
    filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm)
    );
    
    console.log(`Найдено видео: ${filteredVideos.length} из ${videos.length}`);
    
    const videoContainer = document.getElementById('videosContainer');
    
    if (filteredVideos.length > 0) {
        if (isAdmin) {
            videoContainer.innerHTML = filteredVideos.map(video => `
                <div class="video-card">
                    <iframe src="${video.url}" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="video-title">${escapeHtml(video.title)}</div>
                        <div class="video-actions">
                            <button onclick="deleteVideo(${video.id})" class="btn btn-danger">${translations[currentLanguage].deleteVideo}</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            videoContainer.innerHTML = filteredVideos.map(video => `
                <div class="video-card">
                    <iframe src="${video.url}" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="video-title">${escapeHtml(video.title)}</div>
                    </div>
                </div>
            `).join('');
        }
    } else {
        videoContainer.innerHTML = `<p class="no-content">${translations[currentLanguage].noVideos}</p>`;
    }
}

function showAdminPanel() {
    if (!isAdmin) {
        showUserPanel();
        return;
    }

    const videoContainer = document.getElementById('videosContainer');
    
    if (videos && videos.length > 0) {
        videoContainer.innerHTML = videos.map(video => `
            <div class="video-card">
                <iframe src="${video.url}" allowfullscreen></iframe>
                <div class="video-info">
                    <div class="video-title">${escapeHtml(video.title)}</div>
                    <div class="video-actions">
                        <button onclick="deleteVideo(${video.id})" class="btn btn-danger">${translations[currentLanguage].deleteVideo}</button>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        videoContainer.innerHTML = `<p class="no-content">${translations[currentLanguage].noVideos}</p>`;
    }

    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfFiles && pdfFiles.length > 0) {
        const pdfList = pdfFiles.map(pdf => `
            <div class="pdf-item">
                <div class="pdf-header">
                    <h4>${escapeHtml(pdf.name)}</h4>
                    <span class="pdf-date">${pdf.uploadDate || 'N/A'}</span>
                </div>
                <div class="pdf-actions">
                    <button onclick="viewPdf(${pdf.id}, '${pdf.source || 'localStorage'}')" class="btn btn-primary">Bax</button>
                    <button onclick="deletePdf(${pdf.id})" class="btn btn-danger">${translations[currentLanguage].deletePdf}</button>
                </div>
            </div>
        `).join('');
        pdfViewer.innerHTML = pdfList;
    } else {
        pdfViewer.innerHTML = `<p class="no-content">${translations[currentLanguage].noPdf}</p>`;
    }
}

function showUserPanel() {
    if (!isAuthenticated) {
        const videoContainer = document.getElementById('videosContainer');
        const pdfViewer = document.getElementById('pdfViewer');
        videoContainer.innerHTML = `<p class="no-content" style="color: white; font-size: 1.2em; text-align: center; padding: 50px 20px;">${translations[currentLanguage].pleaseLogin}</p>`;
        pdfViewer.innerHTML = `<p class="no-content">${translations[currentLanguage].pleaseLogin}</p>`;
        return;
    }

    const videoContainer = document.getElementById('videosContainer');
    
    if (videos && videos.length > 0) {
        videoContainer.innerHTML = videos.map(video => `
            <div class="video-card">
                <iframe src="${video.url}" allowfullscreen></iframe>
                <div class="video-info">
                    <div class="video-title">${escapeHtml(video.title)}</div>
                </div>
            </div>
        `).join('');
    } else {
        videoContainer.innerHTML = `<p class="no-content">${translations[currentLanguage].noVideos}</p>`;
    }

    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfFiles && pdfFiles.length > 0) {
        const pdfList = pdfFiles.map(pdf => `
            <div class="pdf-item">
                <div class="pdf-header">
                    <h4>${escapeHtml(pdf.name)}</h4>
                </div>
                <div class="pdf-actions">
                    <button onclick="viewPdf(${pdf.id}, '${pdf.source || 'localStorage'}')" class="btn btn-primary">Bax</button>
                </div>
            </div>
        `).join('');
        pdfViewer.innerHTML = pdfList;
    } else {
        pdfViewer.innerHTML = `<p class="no-content">${translations[currentLanguage].noPdf}</p>`;
    }
}

function updateUI() {
    const titleEl = document.getElementById('mainTitle');
    const adminTitleEl = document.getElementById('adminTitle');
    const videoManageTitleEl = document.getElementById('videoManageTitle');
    const pdfManageTitleEl = document.getElementById('pdfManageTitle');
    const adminCodeEl = document.getElementById('adminCode');
    const videoTitleEl = document.getElementById('videoTitle');
    const pdfNameEl = document.getElementById('pdfName');
    const searchInputEl = document.getElementById('searchInput');
    const addVideoBtnEl = document.getElementById('addVideoBtn');
    const uploadPdfBtnEl = document.getElementById('uploadPdfBtn');
    const videosTitleEl = document.getElementById('videosTitle');
    const pdfTitleEl = document.getElementById('pdfTitle');
    const footerTextEl = document.getElementById('footerText');
    
    if (titleEl) titleEl.textContent = translations[currentLanguage].mainTitle;
    if (adminTitleEl) adminTitleEl.textContent = translations[currentLanguage].adminTitle;
    if (videoManageTitleEl) videoManageTitleEl.textContent = translations[currentLanguage].videoManageTitle;
    if (pdfManageTitleEl) pdfManageTitleEl.textContent = translations[currentLanguage].pdfManageTitle;
    if (adminCodeEl) adminCodeEl.placeholder = translations[currentLanguage].adminCode;
    if (videoTitleEl) videoTitleEl.placeholder = translations[currentLanguage].videoTitle;
    if (pdfNameEl) pdfNameEl.placeholder = translations[currentLanguage].pdfName;
    if (searchInputEl) searchInputEl.placeholder = translations[currentLanguage].searchPlaceholder;
    if (addVideoBtnEl) addVideoBtnEl.textContent = translations[currentLanguage].addVideo;
    if (uploadPdfBtnEl) uploadPdfBtnEl.textContent = translations[currentLanguage].uploadPdf;
    if (videosTitleEl) videosTitleEl.textContent = translations[currentLanguage].videosTitle;
    if (pdfTitleEl) pdfTitleEl.textContent = translations[currentLanguage].pdfTitle;
    if (footerTextEl) footerTextEl.textContent = translations[currentLanguage].footerText;
}

function updateTimer() {
    const now = new Date();
    const locales = { az: 'az-AZ', ru: 'ru-RU', en: 'en-US' };
    const time = now.toLocaleString(locales[currentLanguage], { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = time;
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'};
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('Загрузка приложения...');
    console.log('Загруженные видео:', videos);
    console.log('Загруженные PDF:', pdfFiles);
    updateUI();
    showUserPanel();
    setInterval(updateTimer, 1000);
    updateTimer();
    console.log('✅ Приложение готово!');
});