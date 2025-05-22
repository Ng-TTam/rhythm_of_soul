import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/Pagination';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import '../../styles/toast.css';
import { getUsers, lockUser, unlockUser } from '../../services/api/accountService';
import { useDebounce } from '../feed/hooks/useDebounce';

interface User {
  id: string;
  avatar: string | null;
  fullName: string;
  email: string;
  role: string;
  status: string | null;
}

export default function AdminUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 3;
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchKey, setSearchKey] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedAccountEmail, setSelectedAccountEmail] = useState<string | null>(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState<string | null>(null);
  const [lockReason, setLockReason] = useState('');
  const toast = useRef<Toast>(null);
    const debouncedSearchKey = useDebounce(searchKey, 2000); // sau 2s mới gọi
  

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(currentPage, pageSize, roleFilter || undefined, statusFilter || undefined, searchKey || undefined);
      if (data.code === 200 && data.result?.content) {
        setUsers(data.result.content);
        setTotalPages(data.result.totalPages);
      } else {
        setError('Failed to load users.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Server error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter, debouncedSearchKey]);

  const handleLockUnlock = async (id: string, status: string | null) => {
    try {
      if (status === 'ACTIVE') {
        await lockUser(id, lockReason);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User locked successfully', life: 3000, className: 'custom-success-toast' });
      } else if (status === 'BANNED') {
        await unlockUser(id);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'User unlocked successfully', life: 3000, className: 'custom-success-toast' });
      }
      await fetchUsers();
    } catch (err) {
      console.error("Failed to lock/unlock user", err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to perform the action', life: 3000, className: 'custom-error-toast' });
    }
  };
  


  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <Toast ref={toast} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
              <h4 className="mb-0">User List</h4>
              <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvaswriter" aria-controls="offcanvaswriter">
                + Add New User
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap px-3 py-2 gap-3">
              <div className="flex-grow-1 d-flex align-items-center gap-2" style={{ minWidth: 300 }}>
                <label htmlFor="search" className="form-label mb-0"><strong>Search:</strong></label>
                <input
                  id="search"
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter email"
                  value={searchKey}
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>

              <div className="d-flex gap-3 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="roleFilter" className="form-label mb-0"><strong>Role:</strong></label>
                  <select id="roleFilter" className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ARTIST">Artist</option>
                    <option value="USER">User</option>
                  </select>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="statusFilter" className="form-label mb-0"><strong>Status:</strong></label>
                  <select id="statusFilter" className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card-body px-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : error ? (
                <div className="alert alert-danger mx-3">{error}</div>
              ) : (
                <div className="table-data-top table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-3">No users found.</td>
                        </tr>
                      ) : (
                        users.map((user, index) => (
                          <tr key={user.id}>
                            <td>{index + 1 + currentPage * pageSize}</td>
                            <td>
                              <img
                                src={user.avatar || "https://via.placeholder.com/40"}
                                alt="avatar"
                                className="img-fluid rounded-3"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </td>
                            <td>{user.fullName || 'N/A'}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${user.role === 'ARTIST' ? 'bg-info text-white' : user.role === 'USER' ? 'bg-dark text-white' : 'bg-secondary text-white'}`}>
                                {user.role.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.status === 'ACTIVE' ? 'bg-success' : user.status === 'BANNED' ? 'bg-primary' : 'bg-secondary'}`}>
                                {user.status || 'UNKNOWN'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {user.status === 'ACTIVE' ? (
                                  <button className="btn btn-danger btn-sm rounded-pill" title="Lock" onClick={() => {
                                    setSelectedUserId(user.id);
                                    setSelectedAccountEmail(user.email);
                                    setSelectedUserStatus(user.status);
                                    setShowConfirmModal(true);
                                  }}>
                                    <FontAwesomeIcon icon={faLock} />
                                  </button>
                                ) : user.status === 'BANNED' ? (
                                  <button className="btn btn-success btn-sm rounded-pill" title="Unlock" onClick={() => handleLockUnlock(user.id, user.status)}>
                                    <FontAwesomeIcon icon={faUnlock} />
                                  </button>
                                ) : (
                                  <span className="text-muted">--</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-end align-items-center p-3">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title w-100 text-center">Confirm Lock</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to lock user: {selectedAccountEmail}?</p>
                <div className="mb-3">
                  <label className="form-label">Reason:</label>
                  <input type="text" className="form-control" value={lockReason} onChange={(e) => setLockReason(e.target.value)} placeholder="Enter reason..." />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (!lockReason.trim()) {
                      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Reason is required!', life: 3000, className: 'custom-error-toast' });
                      return;
                    }
                    if (selectedUserId && selectedUserStatus) {
                      await handleLockUnlock(selectedUserId, selectedUserStatus);
                      setShowConfirmModal(false);
                      setLockReason('');
                    }
                  }}
                >
                  Confirm
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}