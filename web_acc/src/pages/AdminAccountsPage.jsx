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
    const [showNotification, setShowNotification] = useState(false);
    const [formValues, setFormValues] = useState({
        TenTaiKhoan: '',
        MatKhauTaiKhoan: '',
        MoTa: '',
        GiaBan: 0,
        TrangThai: 0,
        MaGame: 1,
    });

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:8001/api/taikhoan');
            setAccounts(response.data || []);
        } catch (err) {
            console.error("Lỗi khi fetch tài khoản:", err);
            showNotificationMessage('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const showNotificationMessage = (message, type) => {
        if (type === 'success') {
            setSuccessMessage(message);
        } else {
            setError(message);
        }
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            setSuccessMessage(null);
            setError(null);
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: name === 'GiaBan' ? parseFloat(value) : value,
        }));
    };

    const addAccount = async () => {
        try {
            await axios.post('http://127.0.0.1:8001/api/taikhoan', formValues);
            showNotificationMessage('Thêm tài khoản thành công!', 'success');
            resetForm();
            setTimeout(() => fetchAccounts(), 500);
        } catch (err) {
            console.error("Lỗi khi thêm tài khoản:", err);
            showNotificationMessage('Không thể thêm tài khoản. Vui lòng thử lại sau.', 'error');
        }
    };

    const deleteAccount = async (maTaiKhoan) => {
        try {
            const account = accounts.find(a => a.MaTaiKhoan === maTaiKhoan);
            if (account.TrangThai === 1) {
                showNotificationMessage('Không thể xóa tài khoản đã bán', 'error');
                return;
            }
            
            await axios.delete(`http://127.0.0.1:8001/api/taikhoan/${maTaiKhoan}`);
            showNotificationMessage('Xóa tài khoản thành công!', 'success');
            setTimeout(() => fetchAccounts(), 500);
        } catch (err) {
            console.error("Lỗi khi xóa tài khoản:", err);
            showNotificationMessage('Không thể xóa tài khoản. Vui lòng thử lại sau.', 'error');
        }
    };

    const updateAccount = async () => {
        try {
            const account = accounts.find(a => a.MaTaiKhoan === formValues.MaTaiKhoan);
            if (account && account.TrangThai === 1) {
                showNotificationMessage('Không thể cập nhật tài khoản đã bán', 'error');
                return;
            }
            
            await axios.put(`http://127.0.0.1:8001/api/taikhoan/${formValues.MaTaiKhoan}`, formValues);
            showNotificationMessage('Cập nhật tài khoản thành công!', 'success');
            resetForm();
            setTimeout(() => fetchAccounts(), 500);
        } catch (err) {
            console.error("Lỗi khi cập nhật tài khoản:", err);
            showNotificationMessage('Không thể cập nhật tài khoản. Vui lòng thử lại sau.', 'error');
        }
    };

    const resetForm = () => {
        setFormValues({
            TenTaiKhoan: '',
            MatKhauTaiKhoan: '',
            MoTa: '',
            GiaBan: 0,
            TrangThai: 0,
            MaGame: 1,
        });
    };

    const editAccount = (account) => {
        if (account.TrangThai === 1) {
            showNotificationMessage('Không thể chỉnh sửa tài khoản đã bán', 'error');
            return;
        }
        setFormValues(account);
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading-container"><p className="loading-message">Đang tải danh sách tài khoản...</p></div>;
        }

        if (accounts.length === 0) {
            return <div className="message-container"><p className="empty-message">Không có tài khoản nào.</p></div>;
        }

        return (
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Mã TK</th>
                            <th>Mã người bán</th>
                            <th>Tài khoản</th>
                            <th>Mật khẩu</th>
                            <th>Mô tả</th>
                            <th>Giá bán</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.MaTaiKhoan} className={account.TrangThai === 1 ? 'sold' : ''}>
                                <td>{account.MaTaiKhoan}</td>
                                <td>{account.MaNguoiBan}</td>
                                <td>{account.TenTaiKhoan || 'Không có'}</td>
                                <td>{account.MatKhauTaiKhoan || 'Không có'}</td>
                                <td>{account.MoTa || 'Không có'}</td>
                                <td>{(account.GiaBan || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td>{account.TrangThai === 1 ? 'Đã bán' : 'Đang bán'}</td>
                                <td>
                                    {account.TrangThai !== 1 && (
                                        <>
                                            <button 
                                                onClick={() => editAccount(account)} 
                                                className="edit-button"
                                            >
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => deleteAccount(account.MaTaiKhoan)}
                                                className="delete-button"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Quản lý tài khoản</h2>
            </div>
            
            {/* Thông báo popup */}
            {showNotification && (
                <div className={`notification ${successMessage ? 'success' : 'error'}`}>
                    {successMessage || error}
                </div>
            )}

            <div className="form-container">
                <form className="account-form">
                    <h3>{formValues.MaTaiKhoan ? 'Cập nhật tài khoản' : 'Thêm tài khoản'}</h3>
                    
                    <div className="form-group">
                        <label>Tên tài khoản</label>
                        <input
                            type="text"
                            name="TenTaiKhoan"
                            placeholder="Nhập tên tài khoản"
                            value={formValues.TenTaiKhoan}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="text"
                            name="MatKhauTaiKhoan"
                            placeholder="Nhập mật khẩu"
                            value={formValues.MatKhauTaiKhoan}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Mô tả</label>
                        <input
                            type="text"
                            name="MoTa"
                            placeholder="Nhập mô tả"
                            value={formValues.MoTa}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Giá bán (VND)</label>
                        <input
                            type="number"
                            name="GiaBan"
                            placeholder="Nhập giá bán"
                            value={formValues.GiaBan}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select style={{ height: '50px'}}
                            name="TrangThai"
                            value={formValues.TrangThai}
                            onChange={handleInputChange}
                            disabled={formValues.MaTaiKhoan}
                        >
                            <option value={0}>Đang bán</option>
                            <option value={1}>Đã bán</option>
                        </select>
                    </div>
                    
                    <div className="form-actions">
                        {formValues.MaTaiKhoan ? (
                            <>
                                <button 
                                    type="button"
                                    onClick={updateAccount}
                                    className="update-button"
                                >
                                    Cập nhật
                                </button>
                                <button 
                                    type="button"
                                    onClick={resetForm}
                                    className="reset-button"
                                >
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button 
                                type="button"
                                onClick={addAccount}
                                className="add-button"
                            >
                                Thêm tài khoản
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="table-section">
                <h3>Danh sách tài khoản</h3>
                {renderContent()}
                <button 
                    onClick={handleBack}
                    className="back-button"
                >
                    Quay lại trang Dashboard
                </button>
            </div>
        </div>
    );
}

export default AdminAccountsPage;