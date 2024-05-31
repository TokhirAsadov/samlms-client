import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  dekanGroups: {},
  dekanGroupsLoadingStatus: "loading",
}

const dekanGroupsSlice = createSlice({
  name: "dekanGroups",
  initialState,
  reducers: {
    dekanGroupsFetching: state =>{ state.dekanGroupsLoadingStatus = 'loading' },
    dekanGroupsFetched: (state,action) => {
      state.dekanGroupsLoadingStatus = "done";
      state.dekanGroups = action.payload;
    },
    dekanGroupsFetchingError: state => { state.dekanGroupsLoadingStatus = "error" },
  }
})

const { actions,reducer } = dekanGroupsSlice;

export default reducer;
export const { dekanGroupsFetching, dekanGroupsFetched, dekanGroupsFetchingError } = actions;