import StatCard from "../../Components/Admin/StatCard";
import QuickAction from "../../Components/Admin/QuickAction";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/AdminStore";
import UserStatsChart from "../../Components/Admin/UserStatsChart";
import ResolvedComplaintsChart from "../../Components/Admin/ResolvedComplaintChart";
import CategoryComplaintChart from "../../Components/Admin/CategoryChart";
import {
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineMessage,
  AiOutlineNotification,
} from "react-icons/ai";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
const { getUsersCount } = useAdminStore();

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const count = await getUsersCount();
      setTotalUsers(count);
    } catch (error) {
      console.error(error);
    }
  };

  fetchUsers();
}, []);

const [totalAnnouncements, setTotalAnnouncements] = useState(0);
const { getAnnouncementsCount } = useAdminStore();

useEffect(() => {
  const fetchAnnouncements = async () => {
    const count = await getAnnouncementsCount();
    setTotalAnnouncements(count);
  };
  fetchAnnouncements();
}, []);

const [pendingComplaints, setPendingComplaints] = useState(0);
const [resolvedComplaints, setResolvedComplaints] = useState(0);
const { getComplaintStats } = useAdminStore();

useEffect(() => {
  const fetchComplaintStats = async () => {
    const stats = await getComplaintStats();
    setPendingComplaints(stats.pending);
    setResolvedComplaints(stats.resolved);
  };
  fetchComplaintStats();
}, []);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<AiOutlineUser className="dark:text-white" />}
          color="from-blue-500 to-blue-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Pending Complaints"
          value={pendingComplaints}
          icon={<AiOutlineClockCircle className="dark:text-white" />}
          color="from-yellow-500 to-yellow-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Announcements"
           value={totalAnnouncements}
          icon={<AiOutlineNotification className="dark:text-white" />}
          color="from-purple-500 to-purple-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Completed"
          value={resolvedComplaints}
          icon={<AiOutlineCheckCircle className="dark:text-white" />}
          color="from-green-500 to-green-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Messages"
          value="15"
          icon={<AiOutlineMessage className="dark:text-white" />}
          color="from-pink-500 to-pink-400"
          className="dark:bg-slate-800 dark:text-white"
        />
      </div>

      {/* Quick Actions */}
      <div>
  <h3 className="font-semibold mb-4 dark:text-white">Quick Actions</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    <QuickAction
      label="Add New User"
      icon={<AiOutlineUser className="dark:text-white" />}
      color="border-blue-500"
      to="/admin/addUsers"
    />
    <QuickAction
      label="View Users"
      icon={<AiOutlineUser className="dark:text-white" />}
      color="border-green-500"
      to="/admin/viewUsers"
    />
    <QuickAction
      label="Pending Complaints"
      icon={<AiOutlineClockCircle className="dark:text-white" />}
      color="border-yellow-500"
      to="/admin/viewAllComplaints"
    />
    <QuickAction
      label="Add Announcement"
      icon={<AiOutlineNotification className="dark:text-white" />}
      color="border-purple-500"
      to="/admin/addPost"
    />
  </div>
</div>
      {/* User Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserStatsChart />
        <ResolvedComplaintsChart />
      </div>
      <div className="mt-6">
  <CategoryComplaintChart />
</div>
    </div>
  );
}
