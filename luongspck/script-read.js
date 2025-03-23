document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get("chapter") || "6747db09c926626890a4e855"; // ID mặc định

    async function loadChapter(chapterId) {
        try {
            const response = await fetch(`https://sv1.otruyencdn.com/v1/api/chapter/${chapterId}`);
            if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

            const data = await response.json();
            console.log("📌 Dữ liệu chương:", data);

            if (!data || data.status !== "success" || !data.data) throw new Error("Dữ liệu không hợp lệ");

            const chapter = data.data;
            document.getElementById("chapter-title").innerText = `${chapter.comic_name} - Chương ${chapter.chapter_name}`;

            // Hiển thị ảnh chương
            const imageContainer = document.getElementById("image-container");
            imageContainer.innerHTML = "";

            if (chapter.item && chapter.item.chapter_image) {
                const { domain_cdn, chapter_path, chapter_image } = chapter.item;

                chapter_image.forEach(img => {
                    const imgElement = document.createElement("img");
                    imgElement.src = `${domain_cdn}/${chapter_path}/${img.image_file}`;
                    imgElement.className = "chapter-image";
                    imageContainer.appendChild(imgElement);
                });
            } else {
                imageContainer.innerHTML = "<h2>Không có hình ảnh để hiển thị.</h2>";
            }
        } catch (error) {
            console.error("❌ Lỗi khi tải chương:", error);
            document.getElementById("image-container").innerHTML = `<h2 style='color:red'>Không thể tải chương!</h2>`;
        }
    }

    await loadChapter(chapterId);
});
