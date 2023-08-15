import { useContext } from "react";
import Typography from "@mui/material/Typography";
import LibraryContext from "../../../context/library/libraryContext";
import BaseCard from "../../../components/baseCard";

export default function BookCard({ book }) {
  const libraryContext = useContext(LibraryContext);
  const { getBookImageUrl } = libraryContext;

  return (
    <BaseCard
      imageGetter={getBookImageUrl}
      doc={book}
      onClick={() => window.location.replace(`/library/page/${book.firstPage}`)}
    >
      <Typography variant="h5" component="div">
        {book.title}
      </Typography>
      <Typography variant="body2">
        {book.description.slice(
          0,
          book.description.slice(0, 150).lastIndexOf(" ")
        ) + "..."}
      </Typography>
    </BaseCard>
  );
}
