import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  dekanDashboard: {},
  dekanId: "",
  dekanLoadingStatus: "loading",
}

const dekanDashboardSlice = createSlice({
  name: "dekan",
  initialState,
  reducers: {
    dekanDashboardFetching: state =>{ state.dekanLoadingStatus = 'loading' },
    dekanDashboardFetched: (state,action) => {
      state.dekanLoadingStatus = "done";
      state.dekan = action.payload;
    },
    dekanDashboardFetchingError: state => { state.dekanLoadingStatus = "error" },
  }
})

const { actions,reducer } = dekanDashboardSlice;

export default reducer;
export const { dekanFetching, dekanFetched, dekanFetchingError } = actions;