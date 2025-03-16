document.querySelector('#login-btn').addEventListener('click', function() {
    const formContainer = document.querySelector('.form-container');
    const overlay = document.querySelector('.overlay');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    overlay.style.display = formContainer.style.display === 'block' ? 'block' : 'none';
});

// Ẩn form khi bấm overlay
document.querySelector('.overlay').addEventListener('click', function() {
    document.querySelector('.form-container').style.display = 'none';
    this.style.display = 'none';
});

// Chuyển đổi giữa form đăng nhập và đăng ký
document.getElementById('show-signup').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('signup-form-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'block';
});

// Xử lý đăng ký
document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let email = document.getElementById('signup-email').value;
    let password = document.getElementById('signup-password').value;
    let verifyPassword = document.getElementById('verify-password').value;

    if (password !== verifyPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    if (localStorage.getItem(email)) {
        alert('Email đã được đăng ký!');
        return;
    }

    let user = { username, email, password, avatar: "image.jpg" };
    localStorage.setItem(email, JSON.stringify(user));
    alert('Đăng ký thành công!');
    document.getElementById('signup-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'block';
});

// Xử lý đăng nhập
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let user = JSON.parse(localStorage.getItem(email));

    if (user && user.password === password) {
        alert('Đăng nhập thành công!');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        updateUserUI(user);
    } else {
        alert('Sai email hoặc mật khẩu!');
    }
});

function updateUserUI(user) {
    const userInfo = document.getElementById('user-info');
    userInfo.innerHTML = `
        <div class="dropdown">
            <img src="${user.avatar}" alt="Avatar" class="avatar" id="avatar">
            <div class="dropdown-content">
                <input type="file" id="change-avatar" style="display: none;">
                <button onclick="document.getElementById('change-avatar').click();">Đổi hình ảnh</button>
                <button id="logout-btn">Đăng xuất</button>
            </div>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('Bạn có chắc muốn đăng xuất không?')) {
            localStorage.removeItem('loggedInUser');
            userInfo.innerHTML = `<a id="login-btn" class="btn btn-primary">Đăng nhập</a>`;
        }
    });

    document.getElementById('change-avatar').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                user.avatar = e.target.result;
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                updateUserUI(user);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Kiểm tra nếu người dùng đã đăng nhập
window.onload = function() {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        updateUserUI(loggedInUser);
    }
};
