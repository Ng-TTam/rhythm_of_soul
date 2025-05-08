import React from 'react';

interface Writer {
  id: number;
  profile: string;
  name: string;
  email: string;
  dob: string;
  songs: number;
  albums: number;
}

interface AdminUserProps {
  writers: Writer[];
}

export default function AdminUser({ writers }: AdminUserProps) {
  return (
    <div className="content-inner container-fluid pb-0" id="page_layout">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <h4 className="mb-0">Writer List</h4>
                <button
                  className="btn btn-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvaswriter"
                  aria-controls="offcanvaswriter"
                >
                  + Add New Writer
                </button>
              </div>
            </div>

            <div className="card-body px-0">
              <div className="table-data-top table-responsive">
                <table className="table mb-0" id="datatable">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Profile</th>
                      <th>Writer Name</th>
                      <th>Email</th>
                      <th>Date Of Birth</th>
                      <th>Songs</th>
                      <th>Albums</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {writers.map((writer, index) => (
                      <tr key={writer.id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={writer.profile} className="img-fluid rounded-3" alt="writer" />
                        </td>
                        <td>{writer.name}</td>
                        <td>{writer.email}</td>
                        <td>{writer.dob}</td>
                        <td>{writer.songs}</td>
                        <td>{writer.albums}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <a className="btn btn-soft-primary btn-icon btn-sm rounded-pill" href="#" role="button">
                              <i className="bi bi-pencil"></i>
                            </a>
                            <a className="btn btn-soft-danger btn-icon btn-sm rounded-pill" href="#" role="button">
                              <i className="bi bi-trash"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
