import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  dekanat: {},
  dekanatLoadingStatus: "loading",
}

const dekanatSlice = createSlice({
  name: "dekanat",
  initialState,
  reducers: {
    dekanatFetching: state =>{ state.dekanatLoadingStatus = 'loading' },
    dekanatFetched: (state,action) => {
      state.dekanatLoadingStatus = "done";
      state.dekanat = action.payload;
    },
    dekanatFetchingError: state => { state.dekanatLoadingStatus = "error" },

  }
})

const { actions,reducer } = dekanatSlice;

export default reducer;
export const { dekanatFetching, dekanatFetched, dekanatFetchingError } = actions;