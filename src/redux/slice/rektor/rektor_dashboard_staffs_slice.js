import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rektorDashboardStaffs: {},
  rektorDashboardStaffsLoadingStatus: "loading",
}

const rektorDashboardStaffsSlice = createSlice({
  name: "rektorDashboardStaffs",
  initialState,
  reducers: {
    rektorDashboardStaffsFetching: state =>{ state.rektorDashboardStaffsLoadingStatus = 'loading' },
    rektorDashboardStaffsFetched: (state,action) => {
      state.rektorDashboardStaffsLoadingStatus = "done";
      state.rektorDashboardStaffs = action.payload;
    },
    rektorDashboardStaffsFetchingError: state => { state.rektorDashboardStaffsLoadingStatus = "error" },
  }
})

const { actions,reducer } = rektorDashboardStaffsSlice;

export default reducer;
export const { rektorDashboardStaffsFetching, rektorDashboardStaffsFetched, rektorDashboardStaffsFetchingError } = actions;