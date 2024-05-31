import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  bulim: {},
  bulimLoadingStatus: "loading",
}

const bulimSlice = createSlice({
  name: "bulim",
  initialState,
  reducers: {
    bulimFetching: state =>{ state.bulimLoadingStatus = 'loading' },
    bulimFetched: (state,action) => {
      state.bulimLoadingStatus = "done";
      state.bulim = action.payload;
    },
    bulimFetchingError: state => { state.bulimLoadingStatus = "error" },
  }
})

const { actions,reducer } = bulimSlice;

export default reducer;
export const { bulimFetching, bulimFetched, bulimFetchingError } = actions;