import { motion } from "framer-motion";
import { useState } from "react";

export default function PhotoCard({
  photo,
  onImageClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl"
    >
      {/* IMAGE */}
      <div className="relative group overflow-hidden bg-gray-200 min-h-[180px]">

        {/* Loading */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
            <span className="text-gray-500 text-sm">
              Loading...
            </span>
          </div>
        )}

        {/* Error */}
        {error ? (
          <div className="flex min-h-[200px] items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">
                Image could not be loaded
              </p>
            </div>
          </div>
        ) : (
          <img
            src={photo.image}
            alt={photo.caption || "Uploaded photo"}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            onClick={() => onImageClick(photo.image)}
            className={`
              block
              w-full
              h-auto
              cursor-pointer
              object-cover
              transition-all
              duration-700
              group-hover:scale-110
              ${loaded ? "opacity-100" : "opacity-0"}
            `}
          />
        )}

        {/* Overlay */}
        {loaded && (
          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300" />
        )}

        {/* Caption */}
        {loaded && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-300 p-4 bg-gradient-to-t from-black/80 to-transparent">

            <h3 className="font-bold text-white">
              {photo.userName || "Anonymous"}
            </h3>

            {photo.caption && (
              <p className="text-white text-sm mt-1 line-clamp-2">
                {photo.caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4">
        <div>
          <h3 className="font-bold truncate">
            {photo.userName || "Anonymous"}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {photo.createdAt
              ? new Date(photo.createdAt).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}