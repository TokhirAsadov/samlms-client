import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  badBest: {},
  badBestId: "",
  badBestLoadingStatus: "loading",
}

const badBestSlice = createSlice({
  name: "dekan",
  initialState,
  reducers: {
    badBestFetching: state =>{ state.badBestLoadingStatus = 'loading' },
    badBestFetched: (state,action) => {
      state.badBestLoadingStatus = "done";
      state.badBest = action.payload;
    },
    badBestFetchingError: state => { state.badBestLoadingStatus = "error" },
    badBestFetchedId: (state,action) => {
      state.badBestLoadingStatus = "id_done";
      state.badBestId = action.payload;
    },
  }
})

const { actions,reducer } = badBestSlice;

export default reducer;
export const { badBestFetching, badBestFetched, badBestFetchingError } = actions;