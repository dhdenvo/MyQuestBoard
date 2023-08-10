export default function LibraryReducer(state, action) {
  if (!action?.appliesTo) return;
  const { appliesTo, data } = action;
  return {
    ...state,
    [appliesTo]: data,
  };
}
