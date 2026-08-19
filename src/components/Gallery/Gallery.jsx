import Masonry from "react-masonry-css";
import PhotoCard from "./PhotoCard";

export default function Gallery({ photos, onImageClick }) {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow">
        <p className="text-gray-500 text-lg">
          No photos found 📷
        </p>
      </div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-full gap-5"
      columnClassName="flex flex-col gap-5"
    >
      {photos.map((photo) => (
        <PhotoCard
          key={photo._id}
          photo={photo}
          onImageClick={onImageClick}
        />
      ))}
    </Masonry>
  );
}