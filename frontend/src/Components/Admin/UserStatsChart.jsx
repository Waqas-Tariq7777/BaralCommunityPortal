import { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { useAdminStore } from "../../Store/AdminStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function UserStatsChart() {
  const [stats, setStats] = useState({ totalUsers: 0, weekStats: [] });
  const { getUserStats } = useAdminStore();
  const chartRef = useRef();

  // Fetch stats for last 5 weeks
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getUserStats(); // should return { totalUsers, weekStats: [{label, addedUsers, deletedUsers}, ...] }
      setStats(data);
    };
    fetchStats();
  }, []);

  // Dynamic gradients for bars
  const getGradients = (ctx, chartArea) => {
    const addedGradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    addedGradient.addColorStop(0, "#4ade80"); // green
    addedGradient.addColorStop(1, "#16a34a");

    const deletedGradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    deletedGradient.addColorStop(0, "#f87171"); // red
    deletedGradient.addColorStop(1, "#b91c1c");

    return { addedGradient, deletedGradient };
  };

  const data = {
    labels: stats.weekStats.map((w) => w.label), // e.g., "13/3 - 19/3"
    datasets: [
      {
        label: "Added Users",
        data: stats.weekStats.map((w) => w.addedUsers),
        barThickness: 14,
        borderRadius: 2,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "#4ade80";
          const { addedGradient } = getGradients(ctx, chartArea);
          return addedGradient;
        },
      },
      {
        label: "Deleted Users",
        data: stats.weekStats.map((w) => w.deletedUsers),
        barThickness: 14,
        borderRadius: 2,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "#f87171";
          const { deletedGradient } = getGradients(ctx, chartArea);
          return deletedGradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e2e8f0",
          font: { size: 14, weight: "500" },
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fef3c7",
        bodyColor: "#fef3c7",
        titleFont: { weight: "600" },
        bodyFont: { weight: "500" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#f1f5f9", font: { weight: "500" } },
        title: { display: true, text: "Weekly Activity", color: "#c7d2fe", font: { size: 14 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#f1f5f9", font: { weight: "500" } },
        title: { display: true, text: "Users Count", color: "#c7d2fe", font: { size: 14 } },
        grid: { color: "rgba(203,213,225,0.2)" },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    datasets: {
      bar: {
        categoryPercentage: 0.6,
        barPercentage: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-50 p-6 rounded-2xl border
                 bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-300
                 backdrop-blur-xl
                 border-gray-200 dark:border-slate-700
                 shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white drop-shadow-lg">
            User Analytics
          </h2>
          <p className="text-sm text-indigo-100/80">Added vs Deleted Users (Last 5 Weeks)</p>
        </div>

        {/* Total Users */}
        <div className="text-right">
          <p className="text-sm text-indigo-100/70">Total Users</p>
          <h3 className="text-3xl font-extrabold text-white drop-shadow-md">
            {stats?.totalUsers || 0}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </motion.div>
  );
}