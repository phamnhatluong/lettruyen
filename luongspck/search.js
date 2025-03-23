document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const resultContainer = document.getElementById("search-results");

    const apiUrl = "https://otruyenapi.com/v1/api/tim-kiem";  

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function fetchResults(keyword) {
        if (!keyword) {
            console.warn("⚠️ Từ khóa tìm kiếm rỗng!");
            return;
        }

        let queryParams = `?keyword=${encodeURIComponent(keyword)}`;
        let fullUrl = apiUrl + queryParams;
        console.log("🔍 Gửi yêu cầu API:", fullUrl);

        fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
                console.log("✅ API TRẢ VỀ:", data);
                if (data.status === "success" && data.data && data.data.items.length > 0) {
                    displayResults(data.data.items);
                } else {
                    resultContainer.innerHTML = "<p class='text-center text-danger'>Không tìm thấy kết quả nào!</p>";
                }
            })
            .catch(error => {
                console.error("🔥 Lỗi khi gọi API:", error);
                resultContainer.innerHTML = "<p class='text-danger'>Lỗi kết nối đến server!</p>";
            });
    }

    function displayResults(items) {
        resultContainer.innerHTML = "";
        items.forEach(comic => {
            console.log("📌 HIỂN THỊ TRUYỆN:", comic);
            const comicItem = document.createElement("div");
            comicItem.classList.add("col-md-4", "mb-4");

            let chapterList = "";
            if (comic.chapters && comic.chapters.length > 0) {
                comic.chapters.slice(0, 3).forEach(chap => {
                    chapterList += `<p><a href="detail.html?slug=${comic.slug}&chapter=${chap.id}" class="chapter-link">Chapter ${chap.chapter_number} • ${chap.updated_at}</a></p>`;
                });
            }

            comicItem.innerHTML = `
                <div class="card shadow-sm">
                    <a href="detail.html?slug=${comic.slug}">
                        <img src="https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}" class="card-img-top comic-thumb" alt="${comic.name}">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${comic.name}</h5>
                        <div class="comic-stats">
                                    <span>👁️ ${Math.floor(Math.random() * 1000)}</span>
                                    <span>❤️ ${Math.floor(Math.random() * 100)}</span>
                                    <span>💬 ${Math.floor(Math.random() * 50)}</span>
                        </div>
                    </div>
                </div>`;
            resultContainer.appendChild(comicItem);
        });
    }

    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?query=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });

    const initialQuery = getQueryParam("query");
    if (initialQuery) {
        searchInput.value = initialQuery;
        fetchResults(initialQuery);
    }
});
