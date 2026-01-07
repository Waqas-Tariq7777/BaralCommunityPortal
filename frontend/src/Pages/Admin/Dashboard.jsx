import StatCard from "../../Components/Admin/StatCard";
import QuickAction from "../../Components/Admin/QuickAction";
import { Link } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineMessage,
  AiOutlineNotification,
} from "react-icons/ai";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Total Users"
          value="2847"
          icon={<AiOutlineUser className="dark:text-white" />}
          color="from-blue-500 to-blue-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Pending Complaints"
          value="42"
          icon={<AiOutlineClockCircle className="dark:text-white" />}
          color="from-yellow-500 to-yellow-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Announcements"
          value="8"
          icon={<AiOutlineNotification className="dark:text-white" />}
          color="from-purple-500 to-purple-400"
          className="dark:bg-slate-800 dark:text-white"
        />
        <StatCard
          title="Completed"
          value="120"
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
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      to="/admin/pendingComplaints"
    />
    <QuickAction
      label="Add Announcement"
      icon={<AiOutlineNotification className="dark:text-white" />}
      color="border-purple-500"
      to="/admin/addAnnouncement"
    />
  </div>
</div>

    </div>
  );
}
