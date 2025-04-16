import React, { useEffect } from "react";


export default function Error404() {

  useEffect(() => {
    const scripts = [
      "assets/js/core/libs.min.js",
      "assets/js/plugins/slider-tabs.js",
      "assets/vendor/lodash/lodash.min.js",
      "assets/js/iqonic-script/utility.min.js",
      "assets/js/iqonic-script/setting.min.js",
      "assets/js/setting-init.js",
      "assets/js/core/external.min.js",
      "assets/js/charts/widgetchartsf700.js?v=1.0.1",
      "assets/js/charts/dashboardf700.js?v=1.0.1",
      "assets/js/music-playerf700.js?v=1.0.1",
      "assets/js/muzikf700.js?v=1.0.1",
      "assets/js/sidebarf700.js?v=1.0.1",
    ];

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = "/" + src;
      script.defer = true;
      document.body.appendChild(script);
    });
  }, []);

  return (
    <>
      {/* <div id="loading">
        <div className="loader simple-loader">
          <div className="loader-body">
            <img
              src="assets/images/loader.gif"
              alt="loader"
              className="img-fluid"
            />
          </div>
        </div>
      </div> */}

      <div className="wrapper">
        <div className="vh-100">
          <div className="container">
            <div className="row align-items-center align-self-center vh-100">
              <div className="col-sm-12 text-center">
                <img
                  src="assets/images/error/06.png"
                  className="img-fluid w-50"
                />
                <h2 className="mb-0 mt-4">Oops! This Page is Not Found.</h2>
                <p className="mt-2 mb-4">The requested page dose not exist.</p>
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
