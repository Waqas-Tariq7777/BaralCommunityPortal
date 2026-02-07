import { useEffect, useState, useCallback, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { usePostStore } from "../../../Store/PostStore.js";
import PostCard from "../../../Components/User/Post/PostCard.jsx";
import PostImageModal from "../../../Components/User/Post/PostImageModal.jsx";
import LoadingSpinner from "../../../Components/LoadingSpinner.jsx";
import { debounce } from "lodash";

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

  const getPosts = usePostStore((state) => state.getPostsForAdmin);

  const fetchPosts = useCallback(
    async ({ reset = false, searchValue = search } = {}) => {
      if (initialLoading || loadingMore) return;

      if (reset) {
        setInitialLoading(true);
        setLastId(null);
      } else {
        setLoadingMore(true);
      }

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

        if (reset) {
          didInitialLoad.current = true;
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [search, getPosts, initialLoading, loadingMore, lastId]
  );

  // 🔁 Debounced search handler
  const debouncedSearch = useRef(
    debounce((value) => {
      fetchPosts({ reset: true, searchValue: value });
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Initial load
  useEffect(() => {
    fetchPosts({ reset: true });
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!didInitialLoad.current || !hasMore || initialLoading || loadingMore)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 0.4 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, initialLoading, loadingMore, fetchPosts]);

  const openModal = (images, index) => {
    setModalImages(images);
    setModalIndex(index);
  };

  return (
    <div className="min-h-screen p-6 dark:bg-slate-900 transition-colors duration-300">
      {/* Search */}
      <div className="flex items-center mb-6">
        <div className="relative w-full xl:w-[850px] mx-auto">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value); // ✅ now works
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Posts */}
      <div className="w-full flex flex-col items-center px-3 py-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onImageClick={openModal}
          />
        ))}
      </div>

      {/* Initial Loading */}
      {initialLoading && (
        <div className="flex justify-center py-6">
          <LoadingSpinner size={40} color="#748dff" />
        </div>
      )}

      {/* No Posts */}
      {!initialLoading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-slate-500 dark:text-slate-400">
          <FaRegMessage className="text-indigo-400 text-4xl mb-3" />
          <p className="text-base font-medium">No posts found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search or check back later.
          </p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-6">
          {loadingMore && <LoadingSpinner size={40} color="#748dff" />}
        </div>
      )}

      {/* End of Feed Message */}
      {!hasMore && posts.length > 0 && !loadingMore && (
        <div className="flex flex-col items-center text-slate-500 py-6 space-y-2">
          <FaRegMessage className="text-3xl text-[#748dff]" />
          <p className="text-lg font-medium">You have reached the last post</p>
          <p className="text-sm text-slate-400">
            Check back later for new updates from the community
          </p>
        </div>
      )}

      {/* Image Modal */}
      {modalImages && (
        <PostImageModal
          images={modalImages}
          startIndex={modalIndex}
          onClose={() => setModalImages(null)}
          onPostShared={(newPost) =>
            setPosts((prev) => [newPost, ...prev])
          }
        />
      )}
    </div>
  );
};

export default PostFeed;
