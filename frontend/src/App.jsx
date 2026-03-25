import './App.css'
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Routes, Route, Link } from 'react-router-dom';
import { useThemeStore } from "./Store/ThemeStore.js";
import { ToastContainer } from "react-toastify";
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import ProtectedAdminRoutes from "./Routes/AdminRoutes.jsx";
import ProtectedUserRoutes from "./Routes/UserRoutes.jsx";
import AdminDashboard from './Pages/Admin/Dashboard.jsx';
import UserDashboard from './Pages/User/Post/Dashboard.jsx'
import AdminLayout from "./Layouts/AdminLayout";
import ViewUsers from './Pages/Admin/ViewUsers.jsx';
import AddUsers from './Pages/Admin/AddUsers.jsx';
import UserLayout from './Layouts/UserLayout.jsx';
import MyProfile from './Pages/User/MyProfile.jsx';
import SubmitComplaint from './Pages/User/SubmitComplaint.jsx';
import ViewComplaintList from './Pages/User/ViewComplaintList.jsx';
import ViewAllComplaints from './Pages/Admin/ViewAllComplaints.jsx';
import ResolvedComplaints from './Pages/Admin/ResolvedComplaints.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy.jsx';
import AddPost from './Pages/Admin/Post/AddPost.jsx';
import ViewPosts from './Pages/Admin/Post/ViewPosts.jsx';
import LanguageSwitcher from './Components/LanguageSwitcher.jsx';
import ResetPassword from './Pages/User/ResetPassword.jsx';
import Inbox from './Pages/User/Inbox.jsx';
import AdminInbox from './Pages/Admin/Inbox.jsx';
import SessionExpired from './Pages/SessionExpire.jsx';
import Chatbot from './Pages/User/Chatbot.jsx';
import AdminGuestMessages from './Pages/Admin/GuestInbox.jsx';
import { useAuthStore } from "./Store/AuthStore.js";
function App() {
  const dark = useThemeStore((state) => state.dark);
  const location = useLocation();

  const { user, isAdmin } = useAuthStore(); // get user info from auth store
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <>
      {/* Only show for non-admin users */}
      {!isAdmin && <LanguageSwitcher />}
      {!isAdmin && <Chatbot />}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacyPolicy' element={<PrivacyPolicy />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='/sessionExpire' element={<SessionExpired />} />

        <Route element={<ProtectedUserRoutes />}>
          <Route element={<UserLayout />}>
            <Route path='/user/communityHub' element={<UserDashboard />} />
            <Route path='/user/myProfile' element={<MyProfile />} />
            <Route path='/user/submitComplaint' element={<SubmitComplaint />} />
            <Route path='/user/viewComplaintList' element={<ViewComplaintList />} />
            <Route path='/user/communityInbox' element={<Inbox />} />
          </Route>
        </Route>

        <Route element={<ProtectedAdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/viewUsers" element={<ViewUsers />} />
            <Route path="/admin/addUsers" element={<AddUsers />} />
            <Route path="/admin/viewAllComplaints" element={<ViewAllComplaints />} />
            <Route path="/admin/resolvedComplaints" element={<ResolvedComplaints />} />
            <Route path="/admin/addPost" element={<AddPost />} />
            <Route path="/admin/viewPosts" element={<ViewPosts />} />
            <Route path="/admin/communityinbox" element={<AdminInbox />} />
            <Route path="/admin/guestInbox" element={<AdminGuestMessages />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;