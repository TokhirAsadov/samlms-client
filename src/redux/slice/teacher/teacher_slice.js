import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  teacher: {},
  teacherLoadingStatus: "loading",
}

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    teacherFetching: state =>{ state.teacherLoadingStatus = 'loading' },
    teacherFetched: (state,action) => {
      state.teacherLoadingStatus = "done";
      state.teacher = action.payload;
    },
    studentFetchingError: state => { state.teacherLoadingStatus = "error" },
    resetDataTeacher:()=>initialState
  }
})

const { actions,reducer } = teacherSlice;

export default reducer;
export const { teacherFetching,teacherFetched,teacherFetchingError,resetDataTeacher } = actions;