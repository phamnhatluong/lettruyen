document.addEventListener("DOMContentLoaded", function () {
    const comicList = document.getElementById("comic-list");
    const pageNumber = document.getElementById("page-number");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");

    let currentPage = 1;
    let currentGenre = getParameterByName("genre") || "adventure"; // Mặc định adventure

    function fetchComicsByGenre(genre, page = 1) {
        const apiUrl = `https://otruyenapi.com/v1/api/the-loai/${genre}?page=${page}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success" && data.data.items) {
                    displayComics(data.data.items, data.data.APP_DOMAIN_CDN_IMAGE);
                    pageNumber.textContent = `Trang ${page}`;
                    prevPageBtn.disabled = (page === 1);
                } else {
                    comicList.innerHTML = `<p class="text-center text-danger">🚫 Không có dữ liệu!</p>`;
                }
            })
            .catch(error => console.error("🔥 Lỗi tải truyện:", error));
    }

    function displayComics(items, imageDomain) {
        comicList.innerHTML = "";
        items.forEach(comic => {
            const comicItem = document.createElement("div");
            comicItem.classList.add("col-md-3", "mb-3");
            comicItem.innerHTML = `
                <div class="comic-card">
                    <a href="detail.html?slug=${comic.slug}">
                        <img src="${imageDomain}/uploads/comics/${comic.thumb_url}" 
                             alt="${comic.name}" 
                             onerror="this.src='default.jpg'">
                        <h2 class="comic-title">${comic.name}</h2>
                        <div class="comic">
                            <span>👁️ ${Math.floor(Math.random() * 1000)}</span>
                            <span>❤️ ${Math.floor(Math.random() * 100)}</span>
                            <span>💬 ${Math.floor(Math.random() * 50)}</span>
                        </div>
                    </a>
                </div>`;
            comicList.appendChild(comicItem);
        });
    }

    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            fetchComicsByGenre(currentGenre, currentPage);
        }
    });

    nextPageBtn.addEventListener("click", function () {
        currentPage++;
        fetchComicsByGenre(currentGenre, currentPage);
    });

    fetchComicsByGenre(currentGenre, currentPage);
});
