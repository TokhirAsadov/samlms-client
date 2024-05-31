import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  educationYear: {},
  educationYearLoadingStatus: "start",
}

const educationYearSlice = createSlice({
  name: "educationYear",
  initialState,
  reducers: {
    educationYearFetching: state =>{ state.educationYearLoadingStatus = 'loading' },
    educationYearFetched: (state,action) => {
      state.educationYearLoadingStatus = "done";
      state.educationYear = action.payload;
    },
    educationYearFetchingError: state => { state.educationYearLoadingStatus = "error" },
  }
})

const { actions,reducer } = educationYearSlice;

export default reducer;
export const { educationYearFetching, educationYearFetched, educationYearFetchingError } = actions;