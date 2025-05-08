import React, { useState } from "react";
import Swal from "sweetalert2";
import LoginService from "../../services/service";
import { useNavigate } from "react-router-dom";


const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      setError("Email phải kết thúc bằng @gmail.com");
      return;
    }

    try {
      const res = await LoginService.resetPasswordRequest(email);
      if (res.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Gửi thành công",
          text: "OTP đã được gửi tới email.",
          confirmButtonColor: "#6f42c1"
        }).then(() => {
          navigate("/reset-password/verify", { state: { email } }); // chuyển sang trang verify, truyền email
        });
      } else {
        throw new Error("Không thể xử lý");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể gửi email khôi phục. Vui lòng thử lại.",
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
                    <p className="text-center" style={{fontSize: 30}}>Lấy lại mật khẩu</p>
                    <p className="text-center">Nhập email để nhận otp đặt lại mật khẩu.</p>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${error ? "is-invalid" : ""}`}
                          id="email"
                          placeholder="example@gmail.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
                      </div>
                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                          Gửi otp khôi phục
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

export default ResetPassword;
