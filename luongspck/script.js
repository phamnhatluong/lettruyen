fetch('https://otruyenapi.com/v1/api/home')
    .then(response => response.json())
    .then(data => {
      const comicList = document.getElementById('comic-list');
      comicList.classList.add('comic-list'); // Thêm class để áp dụng CSS

      if (data.status === 'success') {
        data.data.items.forEach(comic => {
          const comicItem = document.createElement('div');
          comicItem.classList.add('comic-item');
          let time = Math.floor(Math.random() * 23) + 2;


          comicItem.innerHTML = `
          <a href="detail.html?slug=${comic.slug}">
            <img src="${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/comics/${comic.thumb_url}" alt="${comic.name}">
            <div class="comic-info">
              <h2 class="comic-title">${comic.name}</h2>
        CHAP MỚI NHẤT
       </div>
            <div class="comic-status">
              <span>👁️ ${Math.floor(Math.random() * 1000)}</span>
              <span>❤️ ${Math.floor(Math.random() * 100)}</span>
              <span>💬 ${Math.floor(Math.random() * 50)}</span>
            </div>
            </a>
          `;comicItem.addEventListener('mouseenter', (event) => {
            tooltip.innerHTML = `
                <img src="${data.data.APP_DOMAIN_CDN_IMAGE}/uploads/comics/${comic.thumb_url}" alt="${comic.name}">
                <h3>${comic.name}</h3>
                <p>${comic.description || "Không có mô tả"}</p>
            `;
            tooltip.style.display = 'block';
        });

        // Cập nhật vị trí tooltip khi di chuột
        comicItem.addEventListener('mousemove', (event) => {
            tooltip.style.top = `${event.clientY + 10}px`;
            tooltip.style.left = `${event.clientX + 10}px`;
        });

        // Ẩn tooltip khi di chuột ra ngoài
        comicItem.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        comicList.appendChild(comicItem);

          comicList.appendChild(comicItem);
        });
      }
    })
    .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
    