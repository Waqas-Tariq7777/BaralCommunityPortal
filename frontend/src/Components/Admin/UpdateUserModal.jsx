import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAdminStore } from "../../Store/AdminStore.js";

const UpdateUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const updateUser = useAdminStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    houseNumber: "",
    mobileNumber: "",
    designation: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prefill data
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        houseNumber: user.houseNumber || "",
        mobileNumber: user.mobileNumber || "",
        designation: user.designation || "",
        password: "",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await updateUser(user._id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 relative transform transition-all duration-300 scale-100 animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <AiOutlineClose size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Update User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* User Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              User Name
            </label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mobile Number
            </label>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* House Number */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              House Number
            </label>
            <input
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Designation
            </label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full rounded-lg border px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-500"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
