import { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { useAdminStore } from "../../Store/AdminStore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResolvedComplaintsChart() {
  const [stats, setStats] = useState({ totalComplaints: 0, counts: {} });
  const { getMonthlyComplaintStats } = useAdminStore();
  const chartRef = useRef();

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getMonthlyComplaintStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  const { counts, totalComplaints } = stats;

  const labels = ["Pending", "In Progress", "Rejected", "Resolved"];
  const colors = [
    "rgba(250,204,21,0.6)", // Pending - blue
    "rgba(116,141,255,0.6)",  // In Progress - yellow
    "rgba(248,113,113,0.6)", // Rejected - red
    "rgba(34,197,94,0.6)",   // Resolved - green
  ];
  const borderColors = [
    "rgba(250,204,21,1)",
    "rgba(116,141,255,1)",
    "rgba(248,113,113,1)",
    "rgba(34,197,94,1)",
  ];

  const data = {
    labels,
    datasets: [
      {
        data: labels.map((label) => counts[label.toLowerCase()] || 0),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        hoverOffset: 15, // slightly larger hover effect
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 20,
          padding: 20,
          font: { size: 14, weight: "600" },
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percent = totalComplaints
                ? ((value / totalComplaints) * 100).toFixed(1)
                : 0;

              return {
                text: `${label}: ${percent}%`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.borderColor[i],
                fontColor: dataset.borderColor[i], // ✅ match text with legend color
                hidden: false,
                index: i,
              };
            });
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            const percent = totalComplaints
              ? ((value / totalComplaints) * 100).toFixed(1)
              : 0;
            return `${context.label}: ${value} (${percent}%)`;
          },
        },
        backgroundColor: "#1e293b",
        titleColor: "#fef3c7",
        bodyColor: "#fef3c7",
        titleFont: { weight: "600" },
        bodyFont: { weight: "500" },
      },
    },
    animation: { duration: 1500, easing: "easeInOutQuart" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative z-50 p-6 rounded-2xl border
                 bg-white/5 dark:bg-transparent dark:border-[#748dff] backdrop-blur-xl
                 border-gray-200 
                 shadow-2xl flex flex-col items-center"
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#748dff] drop-shadow-lg">
            Monthly Complaints
          </h2>
          <p className="text-sm text-gray-600">
            Complaint Status Overview (Current Month)
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Complaints</p>
          <h3 className="text-3xl font-extrabold text-[#748dff] drop-shadow-md">
            {totalComplaints || 0}
          </h3>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="relative h-64 w-full">
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>
    </motion.div>
  );
}