import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  kafedraDashboardStatistics: {},
  kafedraDashboardStatisticsLoadingStatus: "loading",
}

const kafedraDashboardStatisticsSlice = createSlice({
  name: "kafedraDashboardStatistics",
  initialState,
  reducers: {
    kafedraDashboardStatisticsFetching: state =>{ state.kafedraDashboardStatisticsLoadingStatus = 'loading' },
    kafedraDashboardStatisticsFetched: (state,action) => {
      state.kafedraDashboardStatisticsLoadingStatus = "done";
      state.kafedraDashboardStatistics = action.payload;
    },
    kafedraDashboardStatisticsFetchingError: state => { state.kafedraDashboardStatisticsLoadingStatus = "error" },
  }
})

const { actions,reducer } = kafedraDashboardStatisticsSlice;

export default reducer;
export const { kafedraDashboardStatisticsFetching, kafedraDashboardStatisticsFetched, kafedraDashboardStatisticsFetchingError } = actions;