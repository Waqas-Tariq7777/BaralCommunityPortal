import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

const PostImageModal = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex || 0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="cursor-pointer absolute top-5 right-5 z-50 text-white text-3xl hover:text-indigo-400"
      >
        <FiX />
      </button>

      {/* Prev Button */}
      {images.length > 1 && (
        <button
          onClick={prev}
          className="cursor-pointer absolute left-6 z-50 text-white text-4xl hover:text-indigo-400"
        >
          <FiChevronLeft />
        </button>
      )}

      {/* Image Container */}
      <div className="relative w-screen h-screen flex items-center justify-center px-10">
        <img
          src={images[index].url}
          alt="preview"
          className="w-full h-full object-contain rounded-2xl"
          style={{ maxWidth: "95vw", maxHeight: "95vh" }}
        />
      </div>


      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="cursor-pointer absolute right-6 z-50 text-white text-4xl hover:text-indigo-400"
        >
          <FiChevronRight />
        </button>
      )}
    </div>
  );
};

export default PostImageModal;
