import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useAdminStore } from "../../Store/AdminStore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function CategoryComplaintChart() {
  const { getYearlyCategoryStats } = useAdminStore();

  const [dataState, setDataState] = useState(null);
  const [sliderMonthIndex, setSliderMonthIndex] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchData = async () => {
      const data = await getYearlyCategoryStats();

      // 🔹 Filter out "special" from all data
      const filteredCurrentMonthStats = Object.fromEntries(
        Object.entries(data.currentMonthStats).filter(([key]) => key !== "special")
      );

      const filteredCategoryData = Object.fromEntries(
        Object.entries(data.categoryData).filter(([key]) => key !== "special")
      );

      setDataState({
        months: data.months,
        currentMonthStats: filteredCurrentMonthStats,
        categoryData: filteredCategoryData,
      });
    };
    fetchData();
  }, []);

  if (!dataState) return <p className="text-center">Loading...</p>;

  const { months, categoryData, currentMonthStats } = dataState;

  const categories = Object.keys(currentMonthStats);
  const values = Object.values(currentMonthStats);

  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const maxIndex = values.indexOf(Math.max(...values));
  const topCategory = categories[maxIndex];
  const topValue = values[maxIndex];

  // Line Chart Data
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Complaints Trend",
        data: values,
        borderColor: "#748dff",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(116,141,255,0.5)");
          gradient.addColorStop(1, "rgba(116,141,255,0)");
          return gradient;
        },
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: values.map((_, i) => (i === maxIndex ? 6 : 4)),
        pointHoverRadius: 7,
        pointBackgroundColor: values.map((_, i) =>
          i === maxIndex ? "#22c55e" : "#748dff"
        ),
        hoverBorderWidth: 4,
      },
    ],
  };

  // Slider Progress Data
  const monthValues = Object.keys(categoryData).map(cat => categoryData[cat][sliderMonthIndex]);
  const maxValue = Math.max(...monthValues, 1);
  const colors = ["#748dff", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];

  const handlePrev = () => setSliderMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  const handleNext = () => setSliderMonthIndex(prev => (prev === 11 ? 0 : prev + 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-slate-700"
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold dark:text-white">Complaint Insights</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {months[currentDate.getMonth()]} {year} • Category-wise analysis
        </p>
        <p className="text-xs text-gray-400 mt-1">
          🔥 Highest complaints:{" "}
          <span className="text-green-500 font-semibold">
            {topCategory} ({topValue})
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Line Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotateX: 2, rotateY: -2 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
                y: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } },
              },
              elements: { line: { borderJoinStyle: "round" } },
            }}
          />
        </motion.div>

        {/* Right: Slider Progress Bars */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Slider Header */}
          <div className="flex justify-between items-center mb-2">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer shadow-md"
            >
              ⬅
            </motion.button>

            <span className="text-sm font-semibold dark:text-white">
              {months[sliderMonthIndex]} {year}
            </span>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer shadow-md"
            >
              ➡
            </motion.button>
          </div>

          {/* Progress Bars */}
          {Object.keys(categoryData).map((cat, index) => {
            const value = categoryData[cat][sliderMonthIndex];
            const percentage = (value / maxValue) * 100;

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1 dark:text-gray-300">
                  <span>{cat}</span>
                  <span>{value}</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}