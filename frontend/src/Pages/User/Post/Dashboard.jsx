import { useEffect, useState, useCallback, useRef } from "react";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { usePostStore } from "../../../Store/PostStore.js";
import PostCard from "../../../Components/User/Post/PostCard.jsx";
import PostImageModal from "../../../Components/User/Post/PostImageModal.jsx";
import LoadingSpinner from "../../../Components/LoadingSpinner.jsx";
import { debounce } from "lodash";
import { useAuthStore } from "../../../Store/AuthStore.js";
import { AiOutlineNotification } from "react-icons/ai";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const colors = [
  "from-blue-500 to-blue-400",
  "from-purple-500 to-purple-400",
  "from-gray-600 to-gray-500",
  "from-pink-500 to-pink-400",
];

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [lastId, setLastId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalImages, setModalImages] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
    <div className="min-h-screen p-6 dark:bg-slate-900 transition-colors duration-300">

      {/* 🚨 IMPORTANT ANNOUNCEMENTS */}
      {!isAdmin && importantPosts.length > 0 && (
        <div className="mb-6 w-full border-2 border-[#748dff] mx-auto rounded-2xl p-4 overflow-hidden relative">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-[#748dff]">
            <AiOutlineNotification className="text-3xl text-[#748dff]" />
            Important Announcements
          </h2>

          <div className="relative overflow-hidden w-full">

            {/* duplicated slides for seamless loop */}
            <div className="flex gap-4 marquee-track">

              {[...importantPosts, ...importantPosts].map((post, idx) => {
                const color = colors[idx % colors.length];

                return (
                  <div
                    key={idx}
                    onClick={() => scrollToPost(post._id)}
                    className={`cursor-pointer flex-shrink-0 w-[420px] h-[110px] p-4 rounded-xl text-white transition-all duration-300 hover:scale-95 hover:shadow-2xl relative overflow-hidden bg-gradient-to-br ${color}`}
                  >
                    <div className="flex justify-between items-start h-full relative z-10">
                      <div className="flex flex-col justify-between h-full pr-3">
                        <p className="font-bold text-sm whitespace-normal break-all overflow-hidden line-clamp-2">
                          {post.content?.replace(/<[^>]+>/g, "")}
                        </p>

                        <p className="text-xs break-words line-clamp-2">
                          {post.content?.replace(/<[^>]+>/g, "")}
                        </p>

                        <span className="text-[10px] opacity-80">
                          Posted recently
                        </span>
                      </div>

                      <AiOutlineNotification className="text-2xl opacity-80 flex-shrink-0" />
                    </div>

                    <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-20 animate-pulse rounded-xl"></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
<div className="flex items-center mb-6">
  <div className="relative w-full xl:w-[850px] mx-auto">
    <FiSearch className="absolute left-3 top-3 text-slate-400 dark:text-slate-300" />
    <input
      type="text"
      placeholder="Search posts..."
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
      <div className="w-full flex flex-col items-center px-3 py-6">
        {posts.map((post) => (
          <div
            key={post._id}
            ref={(el) => (postRefs.current[post._id] = el)}
            className="w-full"
          >
            <PostCard post={post} onImageClick={openModal} />
          </div>
        ))}
      </div>

      {initialLoading && <LoadingSpinner size={40} color="#748dff" />}

      {!initialLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-slate-500 dark:text-slate-400">
          <FaRegMessage className="text-indigo-400 text-4xl mb-3" />
          <p className="text-base font-medium">No posts found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search or check back later.
          </p>
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
          <p className="text-lg font-medium">You have reached the last post</p>
          <p className="text-sm text-slate-400">
            Check back later for new updates from the community
          </p>
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