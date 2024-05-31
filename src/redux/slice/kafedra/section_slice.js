import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  section: {},
  sectionId: "",
  sectionLoadingStatus: "loading",
}

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    sectionFetching: state =>{ state.sectionLoadingStatus = 'loading' },
    sectionFetched: (state,action) => {
      state.sectionLoadingStatus = "done";
      state.section = action.payload;
    },
    sectionFetchingError: state => { state.sectionLoadingStatus = "error" },
    sectionFetchedId: (state,action) => {
      state.sectionLoadingStatus = "id_done";
      state.sectionId = action.payload;
    },
  }
})

const { actions,reducer } = sectionSlice;

export default reducer;
export const { sectionFetching, sectionFetched, sectionFetchingError } = actions;