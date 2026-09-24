import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList, AiOutlineMail, AiOutlinePhone, AiOutlineHome, AiOutlineCalendar, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAdminStore } from "../../Store/AdminStore.js";
import moment from "moment";
import { debounce } from "lodash";
import UpdateUserModal from "../../Components/Admin/UpdateUserModal.jsx";
import ViewUserModal from "../../Components/Admin/ViewUserModal.jsx";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal.jsx";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import { FiSearch, FiUserX, FiKey, FiEye, FiEyeOff } from "react-icons/fi";

// capitalize words helper
const capitalizeWords = (str) => str ? str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

const UserManagement = () => {
  // state
  const [users, setUsers] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [view, setView] = useState("grid");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewMoreClicked, setViewMoreClicked] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [visiblePasswordUserId, setVisiblePasswordUserId] = useState(null);
  // store functions
  const getUsers = useAdminStore((state) => state.getUsers);
  const deleteUser = useAdminStore((state) => state.deleteUser);

  // fetch users
  const fetchUsers = useCallback(async ({ reset = false } = {}) => {
    if (initialLoading || loadingMore) return;

      if (reset && users.length === 0) {
        setInitialLoading(true);   // ONLY first load
      } else {
        setLoadingMore(true);      // View More & View Less
      }
    
    try {
      const res = await getUsers({ limit: 12, lastId: reset ? null : lastId, search });
      const usersData = res?.data ?? [];
      const meta = res?.meta ?? {};
      if (reset) setUsers(usersData); else setUsers((prev) => [...prev, ...usersData]);
      setLastId(usersData.length ? usersData[usersData.length - 1]._id : null);
      setHasMore(typeof meta.hasMore === "boolean" ? meta.hasMore : usersData.length === 12);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setInitialLoading(false);
        setLoadingMore(false);
    }
  }, [getUsers, lastId, search, initialLoading,
      loadingMore,
      users.length]);

  // debounced search
  const debouncedSearch = useCallback(debounce((value) => {
    setLastId(null); setHasMore(true); setUsers([]); setSearch(value);
  }, 400), []);

  // fetch on search change
  useEffect(() => { fetchUsers({ reset: true }); }, [search]);

  // view less handler
  const handleViewLess = () => { setUsers([]); setLastId(null); setHasMore(true); fetchUsers({ reset: true }); };

  // delete user handler
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteUser(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));

      // Refetch one more complaint to fill empty space if there are more
      if (hasMore) fetchUsers();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleteLoading(false);  // hide loader
    }
  };

  return (
    <div className="min-h-screen p-6 dark:bg-slate-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h1>

      {/* SEARCH & VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-3 sm:space-y-0">

        {/* SEARCH INPUT WITH ICON */}
        <div className="relative w-full sm:w-1/2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            value={searchInput}
            placeholder="Search users..."
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff] transition-all"
          />
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex space-x-2">
          <button
            onClick={() => setView("grid")}
            className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "grid"
              ? "bg-[#748dff] text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"
              }`}
          >
            <AiOutlineAppstore size={20} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "list"
              ? "bg-[#748dff] text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"
              }`}
          >
            <AiOutlineUnorderedList size={20} />
          </button>
        </div>

      </div>


      {/* LOADING / NO USERS */}
       {initialLoading ? (
              <div className="flex justify-center mt-20">
                <LoadingSpinner size={60} color="#748dff" />
              </div>
            ) : users.length === 0 ? (
              (() => {
                const isFiltered = search !== "";
                let title = "No Users Found";
                let desc = "There are no users registered in the system yet.";

                if (isFiltered) {
                  title = "No Matching Users";
                  desc = `We couldn't find any users matching "${search}".`;
                }

                return (
                  <div className="flex flex-col items-center justify-center mt-16 text-center transition-all duration-300">
                    <div className="w-16 h-16 bg-[#f0f4ff]/50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 text-[#748dff] animate-pulse">
                      <FiUserX size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                      {desc}
                    </p>
                    {isFiltered && (
                      <button
                        onClick={() => {
                          setSearchInput("");
                          setSearch("");
                        }}
                        className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#748dff]/10 hover:bg-[#748dff]/20 text-[#748dff] font-semibold rounded-lg transition-all duration-200"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                );
              })()
            )  : (

          <>
            {/* GRID VIEW */}
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0">
                {users.map((user) => (
                  <div key={user._id} className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] shadow-md rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between transform hover:scale-[1.01] transition-all duration-300 min-w-0 overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img src={user.profilePicture?.url || "/default-avatar.png"} alt={user.userName} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h2 className="font-bold text-gray-900 dark:text-white truncate">{capitalizeWords(user.userName)}</h2>
                          <p className="text-[#748dff] dark:text-[#748dff] text-xs font-semibold truncate">
                            {user.designation || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
                        <p className="flex items-center gap-2 min-w-0 text-sm">
                          <AiOutlineMail className="text-orange-300 text-lg flex-shrink-0 dark:text-[#748dff]" />
                          <span className="truncate flex-1">{user.email}</span>
                        </p>

                        {/* PASSWORD FIELD WITH PRESS & HOLD EYE BUTTON */}
                        <div className="flex items-center justify-between gap-1.5 min-w-0 text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FiKey className="text-purple-400 text-lg flex-shrink-0 dark:text-[#748dff]" />
                            <span className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200 truncate" title={visiblePasswordUserId === user._id ? (user.password || "••••••••") : undefined}>
                              {visiblePasswordUserId === user._id ? (user.rawPassword || user.password || "••••••••") : "••••••••"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onMouseDown={() => setVisiblePasswordUserId(user._id)}
                            onMouseUp={() => setVisiblePasswordUserId(null)}
                            onMouseLeave={() => setVisiblePasswordUserId(null)}
                            onTouchStart={() => setVisiblePasswordUserId(user._id)}
                            onTouchEnd={() => setVisiblePasswordUserId(null)}
                            onTouchCancel={() => setVisiblePasswordUserId(null)}
                            onContextMenu={(e) => e.preventDefault()}
                            className="cursor-pointer p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all shrink-0 select-none active:scale-95"
                            title="Click and hold to reveal password"
                          >
                            {visiblePasswordUserId === user._id ? (
                              <FiEyeOff className="text-base text-blue-500" />
                            ) : (
                              <FiEye className="text-base" />
                            )}
                          </button>
                        </div>

                        <p className="flex items-center gap-2"><AiOutlinePhone className="text-green-300 dark:text-[#748dff] text-lg shrink-0" /> <span className="truncate">{user.mobileNumber}</span></p>
                        <p className="flex items-center gap-2"><AiOutlineHome className="text-blue-300 dark:text-[#748dff] text-lg shrink-0" /> <span className="truncate">{user.houseNumber}</span></p>
                        <p className="flex items-center gap-2"><AiOutlineCalendar className="text-pink-300 dark:text-[#748dff] text-lg shrink-0" /> <span className="truncate">{moment(user.createdAt).format("MMMM D, YYYY")}</span></p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 min-w-0">
                      <button onClick={() => { setSelectedUser(user); setShowViewModal(true); }} className="cursor-pointer flex-1 min-w-[60px] sm:min-w-[65px] flex items-center justify-center gap-1 px-2.5 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-xl text-xs font-semibold transition dark:bg-slate-800 dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-[#748dff] dark:hover:text-white"><AiOutlineEye className="text-sm shrink-0" /> View</button>
                      <button onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }} className="cursor-pointer flex-1 min-w-[60px] sm:min-w-[65px] flex items-center justify-center gap-1 px-2.5 py-2 bg-[#f0fdf4] hover:bg-green-200 text-[#09a946] rounded-xl text-xs font-semibold transition dark:bg-slate-800 dark:border dark:border-[#09a946] dark:text-[#09a946] dark:hover:bg-green-200"><AiOutlineEdit className="text-sm shrink-0" /> Edit</button>
                      <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="cursor-pointer shrink-0 flex items-center justify-center px-2.5 py-2 bg-[#ffe2e2] hover:bg-red-200 text-[#e91721] rounded-xl text-xs transition dark:bg-slate-800 dark:border dark:border-[#e91721] dark:text-[#e91721] dark:hover:bg-red-200" title="Delete"><AiOutlineDelete className="text-sm shrink-0" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="overflow-x-auto sm:overflow-x-auto rounded-2xl dark:border dark:border-[#748dff]">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200 table-fixed">
                  <thead className="bg-blue-50 dark:bg-indigo-400 text-gray-800 dark:text-gray-200 uppercase text-xs font-semibold sticky top-0">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-2xl w-[170px]">User</th>
                      <th className="px-6 py-3 w-[150px]">Email</th>
                      <th className="px-6 py-3 w-[130px]">Password</th>
                      <th className="px-6 py-3 w-[110px]">Phone</th>
                      <th className="px-6 py-3 w-[100px]">House</th>
                      <th className="px-6 py-3 w-[120px]">Designation</th>
                      <th className="px-6 py-3 w-[120px]">Joined</th>
                      <th className="px-6 py-3 text-center rounded-tr-2xl w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const isLast = index === users.length - 1;
                      return (
                        <tr
                          key={user._id}
                          className={`border-t transition hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-t-[#748dff] ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-900"
                            }`}
                        >
                          {/* USER */}
                          <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${isLast ? "rounded-bl-2xl" : ""}`}>
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={user.profilePicture?.url || "/default-avatar.png"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 flex-shrink-0"
                              />
                              <span className="font-medium text-gray-900 dark:text-white flex-1 min-w-0 truncate">
                                {capitalizeWords(user.userName) || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* EMAIL */}
                          <td className="px-6 py-4 truncate max-w-[150px]">
                            {user.email}
                          </td>

                          {/* PASSWORD WITH PRESS & HOLD EYE BUTTON */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-mono text-xs text-slate-700 dark:text-slate-200 truncate max-w-[80px]" title={visiblePasswordUserId === user._id ? (user.password || "••••••••") : undefined}>
                                {visiblePasswordUserId === user._id ? (user.rawPassword || user.password || "••••••••") : "••••••••"}
                              </span>
                              <button
                                type="button"
                                onMouseDown={() => setVisiblePasswordUserId(user._id)}
                                onMouseUp={() => setVisiblePasswordUserId(null)}
                                onMouseLeave={() => setVisiblePasswordUserId(null)}
                                onTouchStart={() => setVisiblePasswordUserId(user._id)}
                                onTouchEnd={() => setVisiblePasswordUserId(null)}
                                onTouchCancel={() => setVisiblePasswordUserId(null)}
                                onContextMenu={(e) => e.preventDefault()}
                                className="cursor-pointer p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all shrink-0 select-none active:scale-95"
                                title="Click and hold to reveal password"
                              >
                                {visiblePasswordUserId === user._id ? (
                                  <FiEyeOff className="text-sm text-blue-500" />
                                ) : (
                                  <FiEye className="text-sm" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* PHONE */}
                          <td className="px-6 py-4 truncate">
                            {user.mobileNumber}
                          </td>

                          {/* HOUSE */}
                          <td className="px-6 py-4 truncate">
                            {user.houseNumber}
                          </td>

                          {/* DESIGNATION */}
                          <td className="px-6 py-4 truncate max-w-[120px]">
                            {user.designation || "N/A"}
                          </td>

                          {/* JOINED DATE */}
                          <td className="px-6 py-4">{moment(user.createdAt).format("MMMM D, YYYY")}</td>

                          {/* ACTIONS */}
                          <td
                            className={`px-6 py-4 ${isLast ? "rounded-br-2xl" : ""}`}
                          >
                            <div className="flex items-center justify-center gap-2 h-full">
                              <button
                                onClick={() => { setSelectedUser(user); setShowViewModal(true); }}
                                className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-[#748dff] dark:hover:text-white"
                              >
                                <AiOutlineEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }}
                                className="cursor-pointer p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-800 transition dark:bg-transparent dark:border dark:border-[#09a946]"
                              >
                                <AiOutlineEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                                className="cursor-pointer p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition dark:bg-transparent dark:border dark:border-[#e91721]"
                              >
                                <AiOutlineDelete className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            )}
          </>
        )}

            {!initialLoading && (
              <div className="mt-6 text-center flex justify-center gap-4">
                {hasMore && (
                  <button
                    onClick={() => {
                      setViewMoreClicked(true);
                      fetchUsers();
                    }}
                    disabled={loadingMore}
                    className="flex items-center justify-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer disabled:opacity-70"
                  >
                    {loadingMore && <LoadingSpinner size={18} color="#fff" />}
                    {loadingMore ? "Loading..." : "View More"}
                  </button>
                )}
      
                {!hasMore && users.length > 12 && viewMoreClicked && (
                  <button
                    onClick={async () => {
                      setIsCollapsing(true);        // 1️⃣ keep button + show loader
                      await fetchUsers({ reset: true });
                      setIsCollapsing(false);       // 2️⃣ stop loader
                      setViewMoreClicked(false);    // 3️⃣ NOW hide button
                    }}
                    disabled={loadingMore || isCollapsing}
                    className="flex items-center justify-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer disabled:opacity-70"
                  >
                    {(loadingMore || isCollapsing) && (
                      <LoadingSpinner size={18} color="#fff" />
                    )}
                    {(loadingMore || isCollapsing) ? "Loading..." : "View Less"}
                  </button>
      
      
                )}
              </div>
            )}

      {/* MODALS */}
      <ViewUserModal isOpen={showViewModal} user={selectedUser} onClose={() => setShowViewModal(false)} />
      <UpdateUserModal isOpen={showUpdateModal} user={selectedUser} onClose={() => setShowUpdateModal(false)} onSuccess={() => fetchUsers({ reset: true })} />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        loading={deleteLoading}    // ✅ add this
        title="Delete User?"
        message={`Are you sure you want to delete ${userToDelete?.userName}? This action cannot be undone.`}
      />

    </div>
  );
};

export default UserManagement;
