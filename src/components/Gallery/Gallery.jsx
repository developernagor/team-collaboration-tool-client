import Masonry from "react-masonry-css";
import PhotoCard from "./PhotoCard";

export default function Gallery({
  photos,
  onImageClick,
}) {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex gap-5"
      columnClassName="space-y-5"
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