export default function StatCard({ title, value, icon, color }) {
  return (
    <div
      className={`
        p-5 rounded-xl shadow-lg
        bg-gradient-to-br ${color}
        text-white dark:text-gray-200
        dark:from-gray-800 dark:via-gray-700 dark:to-gray-900
        transform transition-transform duration-300 hover:scale-105
        hover:shadow-2xl hover:rotate-1
        relative overflow-hidden
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500
        before:opacity-20 before:animate-pulse
      `}
    >
      <div className="flex justify-between items-center relative z-10">
        <div>
          <p className="text-sm opacity-90 dark:opacity-80">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
