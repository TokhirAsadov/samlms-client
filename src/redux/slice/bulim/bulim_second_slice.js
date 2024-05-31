import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  secondBulim: {},
  secondBulimLoadingStatus: "loading",
}

const secondBulimSlice = createSlice({
  name: "secondBulim",
  initialState,
  reducers: {
    secondBulimFetching: state =>{ state.secondBulimLoadingStatus = 'loading' },
    secondBulimFetched: (state,action) => {
      state.secondBulimLoadingStatus = "done";
      state.secondBulim = action.payload;
    },
    secondBulimFetchingError: state => { state.secondBulimLoadingStatus = "error" },
  }
})

const { actions,reducer } = secondBulimSlice;

export default reducer;
export const { secondBulimFetching, secondBulimFetched, secondBulimFetchingError } = actions;