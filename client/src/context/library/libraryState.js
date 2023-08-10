import { useReducer } from "react";
import LibraryContext from "./libraryContext";
import LibraryReducer from "./libraryReducer";
import axios from "axios";

export default function LibraryState(props) {
  const initialState = {
    books: [],
    page: null,
  };
  const [state, dispatch] = useReducer(LibraryReducer, initialState);

  // Retrieve a list of books
  const retrieveBooks = () =>
    axios.get("/api/library/books").then((res) => {
      if (res?.data) dispatch({ appliesTo: "books", data: res?.data?.data });
    });

  // Retrieve a specific page
  const retrievePage = (id) =>
    axios.get(`/api/library/page/${id}`).then((res) => {
      if (res?.data) dispatch({ appliesTo: "page", data: res?.data?.data });
    });

  // Get the url that a given book
  const getBookImageUrl = ({ _id }) => `/api/image/book/${_id}.png`;

  return (
    <LibraryContext.Provider
      value={{
        books: state.books,
        page: state.page,
        retrieveBooks,
        retrievePage,
        getBookImageUrl,
      }}
    >
      {props.children}
    </LibraryContext.Provider>
  );
}
