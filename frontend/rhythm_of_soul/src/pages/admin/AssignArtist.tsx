import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../components/Pagination';
import { Toast } from 'primereact/toast';
import '../../styles/toast.css';
import { getAssignArtist, upgradeArtist, revokeArtist } from '../../services/api/userService';
import { User } from '../../model/profile/UserProfile';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // nếu chưa có theme
import { useDebounce } from '../feed/hooks/useDebounce';


export default function AssignArtist() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState('');
  const pageSize = 5;
  const toast = useRef<Toast>(null);
  const [status, setStatus] = useState<string>('');
  const debouncedSearchKey = useDebounce(searchKey, 2000); // sau 2s mới gọi


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssignArtist(currentPage, pageSize, searchKey, status || undefined);
      setUsers(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Server error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchKey, status]);

  const handleAssign = async (userId: string) => {
    try {
      const res = await upgradeArtist(userId);

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: res.message || 'Assigned artist role.',
        life: 3000,
        className: 'custom-success-toast'
      });

      fetchUsers();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to assign artist role.',
        life: 3000,
        className: 'custom-error-toast'
      });
      console.error('Error upgrading artist:', error);
    }
  };

  const handleRevoke = async (userId: string) => {
    // TODO: gọi API thu hồi quyền ARTIST
    try {
      const res = await revokeArtist(userId);

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: res.message || 'Revoke artist role.',
        life: 3000,
        className: 'custom-success-toast'
      });

      fetchUsers();
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to assign artist role.',
        life: 3000,
        className: 'custom-error-toast'
      });
      console.error('Error upgrading artist:', error);
    }
  };

  const confirmAssign = (userId: string) => {
    const selectedUser = users.find(u => u.id === userId);

    confirmDialog({
      message: (
        <div className="text-left">
          <div className="flex items-center gap-3 text-danger fw-bold mb-3">
            <i className="pi pi-user-plus text-red-500 text-2xl animate-pulse"></i>
            <span>Are you sure you want to assign the artist role?</span>
          </div>

          {selectedUser?.artistProfile && (
            <div className="mt-2 border-top pt-2">
              <p><strong>Stage Name:</strong> {selectedUser.artistProfile.stageName}</p>
              <p><strong>Bio:</strong> {selectedUser.artistProfile.bio}</p>
              {selectedUser.artistProfile.facebookUrl && (
                <p><strong>Facebook:</strong> <a href={selectedUser.artistProfile.facebookUrl} target="_blank" rel="noreferrer">{selectedUser.artistProfile.facebookUrl}</a></p>
              )}
              {selectedUser.artistProfile.instagramUrl && (
                <p><strong>Instagram:</strong> <a href={selectedUser.artistProfile.instagramUrl} target="_blank" rel="noreferrer">{selectedUser.artistProfile.instagramUrl}</a></p>
              )}
              {selectedUser.artistProfile.youtubeUrl && (
                <p><strong>YouTube:</strong> <a href={selectedUser.artistProfile.youtubeUrl} target="_blank" rel="noreferrer">{selectedUser.artistProfile.youtubeUrl}</a></p>
              )}
            </div>
          )}
        </div>
      ),
      header: (
        <div className="d-flex align-items-center gap-2 text-red-600">
          <i className="pi pi-star-fill text-2xl"></i>
          <span className="fw-bold">Confirm Assign</span>
        </div>
      ),
      acceptLabel: "Confirm",
      rejectLabel: "Cancel",
      accept: () => handleAssign(userId),
      breakpoints: { "960px": "75vw", "640px": "90vw" },
      acceptClassName: "bg-danger text-white fw-bold px-5 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105",
      rejectClassName: "bg-gray-300 text-gray-800 fw-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition-transform transform hover:scale-105",
    });
  };


  const confirmRevoke = (userId: string) => {
    confirmDialog({
      message: (
        <div className="flex items-center gap-3 text-warning fw-bold">
          <i className="pi pi-user-minus text-orange-500 text-3xl animate-bounce"></i>
          <span>Are you sure you want to revoke the artist role?</span>
        </div>
      ),
      header: (
        <div className="d-flex align-items-center gap-2 text-orange-600">
          <i className="pi pi-exclamation-circle text-2xl"></i>
          <span className="fw-bold">Confirm Revoke</span>
        </div>
      ),
      acceptLabel: "Confirm",
      rejectLabel: "Cancel",
      accept: () => handleRevoke(userId),
      breakpoints: { "960px": "75vw", "640px": "90vw" },
      acceptClassName: "bg-warning text-white fw-bold px-5 py-2 rounded-lg shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105",
      rejectClassName: "bg-gray-300 text-gray-800 fw-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition-transform transform hover:scale-105",
    });
  };


  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
              <h4 className="mb-0">Assign Artist Role</h4>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap px-3 py-2 gap-3">
              <div className="flex-grow-1 d-flex align-items-center gap-2" style={{ minWidth: 300 }}>
                <label htmlFor="search" className="form-label mb-0"><strong>Search:</strong></label>
                <input
                  id="search"
                  type="text"
                  className="form-control w-100"
                  placeholder="Enter name or email"
                  value={searchKey}
                  onChange={(e) => {
                    setSearchKey(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>
              <div className="d-flex gap-3 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="roleFilter" className="form-label mb-0"><strong>Status:</strong></label>
                  <select id="roleFilter" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
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
                      <th>Full Name</th>
                      <th>Date of Birth</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Role</th>
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
                          <td>{user.firstName + " " + user.lastName || 'N/A'}</td>
                          <td>{user.dateOfBirth}</td>
                          <td>{user.gender}</td>
                          <td>{user.phoneNumber || 'N/A'}</td>
                          <td>
                            <span className={`badge ${user.artist ? 'bg-info' : 'bg-secondary'} text-white align-middle`}>
                              {user.artist ? 'Artist' : 'User'}
                            </span>
                          </td>
                          <td>
                            {!user.artist ? (
                              <button
                                className="btn btn-success btn-sm rounded-pill d-flex align-items-center gap-1"
                                style={{ padding: '0.25rem 0.5rem' }}
                                onClick={() => confirmAssign(user.id)}
                              >
                                <FontAwesomeIcon icon={faUserPlus} />
                                Assign
                              </button>
                            ) : (
                              <button className="btn btn-warning btn-sm rounded-pill" onClick={() => confirmRevoke(user.id)}>
                                <FontAwesomeIcon icon={faUserMinus} className="me-1" />
                                Revoke
                              </button>
                            )}
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
  );
}
