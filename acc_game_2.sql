CREATE TABLE NGUOIDUNG (
    MaNguoiDung INT PRIMARY KEY AUTO_INCREMENT,
    TenDangNhap VARCHAR(150) NOT NULL,
    MatKhau VARCHAR(150) NOT NULL,  
    Email VARCHAR(150) NOT NULL UNIQUE, 
    HoTen VARCHAR(100),
    DiaChi VARCHAR(150),
    SoDienThoai VARCHAR(11),
    VaiTro TINYINT NOT NULL DEFAULT 0 COMMENT '0: user, 1: admin' 
);

CREATE TABLE GAME (
    MaGame INT PRIMARY KEY AUTO_INCREMENT,
    TenGame VARCHAR(150) NOT NULL DEFAULT 'Lien Minh Huyen Thoai',
    TheLoai VARCHAR(150),
    NhaPhatHanh VARCHAR(150)
);


CREATE TABLE TAIKHOAN (
    MaTaiKhoan INT PRIMARY KEY AUTO_INCREMENT,
    MaGame INT,
    MaNguoiDungBan INT,
    TenTaiKhoan VARCHAR(150) NOT NULL,
    MatKhauTaiKhoan VARCHAR(150) NOT NULL,
    MoTa VARCHAR(150),
    GiaBan FLOAT NOT NULL,
    TrangThai INT NOT NULL DEFAULT 1
);
CREATE TABLE GIAODICH (
    MaGiaoDich INT PRIMARY KEY AUTO_INCREMENT,
    MaTaiKhoan INT,
    MaNguoiDungMua INT,
    NgayGiaoDich DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    TongTien FLOAT NOT NULL,
    TrangThai INT NOT NULL DEFAULT 1
);

CREATE TABLE DANHGIA (
    MaDanhGia INT PRIMARY KEY AUTO_INCREMENT,
    MaTaiKhoan INT,
    MaNguoiDungDanhGia INT,
    SoSao INT NOT NULL CHECK (SoSao >= 1 AND SoSao <= 5),
    NoiDung VARCHAR(150),
    NgayDanhGia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
);
ALTER TABLE TAIKHOAN
ADD FOREIGN KEY (MaGame) REFERENCES GAME(MaGame),
ADD FOREIGN KEY (MaNguoiDungBan) REFERENCES NGUOIDUNG(MaNguoiDung);
ALTER TABLE GIAODICH
ADD FOREIGN KEY (MaTaiKhoan) REFERENCES TAIKHOAN(MaTaiKhoan),
ADD FOREIGN KEY (MaNguoiDungMua) REFERENCES NGUOIDUNG(MaNguoiDung);
ALTER TABLE DANHGIA
ADD FOREIGN KEY (MaTaiKhoan) REFERENCES TAIKHOAN(MaTaiKhoan),
ADD FOREIGN KEY (MaNguoiDungDanhGia) REFERENCES NGUOIDUNG(MaNguoiDung);



INSERT INTO NGUOIDUNG (TenDangNhap, MatKhau, Email, HoTen, DiaChi, SoDienThoai, VaiTro) 
VALUES (
    'admin', 
    '123456',
    'admin@shop.com', 
    'Quản Trị Viên', 
    '1 Admin Street, TP.HCM', 
    '0947979373',
    1 
);

INSERT INTO NGUOIDUNG (TenDangNhap, MatKhau, Email, HoTen, DiaChi, SoDienThoai, VaiTro) 
VALUES (
    'sa201445',
    'sa2014456',
    'thanhvien.a@email.com', 
    'Nguyễn Văn A', 
    '123 User Road, Q1, TP.HCM', 
    '0947979373',
    0 
);

INSERT INTO GAME (TenGame, TheLoai, NhaPhatHanh) 
VALUES ('Liên Minh Huyền Thoại', 'MOBA', 'Riot Games');

INSERT INTO TAIKHOAN (MaGame, MaNguoiDungBan, TenTaiKhoan, MatKhauTaiKhoan, MoTa, GiaBan, TrangThai) 
VALUES (
    1,  
    1,  
    'TK_6727', 
    'sa636548',  
    'Unrank Nhiều Mùa. Rank: Chưa Rank, Khung: Không, Số Tướng: 64, Trang Phục: 13, Đa Sắc: 1, Pet DTCL: 3, Sàn Đấu: 1, Chưởng Lực: 1', -- MoTa: Tổng hợp các chi tiết từ ảnh
    103000,
    1 
);

INSERT INTO GIAODICH (MaTaiKhoan, MaNguoiDungMua, TongTien, TrangThai)
VALUES (
    1,  
    2,  
    103000, 
    1  
);
UPDATE TAIKHOAN
SET TrangThai = 0 
WHERE MaTaiKhoan = 1; 

INSERT INTO DANHGIA (MaTaiKhoan, MaNguoiDungDanhGia, SoSao, NoiDung)
VALUES (
    1,  
    2, 
    5,  
    'Tài khoản đúng mô tả, giao dịch nhanh chóng. Rất hài lòng!' 
);