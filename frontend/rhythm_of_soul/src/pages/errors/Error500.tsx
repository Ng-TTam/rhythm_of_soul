import React from "react";

export default function Error500() {
  return (
    <>
      <div id="loading">
        <div className="loader simple-loader">
          <div className="loader-body ">
            <img
              src="assets/images/loader.gif"
              alt="loader"
              className=" img-fluid "
            />
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className="vh-100">
          <div className="container">
            <div className="row align-items-center align-self-center vh-100">
              <div className="col-sm-12 text-center">
                <img
                  src="assets/images/error/07.png"
                  className="img-fluid w-50"
                />
                <h2 className="mb-0 mt-4 ">Oops! This Page is Not Working.</h2>
                <p className="mt-2 mb-4">
                  The requested is Internal Server Error.
                </p>
                <div className="mt-4">
                  <a className="btn btn-primary" href="../index-2.html">
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
