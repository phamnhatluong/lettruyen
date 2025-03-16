document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug");

    if (!slug) {
        console.error("❌ Không tìm thấy slug trong URL!");
        document.body.innerHTML = "<h2>Không tìm thấy truyện!</h2>";
        return;
    }

    const apiUrl = `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`;
    console.log("🔗 Đang gọi API:", apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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
                chapterList.innerHTML = "";

                if (comic.chapters && comic.chapters.length > 0) {
                    comic.chapters.forEach(chapter => {
                        const li = document.createElement("li");
                        li.innerHTML = `<a href="read.html?slug=${slug}&chapter=${chapter.chapter_id}">Chương ${chapter.chapter_name}</a>`;
                        chapterList.appendChild(li);
                    });

                    // Cập nhật nút "Đọc Truyện" với chương đầu tiên
                    const readButton = document.getElementById("read-comic-btn");
                    if (readButton) {
                        readButton.href = `read.html?slug=${slug}&chapter=${comic.chapters[0].chapter_id}`;
                    } else {
                        console.error("❌ Không tìm thấy nút Đọc Truyện!");
                    }
                } else {
                    chapterList.innerHTML = "<p>Chưa có chương nào.</p>";
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
