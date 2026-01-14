import './App.css'
import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useThemeStore } from "./Store/ThemeStore.js";
import { ToastContainer } from "react-toastify";
import Home from './Pages/Home.jsx'
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import ProtectedAdminRoutes from "./Routes/AdminRoutes.jsx";
import ProtectedUserRoutes from "./Routes/UserRoutes.jsx";
import AdminDashboard from './Pages/Admin/Dashboard.jsx';
import UserDashboard from './Pages/User/Dashboard.jsx';
import AdminLayout from "./Layouts/AdminLayout";
import ViewUsers from './Pages/Admin/ViewUsers.jsx';
import AddUsers from './Pages/Admin/AddUsers.jsx';
import UserLayout from './Layouts/UserLayout.jsx';
import MyProfile from './Pages/User/MyProfile.jsx';
import SubmitComplaint from './Pages/User/SubmitComplaint.jsx';
import ViewComplaintList from './Pages/User/ViewComplaintList.jsx';
import ViewAllComplaints from './Pages/Admin/ViewAllComplaints.jsx';

function App() {

  const dark = useThemeStore((state) => state.dark);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"   // 👈 THIS is important
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />

        <Route element={<ProtectedUserRoutes />}>
          <Route element={<UserLayout />}>
            <Route path='/user/dashboard' element={<UserDashboard />} />
            <Route path='/user/myProfile' element={<MyProfile />} />
            <Route path='/user/submitComplaint' element={<SubmitComplaint />} />
            <Route path='/user/viewComplaintList' element={<ViewComplaintList />} />
          </Route>
        </Route>


        <Route element={<ProtectedAdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/viewUsers" element={<ViewUsers />} />
            <Route path="/admin/addUsers" element={<AddUsers />} />
            <Route path="/admin/viewAllComplaints" element={<ViewAllComplaints />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
