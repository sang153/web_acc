import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAccountsPage.css';
import { useAuth } from '../context/AuthContext';
function AdminUsersPage() {
    const navigate = useNavigate();
    const { updateWallet } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [formValues, setFormValues] = useState({
        id: '',
        email: '',
        wallet: 0,
    });

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    const fetchAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:8001/api/User');
            const accountsData = Array.isArray(response.data) 
                ? response.data 
                : response.data.data || [];
            setAccounts(accountsData);
        } catch (err) {
            console.error("Lỗi khi tải tài khoản:", err);
            setError('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
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
            [name]: name === 'wallet' ? parseFloat(value) || 0 : value,
        }));
    };

    const deleteAccount = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8001/api/User/${id}`);
            showNotificationMessage('Xóa tài khoản thành công!', 'success');
            // Tải lại danh sách sau khi xóa
            setTimeout(() => fetchAccounts(), 500);
        } catch (err) {
            console.error("Lỗi khi xóa tài khoản:", err);
            showNotificationMessage('Không thể xóa tài khoản. Vui lòng thử lại sau.', 'error');
        }
    };

    const updateAccount = async () => {
        try {
          // 1. Gọi API cập nhật trên server
          const response = await axios.put(
            `http://127.0.0.1:8001/api/User/${formValues.id}`,
            { wallet: formValues.wallet },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );
      
          // 2. Cập nhật trong AuthContext (giống AccountDetailPage)
          const success = await updateWallet(response.data.wallet);
          
          if (!success) {
            throw new Error('Cập nhật ví không thành công');
          }
      
      
          showNotificationMessage('Cập nhật ví thành công!', 'success');
          resetForm();
          
        } catch (err) {
          console.error("Lỗi khi cập nhật ví:", err);
          const errorMessage = err.response?.data?.message 
            || 'Không thể cập nhật ví. Vui lòng thử lại sau.';
          showNotificationMessage(errorMessage, 'error');
        }
      };

    const resetForm = () => {
        setFormValues({
            id: '',  
            email: '',
            wallet: 0,
        });
    };

    const editAccount = (account) => {
        setFormValues({
            id: account.id,
            email: account.email,
            wallet: account.wallet || 0
        });
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading-container"><p className="loading-message">Đang tải danh sách tài khoản...</p></div>;
        }

        if (error && !showNotification) {
            return <div className="message-container"><p className="error-message">{error}</p></div>;
        }

        if (accounts.length === 0) {
            return <div className="message-container"><p className="empty-message">Không có tài khoản nào.</p></div>;
        }

        return (
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Ví tiền</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.email || 'Không có email'}</td>
                                <td>{(account.wallet || 0).toLocaleString('vi-VN', { 
                                    style: 'currency', 
                                    currency: 'VND' 
                                })}</td>
                                <td>
                                    <button 
                                        onClick={() => editAccount(account)} 
                                        className="edit-button"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button 
                                        onClick={() => deleteAccount(account.id)} 
                                        className="delete-button"
                                    >
                                        Xóa
                                    </button>
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
                <h2>Quản lý tài khoản người dùng</h2>
            </div>
            
            {/* Thông báo popup */}
            {showNotification && (
                <div className={`notification ${successMessage ? 'success' : 'error'}`}>
                    {successMessage || error}
                </div>
            )}

            <div className="form-container">
                <form className="account-form">
                    <h3>{formValues.id ? 'Chỉnh sửa tài khoản' : 'Chọn tài khoản để chỉnh sửa'}</h3>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Ví tiền (VND)</label>
                        <input
                            type="number"
                            name="wallet"
                            placeholder="Số dư ví"
                            value={formValues.wallet}
                            onChange={handleInputChange}
                            min="0"
                            step="1000"
                        />
                    </div>
                    
                    <div className="form-actions">
                        {formValues.id ? (
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
                            <p className="form-hint">Vui lòng chọn tài khoản từ danh sách để chỉnh sửa</p>
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

export default AdminUsersPage;