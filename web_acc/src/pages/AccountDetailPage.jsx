import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import './AccountDetailPage.css';

function AccountDetailPage() {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, isAdmin, wallet, updateWallet} = useAuth();
    
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactionError, setTransactionError] = useState(null);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const { data } = await axios.get(`http://127.0.0.1:8001/api/taikhoan/${accountId}`);
                
                if (!data) throw new Error('Dữ liệu trống');
                
                setAccountDetails({
                    ...data,
                    MoTa: data.MoTa || 'Không có mô tả chi tiết',
                    GiaBan: data.GiaBan || 0
                });
                
            } catch (err) {
                console.error("Lỗi khi tải chi tiết:", err);
                setError(`Không tải được tài khoản #${accountId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [accountId]);

    const handleBuyClick = () => {
        if (!isLoggedIn) {
            const confirmLogin = window.confirm(
                'Bạn cần đăng nhập để mua tài khoản. Đến trang đăng nhập ngay?'
            );
            if (confirmLogin) {
                navigate('/login', { state: { from: `/accounts/${accountId}` } });
            }
            return;
        }
        
        // Kiểm tra số dư ví trước khi hiển thị xác nhận
        if (wallet < accountDetails.GiaBan) {
            setTransactionError('Số dư ví không đủ để mua tài khoản này');
            return;
        }
        
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setTransactionLoading(true);
        setTransactionError(null);
        
        try {
            const response = await axios.post(
                `http://127.0.0.1:8001/api/taikhoan/${accountId}/mua`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            // Lưu thông tin đăng nhập tài khoản đã mua
            setCredentials({
                username: response.data.taiKhoan.TenTaiKhoan,
                password: response.data.taiKhoan.MatKhauTaiKhoan
            });

            // Cập nhật số dư ví
            updateWallet(response.data.soDuConLai || wallet - accountDetails.GiaBan);
            
            // Hiển thị modal thành công
            setShowSuccessModal(true);
            
            // Cập nhật trạng thái tài khoản
            setAccountDetails(prev => ({
                ...prev,
                TrangThai: 1 // Đánh dấu đã bán
            }));

        } catch (error) {
            console.error('Lỗi khi mua tài khoản:', error);
            setTransactionError(error.response?.data?.message || 'Mua tài khoản thất bại');
        } finally {
            setTransactionLoading(false);
        }
    };

    const renderDetailContent = () => {
        if (loading) {
            return <div className="text-center my-5"><Spinner animation="border" /></div>;
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (!accountDetails) {
            return <Alert variant="warning">Không tìm thấy thông tin tài khoản</Alert>;
        }

        return (
            <div className="account-details-container">
                <div className="game-info-section">
                    <h3>
                        <span className="game-icon">🎮</span> 
                        {accountDetails.MaGame === 1 ? 'Liên Minh Huyền Thoại' : 'Game #' + accountDetails.MaGame}
                    </h3>
                </div>

                <div className="main-info">
                    <h2>Tài khoản #{accountDetails.MaTaiKhoan}</h2>
                    
                    <div className="detail-section">
                        <h3 className="section-title">Thông tin chi tiết</h3>
                        <p className="full-description">{accountDetails.MoTa}</p>
                    </div>

                    <div className="price-section">
                        <h3 className="section-title inline-title">Giá bán: 
                            <span className="price-value">
                                {accountDetails.GiaBan.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </span>
                        </h3>
                        {isLoggedIn && (
                            <p className="wallet-balance">
                                Số dư ví của bạn: {wallet.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </p>
                        )}
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className={`buy-button ${accountDetails.TrangThai === 1 ? 'sold' : ''}`}
                        onClick={handleBuyClick}
                        disabled={accountDetails.TrangThai === 1 || transactionLoading || isAdmin}
                    >
                        {transactionLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" /> Đang xử lý...
                            </>
                        ) : accountDetails.TrangThai === 1 ? (
                            'Đã bán'
                        ) : isAdmin ? (
                            'Admin không thể mua'
                        ) : (
                            '🛒 Mua Ngay'
                        )}
                    </button>
                    <Link to="/accounts" className="back-link">
                        ↩ Quay lại danh sách
                    </Link>
                </div>
                
                {transactionError && (
                    <Alert variant="danger" className="mt-3">
                        {transactionError}
                    </Alert>
                )}
            </div>
        );
    };

    return (
        <div className="account-detail-page">
            <h1 className="page-title">
                <span className="title-icon">🔍</span> 
                Chi Tiết Tài Khoản
            </h1>
            
            {renderDetailContent()}
            
            {/* Modal xác nhận mua */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header   >
                    <Modal.Title>Xác nhận mua tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn mua tài khoản này với giá: 
                        <strong> {accountDetails?.GiaBan?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}</strong>?
                    </p>
                    <p>Số dư ví của bạn: 
                        <strong> {wallet?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}</strong>
                    </p>
                    <p>Số dư sau khi mua: 
                        <strong> {(wallet - accountDetails?.GiaBan)?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}</strong>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Hủy bỏ
                    </Button>
                    <Button variant="primary" onClick={confirmPurchase}>
                        Xác nhận mua
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Modal thông báo mua thành công */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header >
                    <Modal.Title>Mua tài khoản thành công!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="purchase-success">
                        <Alert variant="success">
                            <i className="fas fa-check-circle"></i> Giao dịch hoàn tất!
                        </Alert>
                        
                        <div className="credentials-box">
                            <h5>Thông tin đăng nhập:</h5>
                            <div className="credential-item">
                                <span className="credential-label">Tài khoản:</span>
                                <span className="credential-value">{credentials.username}</span>
                            </div>
                            <div className="credential-item">
                                <span className="credential-label">Mật khẩu:</span>
                                <span className="credential-value">{credentials.password}</span>
                            </div>
                        </div>
                        
                        <Alert variant="warning" className="mt-3">
                            <i className="fas fa-exclamation-triangle"></i> Lưu ý quan trọng:
                            <ul className="mt-2">
                                <li>Vui lòng thay đổi mật khẩu ngay sau khi đăng nhập</li>
                                <li>Bạn chỉ có thể xem thông tin này một lần duy nhất</li>
                                <li>Hãy chụp ảnh hoặc sao chép thông tin ra nơi an toàn</li>
                            </ul>
                        </Alert>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={() => {
                        navigator.clipboard.writeText(
                            `Tài khoản: ${credentials.username}\nMật khẩu: ${credentials.password}`
                        );
                        alert('Đã sao chép thông tin vào clipboard!');
                    }}>
                        Sao chép thông tin
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AccountDetailPage;