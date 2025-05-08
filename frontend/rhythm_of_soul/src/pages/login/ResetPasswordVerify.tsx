import React, { useState } from "react";
import Swal from "sweetalert2";
import LoginService from "../../services/service";
import { useLocation } from "react-router-dom";

const ResetPasswordVerify: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");

    try {
      const res = await LoginService.resetPasswordVerify({
        email,
        otp,
        newPassword
      });

      if (res.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Mật khẩu đã được đặt lại.",
          confirmButtonColor: "#6f42c1"
        });
      } else {
        throw new Error("Không thể xử lý");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
        confirmButtonColor: "#6f42c1"
      });
    }
  };

  return (
    <div className="wrapper">
      <section className="login-content overflow-hidden">
        <div className="row no-gutters align-items-center bg-white">
          <div className="col-md-12 col-lg-6 align-self-center">
            <div className="row justify-content-center pt-5">
              <div className="col-md-9">
                <div className="card mb-0 auth-card iq-auth-form">
                  <div className="card-body">
                    <p className=" text-center" style={{fontSize: 25}}>Xác nhận đặt lại mật khẩu</p>
                    <form onSubmit={handleSubmit}>

                      <div className="form-group mb-3">
                        <label>OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label>Mật khẩu mới</label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label>Nhập lại mật khẩu</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      {error && <div className="alert alert-danger">{error}</div>}
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          Đặt lại mật khẩu
                        </button>
                      </div>
                    </form>
                    <p className="mt-3 text-center">
                      Quay lại <a href="/login" className="text-underline">Đăng nhập</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="col-lg-6 d-lg-block d-none bg-primary p-0 overflow-hidden">
            <img
              src="../../assets/images/auth/01.jpg"
              className="img-fluid gradient-main"
              alt="images"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordVerify;
