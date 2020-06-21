import { TRANSFORM } from "../constants/actions";
// curriculum reducer
export const curriculumReducer = (state, action) => {
  const { type, payload } = action;

  if (type === TRANSFORM) {
    return payload;
  }
  return state;
};
