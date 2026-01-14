import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList, AiOutlineMail, AiOutlinePhone, AiOutlineHome, AiOutlineCalendar, AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useAdminStore } from "../../Store/AdminStore.js";
import moment from "moment";
import { debounce } from "lodash";
import UpdateUserModal from "../../Components/Admin/UpdateUserModal.jsx";
import ViewUserModal from "../../Components/Admin/ViewUserModal.jsx";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal.jsx";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import { FiSearch } from "react-icons/fi";

// capitalize words helper
const capitalizeWords = (str) => str ? str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

const UserManagement = () => {
  // state
  const [users, setUsers] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // grid or list
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewMoreClicked, setViewMoreClicked] = useState(false);

  // store functions
  const getUsers = useAdminStore((state) => state.getUsers);
  const deleteUser = useAdminStore((state) => state.deleteUser);

  // fetch users
  const fetchUsers = useCallback(async ({ reset = false } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getUsers({ limit: 8, lastId: reset ? null : lastId, search });
      const usersData = res?.data ?? [];
      const meta = res?.meta ?? {};
      if (reset) setUsers(usersData); else setUsers((prev) => [...prev, ...usersData]);
      setLastId(usersData.length ? usersData[usersData.length - 1]._id : null);
      setHasMore(typeof meta.hasMore === "boolean" ? meta.hasMore : usersData.length === 8);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [getUsers, lastId, search, loading]);

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
      await deleteUser(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h1>

     {/* SEARCH & VIEW TOGGLE */}
<div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-3 sm:space-y-0">

  {/* SEARCH INPUT WITH ICON */}
  <div className="relative w-full sm:w-1/2">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
    <input
      type="text"
      placeholder="Search users..."
      onChange={(e) => debouncedSearch(e.target.value)}
      className="border rounded px-4 py-2 pl-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#748dff] transition-all"
    />
  </div>

  {/* VIEW TOGGLE */}
  <div className="flex space-x-2">
    <button
      onClick={() => setView("grid")}
      className={`cursor-pointer p-2 rounded transition-colors duration-200 ${
        view === "grid"
          ? "bg-[#748dff] text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"
      }`}
    >
      <AiOutlineAppstore size={20} />
    </button>

    <button
      onClick={() => setView("list")}
      className={`cursor-pointer p-2 rounded transition-colors duration-200 ${
        view === "list"
          ? "bg-[#748dff] text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"
      }`}
    >
      <AiOutlineUnorderedList size={20} />
    </button>
  </div>

</div>


      {/* LOADING / NO USERS */}
      {loading ? <div className="flex justify-center items-center mt-20"><LoadingSpinner size={60} color="#748dff" /></div> :
        users.length === 0 ? <div className="text-center text-gray-500 dark:text-gray-400 mt-20 text-lg">No users found.</div> : (

          <>
            {/* GRID VIEW */}
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {users.map((user) => (
                  <div key={user._id} className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] shadow-md rounded-lg p-6 space-y-4 transform hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center space-x-4">
                      <img src={user.profilePicture?.url || "/default-avatar.png"} alt={user.userName} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400" />
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">{capitalizeWords(user.userName)}</h2>
                        <p className="text-[#748dff] dark:text-[#748dff] text-sm">{user.designation || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                      <p className="flex items-center gap-2"><AiOutlineMail className="text-orange-300 dark:text-[#748dff]" /> {user.email}</p>
                      <p className="flex items-center gap-2"><AiOutlinePhone className="text-green-300 dark:text-[#748dff]" /> {user.mobileNumber}</p>
                      <p className="flex items-center gap-2"><AiOutlineHome className="text-blue-300 dark:text-[#748dff]" /> {user.houseNumber}</p>
                      <p className="flex items-center gap-2"><AiOutlineCalendar className="text-pink-300 dark:text-[#748dff]" /> {moment(user.createdAt).format("MMMM D, YYYY")}</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-3 mt-3">
                      <button onClick={() => { setSelectedUser(user); setShowViewModal(true); }} className="cursor-pointer flex items-center gap-1 px-3 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded transition dark:bg-[#748dff] dark:text-white dark:hover:bg-indigo-500"><AiOutlineEye /> View</button>
                      <button onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }} className=" cursor-pointer flex items-center gap-1 px-3 py-2 bg-[#f0fdf4] hover:bg-green-200 text-[#09a946] rounded transition dark:bg-[#748dff] dark:text-white dark:hover:bg-indigo-500"><AiOutlineEdit /> Edit</button>
                      <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="cursor-pointer px-3 py-2 bg-[#ffe2e2] hover:bg-red-200 text-[#e91721] rounded transition"><AiOutlineDelete /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-[#748dff]">
                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                  <thead className="bg-blue-50 dark:bg-indigo-400 text-gray-800 dark:text-gray-200 uppercase text-xs font-semibold sticky top-0">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-2xl">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">House</th>
                      <th className="px-6 py-3">Designation</th>
                      <th className="px-6 py-3">Joined</th>
                      <th className="px-6 py-3 text-center rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const isLast = index === users.length - 1;
                      return (
                        <tr key={user._id} className={`border-t transition hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-t-[#748dff] ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}`}>
                          <td className={`px-6 py-4 font-medium text-gray-900 dark:text-white ${isLast ? "rounded-bl-2xl" : ""}`}>{capitalizeWords(user.userName)}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.mobileNumber}</td>
                          <td className="px-6 py-4">{user.houseNumber}</td>
                          <td className="px-6 py-4">{user.designation || "N/A"}</td>
                          <td className="px-6 py-4">{moment(user.createdAt).format("MMMM D, YYYY")}</td>
                          <td className={`px-6 py-4 flex justify-center space-x-3 ${isLast ? "rounded-br-2xl" : ""}`}>
                            <button onClick={() => { setSelectedUser(user); setShowViewModal(true); }} className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition dark:bg-[#748dff] dark:text-white dark:hover:bg-indigo-500 dark:hover:text-white"><AiOutlineEye className="w-5 h-5" /></button>
                            <button onClick={() => { setSelectedUser(user); setShowUpdateModal(true); }} className="cursor-pointer p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-800 transition dark:bg-[#748dff] dark:text-white dark:hover:bg-indigo-500 dark:hover:text-white"><AiOutlineEdit className="w-5 h-5" /></button>
                            <button onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }} className="cursor-pointer p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition"><AiOutlineDelete className="w-5 h-5" /></button>
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

      {/*  VIEW MORE / LESS */}
      <div className="mt-6 text-center flex justify-center gap-4">
        {hasMore && !loading && <button onClick={() => { fetchUsers(); setViewMoreClicked(true); }} className="bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer">View More</button>}
        {viewMoreClicked && <button onClick={() => { handleViewLess(); setViewMoreClicked(false); }} className="bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer">View Less</button>}
      </div>

      {/* MODALS */}
      <ViewUserModal isOpen={showViewModal} user={selectedUser} onClose={() => setShowViewModal(false)} />
      <UpdateUserModal isOpen={showUpdateModal} user={selectedUser} onClose={() => setShowUpdateModal(false)} onSuccess={() => fetchUsers({ reset: true })} />
      <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteUser} title="Delete User?" message={`Are you sure you want to delete ${userToDelete?.userName}? This action cannot be undone.`} />
    </div>
  );
};

export default UserManagement;
