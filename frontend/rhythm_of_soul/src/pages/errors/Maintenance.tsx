import React from "react";

export default function Maintenance() {
  return (
    <>
      {/* <div id="loading">
        <div className="loader simple-loader">
          <div className="loader-body ">
            <img
              src="assets/images/loader.gif"
              alt="loader"
              className=" img-fluid "
            />
          </div>
        </div>
      </div> */}

      <div className="wrapper">
        <div className="error-bg vh-100">
          <div className="container">
            <div className="row align-items-center align-self-center vh-100">
              <div className="col-lg-7 md-lg-0">
                <img src="assets/images/error/08.png" className="img-fluid" />
              </div>
              <div className="col-lg-5 text-end">
                <h2 className="mb-0 mt-4">
                  Hang on! We are under maintenance{" "}
                </h2>
                <p className="mt-2 mb-4">
                  It will not take a long time till we get the error fiked. We
                  wii live again in
                </p>
                <a className="btn btn-primary" href="../index-2.html">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
