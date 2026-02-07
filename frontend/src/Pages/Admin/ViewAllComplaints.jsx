import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineAppstore, AiOutlineUnorderedList, AiOutlineMail, AiOutlinePhone, AiOutlineCalendar, AiOutlineEye } from "react-icons/ai";
import { RiFolderSettingsLine } from "react-icons/ri";
import { FiSearch, FiClock, FiFilter, FiUser, FiLayers } from "react-icons/fi";
import { useComplaintStore } from "../../Store/ComplaintStore.js";
import moment from "moment";
import { debounce } from "lodash";
import ViewAdminComplaintModal from "../../Components/Admin/ViewAdminComplaintModal.jsx";
import EditComplaintModal from "../../Components/User/UpdateComplaintModal.jsx";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal.jsx";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";

// Helper
const capitalizeWords = (str) => str ? str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Any");
  const [view, setView] = useState("grid");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [viewMoreClicked, setViewMoreClicked] = useState(false);
  const isFetchingRef = React.useRef(false);


  const getAllComplaints = useComplaintStore(state => state.getAllComplaints);
  const deleteComplaint = useComplaintStore(state => state.deleteComplaint);
  const markComplaintAsRead = useComplaintStore(state => state.markComplaintAsRead);


  const fetchComplaints = useCallback(async ({ reset = false } = {}) => {
    if (isFetchingRef.current) return;
    if (initialLoading || loadingMore) return;
    isFetchingRef.current = true;
    if (reset && complaints.length === 0) {
      setInitialLoading(true);   // ONLY first load
    } else {
      setLoadingMore(true);      // View More & View Less
    }

    try {
      const res = await getAllComplaints({
        limit: 12,
        lastId: reset ? null : lastId,
        search,
        type: typeFilter,
        status: statusFilter
      });

      const data = res?.data ?? [];
      const meta = res?.meta ?? {};

      setComplaints(prev => {
        if (reset) return data;

        const existingIds = new Set(prev.map(c => c._id));
        const uniqueNew = data.filter(c => !existingIds.has(c._id));
        return [...prev, ...uniqueNew];
      });

      setLastId(data.length ? data[data.length - 1]._id : null);
      setHasMore(
        typeof meta.hasMore === "boolean"
          ? meta.hasMore
          : data.length === 12
      );
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      isFetchingRef.current = false;
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, [getAllComplaints, lastId, search, typeFilter, statusFilter, initialLoading,
    loadingMore,
    complaints.length]);


  const debouncedSearch = useCallback(debounce(value => { setLastId(null); setHasMore(true); setComplaints([]); setSearch(value); }, 400), []);

  useEffect(() => { fetchComplaints({ reset: true }); }, [search, typeFilter, statusFilter]);

  const handleViewLess = () => { setComplaints([]); setLastId(null); setHasMore(true); fetchComplaints({ reset: true }); };
  const handleDeleteComplaint = async () => { if (!complaintToDelete) return; try { await deleteComplaint(complaintToDelete._id); setComplaints(prev => prev.filter(c => c._id !== complaintToDelete._id)); setShowDeleteModal(false); } catch (err) { console.error("Failed to delete complaint:", err); } };

  // Remove complaint from list after it is resolved
  const handleComplaintResolved = (resolvedComplaintId) => {
    setComplaints(prev => prev.filter(c => c._id !== resolvedComplaintId));
  };


  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Complaint Management</h1>

      {/* SEARCH & FILTERS & VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
            <input type="text" placeholder="Search Complaints..." onChange={e => debouncedSearch(e.target.value)} className="w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all" />
          </div>

          {/* TYPE FILTER */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="appearance-none w-40 pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all cursor-pointer">
              <option value="All">Type</option>
              <option value="general">General</option>
              <option value="special">Special</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none w-44 pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all cursor-pointer">
              <option value="Any">Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="rejected">Rejected</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button onClick={() => setView("grid")} className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "grid" ? "bg-[#748dff] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"}`}><AiOutlineAppstore size={20} /></button>
          <button onClick={() => setView("list")} className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "list" ? "bg-[#748dff] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"}`}><AiOutlineUnorderedList size={20} /></button>
        </div>
      </div>

      {/* LOADING / NO DATA */}
      {initialLoading ? (
        <div className="flex justify-center mt-20">
          <LoadingSpinner size={60} color="#748dff" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          No complaints found.
        </div>
      ) :
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {complaints.map(c => (
                <div key={c._id} className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] shadow-md rounded-lg p-6 space-y-3 transform hover:scale-105 transition-transform duration-300">
                  <div className="space-y-3 text-gray-700 dark:text-gray-200">
                    <p className="flex text-sm items-center gap-2"><FiUser className="text-indigo-300 text-lg dark:text-[#748dff]" /> {c.userId?.userName}</p>
                    <p className="flex items-center gap-2 min-w-0 text-sm">
                      <AiOutlineMail className="text-orange-300 text-lg flex-shrink-0 dark:text-[#748dff]" />
                      <span className="truncate flex-1">{c.userId.email}</span>
                    </p>
                    <p className="flex text-sm items-center gap-2"><AiOutlinePhone className="text-green-300 text-lg dark:text-[#748dff]" /> {c.userId?.mobileNumber}</p>
                    <p className="flex text-sm items-center gap-2"><AiOutlineCalendar className="text-pink-300 text-lg dark:text-[#748dff]" /> {moment(c.createdAt).format("MMMM D, YYYY")}</p>

                    <div className="flex flex-col w-[100%] gap-2 mt-2">
                      <div className="flex items-center gap-2"><FiLayers className="text-lg text-[#6e11b0]" /><span className="px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">{capitalizeWords(c.complaintType)}</span></div>
                      <div className="flex items-center gap-2"><FiClock className="text-lg text-[#894b00]" /><span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status.toLowerCase() === "pending" ? "bg-[#fef9c2] text-[#894b00]" : c.status.toLowerCase() === "in progress" ? "bg-[#eff6ff]  text-[#155dfc]" : c.status.toLowerCase() === "resolved" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"}`}>{capitalizeWords(c.status)}</span></div>
                    </div>

                    <div><p className="flex items-center gap-2 mt-6 text-sm "> Reason:</p><p className="flex items-center gap-2 mb-6 text-sm font-medium ">{c.reason}</p></div>
                  </div>

                  <div className="flex justify-center mt-2 relative">
                    <button
                      onClick={async () => {
                        setSelectedComplaint(c);
                        setShowViewModal(true);

                        if (c.isReadByAdmin) return;

                        try {
                          await markComplaintAsRead(c._id);

                          // ✅ IMMEDIATE UI UPDATE
                          setComplaints(prev =>
                            prev.map(pc =>
                              pc._id === c._id ? { ...pc, isReadByAdmin: true } : pc
                            )
                          );
                        } catch (err) {
                          console.error("Failed to mark as read:", err);
                        }
                      }}
                      className="cursor-pointer w-full flex justify-center items-center gap-2 px-3 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-lg transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                    >
                      <AiOutlineEye /><span>View</span>
                    </button>

                    {/* ✅ New pill */}
                    {!c.isReadByAdmin && (
                      <span className="absolute top-1 right-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
                        New
                      </span>
                    )}

                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-[#748dff]">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="bg-blue-50 dark:bg-indigo-400 text-gray-800 dark:text-gray-200 uppercase text-xs font-semibold sticky top-0">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-2xl">User</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Submitted</th>
                    <th className="px-6 py-3 text-center rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c._id} className={`${idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-900"} border-t transition hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-t-[#748dff]`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={c.userId?.profilePicture?.url || "/default-avatar.png"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                          />

                          <span className="font-medium text-gray-900 dark:text-white">
                            {c.userId?.userName || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-[200px]"> {/* optional max width for control */}
                        <div className="flex flex-col text-sm min-w-0">
                          <span className="font-medium truncate">{c.userId?.email}</span>
                          <span className="text-gray-500 truncate">{c.userId?.mobileNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">{capitalizeWords(c.complaintType)}</span></td>
                      <td className="px-6 py-4">{c.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${c.status.toLowerCase() === "pending" ? "bg-[#fef9c2] text-[#894b00]" : c.status.toLowerCase() === "in progress" ? "bg-[#eff6ff]  text-[#155dfc]" : c.status.toLowerCase() === "resolved" ? "bg-[#d1fae5] text-[#065f46]" : "bg-[#fee2e2] text-[#991b1b]"}`}>
                          {capitalizeWords(c.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">{moment(c.createdAt).format("MMMM D, YYYY")}</td>
                      <td className="px-6 py-4 flex justify-center relative">
                        <button
                          onClick={async () => {
                            setSelectedComplaint(c);
                            setShowViewModal(true);

                            if (c.isReadByAdmin) return;

                            try {
                              await markComplaintAsRead(c._id);

                              // ✅ IMMEDIATE UI UPDATE
                              setComplaints(prev =>
                                prev.map(pc =>
                                  pc._id === c._id ? { ...pc, isReadByAdmin: true } : pc
                                )
                              );
                            } catch (err) {
                              console.error("Failed to mark as read:", err);
                            }
                          }}

                          className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                        >
                          <AiOutlineEye className="w-5 h-5" />
                        </button>

                        {/* ✅ New pill */}
                        {!c.isReadByAdmin && (
                          <span className="absolute top-1 right-3 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-red-500 text-white animate-pulse">
                            New
                          </span>
                        )}

                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      }

      {/* VIEW MORE / LESS */}
      {!initialLoading && (
        <div className="mt-6 text-center flex justify-center gap-4">
          {hasMore && (
            <button
              onClick={() => {
                setViewMoreClicked(true);
                fetchComplaints();
              }}
              disabled={loadingMore}
              className="flex items-center justify-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer disabled:opacity-70"
            >
              {loadingMore && <LoadingSpinner size={18} color="#fff" />}
              {loadingMore ? "Loading..." : "View More"}
            </button>
          )}

          {!hasMore && complaints.length > 12 && viewMoreClicked && (
            <button
              onClick={async () => {
                setIsCollapsing(true);        // 1️⃣ keep button + show loader
                await fetchComplaints({ reset: true });
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
      <ViewAdminComplaintModal
        isOpen={showViewModal}
        complaint={selectedComplaint}
        onClose={() => setShowViewModal(false)}
        onUpdate={(updatedComplaint) => {
          if (updatedComplaint.status.toLowerCase() === "resolved") {
            handleComplaintResolved(updatedComplaint._id);
          }
        }}
      />

      <EditComplaintModal isOpen={showUpdateModal} complaint={selectedComplaint} onClose={() => setShowUpdateModal(false)} onSuccess={() => fetchComplaints({ reset: true })} />
      <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteComplaint} title="Delete Complaint?" message={`Are you sure you want to delete this complaint from ${complaintToDelete?.userId?.email}? This action cannot be undone.`} />
    </div>
  );
};

export default ComplaintManagement;
