import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AiOutlineAppstore, AiOutlineUnorderedList, AiOutlineMail, AiOutlinePhone, AiOutlineCalendar, AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlineFileText } from "react-icons/ai";
import { useComplaintStore } from "../../Store/ComplaintStore.js";
import moment from "moment";
import { debounce } from "lodash";
import ViewComplaintModal from "../../Components/User/ViewComplaintModal.jsx";
import EditComplaintModal from "../../Components/User/UpdateComplaintModal.jsx";
import ConfirmDeleteModal from "../../Components/Admin/ConfirmDeleteModal.jsx";
import LoadingSpinner from "../../Components/LoadingSpinner.jsx";
import { FiSearch, FiClock, FiFilter, FiLayers, FiInfo } from "react-icons/fi";
import { useAuthStore } from "../../Store/AuthStore.js";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from '../../Store/LanguageStore.js';

// capitalize helper
const capitalizeWords = (str) => str ? str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

const ViewComplaintList = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState([]);
  const [lastId, setLastId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const getUserComplaints = useComplaintStore(state => state.getUserComplaints);
  const deleteComplaint = useComplaintStore(state => state.deleteComplaint);
  const user = useAuthStore(state => state.user);
  const { language } = useLanguageStore();

  const fetchComplaints = useCallback(
    async ({ reset = false } = {}) => {
      if (initialLoading || loadingMore) return;

      if (reset) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const res = await getUserComplaints({
          limit: 12,
          lastId: reset ? null : lastId,
          search,
          type: typeFilter,
          status: statusFilter
        });

        const data = res?.data ?? [];
        const meta = res?.meta ?? {};

        setComplaints(prev =>
          reset ? data : [...prev, ...data]
        );

        setLastId(data.length ? data[data.length - 1]._id : null);
        setHasMore(
          typeof meta.hasMore === "boolean"
            ? meta.hasMore
            : data.length === 12
        );

      } catch (err) {
        console.error(t("error_fetching_complaints"), err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [getUserComplaints, lastId, search, typeFilter, statusFilter, initialLoading, loadingMore, complaints.length, t]
  );

  const debouncedSearch = useCallback(debounce(value => {
    setLastId(null); setHasMore(true); setComplaints([]); setSearch(value);
  }, 400), []);

  useEffect(() => { fetchComplaints({ reset: true }); }, [search, typeFilter, statusFilter]);

  const handleViewLess = () => { setComplaints([]); setLastId(null); setHasMore(true); fetchComplaints({ reset: true }); };

  const handleDeleteComplaint = async () => {
    if (!complaintToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteComplaint(complaintToDelete._id);
      setComplaints(prev => prev.filter(c => c._id !== complaintToDelete._id));
      if (hasMore) fetchComplaints();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(t("error_deleting_complaint"), err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 dark:bg-slate-900 transition-colors duration-300">
      <h1 dir={language === "ur" ? "rtl" : "ltr"} className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t("complaint_management")}</h1>

      {/* SEARCH & FILTERS & VIEW TOGGLE */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-1">

          {/* SEARCH */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
            <input
              type="text"
              value={searchInput}
              placeholder={t("search_placeholder")}
              onChange={e => {
                setSearchInput(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all"
            />
          </div>

          {/* FILTERS CONTAINER */}
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            {/* TYPE FILTER */}
            <div dir={language === "ur" ? "rtl" : "ltr"} className="relative flex-1 sm:flex-none">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="appearance-none w-full sm:w-40 pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:outline-none focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all cursor-pointer"
              >
                <option value="All">{t("type_filter")}</option>
                <option value="general">{t("general")}</option>
                <option value="special">{t("special")}</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>

            {/* STATUS FILTER */}
            <div dir={language === "ur" ? "rtl" : "ltr"} className="relative flex-1 sm:flex-none">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#748dff] text-lg" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-44 pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#748dff] focus:border-[#748dff] transition-all cursor-pointer"
              >
                <option value="Any">{t("status_filter")}</option>
                <option value="pending">{t("pending")}</option>
                <option value="resolved">{t("resolved")}</option>
                <option value="in progress">{t("in_progress")}</option>
                <option value="rejected">{t("rejected")}</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </div>

        </div>

        <div className="flex justify-end space-x-2">
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
        (() => {
          const isFiltered = search !== "" || typeFilter !== "All" || statusFilter !== "Any";
          
          if (isFiltered) {
            let title = "";
            let desc = "";
            
            if (search !== "") {
              title = language === "ur" ? "کوئی مماثل نتائج نہیں ملے" : "No Matching Results";
              desc = language === "ur" 
                ? `ہمیں "${search}" سے مطابقت رکھنے والی کوئی شکایت نہیں ملی۔`
                : `We couldn't find any complaints matching "${search}".`;
            } else if (statusFilter !== "Any") {
              const statusUr = statusFilter === "in progress" ? "زیر کار" : statusFilter === "resolved" ? "حل شدہ" : statusFilter === "rejected" ? "مسترد شدہ" : "زیر التواء";
              const statusEn = statusFilter.toLowerCase() === "in progress" ? "in-progress" : statusFilter;
              title = language === "ur" 
                ? `کوئی ${statusUr} شکایت نہیں ملی`
                : `No ${statusEn} complaints yet.`;
              desc = language === "ur"
                ? `اس وقت آپ کی کوئی بھی شکایت "${statusUr}" کی حیثیت میں نہیں ہے۔`
                : `You don't have any complaints marked as ${statusEn} at the moment.`;
            } else if (typeFilter !== "All") {
              const typeUr = typeFilter === "general" ? "عام" : "خصوصی";
              title = language === "ur"
                ? `کوئی ${typeUr} شکایت نہیں ملی`
                : `No ${typeFilter} complaints found.`;
              desc = language === "ur"
                ? `آپ نے "${typeUr}" قسم کی کوئی شکایت درج نہیں کی ہے۔`
                : `You haven't submitted any complaints of type "${typeFilter}".`;
            }

            return (
              <div className="flex flex-col items-center justify-center mt-16 text-center transition-all duration-300">
                <div className="w-16 h-16 bg-[#f0f4ff]/50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 text-[#748dff] animate-pulse">
                  <FiFilter size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                  {desc}
                </p>
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setTypeFilter("All");
                    setStatusFilter("Any");
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#748dff]/10 hover:bg-[#748dff]/20 text-[#748dff] font-semibold rounded-lg transition-all duration-200"
                >
                  {language === "ur" ? "فلٹرز صاف کریں" : "Clear Filters"}
                </button>
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center mt-16 text-center transition-all duration-300">
              <div className="w-16 h-16 bg-[#f0f4ff]/50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5 text-[#748dff] animate-pulse">
                <AiOutlineFileText size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t("no_complaints_found")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                {language === "ur" 
                  ? "آپ نے ابھی تک کوئی شکایت درج نہیں کی ہے۔ آپ کی تمام درج شدہ شکایتیں یہاں نظر آئیں گی۔"
                  : "It looks like you haven't submitted any complaints yet. All the complaints you file will be tracked and displayed here."}
              </p>
              <Link
                to="/user/submitComplaint"
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#748dff] hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all duration-200"
              >
                <AiOutlineFileText size={18} />
                {language === "ur" ? "شکایت درج کریں" : "Submit a Complaint"}
              </Link>
            </div>
          );
        })()
      ) : (<>

        {/* GRID VIEW */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0">
            {complaints.map(c => (
              <div key={c._id} className="bg-gray-50 dark:bg-gray-900 dark:border dark:border-[#748dff] shadow-md rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between transform hover:scale-[1.01] transition-all duration-300 min-w-0 overflow-hidden">
                <div className="space-y-3 text-gray-700 dark:text-gray-200">
                  <p className="flex items-center gap-2 min-w-0 text-sm">
                    <AiOutlineMail className="text-orange-300 text-lg flex-shrink-0 dark:text-[#748dff]" />
                    <span className="truncate flex-1">{c.userId.email}</span>
                  </p>

                  <p className="flex text-sm items-center gap-2"><AiOutlinePhone className="text-green-300 text-lg dark:text-[#748dff]" /> {c.userId?.mobileNumber}</p>
                  <p className="flex text-sm items-center gap-2"><AiOutlineCalendar className="text-pink-300 text-lg dark:text-[#748dff]" /> {moment(c.createdAt).format("MMMM D, YYYY")}</p>

                  {/* Pills above buttons only */}
                  <div className="flex flex-col w-[100%] gap-2 mt-2">

                    {/* TYPE PILL */}
                    <div className="flex items-center gap-2">
                      <FiLayers className="text-lg text-[#6e11b0]" />
                      <span className="px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">
                        {t(c.complaintType)}
                      </span>
                    </div>

                    {/* STATUS PILL */}
                    <div className="flex items-center gap-2">
                      <FiClock className="text-lg text-[#894b00]" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status.toLowerCase() === "pending"
                          ? "bg-[#fef9c2] text-[#894b00]"
                          : c.status.toLowerCase() === "in progress"
                            ? "bg-[#eff6ff]  text-[#155dfc]"
                            : c.status.toLowerCase() === "resolved"
                              ? "bg-[#d1fae5] text-[#065f46]"
                              : c.status.toLowerCase() === "rejected"
                                ? "bg-[#fee2e2] text-[#991b1b]"
                                : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {t(c.status.replace(" ", "_"))}
                      </span>
                    </div>

                  </div>
                  <div dir={language === "ur" ? "rtl" : "ltr"} >
                    <p className="flex items-center gap-2 mt-4 text-sm "> {t("reason")}:</p>
                    <p className="flex items-center gap-2 mb-4 text-sm font-medium ">{c.reason === "special" ? t("special_request") : t(c.reason)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 min-w-0">
                  {["in progress", "rejected", "resolved"].includes(c.status.toLowerCase()) ? (
                    <button
                      onClick={() => { setSelectedComplaint(c); setShowViewModal(true) }}
                      className="cursor-pointer w-full flex justify-center items-center gap-1.5 px-3 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-xl text-xs font-semibold transition dark:bg-slate-800 dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                    >
                      <AiOutlineEye className="text-sm shrink-0" /> {t("view")}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => { setSelectedComplaint(c); setShowViewModal(true) }}
                        className="cursor-pointer flex-1 min-w-[60px] sm:min-w-[65px] flex items-center justify-center gap-1 px-2 py-2 bg-[#eff6ff] hover:bg-indigo-200 text-[#155dfc] rounded-xl text-xs font-semibold transition dark:bg-slate-800 dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                      >
                        <AiOutlineEye className="text-sm shrink-0" /> <span className="truncate">{t("view")}</span>
                      </button>
                      <button
                        onClick={() => { setSelectedComplaint(c); setShowUpdateModal(true) }}
                        className="cursor-pointer flex-1 min-w-[60px] sm:min-w-[65px] flex items-center justify-center gap-1 px-2 py-2 bg-[#f0fdf4] hover:bg-green-200 text-[#09a946] rounded-xl text-xs font-semibold transition dark:bg-slate-800 dark:border dark:border-[#09a946] dark:text-[#09a946] dark:hover:bg-green-200"
                      >
                        <AiOutlineEdit className="text-sm shrink-0" /> <span className="truncate">{t("edit")}</span>
                      </button>
                      <button
                        onClick={() => { setComplaintToDelete(c); setShowDeleteModal(true); }}
                        className="cursor-pointer shrink-0 flex items-center justify-center px-2.5 py-2 rounded-xl bg-[#ffe2e2] hover:bg-red-200 text-[#e91721] text-xs transition dark:bg-slate-800 dark:border dark:border-[#e91721] dark:text-[#e91721] dark:hover:bg-red-200"
                        title="Delete"
                      >
                        <AiOutlineDelete className="text-sm shrink-0" />
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div  className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-[#748dff]">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
              <thead  className="bg-blue-50 dark:bg-indigo-400 text-gray-800 dark:text-gray-200 uppercase text-xs font-semibold sticky top-0">
                <tr>
                  <th className="px-6 py-3 rounded-tl-2xl">{t("user")}</th>
                  <th className="px-6 py-3">{t("contact")}</th>
                  <th className="px-6 py-3">{t("type_filter")}</th>
                  <th className="px-6 py-3">{t("status_filter")}</th>
                  <th className="px-6 py-3">{t("reason")}</th>
                  <th className="px-6 py-3">{t("submitted")}</th>
                  <th className="px-6 py-3 text-center rounded-tr-2xl">{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((c, idx) => (
                  <tr
                    key={c._id}
                    className={`${idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-900"
                      } border-t transition hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-t-[#748dff]`}
                  >
                    {/* USER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.profilePicture.url || "/avatar.png"}
                          alt="profile"
                          className="w-9 h-9 rounded-full object-cover border border-[#748dff]"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {user?.userName}
                        </span>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="flex flex-col text-sm min-w-0">
                        <span className="font-medium truncate">{c.userId?.email}</span>
                        <span className="text-gray-500 truncate">{c.userId?.mobileNumber}</span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[#6e11b0] bg-[#f3e8ff] text-xs font-semibold">
                        {t(c.complaintType)}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${c.status.toLowerCase() === "pending"
                          ? "bg-[#fef9c2] text-[#894b00]"
                          : c.status.toLowerCase() === "in progress"
                            ? "bg-[#eff6ff]  text-[#155dfc]"
                            : c.status.toLowerCase() === "resolved"
                              ? "bg-[#d1fae5] text-[#065f46]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                      >
                        {t(c.status.replace(" ", "_"))}
                                            </span>
                    </td>

                    {/* REASON */}
                    <td className="px-6 py-4 max-w-xs truncate">
                      {c.reason === "special" ? t("special_request") : t(c.reason)}
                    </td>

                    {/* SUBMITTED */}
                    <td className="px-6 py-4">
                      {moment(c.createdAt).format("MMMM D, YYYY")}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 flex justify-center gap-3">
                      {["in progress", "rejected", "resolved"].includes(c.status.toLowerCase()) ? (
                        <button
                          onClick={() => { setSelectedComplaint(c); setShowViewModal(true); }}
                          className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                        >
                          <AiOutlineEye className="w-5 h-5" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => { setSelectedComplaint(c); setShowViewModal(true); }}
                            className="cursor-pointer p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition dark:bg-transparent dark:border dark:border-[#748dff] dark:text-[#748dff] dark:hover:bg-indigo-400 dark:hover:text-white"
                          >
                            <AiOutlineEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { setSelectedComplaint(c); setShowUpdateModal(true); }}
                            className="cursor-pointer p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition dark:bg-transparent dark:border dark:border-[#09a946] dark:text-[#09a946] dark:hover:bg-green-200"
                          >
                            <AiOutlineEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { setComplaintToDelete(c); setShowDeleteModal(true); }}
                            className="cursor-pointer p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition dark:bg-transparent dark:border dark:border-[#e91721] dark:text-[#e91721] dark:hover:bg-red-200"
                          >
                            <AiOutlineDelete className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>)}

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
              {loadingMore ? t("loading") : t("view_more")}
            </button>
          )}

          {!hasMore && complaints.length > 12 && viewMoreClicked && (
            <button
              onClick={async () => {
                setIsCollapsing(true);
                await fetchComplaints({ reset: true });
                setIsCollapsing(false);
                setViewMoreClicked(false);
              }}
              disabled={loadingMore || isCollapsing}
              className="flex items-center justify-center gap-2 bg-indigo-400 hover:bg-indigo-500 text-white px-5 py-2 rounded transition cursor-pointer disabled:opacity-70"
            >
              {(loadingMore || isCollapsing) && (
                <LoadingSpinner size={18} color="#fff" />
              )}
              {(loadingMore || isCollapsing) ? t("loading") : t("view_less")}
            </button>
          )}
        </div>
      )}

      {/* MODALS */}
      <ViewComplaintModal
        isOpen={showViewModal}
        complaint={selectedComplaint}
        onClose={() => setShowViewModal(false)}
      />
      <EditComplaintModal
        isOpen={showUpdateModal}
        complaint={selectedComplaint}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={() => fetchComplaints({ reset: true })}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteComplaint}
        loading={deleteLoading}
        title={t("delete_complaint")}
        message={t("delete_complaint_message", { email: complaintToDelete?.userId?.email })}
      />
    </div>
  );
};

export default ViewComplaintList;

