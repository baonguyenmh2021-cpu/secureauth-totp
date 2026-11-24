
# SecureAuth – ĐT16

Hệ thống xác thực hai yếu tố (Two-Factor Authentication – 2FA) sử dụng mã TOTP, triển khai trong khuôn khổ đồ án ĐT16.

## 1. Thông tin dự án

- **Repository:** https://github.com/baonguyenmh2021-cpu/secureauth-totp
- **Backend:** Python 3.11, FastAPI
- **Frontend:** React + Vite
- **Database:** PostgreSQL 18
- **ORM / Driver:** SQLAlchemy 2.x / psycopg 3
- **QR Code:** qrcode
- **Testing:** pytest
- **Version control:** Git và GitHub

> Đây là repository làm việc nhóm. Hãy kiểm tra quyền truy cập và chấp nhận lời mời Collaborator trước khi clone.

## 2. Yêu cầu trước khi bắt đầu

Cài đặt các công cụ sau trên máy:

1. Git for Windows.
2. Python 3.11.x.
3. Node.js và npm.
4. PostgreSQL 18 và pgAdmin 4 (khi cần chạy chức năng có sử dụng database).
5. Visual Studio Code (khuyến nghị).

Kiểm tra cài đặt trong PowerShell:

```powershell
git --version
python --version
py -3.11 --version
node --version
npm.cmd --version
```

Nếu PowerShell chặn lệnh `npm`, thử `npm.cmd` thay thế.

## 3. Clone repository về máy

### Cách 1: Dùng Terminal (khuyến nghị)

Mở PowerShell hoặc Terminal trong VS Code, di chuyển đến thư mục muốn lưu dự án. Ví dụ:

```powershell
cd "D:\ATTT\ATTT CK"
```

Clone repository:

```powershell
git clone https://github.com/baonguyenmh2021-cpu/secureauth-totp.git
```

Đi vào thư mục dự án và mở bằng VS Code:

```powershell
cd secureauth-totp
code .
```

### Cách 2: Dùng VS Code

1. Mở VS Code.
2. Nhấn `Ctrl + Shift + P`.
3. Tìm lệnh `Git: Clone`.
4. Dán địa chỉ repository:

   `https://github.com/baonguyenmh2021-cpu/secureauth-totp.git`

5. Chọn thư mục lưu dự án.
6. Chọn **Open** khi VS Code hỏi có mở repository vừa clone không.

Nếu repository đặt ở chế độ Private, hãy đăng nhập GitHub bằng tài khoản đã được mời vào repository và chấp nhận lời mời trước khi clone.

## 4. Cấu trúc dự án

```text
secureauth-totp/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── totp/
│   │   │   ├── qrcode/
│   │   │   └── security_lab/
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── docs/
├── data/
├── evidence/
├── .gitignore
└── README.md
```

Một số thư mục có thể đang được tạo dần trong quá trình triển khai. Nếu một thư mục chưa có trên branch bạn clone, hãy kiểm tra branch hiện tại và cập nhật repository.

## 5. Chạy Frontend React

Mở Terminal tại thư mục gốc dự án:

```powershell
cd frontend
```

Cài các package theo `package-lock.json`:

```powershell
npm.cmd install
```

Chạy môi trường phát triển:

```powershell
npm.cmd run dev
```

Mở địa chỉ Local được Vite hiển thị trong Terminal (thường là `http://localhost:5173/`).

Dừng server bằng `Ctrl + C`.

> Không đưa `node_modules/` lên GitHub. Mỗi thành viên tự chạy `npm.cmd install` sau khi clone hoặc khi dependency thay đổi.

## 6. Chuẩn bị và chạy Backend FastAPI

Mở Terminal thứ hai tại thư mục gốc dự án:

```powershell
cd backend
```

Tạo môi trường ảo (chỉ cần thực hiện một lần trên mỗi máy):

```powershell
py -3.11 -m venv .venv
```

Cài dependency:

```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Sau khi nhóm đã tạo `backend/app/main.py`, chạy Backend bằng:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Mở Swagger UI tại:

`http://127.0.0.1:8000/docs`

Dừng server bằng `Ctrl + C`.

> Nếu `requirements.txt` hoặc `app/main.py` chưa có trên branch bạn đang dùng, không tự tạo bản khác trùng lặp. Hãy hỏi người phụ trách Backend hoặc cập nhật branch `develop` theo quy trình của nhóm.

## 7. Quy trình Git hằng ngày

Nhóm sử dụng quy ước:

- `main`: phiên bản ổn định.
- `develop`: nhánh tích hợp công việc đã review.
- `feature/<ten-chuc-nang>`: nhánh thực hiện một chức năng.
- `fix/<ten-loi>`: nhánh sửa lỗi.
- `docs/<noi-dung>`: nhánh cập nhật tài liệu.

### 7.1. Cập nhật develop trước khi làm

```powershell
git switch develop
git pull origin develop
```

Nếu máy chưa có branch `develop`, lấy thông tin remote và tạo branch theo dõi:

```powershell
git fetch origin
git switch --track origin/develop
```

### 7.2. Tạo branch riêng cho nhiệm vụ

Ví dụ:

```powershell
git switch -c feature/totp-core
```

Đặt tên branch ngắn gọn, viết thường, không dấu và mô tả đúng nhiệm vụ được giao.

### 7.3. Kiểm tra, commit và push

```powershell
git status
git diff
git add <file-hoac-thu-muc>
git commit -m "feat(totp): implement TOTP validation"
git push -u origin feature/totp-core
```

Thay tên branch và nội dung commit theo công việc thực tế. Chỉ dùng `git add .` sau khi đã kiểm tra kỹ `git status`, tránh đưa nhầm file bí mật hoặc file sinh tự động lên GitHub.

### 7.4. Tạo Pull Request

1. Mở repository trên GitHub.
2. Chọn **Pull requests** → **New pull request**.
3. Chọn `base: develop` và `compare: feature/totp-core` (thay bằng branch của bạn).
4. Mô tả nội dung đã làm và cách kiểm thử.
5. Chọn một thành viên khác làm reviewer.
6. Chỉ merge sau khi đã review và xử lý góp ý.

Không push trực tiếp lên `main` hoặc `develop`, trừ khi trưởng nhóm có hướng dẫn cụ thể.

## 8. Quy ước commit message

| Tiền tố | Mục đích | Ví dụ |
|---|---|---|
| `feat` | Thêm chức năng | `feat(auth): add login endpoint` |
| `fix` | Sửa lỗi | `fix(totp): handle invalid code` |
| `test` | Thêm hoặc sửa test | `test(totp): add RFC test vectors` |
| `docs` | Cập nhật tài liệu | `docs: update setup guide` |
| `refactor` | Tái cấu trúc code | `refactor(database): organize models` |
| `chore` | Cấu hình/công việc phụ trợ | `chore: update dependencies` |

## 9. Bảo mật và các file không được push

Tuyệt đối không commit:

- File `.env` chứa mật khẩu hoặc secret thật.
- PostgreSQL password, API token, GitHub token.
- TOTP Secret Key của tài khoản thật.
- Dữ liệu cá nhân hoặc dữ liệu thử nghiệm nhạy cảm.
- Thư mục `.venv/`, `node_modules/`, `__pycache__/`, `dist/`.

Chỉ commit `.env.example` với giá trị minh họa, không chứa thông tin đăng nhập thật. Nếu vô tình push secret lên GitHub, phải thu hồi/thay secret ngay; xóa file ở commit mới không xóa secret khỏi lịch sử Git.

## 10. Một số lệnh Git hữu ích

| Lệnh | Tác dụng |
|---|---|
| `git status` | Xem trạng thái file |
| `git branch -a` | Xem các branch local và remote |
| `git switch <branch>` | Chuyển branch |
| `git fetch origin` | Lấy thông tin mới từ remote |
| `git pull origin develop` | Cập nhật branch từ remote |
| `git diff` | Xem thay đổi chưa stage |
| `git log --oneline --graph --all` | Xem lịch sử commit |
| `git push` | Đẩy commit lên remote |

## 11. Khi gặp lỗi

- **Repository not found / Permission denied:** kiểm tra đã Accept lời mời và đăng nhập đúng tài khoản GitHub.
- **`npm` bị PowerShell chặn:** dùng `npm.cmd`.
- **Không tìm thấy `package.json`:** kiểm tra Terminal đang ở thư mục `frontend`.
- **Không tìm thấy `requirements.txt`:** kiểm tra Terminal đang ở thư mục `backend`.
- **Push bị rejected:** chạy `git fetch origin`, cập nhật branch phù hợp và xử lý conflict trước khi push lại.
- **Merge conflict:** mở file conflict, trao đổi với người phụ trách, kết hợp nội dung đúng, chạy test rồi mới commit.

## 12. Liên kết

- GitHub Repository: https://github.com/baonguyenmh2021-cpu/secureauth-totp
- Git for Windows: https://git-scm.com/download/win
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/
- pgAdmin 4: https://www.pgadmin.org/download/

---

**Lưu ý:** Tài liệu này là hướng dẫn chung cho nhóm SecureAuth. Khi cấu trúc, branch hoặc lệnh chạy thay đổi, thành viên cần ưu tiên hướng dẫn mới nhất được thống nhất trong nhóm.
