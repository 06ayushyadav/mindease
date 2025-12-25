
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { Toaster } from "react-hot-toast";
import Navbar from "./home/Navbar";
import Footer from "./home/Footer";
import ScrollTop from "./utils/ScrollTop";
import AdminProtected from "./components/protectedroute/AdminProtected";
import CounselorProtected from "./components/protectedroute/CounselorProtected";
// import ManageCounselors from "./components/admin/monitor/ManageCounselors";
import AllCounselors from "./pages/admin/AllCounselors";
import AllAnalytics from "./pages/admin/AllAnalytics";
import PatientProtected from "./components/protectedroute/PatientProtected";
import MindEaseServicesPage from "./components/admin/ServiceLearnMore";
import ForgotPassword from "./components/forgat/ForgatPasswordForm";
import ResetPassword from "./components/forgat/ResetPassword";
import CounselorForgot from "./components/forgat/CounselorForgot";
import CounselorReset from "./components/forgat/CounselorReset";
// import SessionFetchPage from "./components/counselor/sessions/DoctorSession";

// auth
const CounselorRegisterPage = lazy(() => import("./pages/auth/counselor/RegisterPage"))
const CounselorLoginPaage = lazy(() => import("./pages/auth/counselor/LoginPage"))
//
const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"))
const DoctorsPage = lazy(() => import("./pages/DoctorsPage"))
const BlogPage = lazy(() => import("./pages/BlogPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))
//userpage
const UserPage = lazy(() => import("./pages/UserPage"))
const PatientLogin = lazy(() => import("./pages/auth/patient/PatientLoginPage"))
const PatientRegister = lazy(() => import("./pages/auth/patient/PatientRegisterPage"))
// counselor dashboard
const CounselorDashboardPage = lazy(() => import("./pages/ConselorPage"))
const BookingRequest = lazy(() => import("./components/counselor/bookingrequest/BookingRequest"))
const DoctorDetailPage = lazy(() => import("./components/counselor/details/DoctorDetailPage"))
const BookAppointmentPage = lazy(()=> import ("./components/counselor/bookingrequest/BookAppointmentPage"))
// admin pannel
const AdminRegister = lazy(() => import("./pages/auth/admin/AdminRegisterPage"))
const AdminLogin = lazy(() => import("./pages/auth/admin/AdminLoginPage"))
const AdminPannelPage = lazy(() => import("./pages/admin/AdminPage"))
const AdminManageContentPage = lazy(() => import("./pages/admin/AdminManageContent"))

// session 
const SessionHome= lazy(()=> import("./pages/session/SessionHome"))
const SessionRoom=lazy(()=> import("./pages/session/SessionRoom"))

// blog read more
const ReadMorePage = lazy(() => import("./components/blog/ReadMorePage"))


const Loader = () => {
  <div className="flex justify-center items-center h-screen">
    <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
  </div>
}

function App() {


  return (
    <>
      <BrowserRouter>
        <ScrollTop />
        <Navbar />
        <Suspense fallback={<Loader />}>
        <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn-more" element={<MindEaseServicesPage/>} />

            {/* auth routes */}
            <Route path="/counselor/register" element={<CounselorRegisterPage />} />
            <Route path="/counselor/login" element={<CounselorLoginPaage />} />

            {/* session route */}
            <Route path="/session/enter-roomid" element={<SessionHome/>}/>
            <Route path="/session/:roomId" element={<SessionRoom/>  }/>

            {/* main routes */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* counselor  */}
            <Route path="/counselor/dashboard/:counselorId" element={
              <CounselorProtected>
                <CounselorDashboardPage />
              </CounselorProtected>
            } />
            <Route path="/doctor/doctor-booking" element={<BookingRequest />} />
            <Route path={`/doctors/doctor-booking/:doctorId`} element={<DoctorDetailPage />} />
            <Route path="/counselor-register" element={<CounselorRegisterPage />} />
            <Route path="/counselor-login" element={<CounselorLoginPaage />} />
            {/* /doctor appointment/ */}
            <Route path="/book-appointment/:doctorId" element={<BookAppointmentPage />} />
            {/* <Route path="/sessions/:counselorId" element={<SessionFetchPage />} /> */}
            <Route path="/counselor-forgotpassword" element={<CounselorForgot/>} />
            <Route path={`/counselor-resetpassword`} element={<CounselorReset/>} /> 
            

            {/* user  */}
            <Route path="/patient-dashboard/:patientId" element={<PatientProtected><UserPage /></PatientProtected>} />
            <Route path="/patient-register" element={<PatientRegister />} />
            <Route path="/patient-login" element={<PatientLogin />} />

            <Route path="/forgate-password" element={<ForgotPassword/>} />
            <Route path={`/reset-password`} element={<ResetPassword/>} /> 

            {/* admin  */}
           
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard/:adminId" element={
              <AdminProtected>
                <AdminPannelPage />
              </AdminProtected>
            } />
             {/* <Route path="/admin/dashboard" element={<AdminPannelPage />} /> */}
            <Route path="/admin/manage-counselors/" element={<AllCounselors/>} />
            <Route path="/admin/manage-content" element={<AdminManageContentPage />} />
            <Route path="/admin/manage-analytics" element={<AllAnalytics/>} />
            

            {/* blog read more */}
            <Route path="/blog/read-more/:id" element={<ReadMorePage />} />

            {/* { not found } */}
            <Route path="*" element={<NotFoundPage />} />


          </Routes>
          <Footer/>
        </Suspense>

      </BrowserRouter>

    </>
  )
}

export default App
