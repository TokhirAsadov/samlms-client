import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rektorTeachers: {},
  rektorTeachersLoadingStatus: "loading",
}

const rektorTeachersSlice = createSlice({
  name: "rektorTeachers",
  initialState,
  reducers: {
    rektorTeachersFetching: state =>{ state.rektorTeachersLoadingStatus = 'loading' },
    rektorTeachersFetched: (state,action) => {
      state.rektorTeachersLoadingStatus = "done";
      state.rektorTeachers = action.payload;
    },
    rektorTeachersFetchingError: state => { state.rektorTeachersLoadingStatus = "error" },
  }
})

const { actions,reducer } = rektorTeachersSlice;

export default reducer;
export const { rektorTeachersFetching, rektorTeachersFetched, rektorTeachersFetchingError } = actions;