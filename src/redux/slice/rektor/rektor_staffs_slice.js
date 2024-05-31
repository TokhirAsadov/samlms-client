import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rektorStaffs: {},
  rektorStaffsLoadingStatus: "loading",
}

const rektorStaffsSlice = createSlice({
  name: "rektorStaffs",
  initialState,
  reducers: {
    rektorStaffsFetching: state =>{ state.rektorStaffsLoadingStatus = 'loading' },
    rektorStaffsFetched: (state,action) => {
      state.rektorStaffsLoadingStatus = "done";
      state.rektorStaffs = action.payload;
    },
    rektorStaffsFetchingError: state => { state.rektorStaffsLoadingStatus = "error" },
  }
})

const { actions,reducer } = rektorStaffsSlice;

export default reducer;
export const { rektorStaffsFetching, rektorStaffsFetched, rektorStaffsFetchingError } = actions;