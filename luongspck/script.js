let currentPage = 1;
        const comicsPerPage = 16;

        function fetchComics(page) {
            fetch(`https://otruyenapi.com/v1/api/home?page=${page}`)
                .then(response => response.json())
                .then(data => {
                    const comicList = document.getElementById('comic-list');
                    comicList.innerHTML = '';
                    comicList.classList.add('comic-list');
                    
                    if (data.status === 'success') {
                        let comics = data.data.items;
                        let start = (page - 1) * comicsPerPage;
                        let end = start + comicsPerPage;
                        let paginatedComics = comics.slice(start, end);
                        
                        paginatedComics.forEach(comic => {
                            const comicItem = document.createElement('div');
                            comicItem.classList.add('comic-item');
                            let time = Math.floor(Math.random() * 23) + 2;
                            comicItem.innerHTML = `
                            <a href="detail.html?slug=${comic.slug}" class="comic-card">
                                <img src="${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/comics/${comic.thumb_url}" alt="${comic.name}">
                                <div class="comic-info">
                                    <h2 class="comic-title">${comic.name}</h2>
                                    <p class="comic-meta">Chapter ${comic.chaptersLatest[0].chapter_name} • <span>${time} giờ trước</span></p>
                                    <p class="comic-meta">Chapter ${comic.chaptersLatest[0].chapter_name-1} • <span>${(time - 1)} giờ trước</span></p>
                                    <p class="comic-meta">Chapter ${comic.chaptersLatest[0].chapter_name-2} • <span>${(time - 2)} giờ trước</span></p>
                                </div>
                                <div class="comic-status">
                                    <span>👁️ ${Math.floor(Math.random() * 1000)}</span>
                                    <span>❤️ ${Math.floor(Math.random() * 100)}</span>
                                    <span>💬 ${Math.floor(Math.random() * 50)}</span>
                                </div>
                            </a>`;

                            comicList.appendChild(comicItem);
                        });
                    }

                    document.getElementById('page-number').innerText = `Trang ${currentPage}`;
                })
                .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
        }

        // Xử lý chuyển trang
        document.getElementById('prev-page').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                fetchComics(currentPage);
            }
        });

        document.getElementById('next-page').addEventListener('click', function() {
            currentPage++;
            fetchComics(currentPage);
        });

        // Gọi lần đầu
        fetchComics(currentPage);
        const searchForm = document.querySelector('.search');
if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.querySelector('.search input').value.trim();
        if (query) {
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });
}