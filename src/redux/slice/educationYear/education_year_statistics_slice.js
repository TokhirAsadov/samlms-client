import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  educationYearStatistics: [],
  educationYearStatisticsLoadingStatus: "start",
}

const educationYearStatisticsSlice = createSlice({
  name: "educationYearStatistics",
  initialState,
  reducers: {
    educationYearStatisticsFetching: state =>{ state.educationYearStatisticsLoadingStatus = 'loading' },
    educationYearStatisticsFetched: (state,action) => {
      state.educationYearStatisticsLoadingStatus = "done";
      state.educationYearStatistics = action.payload;
    },
    educationYearStatisticsFetchingError: state => { state.educationYearStatisticsLoadingStatus = "error" },
    resetDataDeanStatistics: (state) => {
      state.educationYearStatistics = initialState.educationYearStatistics;
      state.educationYearStatisticsLoadingStatus = initialState.educationYearStatisticsLoadingStatus;
    }
  }
})

const { actions,reducer } = educationYearStatisticsSlice;

export default reducer;
export const { educationYearStatisticsFetching,resetDataDeanStatistics, educationYearStatisticsFetched, educationYearStatisticsFetchingError } = actions;