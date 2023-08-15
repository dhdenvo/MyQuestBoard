import { useReducer } from "react";
import LibraryContext from "./libraryContext";
import LibraryReducer from "./libraryReducer";
import axios from "axios";

export default function LibraryState(props) {
  const initialState = {
    books: [],
    page: null,
    path: null,
  };
  const [state, dispatch] = useReducer(LibraryReducer, initialState);

  // Retrieve a list of books
  const retrieveBooks = () =>
    axios.get("/api/library/books").then((res) => {
      if (res?.data) dispatch({ appliesTo: "books", data: res?.data?.data });
    });

  // Retrieve a specific page
  const retrievePage = (id) => {
    const params = {};
    if (state.path) params.path = state.path;
    axios.get(`/api/library/page/${id}`, { params }).then((res) => {
      if (res?.data) dispatch({ appliesTo: "page", data: res.data.data[0] });
    });
  };

  // Retrieve a specific page
  const searchForPage = (bookId, searchInfo) => {
    axios.get(`/api/library/book/${bookId}/page/${searchInfo}`).then((res) => {
      if (res?.data?.data?.length)
        window.location.href = `/library/page/${res.data.data[0]._id}`;
    });
  };

  // Get the url that a given book
  const getBookImageUrl = ({ _id }) => `/api/image/books/${_id}.png`;

  // Set the path that the reader is on
  const setPath = (path) => dispatch({ appliesTo: "path", data: path });

  // Save a path to a book
  const savePath = ({ _id, book }) => {
    axios.put(`/api/library/book/${book._id}/page/${_id}/path`);
    const newPage = { ...state.page, pathSaved: true };
    dispatch({ appliesTo: "page", data: newPage });
  };
  // Remove a path from a book
  const removePath = ({ _id, book }) => {
    axios.delete(`/api/library/book/${book._id}/page/${_id}/path`);
    const newPage = { ...state.page, pathSaved: false };
    dispatch({ appliesTo: "page", data: newPage });
  };

  return (
    <LibraryContext.Provider
      value={{
        books: state.books,
        page: state.page,
        path: state.path,
        retrieveBooks,
        retrievePage,
        getBookImageUrl,
        setPath,
        savePath,
        removePath,
        searchForPage,
      }}
    >
      {props.children}
    </LibraryContext.Provider>
  );
}
