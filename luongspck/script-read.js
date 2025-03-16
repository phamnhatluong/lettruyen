document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("slug");
    let chapterId = urlParams.get("chapter") || 1; // Mặc định chương 1

    if (!slug) {
        console.error("❌ Không tìm thấy slug!");
        return;
    }

    // Gọi API lấy thông tin truyện
    fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success" && data.data.item) {
                document.getElementById("comic-title").innerText = data.data.item.name;
            }
        })
        .catch(error => console.error("❌ Lỗi khi tải truyện:", error));

    // Gọi API lấy chương truyện
    function loadChapter(chapterId) {
        fetch(`https://otruyenapi.com/v1/api/chapter/${chapterId}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById("chapter-title").innerText = `Chương ${data.data.item.chapter_name}`;
                    document.getElementById("chapter-content").innerHTML = data.data.item.image_urls
                        .map(img => `<img src="${img}" alt="Trang truyện">`)
                        .join("");

                    // Chuyển chương
                    document.getElementById("prev-chapter").onclick = function () {
                        if (data.data.item.prev_chapter_id) {
                            window.location.href = `read.html?slug=${slug}&chapter=${data.data.item.prev_chapter_id}`;
                        }
                    };

                    document.getElementById("next-chapter").onclick = function () {
                        if (data.data.item.next_chapter_id) {
                            window.location.href = `read.html?slug=${slug}&chapter=${data.data.item.next_chapter_id}`;
                        }
                    };
                } else {
                    document.getElementById("chapter-content").innerHTML = "<p>Không tìm thấy nội dung chương!</p>";
                }
            })
            .catch(error => console.error("❌ Lỗi khi tải chương:", error));
    }

    loadChapter(chapterId);
});
