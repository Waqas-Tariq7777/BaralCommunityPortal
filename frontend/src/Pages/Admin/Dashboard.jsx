// Dashboard.jsx
import StatCard from "../../Components/Admin/StatCard";
import QuickAction from "../../Components/Admin/QuickAction";
import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/AdminStore";
import { useMessageStore } from "../../Store/MessageStore";
import { useGuestStore } from "../../Store/GuestStore";
import UserStatsChart from "../../Components/Admin/UserStatsChart";
import ResolvedComplaintsChart from "../../Components/Admin/ResolvedComplaintChart";
import CategoryComplaintChart from "../../Components/Admin/CategoryChart";
import { FiShield } from "react-icons/fi";

import {
  AiOutlineUser,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineMessage,
  AiOutlineNotification,
} from "react-icons/ai";

export default function Dashboard() {
  // ================= Users =================
  const [totalUsers, setTotalUsers] = useState(0);
  const { getUsersCount, getAnnouncementsCount, getComplaintStats, getMessagesCount, getResolutionProofStats } =
    useAdminStore();

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

  // ================= Announcements =================
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const count = await getAnnouncementsCount();
        setTotalAnnouncements(count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnnouncements();
  }, []);

  // ================= Complaints =================
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);

  useEffect(() => {
    const fetchComplaintStats = async () => {
      try {
        const stats = await getComplaintStats();
        setPendingComplaints(stats.pending);
        setResolvedComplaints(stats.resolved);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComplaintStats();
  }, []);

  // ================= Resolution Proof Stats =================
  const [proofStats, setProofStats] = useState({ totalProofs: 0, verifiedProofs: 0 });

  useEffect(() => {
    const fetchProofStats = async () => {
      try {
        const stats = await getResolutionProofStats();
        setProofStats(stats || { totalProofs: 0, verifiedProofs: 0 });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProofStats();
    const interval = setInterval(fetchProofStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // ================= Messages =================
  const [totalMessages, setTotalMessages] = useState(0);
  const { unreadCount, fetchUnreadCount } = useMessageStore();

  useEffect(() => {
    fetchUnreadCount();
    const fetchMessages = async () => {
      try {
        const count = await getMessagesCount();
        setTotalMessages(count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  // ================= Guest Messages =================
  const { unreadGuestCount, getUnreadCount } = useGuestStore();

  useEffect(() => {
    getUnreadCount();
  }, []);

  // ================= Combined Unread Pill =================
  const totalUnread = unreadCount + unreadGuestCount;
  const [showUnreadBreakdown, setShowUnreadBreakdown] = useState(false);

  // ================= Render =================
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 items-stretch">
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

        {/* 🛡️ Resolution Proofs Card */}
        <div className="relative h-full w-full">
          <StatCard
            title="Resolution Proofs"
            value={proofStats.totalProofs}
            icon={<FiShield className="dark:text-white text-xl" />}
            color="from-emerald-500 to-teal-400"
            className="dark:bg-slate-800 dark:text-white"
          />
          <span className="absolute top-2 right-2 bg-emerald-700/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            {proofStats.verifiedProofs} Verified
          </span>
        </div>

        {/* Messages + Combined Unread */}
        <div className="relative h-full w-full">
          <StatCard
            title="Messages"
            value={totalMessages}
            icon={<AiOutlineMessage className="dark:text-white" />}
            color="from-pink-500 to-pink-400"
            className="dark:bg-slate-800 dark:text-white"
          />

          {/* Combined unread pill */}
          {totalUnread > 0 && (
            <button
              onClick={() => setShowUnreadBreakdown(!showUnreadBreakdown)}
              className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md animate-pulse"
            >
              {totalUnread} Unread
            </button>
          )}

          {/* Breakdown popup */}
          {showUnreadBreakdown && (
            <div className="absolute top-12 right-2 w-48 p-3 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-xl shadow-lg z-50 ring-1 ring-white/20">
              <p className="flex justify-between items-center mb-2">
                <span className="font-semibold">Community Inbox</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-medium">{unreadCount}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="font-semibold">Guest Inbox</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-medium">{unreadGuestCount}</span>
              </p>
            </div>
          )}
        </div>
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

      {/* Charts */}
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