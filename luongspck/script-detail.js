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

                // Xử lý danh sách chương
                const chapterList = document.getElementById("chapter-list");
                chapterList.innerHTML = ""; // Xóa danh sách cũ nếu có

                if (comic.chapters && comic.chapters.length > 0) {
                    comic.chapters.forEach(server => {
                        server.server_data.forEach(chapter => {
                            const li = document.createElement("li");
                            li.innerHTML = `<a href="read.html?slug=${slug}&chapter=${chapter.chapter_api_data.split('/').pop()}">Chương ${chapter.chapter_name}</a>`;
                            chapterList.appendChild(li);
                        });
                    });

                    // Cập nhật nút "Đọc Truyện" với chương đầu tiên
                    const readButton = document.getElementById("read-comic-btn");
                    if (readButton && comic.chapters[0].server_data.length > 0) {
                        readButton.href = `read.html?slug=${slug}&chapter=${comic.chapters[0].server_data[0].chapter_api_data.split('/').pop()}`;
                    } else {
                        console.error("❌ Không tìm thấy chương đầu tiên!");
                    }
                } else {
                    chapterList.innerHTML = "<p>Xin lỗi! Dữ liệu đang được cập nhật</p>";
                }
            } else {
                console.error("⚠ API không có dữ liệu `item`.");
                document.body.innerHTML = `<h2>❌ Không tìm thấy truyện. Dữ liệu API có thể bị lỗi.</h2>`;
            }
        })
        .catch(error => {
            console.error("❗ Lỗi khi tải chi tiết truyện:", error);
            document.body.innerHTML = `<h2>❌ Lỗi khi tải truyện. Vui lòng thử lại sau.</h2>`;
        });
});
document.addEventListener("DOMContentLoaded", function () {
    const chapterLinks = document.querySelectorAll(".chapter-link");

    chapterLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const chapterId = this.getAttribute("data-chapter-id");
            const slug = this.getAttribute("data-slug");
            window.location.href = `read.html?slug=${slug}&chapter=${chapterId}`;
        });
    });
});