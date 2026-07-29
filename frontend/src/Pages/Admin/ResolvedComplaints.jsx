import React, { useEffect, useState, useCallback } from "react";
import {
  AiOutlineAppstore,
  AiOutlineUnorderedList,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete
} from "react-icons/ai";
import { RiFolderSettingsLine } from "react-icons/ri";
import { FiSearch, FiClock, FiX, FiFilter, FiUser, FiLayers, FiPrinter, FiInbox } from "react-icons/fi";
import { useComplaintStore } from "../../Store/ComplaintStore.js";
import moment from "moment";
import { debounce } from "lodash";
import ViewResolvedComplaintModal from "../../Components/Admin/ViewResolvedComplaintModal.jsx";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import UpdateResourcesCostModal from "../../Components/Admin/UpdateResourcesCostModal.jsx";
import ResolvedComplaintPrint from "../../Components/Admin/ResolvedComplaintPrint.jsx";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal.jsx";
// Helper
const capitalizeWords = (str) =>
  str
    ? str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
    : "";

const ResolvedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [view, setView] = useState("grid");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMoreClicked, setViewMoreClicked] = useState(false);
  const [showUpdateResourcesModal, setShowUpdateResourcesModal] = useState(false);
  const [currentResources, setCurrentResources] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getAllComplaints = useComplaintStore(
    (state) => state.getAllComplaints
  );
  const updateResolvedResources = useComplaintStore(state => state.updateResolvedResources);
  const deleteResolvedComplaint = useComplaintStore(
  state => state.deleteResolvedComplaint
);


  const statusFilter = "resolved";

  const fetchComplaints = useCallback(
    async ({ reset = false } = {}) => {
      if (initialLoading || loadingMore) return;

      if (reset) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
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

        if (reset) setComplaints(data);
        else setComplaints((prev) => [...prev, ...data]);

        setLastId(data.length ? data[data.length - 1]._id : null);
        setHasMore(
          typeof meta.hasMore === "boolean"
            ? meta.hasMore
            : data.length === 12
        );
      } catch (err) {
        console.error("Error fetching resolved complaints:", err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [getAllComplaints, lastId, search, typeFilter, initialLoading,
      loadingMore,
      complaints.length]
  );

  const debouncedSearch = useCallback(
    debounce((value) => {
      setComplaints([]);
      setLastId(null);
      setHasMore(true);
      setSearch(value);
    }, 400),
    []
  );

  useEffect(() => {
    setComplaints([]);
    setLastId(null);
    setHasMore(true);
    fetchComplaints({ reset: true });
  }, [search, typeFilter]);

  const handleViewLess = () => {
    setComplaints([]);
    setLastId(null);
    setHasMore(true);
    fetchComplaints({ reset: true });
  };

  return (
    <div className="min-h-screen p-6 dark:bg-slate-900 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Resolved Complaints
      </h1>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        {/* SEARCH & TYPE FILTER */}
        <div className="flex flex-wrap items-center gap-4">
          {/* SEARCH */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              placeholder="Search Resolved Complaints..."
              onChange={(e) => {
                setSearchInput(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-72 pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff] transition-all"
            />
          </div>

          {/* TYPE FILTER - WHOLE BOX CLICKABLE */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="appearance-none w-40 pl-10 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff] transition-all cursor-pointer">
              <option value="All">Type</option>
              <option value="general">General</option>
              <option value="special">Special</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ">▼</span>
          </div>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex space-x-2">
          <button onClick={() => setView("grid")} className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "grid" ? "bg-[#748dff] text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"}`}><AiOutlineAppstore size={20} /></button>
          <button onClick={() => setView("list")} className={`cursor-pointer p-2 rounded transition-colors duration-200 ${view === "list" ? "bg-[#748dff] text-white" : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-400 hover:text-white"}`}><AiOutlineUnorderedList size={20} /></button>
        </div>
      </div>

      {/* CONTENT */}
      {initialLoading ? (
        <div className="flex justify-center mt-20">
          <LoadingSpinner size={60} color="#748dff" />
        </div>
      ) : complaints.length === 0 ? (
        (() => {
          const isFiltered = search !== "" || typeFilter !== "All";
          let title = "No Resolved Complaints Yet";
          let desc = "All complaints that have been completed and resolved will show up here.";

          if (isFiltered) {
            if (search !== "") {
              title = "No Matching Results";
              desc = `We couldn't find any resolved complaints matching "${search}".`;
            } else if (typeFilter !== "All") {
              title = `No Resolved ${typeFilter === "general" ? "General" : "Special"} Complaints`;
              desc = `There are no resolved complaints of type "${typeFilter}".`;
            }
          }

          return (
            <div className="flex flex-col items-center justify-center mt-16 text-center transition-all duration-300">
              <div className="w-16 h-16 bg-[#f0f4ff]/50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 text-[#748dff] animate-pulse">
                <FiInbox size={32} />
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
                    setTypeFilter("All");
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#748dff]/10 hover:bg-[#748dff]/20 text-[#748dff] font-semibold rounded-lg transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          );
        })()
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">

              {complaints.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-50 dark:bg-slate-900 dark:border dark:border-[#748dff] shadow-md rounded-lg p-6 flex flex-col transition-transform duration-300 hover:scale-[1.02]"

                >
                  <div className="space-y-3 text-gray-700 dark:text-gray-200">
                    <p className="flex text-sm items-center gap-2">
                      <FiUser className="text-indigo-300 text-lg dark:text-[#748dff]" /> {c.userId?.userName}
                    </p>
                    <p className="flex items-center gap-2 min-w-0 text-sm">
                      <AiOutlineMail className="text-orange-300 text-lg flex-shrink-0 dark:text-[#748dff]" />
                      <span className="truncate flex-1">{c.userId.email}</span>
                    </p>
                    <p className="flex text-sm items-center gap-2">
                      <AiOutlinePhone className="text-green-300 text-lg dark:text-[#748dff]" /> {c.userId?.mobileNumber}
                    </p>
                    <p className="flex text-sm items-center gap-2">
                      <AiOutlineCalendar className="text-pink-300 text-lg dark:text-[#748dff]" /> {moment(c.createdAt).format("MMMM D, YYYY")}
                    </p>

                    <div className="flex flex-col w-[100%] gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <FiLayers className="text-[#6e11b0] text-lg" />
                        <span className="px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">{capitalizeWords(c.complaintType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#065f46] text-lg" />
                        <span className="px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-semibold">{capitalizeWords(c.status)}</span>
                      </div>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 mt-6 text-sm">Reason:</p>
                      <p className="flex items-center gap-2 mb-6 text-sm font-medium">{c.reason}</p>
                    </div>
                  </div>

                  <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => { setSelectedComplaint(c); setShowViewModal(true); }}
                      className="cursor-pointer flex justify-center items-center gap-2 px-3 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-lg transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                    >
                      <AiOutlineEye /> 
                    </button>

                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setCurrentResources(c.resources || []);
                        setShowUpdateResourcesModal(true);
                      }}
                      className="cursor-pointer  flex justify-center items-center gap-2 px-3 py-2 bg-[#f0fdf4] hover:bg-green-200 text-[#09a946] rounded-lg transition dark:bg-transparent dark:border dark:border-[#09a946] dark:text-[#09a946] dark:hover:bg-green-200"
                    >
                      <AiOutlineEdit /> 
                    </button>

                    <button
                      onClick={() => ResolvedComplaintPrint(c)?.handlePrint()}
                      className="cursor-pointer  flex justify-center items-center gap-2 px-3 py-2 bg-[#f3e8ff] hover:bg-purple-200 text-[#6e11b0] rounded-lg transition dark:bg-transparent dark:border dark:border-[#6e11b0] dark:text-[#6e11b0] dark:hover:bg-purple-200"
                    >
                      <FiPrinter />
                    </button>

                    <button
                      onClick={() => {
                        setComplaintToDelete(c);
                        setShowDeleteModal(true);
                      }}
                      className="cursor-pointer flex justify-center items-center gap-2 px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition dark:bg-transparent dark:border dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  </div>


                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white dark:border dark:bg-slate-900 rounded-xl shadow dark:border-[#748dff]">
              <table className="w-full border-collapse text-sm text-left dark:text-gray-200">
                <thead className="bg-blue-50 dark:bg-indigo-400 text-xs uppercase text-gray-800 dark:text-gray-200">
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
                    <tr key={c._id} className={`${idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-900"} border-t  transition hover:bg-blue-50 dark:hover:bg-slate-800 dark:border-t-[#748dff]`}>
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
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">
                          {capitalizeWords(c.complaintType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{c.reason}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-semibold">
                          {capitalizeWords(c.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{moment(c.createdAt).format("MMMM D, YYYY")}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => { setSelectedComplaint(c); setShowViewModal(true); }}
                            className="cursor-pointer p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                          >
                            <AiOutlineEye className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedComplaint(c);
                              setCurrentResources(c.resources || []);
                              setShowUpdateResourcesModal(true);
                            }}
                            className="cursor-pointer p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition dark:bg-transparent dark:border dark:border-[#09a946] dark:text-[#09a946]"
                          >
                            <AiOutlineEdit className="w-5 h-5" />
                          </button>


                          <button
                            onClick={() => ResolvedComplaintPrint(c)?.handlePrint()}
                            className="cursor-pointer p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition dark:bg-transparent dark:border dark:border-[#6e11b0] dark:text-[#6e11b0]"
                          >
                            <FiPrinter className="w-5 h-5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
        </>
      )}

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center gap-4">
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
                {loadingMore ? <LoadingSpinner size={18} color="#fff" /> : "View More"}
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
                {(loadingMore || isCollapsing) ? <LoadingSpinner size={18} color="#fff" /> : "View Less"}
              </button>


            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      <ViewResolvedComplaintModal
        isOpen={showViewModal}
        complaint={selectedComplaint}
        onClose={() => setShowViewModal(false)}
      />
      {/* 🔹 Update Resources Modal */}
      <UpdateResourcesCostModal
        isOpen={showUpdateResourcesModal}
        initialResources={currentResources}
        onClose={() => setShowUpdateResourcesModal(false)}
        onSave={async (updatedResources) => {
          try {
            if (!selectedComplaint) return;

            // Call store function to update resources
            const updatedComplaint = await updateResolvedResources(selectedComplaint._id, updatedResources);

            // Update complaint list locally
            setComplaints(prev =>
              prev.map(c => c._id === selectedComplaint._id
                ? { ...c, resources: updatedResources }
                : c
              )
            );

            setShowUpdateResourcesModal(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        loading={deleting}
        onClose={() => {
          setShowDeleteModal(false);
          setComplaintToDelete(null);
        }}
        onConfirm={async () => {
  if (!complaintToDelete) return;
  try {
    setDeleting(true);
    await deleteResolvedComplaint(complaintToDelete._id); // ✅ use correct function
    setComplaints(prev => prev.filter(item => item._id !== complaintToDelete._id));
  } catch (err) {
    console.error(err);
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
    setComplaintToDelete(null);
  }
}}
      />
    </div>
  );
};

export default ResolvedComplaints;
