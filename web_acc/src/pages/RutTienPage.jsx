import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './RutTienPage.css';
import axios from 'axios';

function RutTienPage() {
  const { 
    user, 
    wallet, 
    updateWallet,
    isLoggedIn,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    soTien: '',
    soTaiKhoanMomo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.soTien || isNaN(formData.soTien)) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }

    const soTien = parseFloat(formData.soTien);
    
    if (soTien < 50000) {
      setError('Số tiền rút tối thiểu là 50,000 VNĐ');
      return false;
    }

    if (soTien > wallet) {
      setError('Số tiền rút không được vượt quá số dư ví');
      return false;
    }

    if (!formData.soTaiKhoanMomo) {
      setError('Vui lòng nhập số tài khoản Momo');
      return false;
    }

    setError(null);
    return true;
  };

    const saveWithdrawalRequest = (requestData) => {
        try {
        // Get existing requests or initialize empty array
        const existingRequests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
        
        // Add new request with timestamp
        const newRequest = {
            ...requestData,
            id: Date.now(), // Use timestamp as unique ID
            timestamp: new Date().toISOString(),
            status: 'pending' // Initial status
        };
        
        // Save back to localStorage
        localStorage.setItem('withdrawalRequests', JSON.stringify([...existingRequests, newRequest]));
        
        return newRequest;
        } catch (error) {
        console.error('Error saving withdrawal request:', error);
        throw error;
        }
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const confirmWithdrawal = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    
    try {
      const response = await axios.post('/api/rut-tien', {
        amount: parseFloat(formData.soTien),
        momo_account: formData.soTaiKhoanMomo
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (response.data.success) {
        const withdrawalData = {
            userId: user.id,
            username: user.email,
            amount: parseFloat(formData.soTien),
            momoAccount: formData.soTaiKhoanMomo,
            previousBalance: wallet,
            newBalance: response.data.new_balance
        };

        saveWithdrawalRequest(withdrawalData);
        
        updateWallet(response.data.new_balance);
        
        setShowSuccessModal(true);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Lỗi khi rút tiền:', err);
      setError(err.response?.data?.message || err.message || 'Rút tiền thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="rut-tien-page">
        <div className="content-wrapper">
          <Alert variant="warning">
            Vui lòng đăng nhập để sử dụng tính năng rút tiền
          </Alert>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="rut-tien-page">
        <div className="content-wrapper">
          <Alert variant="danger">
            Tài khoản admin không thể sử dụng tính năng rút tiền
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="rut-tien-page">
      <div className="content-wrapper">
        <h1 className="page-title">Rút tiền từ ví</h1>
        
        <div className="withdrawal-form">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username" className="form-group">
              <Form.Label>Tên tài khoản</Form.Label>
              <Form.Control 
                type="text" 
                value={user?.email || user?.username || ''} 
                readOnly 
                className="form-input"
              />
            </Form.Group>

            <Form.Group controlId="soTien" className="form-group">
              <Form.Label>Số tiền muốn rút (VNĐ)</Form.Label>
              <Form.Control
                type="number"
                name="soTien"
                value={formData.soTien}
                onChange={handleChange}
                placeholder="Nhập số tiền muốn rút"
                min="50000"
                className="form-input"
              />
            </Form.Group>

            <Form.Group controlId="soTaiKhoanMomo" className="form-group">
              <Form.Label>Số tài khoản Momo</Form.Label>
              <Form.Control
                type="text"
                name="soTaiKhoanMomo"
                value={formData.soTaiKhoanMomo}
                onChange={handleChange}
                placeholder="Nhập số điện thoại đăng ký Momo"
                className="form-input"
              />
            </Form.Group>

            {error && (
              <Alert variant="danger" className="error-message">
                {error}
              </Alert>
            )}

            <div className="wallet-info">
              <span>Số dư ví hiện tại:</span>
              <span className="wallet-balance">
                {wallet.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </span>
            </div>

            <div className="action-buttons">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Đang xử lý...
                  </>
                ) : (
                  'Xác nhận rút tiền'
                )}
              </Button>
            </div>
          </Form>

          <div className="withdrawal-notice">
            <h5>Lưu ý quan trọng:</h5>
            <ul>
              <li>Số tiền rút tối thiểu: 50,000 VNĐ</li>
              <li>Phí rút tiền: 0% (miễn phí)</li>
              <li>Tiền sẽ được chuyển về tài khoản Momo của bạn vào thứ 6 hàng tuần</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal xác nhận rút tiền */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header >
          <Modal.Title>Xác nhận rút tiền</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn rút <strong>
            {parseFloat(formData.soTien).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </strong>?</p>
          <p>Số tài khoản Momo nhận tiền: <strong>{formData.soTaiKhoanMomo}</strong></p>
          <p>Số dư ví hiện tại: <strong>
            {wallet.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </strong></p>
          <p>Số dư sau khi rút: <strong>
            {(wallet - parseFloat(formData.soTien)).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={confirmWithdrawal}>
            Xác nhận rút tiền
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal thông báo thành công */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Yêu cầu rút tiền thành công!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <i className="fas fa-check-circle"></i> Yêu cầu rút {parseFloat(formData.soTien).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })} đã được ghi nhận!
          </Alert>
          <p>Số tiền sẽ được chuyển về tài khoản Momo <strong>{formData.soTaiKhoanMomo}</strong> vào thứ 6 hàng tuần.</p>
          <p>Số dư ví hiện tại: <strong>
            {(wallet ).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND'
            })}
          </strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RutTienPage;