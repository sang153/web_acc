import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './AdminRutTien.css';
import { useNavigate } from 'react-router-dom';

function AdminRutTienPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  
  useEffect(() => {
    loadWithdrawalRequests();
  }, []);

  const loadWithdrawalRequests = () => {
    try {
      const requests = JSON.parse(localStorage.getItem('withdrawalRequests') || '[]');
      setWithdrawalRequests(requests);
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
      setError('Không thể tải dữ liệu yêu cầu rút tiền');
    }
  };

  const handleCompleteRequest = (requestId) => {
    const request = withdrawalRequests.find(req => req.id === requestId);
    setSelectedRequest(request);
    setShowConfirmModal(true);
  };
    const handleBack = () => {
        navigate('/admin/dashboard');
    };

  const confirmCompleteRequest = () => {
    setLoading(true);
    try {
      const updatedRequests = withdrawalRequests.map(req => {
        if (req.id === selectedRequest.id) {
          return { ...req, status: 'completed', completedAt: new Date().toISOString() };
        }
        return req;
      });

      localStorage.setItem('withdrawalRequests', JSON.stringify(updatedRequests));
      setWithdrawalRequests(updatedRequests);
      setSuccess(`Đã đánh dấu yêu cầu rút ${selectedRequest.amount.toLocaleString()} VNĐ thành công`);
      setShowConfirmModal(false);
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật trạng thái');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xử lý';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark">Đang chờ</Badge>;
      case 'completed':
        return <Badge bg="success">Hoàn thành</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  if (!isAdmin) {
    return (
      <div className="quan-ly-rut-tien-page">
        <div className="content-wrapper">
          <Alert variant="danger">
            Chỉ quản trị viên mới có thể truy cập trang này
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="quan-ly-rut-tien-page">
      <div className="content-wrapper">
        <h1 className="page-title">Quản lý yêu cầu rút tiền</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="withdrawal-requests-table">
          {withdrawalRequests.length === 0 ? (
            <Alert variant="info">Hiện không có yêu cầu rút tiền nào</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người dùng</th>
                  <th>Số tiền</th>
                  <th>Tài khoản Momo</th>
                  <th>Ngày yêu cầu</th>
                  <th>Trạng thái</th>
                  <th>Ngày hoàn thành</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{index + 1}</td>
                    <td>{request.username || request.userId}</td>
                    <td>
                      {request.amount.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </td>
                    <td>{request.momoAccount}</td>
                    <td>{formatDate(request.timestamp)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{formatDate(request.completedAt)}</td>
                    <td>
                      {request.status === 'pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleCompleteRequest(request.id)}
                          disabled={loading}
                        >
                          {loading && selectedRequest?.id === request.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            'Hoàn thành'
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Modal xác nhận hoàn thành yêu cầu */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header>
          <Modal.Title>Xác nhận hoàn thành yêu cầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn đánh dấu yêu cầu này là đã hoàn thành?</p>
          <ul>
            <li>Người dùng: <strong>{selectedRequest?.username}</strong></li>
            <li>Số tiền: <strong>
              {selectedRequest?.amount?.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND'
              })}
            </strong></li>
            <li>Tài khoản Momo: <strong>{selectedRequest?.momoAccount}</strong></li>
          </ul>
          <Alert variant="info">
            Sau khi xác nhận, yêu cầu sẽ được đánh dấu là đã hoàn thành và ẩn khỏi danh sách chờ xử lý.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={confirmCompleteRequest}>
            Xác nhận hoàn thành
          </Button>
        </Modal.Footer>
      </Modal>
        <button 
                onClick={handleBack}
                className="back-button"
                >
                    Quay lại trang Dashboard
        </button>
    </div>
    
  );
}

export default AdminRutTienPage;