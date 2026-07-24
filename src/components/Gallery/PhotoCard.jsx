import { motion } from "framer-motion";

export default function PhotoCard({
  photo,
  onImageClick,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative group overflow-hidden">
        <img
          src={photo.image}
          alt=""
          onClick={() => {
    // console.log("Clicked:", photo.image);
    onImageClick(photo.image);
  }}
          className="w-full cursor-pointer object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition duration-300 p-4">

          <h3 className="font-bold text-white">
            {photo.userName}
          </h3>

          {photo.caption && (
            <p className="text-white text-sm mt-1">
              {photo.caption}
            </p>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="p-4">

        <div className="flex justify-between items-center">

          <div>

            <h3 className="font-bold">
              {photo.userName}
            </h3>

            <p className="text-xs text-gray-500">
              {new Date(photo.createdAt).toLocaleDateString()}
            </p>

          </div>

        </div>

      </div>

    </motion.div>
  );
}