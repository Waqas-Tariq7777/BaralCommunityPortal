import React, { useRef, useState } from "react";
import { useAuthStore } from "../../Store/AuthStore.js";
import { useUserStore } from "../../Store/UserStore";
import { toast } from "react-toastify";
import { FiBell, FiCamera, FiMail, FiUser, FiPhone, FiHome, FiCalendar, FiBriefcase } from "react-icons/fi";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import ChangePasswordModal from "../../Components/User/ChangePasswordModal.jsx";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef(null);
  const uploadProfilePicture = useUserStore((state) => state.uploadProfilePicture);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture?.url);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error(t("user_id_not_found"));
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    try {
      const res = await uploadProfilePicture(userId, file);
      setPreviewUrl(res.data.url);
    } catch (err) {
      console.error(err);
      toast.error(t("profile_upload_failed"));
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="text-gray-500 dark:text-gray-400 text-center mt-10">{t("no_user_logged_in")}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{t("my_profile")}</h1>

      <div className="bg-white dark:bg-gray-900 dark:border dark:border-[#748dff] rounded-lg shadow-md p-6 space-y-6">

        <div className="flex flex-col sm:flex-row items-center justify-center sm:items-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center rounded-full border-2 border-blue-500 overflow-hidden">
                <LoadingSpinner size={40} color="#3b82f6" />
              </div>
            ) : (
              <img src={previewUrl || "/default-avatar.png"} alt={user.userName} className="w-full h-full rounded-full object-cover border-2 border-blue-500" loading="lazy" />
            )}

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfilePictureChange} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="cursor-pointer absolute bottom-0 right-0 bg-[#748dff] hover:bg-indigo-500 text-white p-2 rounded-full border border-white transition">
              <FiCamera />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{user.userName}</h2>
            <p className="text-[#748dff] dark:text-[#748dff] flex items-center justify-center sm:justify-start gap-2 truncate max-w-[220px] sm:max-w-[300px]">
              <FiMail /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: FiUser, label: t("name"), value: user.userName },
            { icon: FiMail, label: t("email"), value: user.email },
            { icon: FiPhone, label: t("mobile_number"), value: user.mobileNumber || t("not_available") },
            { icon: FiHome, label: t("house_number"), value: user.houseNumber || t("not_available") },
            { icon: FiBriefcase, label: t("designation"), value: user.designation || t("not_available") },
            { icon: FiCalendar, label: t("joined"), value: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : t("not_available") },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <item.icon className="text-gray-500 dark:text-[#748dff]" />
              <div className="min-w-0">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button onClick={() => setIsPasswordModalOpen(true)} className="cursor-pointer drop-shadow-xl bg-[#748dff] hover:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md transition-all hover:scale-105">
            {t("change_password")}
          </button>
        </div>

        <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} userId={user?._id || user?.id} />
      </div>
    </div>
  );
}