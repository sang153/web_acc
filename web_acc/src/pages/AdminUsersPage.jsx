
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAccountsPage.css';

function AdminUsersPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formValues, setFormValues] = useState({
        id: '',
        email: '',
        password: '',
        wallet: 0,
    });

    const handleBack = () => {
        navigate('/admin/dashboard');
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/User');
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
            [name]: name === 'wallet' ? parseFloat(value)|| 0 : value,
        }));
    };


    const deleteAccount = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/User/${id}`);
            setAccounts(accounts.filter(account => account.id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa tài khoản:", err);
            setError('Không thể xóa tài khoản. Vui lòng thử lại sau.');
        }
    };

    const updateAccount = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/User/${formValues.id}`, formValues);
            setAccounts(accounts.map(account => account.id === formValues.id ? formValues : account));
            resetForm();
        } catch (err) {
            console.error("Lỗi khi cập nhật tài khoản:", err);
            setError('Không thể cập nhật tài khoản. Vui lòng thử lại sau.');
        }
    };

    const resetForm = () => {
        setFormValues({
            id:'',  
            email: '',
            password: '',
            wallet: 0,
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
                    <div className="account-card" key={account.email} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <div className="account-title">
                            <strong>Email:</strong> {account.email || 'Không có email'}
                        </div>

                        <div className="account-price">
                            <strong>Wallet:</strong> {(account.wallet || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>
                        <button onClick={() => editAccount(account)} className="edit-button">Chỉnh sửa</button>
                        <button onClick={() => deleteAccount(account.id)} className="delete-button">Xóa</button>
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
                    <h3>Sửa tài khoản</h3>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                        disabled 
                    />
                    <input
                        type="number"
                        name="wallet"
                        placeholder="Ví tiền (VND)"
                        value={formValues.wallet}
                        onChange={handleInputChange}
                        style={{ width: '80%' }} // Thay đổi chiều rộng
                    />
                    <div style={{ display: 'flex' }}>
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

export default AdminUsersPage;