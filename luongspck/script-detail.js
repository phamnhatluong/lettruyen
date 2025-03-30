document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug");

    if (!slug) {
        console.error("❌ Không tìm thấy slug!");
        return;
    }

    const apiUrl = `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`;
    console.log("🔗 Đang gọi API:", apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("📌 API trả về:", data);

            if (data.status === "success" && data.data.item) {
                const comic = data.data.item;
                const imageDomain = data.data.APP_DOMAIN_CDN_IMAGE || "https://img.otruyenapi.com";

                document.getElementById("comic-image").src = `${imageDomain}/uploads/comics/${comic.thumb_url || "default.jpg"}`;
                document.getElementById("comic-title").innerText = comic.name || "Không có tiêu đề";
                document.getElementById("comic-description").innerText = comic.content || "Không có mô tả";
                document.getElementById("comic-category").innerText = comic.category.map(cat => cat.name).join(", ") || "Không có thể loại";
                document.getElementById("comic-status").innerText = comic.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành";
                document.getElementById("comic-updated").innerText = new Date(comic.updatedAt).toLocaleString();

                const chapterList = document.getElementById("chapter-list");
                chapterList.innerHTML = "";
                
                let currentPage = 1;
                const chaptersPerPage = 10;
                let allChapters = [];

                if (comic.chapters && comic.chapters.length > 0) {
                    comic.chapters.forEach(server => {
                        server.server_data.forEach(chapter => {
                            allChapters.push({
                                name: chapter.chapter_name,
                                link: `read.html?slug=${slug}&chapter=${chapter.chapter_api_data.split('/').pop()}`
                            });
                        });
                    });
                    
                    function renderChapters(page) {
                        chapterList.innerHTML = "";
                        const start = (page - 1) * chaptersPerPage;
                        const end = start + chaptersPerPage;
                        const paginatedChapters = allChapters.slice(start, end);

                        paginatedChapters.forEach(chapter => {
                            const li = document.createElement("li");
                            li.innerHTML = `<a href="${chapter.link}">Chương ${chapter.name}</a>`;
                            chapterList.appendChild(li);
                        });

                        document.getElementById("page-number").innerText = `Trang ${currentPage} / ${Math.ceil(allChapters.length / chaptersPerPage)}`;
                    }

                    document.getElementById("prev-page").addEventListener("click", function () {
                        if (currentPage > 1) {
                            currentPage--;
                            renderChapters(currentPage);
                        }
                    });

                    document.getElementById("next-page").addEventListener("click", function () {
                        if (currentPage < Math.ceil(allChapters.length / chaptersPerPage)) {
                            currentPage++;
                            renderChapters(currentPage);
                        }
                    });

                    renderChapters(currentPage);

                    const readButton = document.getElementById("read-comic-btn");
                    if (readButton && allChapters.length > 0) {
                        readButton.href = allChapters[0].link;
                    } else {
                        console.error("❌ Không tìm thấy chương đầu tiên!");
                    }
                } else {
                    chapterList.innerHTML = "<p style='color:red'>Không có chương nào!</p>";
                }
            } else {
                console.error("⚠ API không có dữ liệu `item`.");
                document.body.innerHTML = `<h2 style='color:red'>❌ Không tìm thấy truyện. Dữ liệu API có thể bị lỗi.</h2>`;
            }
        })
        .catch(error => {
            console.error("❗ Lỗi khi tải chi tiết truyện:", error);
            document.body.innerHTML = `<h2 style='color:red'>❌ Lỗi khi tải truyện. Vui lòng thử lại sau.</h2>`;
        });
});