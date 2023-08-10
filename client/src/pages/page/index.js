import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { page, retrievePage } = libraryContext;
  const { pageId } = useParams();

  useEffect(() => {
    retrievePage(pageId);
    // eslint-disable-next-line
  }, []);

  return <Box sx={{ flexGrow: 1 }}></Box>;
}
