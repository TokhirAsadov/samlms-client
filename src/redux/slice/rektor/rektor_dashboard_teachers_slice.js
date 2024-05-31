import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rektorDashboardTeachers: {},
  rektorDashboardTeachersLoadingStatus: "loading",
}

const rektorDashboardTeachersSlice = createSlice({
  name: "rektorDashboardTeachers",
  initialState,
  reducers: {
    rektorDashboardTeachersFetching: state =>{ state.rektorDashboardTeachersLoadingStatus = 'loading' },
    rektorDashboardTeachersFetched: (state,action) => {
      state.rektorDashboardTeachersLoadingStatus = "done";
      state.rektorDashboardTeachers = action.payload;
    },
    rektorDashboardTeachersFetchingError: state => { state.rektorDashboardTeachersLoadingStatus = "error" },
  }
})

const { actions,reducer } = rektorDashboardTeachersSlice;

export default reducer;
export const { rektorDashboardTeachersFetching, rektorDashboardTeachersFetched, rektorDashboardTeachersFetchingError } = actions;