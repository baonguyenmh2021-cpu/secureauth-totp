# SecureAuth – ĐT16

Hệ thống xác thực hai yếu tố (Two-Factor Authentication – 2FA) sử dụng mã TOTP, triển khai trong khuôn khổ đồ án ĐT16.

## 1. Thông tin dự án

- **Tên hệ thống:** SecureAuth-TOTP.
- **Repository:** https://github.com/baonguyenmh2021-cpu/secureauth-totp
- **Mục tiêu:** xây dựng, tích hợp và kiểm thử cơ chế xác thực hai yếu tố bằng TOTP, QR Code và các biện pháp bảo vệ liên quan.
- **Trạng thái:** Project Foundation – nền tảng kết nối Frontend, Backend và PostgreSQL. Các chức năng nghiệp vụ, mô hình dữ liệu, migrations và kiểm thử bảo mật sẽ được phát triển theo nhiệm vụ của từng thành viên.

> Đây là repository làm việc nhóm. Hãy chấp nhận lời mời Collaborator trước khi clone nếu cần quyền truy cập. Hướng dẫn bên dưới áp dụng cho phiên bản Foundation sau khi được merge vào `develop`.

## 2. Công nghệ và môi trường chuẩn

| Thành phần | Phiên bản / công nghệ đã sử dụng |
|---|---|
| Python | 3.11.9 |
| FastAPI | 0.165.0 |
| Uvicorn | 0.54.0 |
| PostgreSQL | 18.6 |
| SQLAlchemy / psycopg | 2.1.9 / 3.3.9 |
| Alembic | 1.20.1 |
| Pydantic / pydantic-settings | 2.14.4 / 2.16.3 |
| Password hashing | pwdlib[argon2] 0.4.2 |
| Cryptography | 50.0.2 |
| QR Code | qrcode 8.2 |
| Backend testing | pytest 9.2.0, httpx 0.29.0 |
| Node.js / npm | 24.15.0 / 11.12.1 |
| Frontend | React, TypeScript, Vite 8.3.8 |
| Frontend libraries | Axios, React Router, Lucide React, Recharts |
| Frontend testing / lint | Vitest, Testing Library, Oxlint |
| Quản lý mã nguồn | Git và GitHub |
| Công cụ | VS Code, pgAdmin 4 (tùy chọn) |

Các phiên bản trên là baseline phát triển đã ghi nhận trên máy Windows 11, không phải yêu cầu phải dùng bản mới nhất. Xem `backend/requirements.txt`, `backend/requirements-lock.txt`, `frontend/package.json` và `frontend/package-lock.json` để biết dependencies cụ thể. Không tự ý nâng phiên bản khi chưa trao đổi với nhóm.

## 3. Kiến trúc nền tảng

```text
Browser / React + TypeScript
            |
            | Axios: /api/*
            v
Vite development server (localhost:5173)
            |
            | Development proxy
            v
FastAPI (127.0.0.1:8000)
            |
            | SQLAlchemy Session + psycopg
            v
PostgreSQL (localhost:5432)
```

Frontend không kết nối trực tiếp tới PostgreSQL. Vite Proxy chỉ là cấu hình phát triển local; triển khai production cần cấu hình máy chủ/reverse proxy và bảo mật riêng. System Health Check không phải cơ chế đăng nhập hoặc phân quyền.

## 4. Cấu trúc dự án

Cấu trúc chính của Foundation (không liệt kê toàn bộ file phụ trợ):

```text
secureauth-totp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── connection.py
│   │   │   └── session.py
│   │   └── main.py
│   ├── .env.example
│   ├── requirements.txt
│   └── requirements-lock.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── services/
│   │   │   └── apiClient.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── PROJECT_STRUCTURE.md
└── README.md
```

Các module `auth`, `totp`, `qrcode`, `two_factor`, `security_lab`, models, migrations, tests, docs, data và evidence được tổ chức theo `PROJECT_STRUCTURE.md` khi triển khai. Không hiểu sơ đồ kiến trúc mục tiêu là toàn bộ file đã được tạo. Git không theo dõi thư mục rỗng.

## 5. Phân công và nhánh làm việc

| Thành viên | Phạm vi phụ trách | Branch dự kiến |
|---|---|---|
| TV1 | TOTP Core | `feature/totp-core` |
| TV2 | Authentication Backend | `feature/auth-backend` |
| TV3 | Frontend | `feature/frontend` |
| TV4 | 2FA & QR Integration | `feature/2fa-integration` |
| TV5 | Security Lab & Testing | `feature/security-lab` |
| TV6 | Database, Integration & QA | `feature/database-setup` |

Thành viên thực hiện theo tài liệu phân công đã thống nhất của nhóm. Tên nhánh trên là quy ước nhiệm vụ, không khẳng định các nhánh đã được tạo. Các thay đổi API contract, database schema và file dùng chung cần trao đổi với người phụ trách liên quan trước khi merge.

## 6. Yêu cầu trước khi bắt đầu

Cài Git for Windows, Python 3.11.x, Node.js/npm, PostgreSQL 18 và VS Code. pgAdmin 4 là công cụ tùy chọn để quản lý database. Các lệnh thiết lập và chạy dưới đây sử dụng **Command Prompt (CMD)** trên Windows; các lệnh Git, Python và npm cũng có thể dùng trong PowerShell với cú pháp đường dẫn phù hợp.

```cmd
git --version
py -3.11 --version
node --version
npm.cmd --version
```

Kiểm tra PostgreSQL (điều chỉnh đường dẫn nếu cài ở vị trí khác):

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
"C:\Program Files\PostgreSQL\18\bin\pg_isready.exe" -h localhost -p 5432
```

Nếu PowerShell chặn `npm`, sử dụng `npm.cmd`. Không cần thay đổi Execution Policy hoặc tắt bảo vệ hệ thống.

## 7. Clone repository

### Cách 1: Terminal CMD (khuyến nghị)

Di chuyển đến thư mục lưu dự án đã tồn tại (đường dẫn sau chỉ là ví dụ):

```cmd
cd /d "D:\ATTT\ATTT CK"
git clone -b develop https://github.com/baonguyenmh2021-cpu/secureauth-totp.git
cd secureauth-totp
git branch --show-current
code .
```

Nếu đã clone, không clone lại vào thư mục cũ. Kiểm tra và lưu các thay đổi riêng trước khi cập nhật:

```cmd
git status --short
git fetch origin
git switch develop
git pull --ff-only origin develop
```

Chỉ chuyển nhánh sau khi đã xử lý công việc chưa commit. Nếu chưa có `develop` local, dùng `git switch --track origin/develop` sau khi fetch.

### Cách 2: VS Code

1. Mở VS Code, nhấn `Ctrl + Shift + P`, tìm `Git: Clone`.
2. Dán URL repository, chọn thư mục lưu và chọn **Open**.
3. Mở Terminal, chạy `git fetch origin`, chuyển sang `develop` như trên.

Nếu repository ở chế độ Private, đăng nhập đúng tài khoản GitHub đã được cấp quyền.

> **Lưu ý với thành viên đã tải commit cũ có `.venv` được Git theo dõi:** hãy sao lưu công việc riêng và cấu hình `.env` bên ngoài repository trước khi cập nhật. Việc merge bản dọn dẹp có thể loại các file `.venv` đã tracked trên máy cũ; cần tạo lại virtual environment riêng sau khi cập nhật. Không sao chép virtual environment từ máy người khác.

## 8. Chuẩn bị Backend

Từ thư mục gốc dự án, mở Terminal CMD:

```cmd
cd backend
py -3.11 -m venv .venv
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install -r requirements.txt -c requirements-lock.txt
.venv\Scripts\python.exe -m pip check
```

Kết quả `pip check` mong đợi: `No broken requirements found.`

- `requirements.txt`: các dependencies trực tiếp đã cố định phiên bản.
- `requirements-lock.txt`: snapshot dependencies từ môi trường Windows đã sử dụng, dùng làm constraints để tái tạo baseline.

Nếu cài trên hệ điều hành khác hoặc gặp lỗi tương thích của constraints, trao đổi với nhóm trước khi thay đổi phiên bản; có thể kiểm tra với `pip install -r requirements.txt` trong môi trường riêng. Snapshot chưa được nghiệm thu trên tất cả hệ điều hành hay toàn bộ máy thành viên.

Không cần kích hoạt `.venv` nếu gọi trực tiếp `.venv\Scripts\python.exe`. Trong CMD có thể kích hoạt tùy chọn bằng `.venv\Scripts\activate.bat`.

## 9. Chuẩn bị PostgreSQL

Đảm bảo PostgreSQL đang chạy. Trên Windows có thể kiểm tra trong Services (`services.msc`); tên service phụ thuộc cách cài đặt, ví dụ `postgresql-x64-18`.

Mở CMD và kết nối bằng tài khoản quản trị PostgreSQL local:

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d postgres
```

Nhập mật khẩu quản trị khi được hỏi. Trong cửa sổ **psql**, kiểm tra role và database trước:

```sql
\du
\l
```

Chỉ khi role `secureauth_app` chưa tồn tại, tạo role ứng dụng không có quyền superuser:

```sql
CREATE ROLE secureauth_app WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
\password secureauth_app
```

Lệnh `\password` yêu cầu nhập mật khẩu local hai lần. Không đưa mật khẩu vào Git hoặc gửi trong nhóm chat. Nếu role đã tồn tại, sử dụng thông tin đăng nhập đã thiết lập hoặc liên hệ người quản lý database.

Chỉ tạo database nào chưa tồn tại:

```sql
CREATE DATABASE secureauth_dev OWNER secureauth_app;
CREATE DATABASE secureauth_test OWNER secureauth_app;
```

Kiểm tra owner bằng `\l`, thoát psql bằng `\q`. Không xóa hoặc ghi đè database đã có dữ liệu.

Từ CMD, kiểm tra lần lượt hai database (nhập mật khẩu của `secureauth_app` khi được hỏi):

```cmd
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U secureauth_app -d secureauth_dev -c "SELECT current_database(), current_user;"
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U secureauth_app -d secureauth_test -c "SELECT current_database(), current_user;"
```

`secureauth_dev` dành cho phát triển; `secureauth_test` dành cho kiểm thử có database. Hai database dùng chung role trong baseline local, không phải mô hình phân quyền production. Khi xây dựng test fixtures, phải cấu hình test engine trỏ tới test database; chỉ khai báo tên test database không tự động chuyển tất cả test sang database đó.

Foundation chưa triển khai các bảng nghiệp vụ hoặc Alembic migrations. TV6 phụ trách theo tài liệu thiết kế đã thống nhất; không tự tạo bảng hoặc chạy migration chưa được review.

## 10. Cấu hình biến môi trường

Tại thư mục `backend`, nếu chưa có `.env`, chạy trong CMD:

```cmd
if not exist .env copy .env.example .env
```

Mở `backend/.env` trong VS Code, cấu hình theo database local:

```dotenv
APP_NAME=SecureAuth-TOTP
APP_VERSION=0.1.0
APP_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=secureauth_app
DB_PASSWORD=change_me
DB_NAME=secureauth_dev
TEST_DB_NAME=secureauth_test
```

Thay `change_me` bằng mật khẩu local vừa đặt. Nếu mật khẩu có ký tự đặc biệt của dotenv, dùng cách trích dẫn phù hợp. Không thay `.env.example` bằng mật khẩu thật. `config.py` đọc file `.env` từ thư mục Backend; không cần tự ghép database URL.

Tại thư mục `backend`, kiểm tra cấu hình mà không in mật khẩu:

```cmd
.venv\Scripts\python.exe -c "from app.core.config import settings; print(settings.APP_NAME); print(settings.database_url); print(settings.test_database_url)"
```

Kết quả URL phải trỏ đến `secureauth_dev` và `secureauth_test`, mật khẩu được che. Không gọi phương thức xuất URL chứa mật khẩu thật khi ghi log.

## 11. Cài đặt Frontend

Mở Terminal CMD khác tại thư mục gốc dự án:

```cmd
cd frontend
npm.cmd ci
```

`npm ci` cài đúng `package-lock.json`; chỉ sử dụng `npm install` khi chủ động thay đổi dependencies và cần cập nhật lockfile. Không commit `node_modules/`.

## 12. Khởi động hệ thống

Giữ PostgreSQL hoạt động. Mở hai Terminal tại thư mục gốc repository.

**Terminal 1 – Backend:**

```cmd
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 – Frontend:**

```cmd
cd frontend
npm.cmd run dev
```

| Địa chỉ | Mục đích |
|---|---|
| http://localhost:5173/ | System Health Check UI |
| http://127.0.0.1:8000/docs | Swagger UI |
| http://127.0.0.1:8000/api/health | Backend health |
| http://127.0.0.1:8000/api/health/db | Database health |
| http://localhost:5173/api/health | Kiểm tra Vite Proxy |
| http://localhost:5173/api/health/db | Kiểm tra Database qua Vite Proxy |

Dừng server bằng `Ctrl + C` trong Terminal tương ứng. Không cần dừng PostgreSQL chỉ để kiểm tra lỗi mất kết nối Backend.

## 13. Kiểm tra System Health Check

Truy cập http://localhost:5173/ và chọn **Check connection** nếu cần. Kết quả mong đợi khi hệ thống hoạt động:

- Frontend: `Connected`.
- Backend: `Connected`.
- Database: `Connected`.
- Tổng trạng thái: `All systems operational`.

API `/api/health` trả về `status: ok`; `/api/health/db` trả về `status: ok`, `database: PostgreSQL`, `connection: connected` nếu truy vấn kiểm tra thành công.

| Test | Thao tác | Kết quả mong đợi |
|---|---|---|
| TC-01 | Chạy cả Backend và Frontend, PostgreSQL hoạt động | Cả ba tầng Connected |
| TC-02 | Dừng Uvicorn, giữ Frontend, nhấn Check connection | Backend và Database Unavailable |
| TC-03 | Chạy lại Uvicorn, nhấn Check connection | Cả ba tầng Connected trở lại |

Khi Backend không phản hồi, trạng thái Database Unavailable có nghĩa là không thể xác minh Database thông qua API, không khẳng định PostgreSQL đã ngừng hoạt động.

Giao diện Health Check chỉ là công cụ smoke test cho nền tảng phát triển; TV3 sẽ xây dựng giao diện nghiệp vụ chính thức.

## 14. Kiểm thử và tiêu chí nghiệm thu

Từ thư mục `backend`:

```cmd
.venv\Scripts\python.exe -m pip check
```

Từ thư mục `frontend`:

```cmd
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Tiêu chí Foundation: không có dependencies bị lỗi, TypeScript kiểm tra thành công, Oxlint báo 0 warnings và 0 errors, build thành công, kiểm thử Health Check và phục hồi đạt yêu cầu. Kiểm tra tại máy của thành viên trước khi bắt đầu nghiệp vụ.

pytest, httpx, Vitest và Testing Library đã được chuẩn bị cho phát triển test. Các bộ test nghiệp vụ, fixtures, cấu hình chạy test frontend và kiểm thử tích hợp database sẽ được triển khai theo phân công. Không đánh đồng việc cài test framework hoặc build thành công với việc toàn bộ nghiệp vụ đã được kiểm thử.

## 15. Quy trình Git hằng ngày

- `main`: phiên bản ổn định, dùng cho release/demo đã nghiệm thu.
- `develop`: nhánh tích hợp công việc đã review.
- `feature/<ten-chuc-nang>`: nhánh triển khai nhiệm vụ.
- `fix/<ten-loi>`: nhánh sửa lỗi.
- `docs/<noi-dung>`: nhánh cập nhật tài liệu.

### 15.1. Cập nhật develop trước khi tạo nhánh

Kiểm tra `git status --short`. Chỉ chuyển nhánh nếu đã xử lý công việc chưa commit.

```cmd
git fetch origin
git switch develop
git pull --ff-only origin develop
```

### 15.2. Tạo hoặc sử dụng nhánh được phân công

Ví dụ cho TV1. Nếu nhánh chưa tồn tại cả local và remote:

```cmd
git switch -c feature/totp-core
```

Nếu đã có trên remote nhưng chưa có local, dùng `git switch --track origin/feature/totp-core`. Nếu đã có local, dùng `git switch feature/totp-core`. Không tạo lại nhánh cùng tên hoặc reset nhánh có công việc đang làm.

Khi cần tích hợp cập nhật từ develop vào nhánh cá nhân, commit công việc đang làm trước, fetch, kiểm tra nhánh hiện tại rồi dùng `git merge origin/develop`. Nếu có conflict, trao đổi với người phụ trách file và chạy test sau khi giải quyết. Không force push.

### 15.3. Kiểm tra, commit và push

```cmd
git status --short
git diff
```

Dùng `git add --` với đường dẫn file thực tế cần commit (không nhập ký hiệu placeholder). Sau khi stage, kiểm tra:

```cmd
git diff --cached --stat
git diff --cached
git ls-files -- backend/.env backend/.venv frontend/node_modules frontend/dist
```

Lệnh cuối không được liệt kê file nào. Chạy lệnh tại thư mục gốc. Kiểm tra nội dung staged để tránh secrets và file ngoài phạm vi. Không sử dụng `git add .` một cách máy móc.

Ví dụ commit/push sau khi đã stage đúng file nghiệp vụ của TV1:

```cmd
git commit -m "feat(totp): implement TOTP validation"
git push -u origin feature/totp-core
```

Các lần sau trên cùng nhánh có thể dùng `git push`. Thay tên branch và commit message theo nhiệm vụ thực tế.

### 15.4. Pull Request

1. Mở repository GitHub, chọn **Pull requests → New pull request**.
2. Chọn `base: develop`, `compare: feature/totp-core` (hoặc nhánh nhiệm vụ thực tế).
3. Mô tả phạm vi thay đổi, cách kiểm thử, kết quả và hạn chế còn lại.
4. Mời thành viên khác review, xử lý góp ý/conflict và chạy lại test khi cần.
5. Chỉ merge khi đáp ứng tiêu chí review của nhóm.

Không push trực tiếp lên `main` hoặc `develop`. Release lên `main` chỉ sau khi nhóm nghiệm thu và thống nhất.

## 16. Quy ước commit message

| Tiền tố | Mục đích | Ví dụ |
|---|---|---|
| `feat` | Thêm chức năng | `feat(auth): add login endpoint` |
| `fix` | Sửa lỗi | `fix(totp): handle invalid code` |
| `test` | Thêm hoặc sửa test | `test(totp): add RFC test vectors` |
| `docs` | Cập nhật tài liệu | `docs: update setup guide` |
| `refactor` | Tái cấu trúc code | `refactor(database): organize models` |
| `chore` | Cấu hình/công việc phụ trợ | `chore: update dependencies` |

## 17. Bảo mật và các file không được push

Tuyệt đối không commit:

- `.env` thật, mật khẩu PostgreSQL, API token, GitHub token, khóa mã hóa và TOTP Secret Key thật.
- QR Code chứa secret thật, session token, dữ liệu cá nhân hoặc dữ liệu kiểm thử nhạy cảm.
- `.venv/`, `node_modules/`, `__pycache__/`, `dist/` và các file sinh tự động không cần quản lý bằng Git.

Chỉ commit `.env.example` với giá trị minh họa và các manifest/lockfile dependencies. Kiểm tra từ thư mục gốc:

```cmd
git check-ignore -v backend/.env
git check-ignore -v backend/.venv/pyvenv.cfg
git ls-files -- backend/.env backend/.venv frontend/node_modules frontend/dist
```

`.gitignore` không tự loại file đã được Git theo dõi. Nếu lỡ commit/push secret, phải báo nhóm và thu hồi/thay secret ngay. Xóa file trong commit mới không xóa nội dung khỏi lịch sử Git. Không tự viết lại lịch sử hoặc force push trên nhánh dùng chung.

Các thí nghiệm Security Lab chỉ thực hiện trên hệ thống, dữ liệu giả lập và tài khoản thử nghiệm được nhóm cho phép; không tấn công dịch vụ hoặc tài khoản bên ngoài.

## 18. Một số lệnh Git hữu ích

| Lệnh | Tác dụng |
|---|---|
| `git status` | Xem trạng thái file |
| `git branch -a` | Xem branch local và remote |
| `git branch -vv` | Kiểm tra nhánh và upstream |
| `git fetch origin` | Lấy thông tin mới, không tự merge |
| `git pull --ff-only origin develop` | Cập nhật khi đang ở develop, chỉ cho phép fast-forward |
| `git diff` | Xem thay đổi chưa stage |
| `git diff --cached` | Xem thay đổi đã stage |
| `git --no-pager log --oneline --graph --all -15` | Xem lịch sử commit ngắn gọn |
| `git push` | Đẩy commit lên upstream đã thiết lập |

## 19. Xử lý lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Repository not found / Permission denied | Kiểm tra lời mời Collaborator và tài khoản GitHub |
| PowerShell chặn npm | Dùng `npm.cmd` hoặc CMD |
| Không tìm thấy `package.json` / `requirements.txt` | Kiểm tra thư mục `frontend` / `backend` tương ứng |
| Không tìm thấy `psql` | Dùng đường dẫn đầy đủ tới PostgreSQL bin hoặc bổ sung PATH |
| Database connection refused | Kiểm tra service PostgreSQL, host và port |
| Password authentication failed | Kiểm tra role và mật khẩu trong `.env` local; không gửi mật khẩu vào chat |
| Backend báo thiếu biến môi trường | Kiểm tra `backend/.env` đã tạo từ `.env.example` |
| Cổng 5173/8000 đang được sử dụng | Dừng tiến trình cũ của chính dự án; nếu đổi cổng phải cập nhật proxy tương ứng |
| API trực tiếp chạy nhưng proxy lỗi | Kiểm tra `vite.config.ts`, Backend đang chạy đúng host/port và khởi động lại Vite |
| `.venv` bị hỏng hoặc từ máy khác | Tạo lại virtual environment riêng sau khi bảo toàn công việc; cài dependencies từ manifest |
| `npm ci` báo lockfile không khớp | Không tự xóa lockfile; trao đổi với người phụ trách Frontend |
| Push bị rejected / merge conflict | Fetch, xác định nhánh, trao đổi với người phụ trách file và xử lý conflict; không force push |

## 20. Liên kết

- GitHub Repository: https://github.com/baonguyenmh2021-cpu/secureauth-totp
- Git for Windows: https://git-scm.com/download/win
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/
- pgAdmin 4: https://www.pgadmin.org/download/
- FastAPI: https://fastapi.tiangolo.com/
- RFC 4226 (HOTP): https://www.rfc-editor.org/rfc/rfc4226
- RFC 6238 (TOTP): https://www.rfc-editor.org/rfc/rfc6238

---

**Lưu ý:** README là hướng dẫn nền tảng chung cho nhóm SecureAuth. Khi kiến trúc, API, database schema, branch hoặc lệnh chạy thay đổi, cập nhật tài liệu cùng Pull Request liên quan. Ưu tiên những quyết định đã được nhóm thống nhất và kiểm thử thực tế.
