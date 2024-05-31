import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  student: {},
  studentLoadingStatus: "loading",
}

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    studentFetching: state =>{ state.studentLoadingStatus = 'loading' },
    studentFetched: (state,action) => {
      state.studentLoadingStatus = "done";
      state.student = action.payload;
    },
    studentFetchingError: state => { state.studentLoadingStatus = "error" },
    resetStudentData:()=>initialState
  }
})

const { actions,reducer } = studentSlice;

export default reducer;
export const { studentFetching,studentFetched,studentFetchingError,resetStudentData } = actions;