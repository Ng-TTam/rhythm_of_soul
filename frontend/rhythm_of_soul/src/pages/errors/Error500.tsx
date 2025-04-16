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
      {/* <!-- Library Bundle Script -->
    <script src="assets/js/core/libs.min.js"></script>
    <!-- Plugin Scripts -->

    <!-- Slider-tab Script -->
    <script src="assets/js/plugins/slider-tabs.js"></script>
    <!-- Lodash Utility -->
    <script src="assets/vendor/lodash/lodash.min.js"></script>
    <!-- Utilities Functions -->
    <script src="assets/js/iqonic-script/utility.min.js"></script>
    <!-- Settings Script -->
    <script src="assets/js/iqonic-script/setting.min.js"></script>
    <!-- Settings Init Script -->
    <script src="assets/js/setting-init.js"></script>
    <!-- External Library Bundle Script -->
    <script src="assets/js/core/external.min.js"></script>
    <!-- Widgetchart Script -->
    <script src="assets/js/charts/widgetchartsf700.js?v=1.0.1" defer></script>
    <!-- Dashboard Script -->
    <script src="assets/js/charts/dashboardf700.js?v=1.0.1" defer></script>
    <!-- Music Player -->
    <script src="assets/js/music-playerf700.js?v=1.0.1" defer></script>
    <!-- qompacui Script -->
    <script src="assets/js/muzikf700.js?v=1.0.1" defer></script>
    <script src="assets/js/sidebarf700.js?v=1.0.1" defer></script> */}
    </>
  );
}
