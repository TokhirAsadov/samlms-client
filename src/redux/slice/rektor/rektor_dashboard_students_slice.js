import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rektorDashboardStudents: {},
  rektorDashboardStudentsLoadingStatus: "loading",
}

const rektorDashboardStudentsSlice = createSlice({
  name: "rektorDashboardStudents",
  initialState,
  reducers: {
    rektorDashboardStudentsFetching: state =>{ state.rektorDashboardStudentsLoadingStatus = 'loading' },
    rektorDashboardStudentsFetched: (state,action) => {
      state.rektorDashboardStudentsLoadingStatus = "done";
      state.rektorDashboardStudents = action.payload;
    },
    rektorDashboardStudentsFetchingError: state => { state.rektorDashboardStudentsLoadingStatus = "error" },
  }
})

const { actions,reducer } = rektorDashboardStudentsSlice;

export default reducer;
export const { rektorDashboardStudentsFetching, rektorDashboardStudentsFetched, rektorDashboardStudentsFetchingError } = actions;