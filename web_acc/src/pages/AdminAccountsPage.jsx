// src/pages/AdminAccountsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAccountsPage.css';

function AdminAccountsPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formValues, setFormValues] = useState({
        TenTaiKhoan: '',
        MatKhauTaiKhoan: '',
        MoTa: '',
        GiaBan: 0,
        TrangThai: 1,
        MaGame: 1,
    });

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8001/api/taikhoan');
                setAccounts(response.data || []);
            } catch (err) {
                console.error("Lỗi khi fetch tài khoản:", err);
                setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: name === 'GiaBan' ? parseFloat(value) : value,
        }));
    };

    const addAccount = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8001/api/taikhoan', formValues);
            setAccounts([...accounts, response.data]);
            setSuccessMessage('Thêm tài khoản thành công!');
            resetForm();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            console.error("Lỗi khi thêm tài khoản:", err);
            setError('Không thể thêm tài khoản. Vui lòng thử lại sau.');
        }
    };

    const deleteAccount = async (maTaiKhoan) => {
        try {
            await axios.delete(`http://127.0.0.1:8001/api/taikhoan/${maTaiKhoan}`);
            setAccounts(accounts.filter(account => account.MaTaiKhoan !== maTaiKhoan));
        } catch (err) {
            console.error("Lỗi khi xóa tài khoản:", err);
            setError('Không thể xóa tài khoản. Vui lòng thử lại sau.');
        }
    };

    const updateAccount = async () => {
        try {
            await axios.put(`http://127.0.0.1:8001/api/taikhoan/${formValues.MaTaiKhoan}`, formValues);
            setAccounts(accounts.map(account => account.MaTaiKhoan === formValues.MaTaiKhoan ? formValues : account));
            resetForm();
        } catch (err) {
            console.error("Lỗi khi cập nhật tài khoản:", err);
            setError('Không thể cập nhật tài khoản. Vui lòng thử lại sau.');
        }
    };

    const resetForm = () => {
        setFormValues({
            TenTaiKhoan: '',
            MatKhauTaiKhoan: '',
            MoTa: '',
            GiaBan: 0,
            TrangThai: 1,
            MaGame: 1,
        });
        setSuccessMessage(null);
    };

    const editAccount = (account) => {
        setFormValues(account);
    };

    const renderContent = () => {
        if (loading) {
            return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải danh sách tài khoản...</p>;
        }

        if (error) {
            return <p className="error-message" style={{ textAlign: 'center', padding: '50px' }}>{error}</p>;
        }

        if (accounts.length === 0) {
            return <p style={{ textAlign: 'center' }}>Không có tài khoản nào.</p>;
        }

        return (
            <div className="accounts-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accounts.map((account) => (
                    <div className="account-card" key={account.MaTaiKhoan} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <div className="account-title">
                            <strong>Tài khoản:</strong> {account.TenTaiKhoan || 'Không có tên'}
                        </div>
                        <div className="account-password">
                            <strong>Mật khẩu:</strong> {account.MatKhauTaiKhoan || 'Không có mật khẩu'}
                        </div>
                        <div className="account-description">
                            <strong>Mô tả:</strong> {account.MoTa || 'Không có mô tả'}
                        </div>
                        <div className="account-price">
                            <strong>Giá:</strong> {(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        <button onClick={() => editAccount(account)} className="edit-button">Chỉnh sửa</button>
                        <button onClick={() => deleteAccount(account.MaTaiKhoan)} className="delete-button">Xóa</button>
                    </div>
                ))}
            </div>
        );
    };

    

    return (
        <div>
            <h1>Quản lý tài khoản</h1>
            <div className="admin-accounts-page" style={{ display: 'flex' }}>
                <div className="account-form" style={{ width: '400px', marginRight: '20px' }}>
                    <h3>Thêm/Sửa tài khoản</h3>
                    <input
                        type="text"
                        name="TenTaiKhoan"
                        placeholder="Tên tài khoản"
                        value={formValues.TenTaiKhoan}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                    />
                    <input
                        type="text"
                        name="MatKhauTaiKhoan"
                        placeholder="Mật khẩu tài khoản"
                        value={formValues.MatKhauTaiKhoan}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                    />
                    <input
                        type="text"
                        name="MoTa"
                        placeholder="Mô tả"
                        value={formValues.MoTa}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                    />
                    <input
                        type="number"
                        name="GiaBan"
                        placeholder="Giá bán (VND)"
                        value={formValues.GiaBan}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                    />
                    <div style={{ display: 'flex' }}>
                        <button onClick={addAccount} className="add-button">Thêm tài khoản</button>
                        <button onClick={updateAccount} className="update-button">Cập nhật tài khoản</button>
                    </div>

                    {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
                </div>

                <div className="accounts-display" style={{ flex: 1 }}>
                    {renderContent()}
                </div>
            </div>
            <button onClick={handleBack} className="back-button">
                Quay lại trang Dashboard
            </button>
        </div>
    );
}

export default AdminAccountsPage;