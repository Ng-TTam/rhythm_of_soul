import React from 'react'

export default function AdminDashboard() {
    return (
        <>
            <main className="main-content">
                <div className="position-relative ">
                    <nav className="nav navbar navbar-expand-xl navbar-light iq-navbar">
                        <div className="container-fluid navbar-inner">
                            <a href="../index-2.html" className="navbar-brand">

                                <div className="logo-main">
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo.svg" className="logo-normal img-fluid" alt="logo" />
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark.svg" className="logo-normal dark-normal img-fluid" alt="logo-dark" />
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-color.svg" className="logo-normal white-normal img-fluid" alt="logo-color" />
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-mini.svg" className="logo-mini img-fluid" alt="logo-mini" />
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-dark-mini.svg" className="logo-mini dark-mini img-fluid" alt="logo-dark-mini" />
                                    <img src="https://templates.iqonic.design/muzik/html/assets/images/logo-color-mini.svg" className="logo-mini white-mini img-fluid" alt="logo-white-mini" />
                                </div>
                            </a>
                            <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                                <i className="icon d-flex">
                                    <svg className="icon-20" width="20" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                                    </svg>
                                </i>
                            </div>
                            <div className="d-flex align-items-center justify-content-between product-offcanvas">
                                <div className="offcanvas offcanvas-end shadow-none iq-product-menu-responsive" tabIndex={-1} id="offcanvasBottom">
                                    <div className="offcanvas-body">
                                        <ul className="iq-nav-menu list-unstyled">
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page"
                                                    href="../index-2.html">
                                                    <span className="item-name">Home</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page"
                                                    href="../release.html">
                                                    <span className="item-name">Release</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link " aria-current="page"
                                                    href="../albums.html">
                                                    <span className="item-name">Albums</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <button id="navbar-toggle" className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon">
                                        <span className="navbar-toggler-bar bar1 mt-1"></span>
                                        <span className="navbar-toggler-bar bar2"></span>
                                        <span className="navbar-toggler-bar bar3"></span>
                                    </span>
                                </button>
                            </div>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <div className="search-box d-xl-block d-none">
                                    <div className="dropdown">
                                        <div className="search-box-drop" id="search-box-drop" data-bs-toggle="dropdown">
                                            <div className="d-flex align-items-center justify-content-between gap-2">
                                                <div className="search-box-inner">
                                                    <button type="submit" className="search-box-drop-submit">
                                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                            viewBox="0 0 24 24">
                                                            <circle cx="11.7669" cy="11.7666" r="8.98856" stroke="currentColor" stroke-width="1.5"
                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M18.0186 18.4851L21.5426 22" stroke="currentColor" stroke-width="1.5"
                                                                stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <input type="text" placeholder="Search Here..." />
                                                </div>
                                                <div className="flex-shrink-0 search-box-btn">
                                                    <a className="btn  text-capitalize">
                                                        clt + k
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end" aria-labelledby="search-drop">
                                            <li className="">
                                                <div className="p-0 card-body all-notification">
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/64.jpg"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h5">Paige Turner</a>
                                                            <span>Paige001</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/02.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h5">Monty Carlo</a>
                                                            <span>Carlo.m</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center search-hover py-2 px-3 border-bottom">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/03.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h5">Paul Molive</a>
                                                            <span>Paul.45</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/04.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h5">Monty Carlo</a>
                                                            <span>Carlo.m</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <ul className="mb-2 navbar-nav ms-auto align-items-center navbar-list mb-lg-0">
                                    <li className="nav-item dropdown d-xl-none d-block">
                                        <a href="#" className="nav-link" id="search-drop" data-bs-toggle="dropdown">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                                                    transform="rotate(45 17.0365 15.1223)" fill="currentColor"></rect>
                                                <path
                                                    d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </a>
                                        <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end" aria-labelledby="search-drop">
                                            <li className="">
                                                <div className="p-3 card-header justify-content-between border-bottom rounded-top">
                                                    <div className="header-title">
                                                        <div className="iq-search-bar device-search  position-relative">
                                                            <form action="#" className="searchbox">
                                                                <input type="text" className="text search-input form-control bg-soft-primary"
                                                                    placeholder="Search here..." />
                                                                <a className="d-lg-none d-flex" href="javascript:void(0);">
                                                                    <span className="material-symbols-outlined">search</span>
                                                                </a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-0 card-body all-notification">
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/64.jpg"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h6">Alexa Zone</a>
                                                            <span>Muzic Player</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/55.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h6">Karuna Trusaa</a>
                                                            <span>Singer</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center search-hover py-2 px-3 border-bottom">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/56.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h6">Vibrato Ecruct</a>
                                                            <span>Playback</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center border-bottom search-hover py-2 px-3">
                                                        <div className="flex-shrink-0">
                                                            <img src="../../assets/images/dashboard/57.png"
                                                                className="align-self-center img-fluid avatar-50 rounded-pill" alt="#" />
                                                        </div>
                                                        <div className="d-flex flex-column ms-3 w-100">
                                                            <a href="javascript:void(0);" className="h6">Omen Smith</a>
                                                            <span>Singer</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <g clip-path="url(#clip0_549_1300)">
                                                <path d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z" stroke="#AAAAAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M10.1601 16.1023C10.0555 16.1023 9.94999 16.1023 9.84765 16.1023L7.34374 17.5C6.36899 17.1721 5.46489 16.6632 4.6789 16L4.66952 13.1875C4.61405 13.1 4.56171 13.0117 4.51327 12.9211L2.02343 11.5031C1.82731 10.5112 1.82731 9.4904 2.02343 8.49844L4.51093 7.08438C4.56171 6.99453 4.61405 6.90547 4.66718 6.81797L4.67968 4.00547C5.46496 3.34035 6.36883 2.82957 7.34374 2.5L9.84374 3.89766C9.94843 3.89766 10.0539 3.89766 10.1562 3.89766L12.6562 2.5C13.631 2.82788 14.5351 3.33679 15.3211 4L15.3305 6.8125C15.3859 6.9 15.4383 6.98828 15.4867 7.07891L17.975 8.49609C18.1711 9.48806 18.1711 10.5088 17.975 11.5008L15.4875 12.9148C15.4367 13.0047 15.3844 13.0938 15.3312 13.1813L15.3187 15.9938C14.534 16.659 13.6307 17.17 12.6562 17.5L10.1601 16.1023Z" stroke="#AAAAAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_549_1300">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a href="#" className="nav-link p-0 ps-3" id="notification-drop" data-bs-toggle="dropdown">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <g clip-path="url(#clip0_549_1304)">
                                                    <path d="M7.5 15C7.5 15.663 7.76339 16.2989 8.23223 16.7678C8.70107 17.2366 9.33696 17.5 10 17.5C10.663 17.5 11.2989 17.2366 11.7678 16.7678C12.2366 16.2989 12.5 15.663 12.5 15" stroke="#AAAAAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M4.37502 8.125C4.37502 6.63316 4.96766 5.20242 6.02255 4.14752C7.07744 3.09263 8.50818 2.5 10 2.5C11.4919 2.5 12.9226 3.09263 13.9775 4.14752C15.0324 5.20242 15.625 6.63316 15.625 8.125C15.625 10.9234 16.2735 13.1719 16.7891 14.0625C16.8439 14.1574 16.8727 14.2649 16.8728 14.3744C16.8729 14.484 16.8442 14.5916 16.7896 14.6865C16.735 14.7815 16.6565 14.8604 16.5618 14.9154C16.467 14.9705 16.3595 14.9996 16.25 15H3.75002C3.64063 14.9993 3.53333 14.97 3.43884 14.9149C3.34435 14.8597 3.26599 14.7808 3.21158 14.6859C3.15717 14.591 3.12862 14.4835 3.12878 14.3741C3.12895 14.2647 3.15783 14.1572 3.21252 14.0625C3.72737 13.1719 4.37502 10.9227 4.37502 8.125Z" stroke="#AAAAAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    <circle cx="14.2803" cy="2.91665" r="2.58333" fill="#EF3E36" stroke="white" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_549_1304">
                                                        <rect width="20" height="20" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span className="bg-danger dots"></span>
                                        </a>
                                        <ul className="p-0 sub-drop dropdown-menu dropdown-menu-end" aria-labelledby="notification-drop">
                                            <li className="">
                                                <div className="p-3 card-header d-flex justify-content-between bg-primary rounded-top">
                                                    <div className="header-title">
                                                        <h5 className="mb-0 text-white">All Notifications</h5>
                                                    </div>
                                                </div>
                                                <div className="p-0 card-body all-notification">
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="p-1 avatar-40 rounded-pill bg-soft-primary"
                                                                src="../../assets/images/dashboard/24.png" alt="" loading="lazy" />
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">Emma Watson Bni</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">95 MB</p>
                                                                    <small className="float-end font-size-12">Just Now</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <img className="p-1 avatar-40 rounded-pill bg-soft-primary"
                                                                    src="../../assets/images/dashboard/25.png" alt="" loading="lazy" />
                                                            </div>
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">New customer is join</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-end font-size-12">5 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="p-1 avatar-40 rounded-pill bg-soft-primary"
                                                                src="../../assets/images/dashboard/26.png" alt="" loading="lazy" />
                                                            <div className="ms-3 w-100">
                                                                <h6 className="mb-0 ">Two customer is left</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-end font-size-12">2 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="#" className="iq-sub-card">
                                                        <div className="d-flex align-items-center">
                                                            <img className="p-1 avatar-40 rounded-pill bg-soft-primary"
                                                                src="../../assets/images/dashboard/27.png" alt="" loading="lazy" />
                                                            <div className="w-100 ms-3">
                                                                <h6 className="mb-0 ">New Mail from Fenny</h6>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <p className="mb-0">Cyst Bni</p>
                                                                    <small className="float-end font-size-12">3 days ago</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="p-0 ps-3 nav-link d-flex align-items-center position-relative" href="#" id="profile-setting" role="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src="../../assets/images/dashboard/64.jpg" alt="User-Profile"
                                                className="theme-color-default-img img-fluid avatar avatar-40 avatar-rounded" loading="lazy" />
                                            <div className="iq-profile-badge  bg-success"></div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-setting">
                                            <li><a className="dropdown-item" href="../app/user-profile.html">Profile</a></li>
                                            <li><a className="dropdown-item" href="../app/user-privacy-setting.html">Privacy
                                                Setting</a></li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li><a className="dropdown-item" href="../auth/sign-in.html">Logout</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <div className="content-inner container-fluid pb-0" id="page_layout">
                    <div className="row rows-cols-lg-5 rows-cols-md-3">
                        <div className="col">
                            <div className="card card-box bg-soft-danger text-center">
                                <div className="card-body">
                                    <div className="admin-circle-box rounded-pill">
                                        <svg className="text-danger" width="30" height="36" viewBox="0 0 30 36" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g id="Voice 2">
                                                <path id="Stroke 1" d="M15.0004 34.6667V29.3984" stroke="currentColor" stroke-width="1.5"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 3" fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M15.0004 22.747V22.747C11.2602 22.747 8.23071 19.7032 8.23071 15.9471V8.13507C8.23071 4.37903 11.2602 1.3335 15.0004 1.3335C18.7388 1.3335 21.7683 4.37903 21.7683 8.13507V15.9471C21.7683 19.7032 18.7388 22.747 15.0004 22.747Z"
                                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path id="Stroke 5"
                                                    d="M28.3334 16.001C28.3334 23.399 22.3634 29.3971 15 29.3971C7.63491 29.3971 1.66669 23.399 1.66669 16.001"
                                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path id="Stroke 7" d="M18.4482 9.25998H21.7641" stroke="currentColor" stroke-width="1.5"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 9" d="M16.784 14.8225H21.7674" stroke="currentColor" stroke-width="1.5"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <h4 className="text-capitalize mt-4 mb-1">352</h4>
                                    <p className="mb-0 text-capitalize text-body">total Music Artist</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-box bg-soft-warning text-center">
                                <div className="card-body">
                                    <div className="admin-circle-box rounded-pill">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-warning" width="41" height="41"
                                            viewBox="0 0 41 41" fill="none">
                                            <path
                                                d="M20.3962 4.31787C17.1823 4.31787 14.0405 5.27092 11.3682 7.05649C8.69593 8.84206 6.61313 11.38 5.38321 14.3493C4.15328 17.3186 3.83148 20.5859 4.45849 23.7381C5.0855 26.8903 6.63316 29.7858 8.90576 32.0584C11.1784 34.331 14.0738 35.8786 17.226 36.5056C20.3782 37.1326 23.6456 36.8108 26.6149 35.5809C29.5842 34.351 32.1221 32.2682 33.9076 29.5959C35.6932 26.9236 36.6462 23.7818 36.6462 20.5679C36.6417 16.2595 34.9282 12.1289 31.8817 9.08241C28.8352 6.03593 24.7046 4.32242 20.3962 4.31787ZM20.3962 34.3179C17.6768 34.3179 15.0183 33.5114 12.7572 32.0006C10.496 30.4897 8.73361 28.3423 7.6929 25.8298C6.6522 23.3173 6.3799 20.5526 6.91045 17.8854C7.441 15.2181 8.75056 12.7681 10.6735 10.8452C12.5965 8.92218 15.0465 7.61262 17.7138 7.08207C20.381 6.55153 23.1457 6.82382 25.6581 7.86453C28.1706 8.90523 30.3181 10.6676 31.829 12.9288C33.3398 15.19 34.1462 17.8484 34.1462 20.5679C34.1421 24.2133 32.6921 27.7083 30.1144 30.286C27.5367 32.8638 24.0417 34.3137 20.3962 34.3179ZM20.3962 11.8179C18.0764 11.8204 15.8522 12.743 14.2118 14.3834C12.5714 16.0238 11.6487 18.248 11.6462 20.5679C11.6462 20.8994 11.5146 21.2173 11.2801 21.4518C11.0457 21.6862 10.7278 21.8179 10.3962 21.8179C10.0647 21.8179 9.74678 21.6862 9.51236 21.4518C9.27794 21.2173 9.14625 20.8994 9.14625 20.5679C9.14956 17.5852 10.3359 14.7256 12.445 12.6166C14.554 10.5075 17.4136 9.32118 20.3962 9.31787C20.7278 9.31787 21.0457 9.44957 21.2801 9.68399C21.5146 9.91841 21.6462 10.2364 21.6462 10.5679C21.6462 10.8994 21.5146 11.2173 21.2801 11.4518C21.0457 11.6862 20.7278 11.8179 20.3962 11.8179ZM31.6462 20.5679C31.6429 23.5505 30.4566 26.4101 28.3475 28.5192C26.2385 30.6282 23.3789 31.8146 20.3962 31.8179C20.0647 31.8179 19.7468 31.6862 19.5124 31.4518C19.2779 31.2173 19.1462 30.8994 19.1462 30.5679C19.1462 30.2364 19.2779 29.9184 19.5124 29.684C19.7468 29.4496 20.0647 29.3179 20.3962 29.3179C22.7161 29.3154 24.9403 28.3927 26.5807 26.7523C28.2211 25.1119 29.1438 22.8878 29.1462 20.5679C29.1462 20.2364 29.2779 19.9184 29.5124 19.684C29.7468 19.4496 30.0647 19.3179 30.3962 19.3179C30.7278 19.3179 31.0457 19.4496 31.2801 19.684C31.5146 19.9184 31.6462 20.2364 31.6462 20.5679ZM25.3962 20.5679C25.3962 19.579 25.103 18.6123 24.5536 17.79C24.0042 16.9678 23.2233 16.3269 22.3097 15.9485C21.396 15.57 20.3907 15.471 19.4208 15.6639C18.4509 15.8569 17.56 16.3331 16.8607 17.0323C16.1615 17.7316 15.6852 18.6225 15.4923 19.5924C15.2994 20.5623 15.3984 21.5677 15.7768 22.4813C16.1553 23.3949 16.7962 24.1758 17.6184 24.7252C18.4406 25.2746 19.4073 25.5679 20.3962 25.5679C21.7223 25.5679 22.9941 25.0411 23.9318 24.1034C24.8695 23.1657 25.3962 21.894 25.3962 20.5679ZM17.8962 20.5679C17.8962 20.0734 18.0429 19.5901 18.3176 19.1789C18.5923 18.7678 18.9827 18.4474 19.4395 18.2582C19.8964 18.069 20.399 18.0194 20.884 18.1159C21.3689 18.2124 21.8144 18.4505 22.164 18.8001C22.5136 19.1497 22.7517 19.5952 22.8482 20.0801C22.9447 20.5651 22.8952 21.0678 22.7059 21.5246C22.5167 21.9814 22.1963 22.3718 21.7852 22.6465C21.3741 22.9212 20.8907 23.0679 20.3962 23.0679C19.7332 23.0679 19.0973 22.8045 18.6285 22.3356C18.1596 21.8668 17.8962 21.2309 17.8962 20.5679Z"
                                                fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h4 className="text-capitalize mt-4 mb-1">987</h4>
                                    <p className="mb-0 text-capitalize text-body">total Music albums</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-box bg-soft-info text-center">
                                <div className="card-body">
                                    <div className="admin-circle-box rounded-pill">
                                        <svg xmlns="http://www.w3.org/2000/svg" className=" text-info" width="41" height="41"
                                            viewBox="0 0 41 41" fill="none">
                                            <path
                                                d="M33.9453 4.74885C33.7955 4.63218 33.6212 4.55114 33.4355 4.51188C33.2498 4.47263 33.0575 4.47619 32.8734 4.52229L12.8734 9.52229C12.603 9.58988 12.3629 9.74593 12.1913 9.96562C12.0198 10.1853 11.9266 10.456 11.9265 10.7348V27.9348C10.8838 27.2381 9.63807 26.9098 8.38737 27.0021C7.13667 27.0945 5.9527 27.6021 5.02356 28.4444C4.09442 29.2867 3.4734 30.4154 3.25918 31.651C3.04496 32.8867 3.24983 34.1585 3.84122 35.2644C4.43261 36.3703 5.37662 37.2469 6.52325 37.7548C7.66988 38.2628 8.95338 38.373 10.1698 38.0679C11.3862 37.7628 12.4658 37.06 13.2371 36.0711C14.0083 35.0822 14.427 33.8639 14.4265 32.6098V19.2114L31.9265 14.8364V22.9348C30.8838 22.2381 29.6381 21.9098 28.3874 22.0021C27.1367 22.0945 25.9527 22.6021 25.0236 23.4444C24.0944 24.2867 23.4734 25.4154 23.2592 26.651C23.045 27.8867 23.2498 29.1585 23.8412 30.2644C24.4326 31.3703 25.3766 32.2469 26.5233 32.7548C27.6699 33.2628 28.9534 33.373 30.1698 33.0679C31.3862 32.7628 32.4658 32.06 33.2371 31.0711C34.0083 30.0822 34.427 28.8639 34.4265 27.6098V5.73479C34.4266 5.54467 34.3832 5.35705 34.2998 5.1862C34.2164 5.01535 34.0952 4.86577 33.9453 4.74885ZM8.80151 35.7348C8.18345 35.7348 7.57926 35.5515 7.06536 35.2081C6.55145 34.8647 6.15091 34.3767 5.91439 33.8057C5.67787 33.2347 5.61598 32.6063 5.73656 32.0001C5.85714 31.3939 6.15477 30.8371 6.5918 30.4001C7.02884 29.963 7.58567 29.6654 8.19186 29.5448C8.79805 29.4243 9.42638 29.4861 9.9974 29.7227C10.5684 29.9592 11.0565 30.3597 11.3999 30.8736C11.7432 31.3875 11.9265 31.9917 11.9265 32.6098C11.9265 33.4386 11.5973 34.2334 11.0112 34.8195C10.4252 35.4055 9.63032 35.7348 8.80151 35.7348ZM14.4265 16.6332V11.7113L31.9265 7.33635V12.2582L14.4265 16.6332ZM28.8015 30.7348C28.1834 30.7348 27.5793 30.5515 27.0654 30.2081C26.5515 29.8647 26.1509 29.3767 25.9144 28.8057C25.6779 28.2347 25.616 27.6063 25.7366 27.0001C25.8571 26.3939 26.1548 25.8371 26.5918 25.4001C27.0288 24.963 27.5857 24.6654 28.1919 24.5448C28.798 24.4243 29.4264 24.4861 29.9974 24.7227C30.5684 24.9592 31.0565 25.3597 31.3999 25.8736C31.7432 26.3875 31.9265 26.9917 31.9265 27.6098C31.9265 28.0202 31.8457 28.4265 31.6886 28.8057C31.5316 29.1848 31.3014 29.5293 31.0112 29.8195C30.721 30.1097 30.3765 30.3399 29.9974 30.4969C29.6183 30.654 29.2119 30.7348 28.8015 30.7348Z"
                                                fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h4 className="text-capitalize mt-4 mb-1">2.5K</h4>
                                    <p className="mb-0 text-capitalize text-body">total songs</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-box bg-soft-success text-center">
                                <div className="card-body">
                                    <div className="admin-circle-box rounded-pill">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-success" width="40" height="40"
                                            viewBox="0 0 40 40" fill="none">
                                            <path
                                                d="M5 10C5 9.66848 5.1317 9.35054 5.36612 9.11612C5.60054 8.8817 5.91848 8.75 6.25 8.75H33.75C34.0815 8.75 34.3995 8.8817 34.6339 9.11612C34.8683 9.35054 35 9.66848 35 10C35 10.3315 34.8683 10.6495 34.6339 10.8839C34.3995 11.1183 34.0815 11.25 33.75 11.25H6.25C5.91848 11.25 5.60054 11.1183 5.36612 10.8839C5.1317 10.6495 5 10.3315 5 10ZM6.25 21.25H25C25.3315 21.25 25.6495 21.1183 25.8839 20.8839C26.1183 20.6495 26.25 20.3315 26.25 20C26.25 19.6685 26.1183 19.3505 25.8839 19.1161C25.6495 18.8817 25.3315 18.75 25 18.75H6.25C5.91848 18.75 5.60054 18.8817 5.36612 19.1161C5.1317 19.3505 5 19.6685 5 20C5 20.3315 5.1317 20.6495 5.36612 20.8839C5.60054 21.1183 5.91848 21.25 6.25 21.25ZM17.5 28.75H6.25C5.91848 28.75 5.60054 28.8817 5.36612 29.1161C5.1317 29.3505 5 29.6685 5 30C5 30.3315 5.1317 30.6495 5.36612 30.8839C5.60054 31.1183 5.91848 31.25 6.25 31.25H17.5C17.8315 31.25 18.1495 31.1183 18.3839 30.8839C18.6183 30.6495 18.75 30.3315 18.75 30C18.75 29.6685 18.6183 29.3505 18.3839 29.1161C18.1495 28.8817 17.8315 28.75 17.5 28.75ZM38.6969 19.7344C38.6497 19.8922 38.5718 20.0392 38.4676 20.1668C38.3634 20.2944 38.235 20.4002 38.0898 20.478C37.9446 20.5559 37.7854 20.6042 37.6214 20.6203C37.4575 20.6364 37.292 20.62 37.1344 20.5719L32.5 19.1797V30C32.5018 31.1029 32.1394 32.1756 31.4691 33.0515C30.7988 33.9274 29.8581 34.5575 28.7931 34.844C27.728 35.1305 26.5981 35.0574 25.5789 34.636C24.5596 34.2146 23.708 33.4685 23.1562 32.5135C22.6044 31.5586 22.3833 30.4481 22.5272 29.3546C22.6711 28.2611 23.172 27.2457 23.9521 26.4661C24.7322 25.6864 25.7479 25.186 26.8414 25.0427C27.935 24.8994 29.0453 25.1211 30 25.6734V17.5C30.0001 17.3051 30.0457 17.113 30.1332 16.9389C30.2207 16.7648 30.3477 16.6136 30.5041 16.4973C30.6604 16.381 30.8418 16.3029 31.0337 16.2692C31.2256 16.2355 31.4227 16.2471 31.6094 16.3031L37.8594 18.1781C38.1768 18.2735 38.4433 18.491 38.6003 18.7829C38.7574 19.0747 38.7921 19.4169 38.6969 19.7344ZM30 30C30 29.5055 29.8534 29.0222 29.5787 28.6111C29.304 28.2 28.9135 27.8795 28.4567 27.6903C27.9999 27.5011 27.4972 27.4516 27.0123 27.548C26.5273 27.6445 26.0819 27.8826 25.7322 28.2322C25.3826 28.5819 25.1445 29.0273 25.048 29.5123C24.9516 29.9972 25.0011 30.4999 25.1903 30.9567C25.3795 31.4135 25.7 31.804 26.1111 32.0787C26.5222 32.3534 27.0055 32.5 27.5 32.5C28.163 32.5 28.7989 32.2366 29.2678 31.7678C29.7366 31.2989 30 30.663 30 30Z"
                                                fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h4 className="text-capitalize mt-4 mb-1">850</h4>
                                    <p className="mb-0 text-capitalize text-body">total playlist</p>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-box bg-soft-tertiray text-center">
                                <div className="card-body">
                                    <div className="admin-circle-box rounded-pill">
                                        <svg className="text-primary" width="36" height="28" viewBox="0 0 36 28" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g id="3 User">
                                                <path id="Stroke 1"
                                                    d="M27.8128 12.1609C30.1378 11.8342 31.9278 9.84089 31.9328 7.42589C31.9328 5.04589 30.1978 3.07255 27.9228 2.69922"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 3"
                                                    d="M30.8809 17.7505C33.1325 18.0872 34.7042 18.8755 34.7042 20.5005C34.7042 21.6188 33.9642 22.3455 32.7675 22.8022"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 5" fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M17.8112 18.4395C12.4545 18.4395 7.87952 19.2511 7.87952 22.4928C7.87952 25.7328 12.4262 26.5678 17.8112 26.5678C23.1679 26.5678 27.7412 25.7645 27.7412 22.5211C27.7412 19.2778 23.1962 18.4395 17.8112 18.4395Z"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 7" fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M17.8112 13.813C21.3262 13.813 24.1762 10.9647 24.1762 7.44801C24.1762 3.93301 21.3262 1.08301 17.8112 1.08301C14.2962 1.08301 11.4462 3.93301 11.4462 7.44801C11.4328 10.9513 14.2612 13.8013 17.7645 13.813H17.8112Z"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 9"
                                                    d="M7.80799 12.1609C5.48132 11.8342 3.69299 9.84089 3.68799 7.42589C3.68799 5.04589 5.42299 3.07255 7.69799 2.69922"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path id="Stroke 11"
                                                    d="M4.73984 17.7505C2.48817 18.0872 0.916504 18.8755 0.916504 20.5005C0.916504 21.6188 1.6565 22.3455 2.85317 22.8022"
                                                    stroke="#8545DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                        </svg>
                                    </div>
                                    <h4 className="text-capitalize mt-4 mb-1">5.2M</h4>
                                    <p className="mb-0 text-capitalize text-body">total users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-header">
                                    <div className="header-title d-flex align-items-center justify-content-between">
                                        <h4 className="card-title text-capitalize">Top artist</h4>
                                        <a href="#" className="small text-body">View All <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                            height="20" viewBox="0 0 20 20" fill="none">
                                            <path opacity="0.4"
                                                d="M20.0002 10C20.0002 15.515 15.5142 20 10.0002 20C4.48621 20 0.000213623 15.515 0.000213623 10C0.000213623 4.486 4.48621 0 10.0002 0C15.5142 0 20.0002 4.486 20.0002 10Z"
                                                fill="currentColor" />
                                            <path
                                                d="M14.2209 8.55748C14.2209 8.74848 14.1479 8.94048 14.0019 9.08648L10.5319 12.5735C10.3909 12.7145 10.1999 12.7935 9.99992 12.7935C9.80092 12.7935 9.60992 12.7145 9.46892 12.5735L5.99692 9.08648C5.70492 8.79348 5.70492 8.31948 5.99892 8.02648C6.29292 7.73448 6.76792 7.73548 7.05992 8.02848L9.99992 10.9815L12.9399 8.02848C13.2319 7.73548 13.7059 7.73448 13.9999 8.02648C14.1479 8.17248 14.2209 8.36548 14.2209 8.55748Z"
                                                fill="currentColor" />
                                        </svg></a>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table id="datatable" className="table mt-0" data-toggle="data-table">
                                            <thead>
                                                <tr>
                                                    <th className="custom-icon">No.</th>
                                                    <th className="custom-icon">Artist Name</th>
                                                    <th className="custom-icon">Joining Date</th>
                                                    <th className="custom-icon">Total Songs</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>01</td>
                                                    <td>
                                                        <h6 className="text-capitalize">Pete Saraiya</h6>
                                                        <p className="mb-0 custom-icon">petesaraiya@demo.com</p>
                                                    </td>
                                                    <td>Jan 24, 2020</td>
                                                    <td>157</td>
                                                </tr>
                                                <tr>
                                                    <td>02</td>
                                                    <td>
                                                        <h6 className="text-capitalize">Pete Saraiya</h6>
                                                        <p className="mb-0 custom-icon">petesaraiya@demo.com</p>
                                                    </td>
                                                    <td>Jan 24, 2020</td>
                                                    <td>157</td>
                                                </tr>
                                                <tr>
                                                    <td>03</td>
                                                    <td>
                                                        <h6 className="text-capitalize">Pete Saraiya</h6>
                                                        <p className="mb-0 custom-icon">petesaraiya@demo.com</p>
                                                    </td>
                                                    <td>Jan 24, 2020</td>
                                                    <td>157</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-header">
                                    <div className="header-title">
                                        <h4 className="card-title text-capitalize">total reviews</h4>
                                    </div>
                                </div>
                                <div className="card-body pt-0">
                                    <div id="chart-01" className=" chart-01"></div>
                                    <div className="d-flex align-items-center mb-5">
                                        <svg className="me-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M19.9613 2.40839C19.8714 2.33839 19.7668 2.28977 19.6554 2.26621C19.5439 2.24266 19.4286 2.24479 19.3181 2.27245L7.31813 5.27245C7.15587 5.31301 7.01183 5.40664 6.90889 5.53845C6.80596 5.67027 6.75003 5.83271 6.75 5.99995V16.32C6.12435 15.9019 5.37694 15.705 4.62652 15.7604C3.8761 15.8158 3.16571 16.1203 2.60823 16.6257C2.05075 17.1311 1.67814 17.8083 1.54961 18.5497C1.42108 19.2911 1.54399 20.0542 1.89883 20.7177C2.25366 21.3813 2.82007 21.9072 3.50805 22.212C4.19603 22.5167 4.96612 22.5829 5.69598 22.3998C6.42584 22.2168 7.0736 21.7951 7.53635 21.2017C7.99909 20.6084 8.25028 19.8774 8.25 19.125V11.0859L18.75 8.46089V13.32C18.1243 12.9019 17.3769 12.705 16.6265 12.7604C15.8761 12.8158 15.1657 13.1203 14.6082 13.6257C14.0507 14.1311 13.6781 14.8083 13.5496 15.5497C13.4211 16.2911 13.544 17.0542 13.8988 17.7177C14.2537 18.3813 14.8201 18.9072 15.508 19.212C16.196 19.5167 16.9661 19.5829 17.696 19.3998C18.4258 19.2168 19.0736 18.7951 19.5363 18.2017C19.9991 17.6084 20.2503 16.8774 20.25 16.125V2.99995C20.25 2.88588 20.224 2.77331 20.174 2.6708C20.124 2.56829 20.0512 2.47855 19.9613 2.40839ZM4.875 21C4.50416 21 4.14165 20.89 3.83331 20.684C3.52497 20.4779 3.28464 20.1851 3.14273 19.8425C3.00082 19.4999 2.96368 19.1229 3.03603 18.7592C3.10838 18.3954 3.28696 18.0614 3.54918 17.7991C3.8114 17.5369 4.1455 17.3583 4.50921 17.286C4.87292 17.2136 5.24992 17.2508 5.59254 17.3927C5.93515 17.5346 6.22798 17.7749 6.43401 18.0833C6.64004 18.3916 6.75 18.7541 6.75 19.125C6.75 19.6222 6.55246 20.0991 6.20083 20.4508C5.8492 20.8024 5.37229 21 4.875 21ZM8.25 9.53902V6.58589L18.75 3.96089V6.91402L8.25 9.53902ZM16.875 18C16.5042 18 16.1417 17.89 15.8333 17.684C15.525 17.4779 15.2846 17.1851 15.1427 16.8425C15.0008 16.4999 14.9637 16.1229 15.036 15.7592C15.1084 15.3954 15.287 15.0614 15.5492 14.7991C15.8114 14.5369 16.1455 14.3583 16.5092 14.286C16.8729 14.2136 17.2499 14.2508 17.5925 14.3927C17.9351 14.5346 18.228 14.7749 18.434 15.0833C18.64 15.3916 18.75 15.7541 18.75 16.125C18.75 16.3712 18.7015 16.615 18.6073 16.8425C18.5131 17.07 18.3749 17.2767 18.2008 17.4508C18.0267 17.6249 17.82 17.763 17.5925 17.8572C17.3651 17.9515 17.1212 18 16.875 18Z" fill="#547AFF" />
                                        </svg>
                                        <div style={{ width: "100%" }}>
                                            <div className="d-flex justify-content-between  ">
                                                <h6 className="mb-2">Songs</h6>
                                                <h6 className="text-body">5,674</h6>
                                            </div>
                                            <div className="progress bg-soft-info shadow-none w-100" style={{ height: "6px" }}>
                                                <div className="progress-bar bg-soft-info" data-toggle="progress-bar" role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} style={{ width: "23%", transition: "width 2s ease 0s" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-5">
                                        <svg className="me-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                            <path d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM16 27C13.8244 27 11.6977 26.3549 9.88873 25.1462C8.07979 23.9375 6.66989 22.2195 5.83733 20.2095C5.00477 18.1995 4.78693 15.9878 5.21137 13.854C5.63581 11.7202 6.68345 9.7602 8.22183 8.22183C9.76021 6.68345 11.7202 5.6358 13.854 5.21136C15.9878 4.78692 18.1995 5.00476 20.2095 5.83733C22.2195 6.66989 23.9375 8.07979 25.1462 9.88873C26.3549 11.6977 27 13.8244 27 16C26.9967 18.9164 25.8367 21.7123 23.7745 23.7745C21.7123 25.8367 18.9164 26.9967 16 27ZM16 9C14.1441 9.00199 12.3648 9.74012 11.0525 11.0524C9.74013 12.3648 9.00199 14.1441 9.00001 16C9.00001 16.2652 8.89465 16.5196 8.70711 16.7071C8.51958 16.8946 8.26522 17 8.00001 17C7.73479 17 7.48044 16.8946 7.2929 16.7071C7.10536 16.5196 7.00001 16.2652 7.00001 16C7.00265 13.6139 7.95171 11.3262 9.63897 9.63896C11.3262 7.95171 13.6139 7.00265 16 7C16.2652 7 16.5196 7.10536 16.7071 7.29289C16.8946 7.48043 17 7.73478 17 8C17 8.26522 16.8946 8.51957 16.7071 8.70711C16.5196 8.89464 16.2652 9 16 9ZM25 16C24.9974 18.3861 24.0483 20.6738 22.361 22.361C20.6738 24.0483 18.3861 24.9974 16 25C15.7348 25 15.4804 24.8946 15.2929 24.7071C15.1054 24.5196 15 24.2652 15 24C15 23.7348 15.1054 23.4804 15.2929 23.2929C15.4804 23.1054 15.7348 23 16 23C17.8559 22.998 19.6352 22.2599 20.9476 20.9476C22.2599 19.6352 22.998 17.8559 23 16C23 15.7348 23.1054 15.4804 23.2929 15.2929C23.4804 15.1054 23.7348 15 24 15C24.2652 15 24.5196 15.1054 24.7071 15.2929C24.8946 15.4804 25 15.7348 25 16ZM20 16C20 15.2089 19.7654 14.4355 19.3259 13.7777C18.8864 13.1199 18.2616 12.6072 17.5307 12.3045C16.7998 12.0017 15.9956 11.9225 15.2196 12.0769C14.4437 12.2312 13.731 12.6122 13.1716 13.1716C12.6122 13.731 12.2312 14.4437 12.0769 15.2196C11.9225 15.9956 12.0017 16.7998 12.3045 17.5307C12.6072 18.2616 13.1199 18.8864 13.7777 19.3259C14.4355 19.7654 15.2089 20 16 20C17.0609 20 18.0783 19.5786 18.8284 18.8284C19.5786 18.0783 20 17.0609 20 16ZM14 16C14 15.6044 14.1173 15.2178 14.3371 14.8889C14.5568 14.56 14.8692 14.3036 15.2346 14.1522C15.6001 14.0009 16.0022 13.9613 16.3902 14.0384C16.7781 14.1156 17.1345 14.3061 17.4142 14.5858C17.6939 14.8655 17.8844 15.2219 17.9616 15.6098C18.0387 15.9978 17.9991 16.3999 17.8478 16.7654C17.6964 17.1308 17.44 17.4432 17.1111 17.6629C16.7822 17.8827 16.3956 18 16 18C15.4696 18 14.9609 17.7893 14.5858 17.4142C14.2107 17.0391 14 16.5304 14 16Z" fill="#FFC554" />
                                        </svg>
                                        <div style={{ width: "100%" }}>
                                            <div className="d-flex justify-content-between  ">
                                                <h6 className="mb-2">Albums</h6>
                                                <h6 className="text-body">1,624</h6>
                                            </div>
                                            <div className="progress bg-soft-warning shadow-none w-100" style={{ height: "6px" }}>
                                                <div className="progress-bar bg-soft-warning" data-toggle="progress-bar" role="progressbar" aria-valuenow={35} aria-valuemin={0} aria-valuemax={100} style={{ width: "23%", transition: "width 2s ease 0s" }}
                                                ></div>
                                            </div>style
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <svg className="me-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                            <path d="M4 8C4 7.73478 4.10536 7.48043 4.29289 7.29289C4.48043 7.10536 4.73478 7 5 7H27C27.2652 7 27.5196 7.10536 27.7071 7.29289C27.8946 7.48043 28 7.73478 28 8C28 8.26522 27.8946 8.51957 27.7071 8.70711C27.5196 8.89464 27.2652 9 27 9H5C4.73478 9 4.48043 8.89464 4.29289 8.70711C4.10536 8.51957 4 8.26522 4 8ZM5 17H20C20.2652 17 20.5196 16.8946 20.7071 16.7071C20.8946 16.5196 21 16.2652 21 16C21 15.7348 20.8946 15.4804 20.7071 15.2929C20.5196 15.1054 20.2652 15 20 15H5C4.73478 15 4.48043 15.1054 4.29289 15.2929C4.10536 15.4804 4 15.7348 4 16C4 16.2652 4.10536 16.5196 4.29289 16.7071C4.48043 16.8946 4.73478 17 5 17ZM14 23H5C4.73478 23 4.48043 23.1054 4.29289 23.2929C4.10536 23.4804 4 23.7348 4 24C4 24.2652 4.10536 24.5196 4.29289 24.7071C4.48043 24.8946 4.73478 25 5 25H14C14.2652 25 14.5196 24.8946 14.7071 24.7071C14.8946 24.5196 15 24.2652 15 24C15 23.7348 14.8946 23.4804 14.7071 23.2929C14.5196 23.1054 14.2652 23 14 23ZM30.9575 15.7875C30.9198 15.9138 30.8574 16.0313 30.7741 16.1334C30.6907 16.2355 30.588 16.3202 30.4718 16.3824C30.3557 16.4447 30.2283 16.4834 30.0972 16.4963C29.966 16.5091 29.8336 16.496 29.7075 16.4575L26 15.3438V24C26.0014 24.8823 25.7115 25.7405 25.1753 26.4412C24.6391 27.1419 23.8865 27.646 23.0345 27.8752C22.1824 28.1044 21.2785 28.0459 20.4631 27.7088C19.6477 27.3717 18.9664 26.7748 18.525 26.0108C18.0835 25.2468 17.9066 24.3585 18.0218 23.4837C18.1369 22.6089 18.5376 21.7966 19.1617 21.1728C19.7858 20.5491 20.5983 20.1488 21.4732 20.0342C22.348 19.9195 23.2363 20.0969 24 20.5387V14C24 13.8441 24.0365 13.6904 24.1065 13.5511C24.1766 13.4119 24.2782 13.2909 24.4032 13.1979C24.5283 13.1048 24.6734 13.0423 24.827 13.0154C24.9805 12.9884 25.1382 12.9977 25.2875 13.0425L30.2875 14.5425C30.5414 14.6188 30.7546 14.7928 30.8803 15.0263C31.0059 15.2598 31.0337 15.5336 30.9575 15.7875ZM24 24C24 23.6044 23.8827 23.2178 23.6629 22.8889C23.4432 22.56 23.1308 22.3036 22.7654 22.1522C22.3999 22.0009 21.9978 21.9613 21.6098 22.0384C21.2219 22.1156 20.8655 22.3061 20.5858 22.5858C20.3061 22.8655 20.1156 23.2219 20.0384 23.6098C19.9613 23.9978 20.0009 24.3999 20.1522 24.7654C20.3036 25.1308 20.56 25.4432 20.8889 25.6629C21.2178 25.8827 21.6044 26 22 26C22.5304 26 23.0391 25.7893 23.4142 25.4142C23.7893 25.0391 24 24.5304 24 24Z" fill="#00E52E" />
                                        </svg>
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <div className="d-flex justify-content-between  ">
                                            <h6 className="mb-2">Playlist</h6>
                                            <h6 className="text-body">5,515</h6>
                                        </div>
                                        <div className="progress bg-soft-success shadow-none w-100" style={{ height: "6px" }}>
                                            <div className="progress-bar bg-soft-success" data-toggle="progress-bar" role="progressbar" aria-valuenow={23} aria-valuemin={0} aria-valuemax={100} style={{ width: "23%", transition: "width 2s ease 0s" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="header-title">
                                    <h4 className="card-title text-capitalize">Recent Users</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled p-0 m-0">
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/50.png" id="01" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">Jane Cooper</h6>
                                                    <small className="text-capitalize">janecooper@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">12 hours ago</p>
                                        </div>                    </li>
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/51.png" id="02" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">wade warren</h6>
                                                    <small className="text-capitalize">wadewarren@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">18 hours ago</p>
                                        </div>                    </li>
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/52.png" id="03" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">Jacob jones</h6>
                                                    <small className="text-capitalize">jacobjones@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">24 hours ago</p>
                                        </div>                    </li>
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/53.png" id="04" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">Cody fisher</h6>
                                                    <small className="text-capitalize">codyfisher@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">28 hours ago</p>
                                        </div>                    </li>
                                    <li className="mb-4">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/54.png" id="05" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">Dianne Russell</h6>
                                                    <small className="text-capitalize">diannerussell@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">36 hours ago</p>
                                        </div>                    </li>
                                    <li>
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <div className="d-flex align-items-center">
                                                <img src="../../assets/images/dashboard/55.png" id="06" className="img-fluid rounded-3  avatar-52" alt="user-img" />
                                                <div className="ms-4">
                                                    <h6 className="text-capitalize">loreal kinas</h6>
                                                    <small className="text-capitalize">lorealkinas@gmail.com</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 custom-icon">48 hours ago</p>
                                        </div>                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <div className="header-title">
                                    <h4 className="card-title text-capitalize">total reviews</h4>
                                </div>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled p-0 m-0">
                                    <li className="mb-4">

                                        <div className="d-flex">
                                            <img src="../../assets/images/dashboard/56.png" id="07" className="img-fluid rounded-3  avatar-52" alt="review-img" />
                                            <div className="ms-4">
                                                <h6 className="text-capitalize mb-2">This song captures my emotions and paints my world with its beautiful melody and heartfelt lyrics. It&#x27;s truly special.</h6>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <small className="text-capitalize">by Alexa Jonas</small>
                                                    <small className="text-capitalize custom-icon">02 hours ago</small>
                                                </div>
                                            </div>
                                        </div>                    </li>
                                    <li className="mb-4">

                                        <div className="d-flex">
                                            <img src="../../assets/images/dashboard/57.png" id="08" className="img-fluid rounded-3  avatar-52" alt="review-img" />
                                            <div className="ms-4">
                                                <h6 className="text-capitalize mb-2">This song captures my emotions and paints my world with its beautiful melody and heartfelt lyrics. It&#x27;s truly special.</h6>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <small className="text-capitalize">by alex Williams</small>
                                                    <small className="text-capitalize custom-icon">06 hours ago</small>
                                                </div>
                                            </div>
                                        </div>                    </li>
                                    <li className="mb-4">

                                        <div className="d-flex">
                                            <img src="../../assets/images/dashboard/58.png" id="09" className="img-fluid rounded-3  avatar-52" alt="review-img" />
                                            <div className="ms-4">
                                                <h6 className="text-capitalize mb-2">This song captures my emotions and paints my world with its beautiful melody and heartfelt lyrics. It&#x27;s truly special.</h6>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <small className="text-capitalize">by vibrat sharia</small>
                                                    <small className="text-capitalize custom-icon">08 hours ago</small>
                                                </div>
                                            </div>
                                        </div>                    </li>
                                    <li className="mb-4">

                                        <div className="d-flex">
                                            <img src="../../assets/images/dashboard/59.png" id="10" className="img-fluid rounded-3  avatar-52" alt="review-img" />
                                            <div className="ms-4">
                                                <h6 className="text-capitalize mb-2">This song captures my emotions and paints my world with its beautiful melody and heartfelt lyrics. It&#x27;s truly special.</h6>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <small className="text-capitalize">by angle pate</small>
                                                    <small className="text-capitalize custom-icon">12 hours ago</small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="">

                                        <div className="d-flex">
                                            <img src="../../assets/images/dashboard/53.png" id="10" className="img-fluid rounded-3  avatar-52" alt="review-img" />
                                            <div className="ms-4">
                                                <h6 className="text-capitalize mb-2">This song captures my emotions and paints my world with its beautiful melody and heartfelt lyrics. It&#x27;s truly special.</h6>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                                    <small className="text-capitalize">by vibrat sharia</small>
                                                    <small className="text-capitalize custom-icon">09 hours ago</small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="card border-top mb-0">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between flex-md-row flex-column gap-3">
                            <div className="">
                                <ul className="list-unstyled p-0 m-0 mb-3 text-capitalize d-flex gap-3 flex-md-nowrap flex-wrap">
                                    <li>about</li>
                                    <li>|</li>
                                    <li>terms of use</li>
                                    <li>|</li>
                                    <li>privacy policy</li>
                                    <li>|</li>
                                    <li>support</li>
                                    <li>|</li>
                                    <li>feedback</li>
                                    <li>|</li>
                                </ul>
                                <small>Copyright <span id="copyright">
                                    <script>document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()))</script>
                                </span>. Made with love by Iqonic Design.</small>
                            </div>
                            <div>
                                <ul className="list-unstyled m-0 p-0 d-flex align-items-center gap-3">
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M5.026 15C11.064 15 14.367 9.99702 14.367 5.66602C14.367 5.52602 14.367 5.38402 14.361 5.24402C15.0041 4.77851 15.5591 4.20217 16 3.54202C15.3993 3.80687 14.7628 3.98143 14.111 4.06002C14.7975 3.64966 15.3117 3.00399 15.558 2.24302C14.913 2.62515 14.207 2.8934 13.471 3.03602C12.9762 2.50905 12.3214 2.15994 11.6081 2.04278C10.8948 1.92562 10.1627 2.04694 9.52534 2.38796C8.88796 2.72897 8.38081 3.27065 8.08245 3.92908C7.78409 4.58751 7.71118 5.32595 7.875 6.03002C6.56974 5.96457 5.29282 5.62549 4.12704 5.03476C2.96127 4.44404 1.93268 3.61487 1.108 2.60102C0.68934 3.3241 0.561574 4.17942 0.750646 4.99329C0.939718 5.80715 1.43145 6.51855 2.126 6.98302C1.60554 6.96534 1.09652 6.82558 0.64 6.57502V6.62002C0.640897 7.3775 0.903307 8.11144 1.38287 8.69778C1.86244 9.28412 2.52975 9.68689 3.272 9.83802C2.99026 9.91564 2.69923 9.95433 2.407 9.95302C2.20098 9.95365 1.99538 9.93456 1.793 9.89602C2.00279 10.5481 2.41127 11.1182 2.96125 11.5265C3.51122 11.9348 4.17513 12.1609 4.86 12.173C3.69656 13.0868 2.2594 13.5824 0.78 13.58C0.519321 13.5811 0.258823 13.5661 0 13.535C1.50151 14.4923 3.2453 15.0006 5.026 15Z" fill="#4A525F" />
                                        </svg>
                                    </li>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_389_2574)">
                                                <path d="M0 1.146C0 0.513 0.526 0 1.175 0H14.825C15.474 0 16 0.513 16 1.146V14.854C16 15.487 15.474 16 14.825 16H1.175C0.526 16 0 15.487 0 14.854V1.146ZM4.943 13.394V6.169H2.542V13.394H4.943ZM3.743 5.182C4.58 5.182 5.101 4.628 5.101 3.934C5.086 3.225 4.581 2.686 3.759 2.686C2.937 2.686 2.4 3.226 2.4 3.934C2.4 4.628 2.921 5.182 3.727 5.182H3.743ZM8.651 13.394V9.359C8.651 9.143 8.667 8.927 8.731 8.773C8.904 8.342 9.299 7.895 9.963 7.895C10.832 7.895 11.179 8.557 11.179 9.529V13.394H13.58V9.25C13.58 7.03 12.396 5.998 10.816 5.998C9.542 5.998 8.971 6.698 8.651 7.191V7.216H8.635C8.64031 7.20765 8.64564 7.19932 8.651 7.191V6.169H6.251C6.281 6.847 6.251 13.394 6.251 13.394H8.651Z" fill="#4A525F" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_389_2574">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </li>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_389_2576)">
                                                <path d="M16 8.04902C16 3.60302 12.418 -0.000976562 8.00005 -0.000976562C3.58005 2.34375e-05 -0.00195312 3.60302 -0.00195312 8.05002C-0.00195312 12.067 2.92405 15.397 6.74805 16.001V10.376H4.71805V8.05002H6.75005V6.27502C6.75005 4.25802 7.94505 3.14402 9.77205 3.14402C10.648 3.14402 11.563 3.30102 11.563 3.30102V5.28102H10.554C9.56105 5.28102 9.25105 5.90202 9.25105 6.53902V8.04902H11.469L11.115 10.375H9.25005V16C13.074 15.396 16 12.066 16 8.04902Z" fill="#FF4545" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_389_2576">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </li>
                                    <li>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_389_2578)">
                                                <path d="M8 0C5.829 0 5.556 0.01 4.703 0.048C3.85 0.088 3.269 0.222 2.76 0.42C2.22609 0.620819 1.74249 0.935826 1.343 1.343C0.936076 1.7427 0.621107 2.22624 0.42 2.76C0.222 3.268 0.087 3.85 0.048 4.7C0.01 5.555 0 5.827 0 8.001C0 10.173 0.01 10.445 0.048 11.298C0.088 12.15 0.222 12.731 0.42 13.24C0.625 13.766 0.898 14.212 1.343 14.657C1.787 15.102 2.233 15.376 2.759 15.58C3.269 15.778 3.849 15.913 4.701 15.952C5.555 15.99 5.827 16 8 16C10.173 16 10.444 15.99 11.298 15.952C12.149 15.912 12.732 15.778 13.241 15.58C13.7746 15.3791 14.2578 15.0641 14.657 14.657C15.102 14.212 15.375 13.766 15.58 13.24C15.777 12.731 15.912 12.15 15.952 11.298C15.99 10.445 16 10.173 16 8C16 5.827 15.99 5.555 15.952 4.701C15.912 3.85 15.777 3.268 15.58 2.76C15.3789 2.22623 15.0639 1.74268 14.657 1.343C14.2576 0.935676 13.774 0.620645 13.24 0.42C12.73 0.222 12.148 0.087 11.297 0.048C10.443 0.01 10.172 0 7.998 0H8.001H8ZM7.283 1.442H8.001C10.137 1.442 10.39 1.449 11.233 1.488C12.013 1.523 12.437 1.654 12.719 1.763C13.092 1.908 13.359 2.082 13.639 2.362C13.919 2.642 14.092 2.908 14.237 3.282C14.347 3.563 14.477 3.987 14.512 4.767C14.551 5.61 14.559 5.863 14.559 7.998C14.559 10.133 14.551 10.387 14.512 11.23C14.477 12.01 14.346 12.433 14.237 12.715C14.1087 13.0624 13.904 13.3764 13.638 13.634C13.358 13.914 13.092 14.087 12.718 14.232C12.438 14.342 12.014 14.472 11.233 14.508C10.39 14.546 10.137 14.555 8.001 14.555C5.865 14.555 5.611 14.546 4.768 14.508C3.988 14.472 3.565 14.342 3.283 14.232C2.9355 14.1039 2.62113 13.8996 2.363 13.634C2.09675 13.376 1.89172 13.0617 1.763 12.714C1.654 12.433 1.523 12.009 1.488 11.229C1.45 10.386 1.442 10.133 1.442 7.996C1.442 5.86 1.45 5.608 1.488 4.765C1.524 3.985 1.654 3.561 1.764 3.279C1.909 2.906 2.083 2.639 2.363 2.359C2.643 2.079 2.909 1.906 3.283 1.761C3.565 1.651 3.988 1.521 4.768 1.485C5.506 1.451 5.792 1.441 7.283 1.44V1.442ZM12.271 2.77C12.1449 2.77 12.0201 2.79483 11.9036 2.84308C11.7872 2.89132 11.6813 2.96203 11.5922 3.05118C11.503 3.14032 11.4323 3.24615 11.3841 3.36262C11.3358 3.4791 11.311 3.60393 11.311 3.73C11.311 3.85607 11.3358 3.9809 11.3841 4.09738C11.4323 4.21385 11.503 4.31968 11.5922 4.40882C11.6813 4.49797 11.7872 4.56868 11.9036 4.61692C12.0201 4.66517 12.1449 4.69 12.271 4.69C12.5256 4.69 12.7698 4.58886 12.9498 4.40882C13.1299 4.22879 13.231 3.98461 13.231 3.73C13.231 3.47539 13.1299 3.23121 12.9498 3.05118C12.7698 2.87114 12.5256 2.77 12.271 2.77ZM8.001 3.892C7.45607 3.8835 6.91489 3.98349 6.40898 4.18614C5.90306 4.3888 5.44251 4.69007 5.05415 5.07242C4.66579 5.45478 4.35736 5.91057 4.14684 6.41326C3.93632 6.91595 3.8279 7.4555 3.8279 8.0005C3.8279 8.5455 3.93632 9.08505 4.14684 9.58774C4.35736 10.0904 4.66579 10.5462 5.05415 10.9286C5.44251 11.3109 5.90306 11.6122 6.40898 11.8149C6.91489 12.0175 7.45607 12.1175 8.001 12.109C9.07954 12.0922 10.1082 11.6519 10.865 10.8833C11.6217 10.1146 12.0459 9.07917 12.0459 8.0005C12.0459 6.92183 11.6217 5.88641 10.865 5.11775C10.1082 4.34909 9.07954 3.90883 8.001 3.892ZM8.001 5.333C8.70833 5.333 9.38669 5.61399 9.88685 6.11415C10.387 6.61431 10.668 7.29267 10.668 8C10.668 8.70733 10.387 9.38569 9.88685 9.88585C9.38669 10.386 8.70833 10.667 8.001 10.667C7.29367 10.667 6.61531 10.386 6.11515 9.88585C5.61499 9.38569 5.334 8.70733 5.334 8C5.334 7.29267 5.61499 6.61431 6.11515 6.11415C6.61531 5.61399 7.29367 5.333 8.001 5.333Z" fill="#4A525F" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_389_2578">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

        </>
    )
}
