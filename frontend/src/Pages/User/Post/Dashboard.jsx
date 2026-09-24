import { useEffect, useState, useCallback, useRef } from "react";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { AiOutlineNotification } from "react-icons/ai";
import { usePostStore } from "../../../Store/PostStore.js";
import { useAuthStore } from "../../../Store/AuthStore.js";
import PostCard from "../../../Components/User/Post/PostCard.jsx";
import PostImageModal from "../../../Components/User/Post/PostImageModal.jsx";
import LoadingSpinner from "../../../Components/LoadingSpinner.jsx";
import { debounce } from "lodash";
import { useLanguageStore } from '../../../Store/LanguageStore.js';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const colors = [
  "from-blue-500 to-indigo-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-orange-400",
];

import { useTranslation } from "react-i18next";

const PostFeed = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [lastId, setLastId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { language } = useLanguageStore();

  const loaderRef = useRef(null);
  const didInitialLoad = useRef(false);
  const postRefs = useRef({});

  const getPosts = usePostStore((state) => state.getPosts);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const importantPosts = posts.filter((post) => {
    if (!post.isImportant || !post.createdAt) return false;
    const age = Date.now() - new Date(post.createdAt).getTime();
    return age <= ONE_WEEK_MS;
  });

  const fetchPosts = useCallback(
    async ({ reset = false, searchValue = search } = {}) => {
      if (initialLoading || loadingMore) return;

      reset ? setInitialLoading(true) : setLoadingMore(true);

      try {
        const res = await getPosts({
          search: searchValue,
          limit: 12,
          reset,
          lastId: reset ? null : lastId,
        });

        const data = res?.data ?? [];
        const meta = res?.meta ?? {};

        setPosts((prev) => (reset ? data : [...prev, ...data]));
        setLastId(data.length ? data[data.length - 1]._id : null);

        setHasMore(
          typeof meta.hasMore === "boolean"
            ? meta.hasMore
            : data.length === 12
        );

        if (reset) didInitialLoad.current = true;
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [search, getPosts, initialLoading, loadingMore, lastId]
  );

  const debouncedSearch = useRef(
    debounce((value) => {
      fetchPosts({ reset: true, searchValue: value });
    }, 500)
  ).current;

  useEffect(() => {
    fetchPosts({ reset: true });
    return () => debouncedSearch.cancel();
  }, []);

  useEffect(() => {
    if (!didInitialLoad.current || !hasMore || initialLoading || loadingMore)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && fetchPosts(),
      { threshold: 0.4 }
    );

    loaderRef.current && observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, initialLoading, loadingMore, fetchPosts]);

  const scrollToPost = (postId) => {
    const el = postRefs.current[postId];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openModal = (images, index) => {
    setModalImages(images);
    setModalIndex(index);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden p-2 sm:p-6 dark:bg-slate-900 transition-colors duration-300">

      {/* 🚨 IMPORTANT ANNOUNCEMENTS */}
      {!isAdmin && importantPosts.length > 0 && (
        <div className="mb-8 w-full max-w-full xl:max-w-[1050px] mx-auto rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-indigo-50/40 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 shadow-md backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 dir={language === "ur" ? "rtl" : "ltr"} className="text-base font-extrabold flex items-center gap-2.5 text-[#748dff]">
              <div className="p-2 rounded-xl bg-[#748dff]/10 text-[#748dff] flex items-center justify-center">
                <AiOutlineNotification className="text-xl animate-pulse" />
              </div>
              {t("important_announcements")}
            </h2>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {importantPosts.length} {t("active") || "Active"}
            </span>
          </div>

          {/* 1 Announcement: Full width card */}
          {importantPosts.length === 1 && (
            <div className="w-full">
              {(() => {
                const post = importantPosts[0];
                const color = colors[0];
                return (
                  <div
                    key={post._id || "single"}
                    onClick={() => scrollToPost(post._id)}
                    className={`cursor-pointer w-full p-5 sm:p-6 rounded-2xl text-white bg-gradient-to-br ${color} shadow-lg hover:shadow-xl hover:scale-[0.99] transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-sm">
                          {t("announcement") || "Notice"}
                        </span>
                        <span className="text-xs text-white/80 flex items-center gap-1">
                          <AiOutlineNotification className="text-sm text-white/90 group-hover:rotate-12 transition-transform" />
                          {t("posted_recently")}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg text-white break-words line-clamp-1 leading-snug">
                        {post.title?.replace(/<[^>]+>/g, "")}
                      </h3>

                      <p className="text-xs sm:text-sm text-white/90 break-words line-clamp-2 leading-relaxed">
                        {post.content?.replace(/<[^>]+>/g, "")}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      <span className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all group-hover:translate-x-1">
                        {t("view_details") || "Details"} &rarr;
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 2 Announcements: Grid layout side by side */}
          {importantPosts.length === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {importantPosts.map((post, idx) => {
                const color = colors[idx % colors.length];
                return (
                  <div
                    key={post._id || idx}
                    onClick={() => scrollToPost(post._id)}
                    className={`cursor-pointer w-full p-5 sm:p-6 rounded-2xl text-white bg-gradient-to-br ${color} shadow-lg hover:shadow-xl hover:scale-[0.99] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group min-h-[160px]`}
                  >
                    <div>
                      <div className="flex justify-between items-center gap-2 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-sm">
                          {t("announcement") || "Notice"}
                        </span>
                        <AiOutlineNotification className="text-sm text-white/80 group-hover:rotate-12 transition-transform" />
                      </div>

                      <h3 className="font-extrabold text-base text-white mb-1.5 break-words line-clamp-1 leading-snug">
                        {post.title?.replace(/<[^>]+>/g, "")}
                      </h3>

                      <p className="text-xs sm:text-sm text-white/90 break-words line-clamp-2 leading-relaxed">
                        {post.content?.replace(/<[^>]+>/g, "")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[10px] text-white/85">
                      <span>{t("posted_recently")}</span>
                      <span className="text-white font-extrabold group-hover:underline text-[10px] flex items-center gap-0.5">
                        {t("view_details") || "Details"} &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3+ Announcements: Continuous seamless marquee loop */}
          {importantPosts.length >= 3 && (() => {
            let displayList = [...importantPosts];
            while (displayList.length < 6) {
              displayList = [...displayList, ...importantPosts];
            }
            const animDuration = Math.max(25, displayList.length * 4);

            const renderCardItem = (post, idx, keyPrefix) => {
              const color = colors[idx % colors.length];
              return (
                <div
                  key={`${keyPrefix}-${post._id || idx}-${idx}`}
                  onClick={() => scrollToPost(post._id)}
                  className={`cursor-pointer flex-shrink-0 w-[280px] sm:w-[340px] p-5 rounded-2xl text-white bg-gradient-to-br ${color} shadow-lg hover:shadow-xl hover:scale-95 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex justify-between items-center gap-2 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white uppercase tracking-wider backdrop-blur-sm">
                        {t("announcement") || "Notice"}
                      </span>
                      <AiOutlineNotification className="text-sm text-white/80 group-hover:rotate-12 transition-transform" />
                    </div>

                    <h3 className="font-extrabold text-sm text-white mb-1.5 break-words line-clamp-1 leading-snug">
                      {post.title?.replace(/<[^>]+>/g, "")}
                    </h3>

                    <p className="text-xs text-white/90 break-words line-clamp-2 leading-relaxed">
                      {post.content?.replace(/<[^>]+>/g, "")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-[10px] text-white/85">
                    <span>{t("posted_recently")}</span>
                    <span className="text-white font-extrabold group-hover:underline text-[10px] flex items-center gap-0.5">
                      {t("view_details") || "Details"} &rarr;
                    </span>
                  </div>
                </div>
              );
            };

            return (
              <div className="relative w-full overflow-hidden py-1">
                <div className="marquee-track flex" style={{ animationDuration: `${animDuration}s` }}>
                  {/* Set 1 */}
                  <div className="flex gap-4 pr-4 shrink-0">
                    {displayList.map((post, idx) => renderCardItem(post, idx, "set1"))}
                  </div>
                  {/* Set 2 (Identical duplicate for seamless continuous loop) */}
                  <div className="flex gap-4 pr-4 shrink-0" aria-hidden="true">
                    {displayList.map((post, idx) => renderCardItem(post, idx, "set2"))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Search */}
      <div  className="flex items-center mb-6">
        <div className="relative w-full max-w-[850px] mx-auto">
          <FiSearch  className="absolute left-3 top-3 text-slate-400 dark:text-slate-300" />
          <input
            type="text"
            placeholder={t("search_Placeholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border 
            border-slate-300 dark:border-[#748dff]
            bg-white dark:bg-slate-900
            text-slate-800 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-300
            focus:outline-none focus:border-[#748dff] focus:ring-1 focus:ring-[#748dff]
            transition-colors duration-200"
          />
        </div>
      </div>

      {/* Posts */}
     <div className="w-full flex flex-col items-center px-0 sm:px-3 py-6">
  {posts.map((post) => (
    <div
      key={post._id}
      ref={(el) => (postRefs.current[post._id] = el)}
      className="w-full sm:max-w-[95%]"
    >
      <PostCard post={post} onImageClick={openModal} />
    </div>
  ))}
</div>

      {initialLoading && <LoadingSpinner size={40} color="#748dff" />}

      {!initialLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-slate-500 dark:text-slate-400">
          <FaRegMessage className="text-indigo-400 text-4xl mb-3" />
          <p className="text-base font-medium">{t("no_posts_found_title")}</p>
          <p className="text-sm text-slate-400 mt-1">{t("no_posts_found_subtitle")}</p>
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-6">
          {loadingMore && <LoadingSpinner size={40} color="#748dff" />}
        </div>
      )}

      {!hasMore && posts.length > 0 && !loadingMore && (
        <div className="flex flex-col items-center text-slate-500 py-6 space-y-2">
          <FaRegMessage className="text-3xl text-[#748dff]" />
          <p className="text-lg font-medium">{t("last_post_title")}</p>
          <p className="text-sm text-slate-400">{t("last_post_subtitle")}</p>
        </div>
      )}

      {modalImages && (
        <PostImageModal
          images={modalImages}
          startIndex={modalIndex}
          onClose={() => setModalImages(null)}
        />
      )}
    </div>
  );
};

export default PostFeed;