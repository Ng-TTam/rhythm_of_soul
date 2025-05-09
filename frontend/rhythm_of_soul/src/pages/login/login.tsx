import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Account } from "../../model/account";
import { Tooltip } from 'bootstrap';
import { useAppDispatch } from '../../store/hook';
import Swal from 'sweetalert2'; 
import { login } from "../../services/api/authService";

const LoginForm: React.FC = () => {
  const [form, setForm] = useState<Account>({
    email: "",
    password: "",
    remember: false,
  });
  const dispatch = useAppDispatch();
  

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await LoginService.verifyToken();
  //       if (res.result.valid) {
  //         dispatch(setToken({ accessToken: res.result.token }));
  //         navigate("/");// đã đăng nhập, chuyển hướng sang trang chính
  //       }
  //     } catch (err) {
  //       // Token không hợp lệ hoặc không tồn tại
  //       console.log("Token không hợp lệ hoặc không tồn tại");
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email.endsWith("@gmail.com")) {
      newErrors.email = "Email phải kết thúc bằng @gmail.com";
      valid = false;
    }

    if (form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, [errors]); // Make sure this runs when the `errors` state changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await login(form);
      if (response.code === 200) {
        console.log("Token: " + response.result.token); 
        
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            navigate("/");
          }
        })
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Tài khoản hoặc mật khẩu không đúng',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ff4545',
      });
    }
  };

  return (
    <>
      <div>
        {/* loader END */}
        <div className="wrapper">
          <section className="login-content overflow-hidden">
            <div className="row no-gutters align-items-center bg-white">
              <div className="col-md-12 col-lg-6 align-self-center">
                <a href="../index-2.html" className="navbar-brand d-flex align-items-center mb-3 justify-content-center text-primary">
                  <svg width={250} height={150} viewBox="0 0 406 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M248.381 54.6V110H234.281V103C232.481 105.4 230.115 107.3 227.181 108.7C224.315 110.033 221.181 110.7 217.781 110.7C213.448 110.7 209.615 109.8 206.281 108C202.948 106.133 200.315 103.433 198.381 99.9C196.515 96.3 195.581 92.0333 195.581 87.1V54.6H209.581V85.1C209.581 89.5 210.681 92.9 212.881 95.3C215.081 97.6333 218.081 98.8 221.881 98.8C225.748 98.8 228.781 97.6333 230.981 95.3C233.181 92.9 234.281 89.5 234.281 85.1V54.6H248.381ZM279.995 98.5H304.695V110H264.095V98.7L288.295 66.1H264.195V54.6H304.395V65.9L279.995 98.5ZM327.634 48C325.168 48 323.101 47.2333 321.434 45.7C319.834 44.1 319.034 42.1333 319.034 39.8C319.034 37.4667 319.834 35.5333 321.434 34C323.101 32.4 325.168 31.6 327.634 31.6C330.101 31.6 332.134 32.4 333.734 34C335.401 35.5333 336.234 37.4667 336.234 39.8C336.234 42.1333 335.401 44.1 333.734 45.7C332.134 47.2333 330.101 48 327.634 48ZM334.534 54.6V110H320.534V54.6H334.534ZM386.166 110L367.366 86.4V110H353.366V36H367.366V78.1L385.966 54.6H404.166L379.766 82.4L404.366 110H386.166Z" fill="#222428" />
                    <path d="M113.739 140.54C113.664 140.54 113.588 140.54 113.513 140.535C105.778 140.432 99.4526 135.037 98.1369 127.41L83.5779 43.0637L71.3217 102.441C69.6582 110.52 62.9942 115.952 54.742 115.952C54.7325 115.952 54.7325 115.952 54.7325 115.952C46.4803 115.957 39.8166 110.529 38.1433 102.451L34.0924 82.8872C33.7636 81.2893 32.335 80.1287 30.6996 80.1287C26.9775 80.1287 23.9604 77.1116 23.9604 73.3896C23.9604 69.6675 26.9775 66.6505 30.6996 66.6505C38.6793 66.6505 45.6533 72.3274 47.2888 80.1426L51.3397 99.7157C51.8378 102.122 53.6801 102.479 54.7325 102.479C55.7853 102.479 57.6276 102.122 58.1257 99.7157L71.6415 34.2241C72.8446 28.3543 77.8918 24.4446 83.879 24.4162C89.8755 24.5149 94.7724 28.7067 95.7873 34.6141L111.408 125.116C111.634 126.39 112.395 127.048 113.692 127.067C115.008 127.005 115.769 126.455 116.023 125.187L137.744 16.8734C138.938 10.9803 144.248 7.03752 149.953 7C155.959 7.07504 160.875 11.253 161.909 17.1651L176.919 102.103C177.567 105.764 175.124 109.26 171.458 109.909C167.849 110.548 164.305 108.118 163.647 104.444L149.728 25.6569L129.238 127.833C127.734 135.342 121.38 140.54 113.739 140.54ZM15.6058 73.7222C15.6058 78.0317 12.1123 81.5251 7.8029 81.5251C3.49345 81.5251 0 78.0317 0 73.7222C0 69.4128 3.49345 65.9193 7.8029 65.9193C12.1123 65.9193 15.6058 69.4128 15.6058 73.7222Z" fill="#FF4545" />
                    <path d="M7.8029 81.5252C12.1123 81.5252 15.6058 78.0318 15.6058 73.7223C15.6058 69.4129 12.1123 65.9194 7.8029 65.9194C3.49345 65.9194 0 69.4129 0 73.7223C0 78.0318 3.49345 81.5252 7.8029 81.5252Z" fill="#FF4545" />
                  </svg>
                </a>
                <div className="row justify-content-center pt-5">
                  <div className="col-md-9">
                    <div className="card  d-flex justify-content-center mb-0 auth-card iq-auth-form">
                      <div className="card-body">
                        <h2 className="mb-2 text-center">Sign In</h2>
                        <p className="text-center">Login to stay connected.</p>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                  type="gmail"
                                  name="email"
                                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                  id="email"
                                  onChange={handleChange}
                                  value={form.email}
                                  placeholder="xyz@gmail.com"
                                  title={errors.email} // Tooltip
                                  data-bs-toggle="tooltip"
                                />
                                {errors.email && <small style={{color: 'red'}}>{errors.email}</small>} 
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                  type="password"
                                  name="password"
                                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                  id="password"
                                  onChange={handleChange}
                                  value={form.password}
                                  placeholder="xxxxxx"
                                  title={errors.password} // Tooltip
                                  data-bs-toggle="tooltip"
                                />
                                {errors.password && <small style={{color: 'red'}}>{errors.password}</small>} 
                              </div>
                            </div>
                            <div className="col-lg-12 d-flex justify-content-between">
                              <div className="form-check mb-3">
                                <input
                                  type="checkbox"
                                  name="remember" // thêm dòng này
                                  className="form-check-input"
                                  checked={form.remember}
                                  onChange={handleChange}
                                  id="customCheck1"
                                />  
                                <label className="form-check-label" htmlFor="customCheck1">Remember Me</label>
                              </div>
                              <a href="/reset-password">Forgot Password?</a>
                            </div>
                          </div>
                          <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary">Sign In</button>
                          </div>
                          <p className="text-center my-3">or sign in with other accounts?</p>
                          <div className="d-flex justify-content-center">
                            <ul className="list-group list-group-horizontal list-group-flush">
                              <li className="list-group-item border-0 pb-0">
                                <a href="#"><img src="https://templates.iqonic.design/muzik/html/assets/images/brands/gm.svg" alt="gm" loading="lazy" /></a>
                              </li>
                            </ul>
                          </div>
                          <p className="mt-3 text-center">
                            Don’t have an account? <a href="/sign-up" className="text-underline">Click here to sign up.</a>
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-lg-block d-none bg-primary p-0  overflow-hidden">
                <img src="../../assets/images/auth/01.jpg" className="img-fluid gradient-main" alt="images" loading="lazy" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LoginForm;