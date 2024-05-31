import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  kafedraTeacherStatistics: {},
  kafedraTeacherStatisticsLoadingStatus: "loading",
}

const kafedraTeacherStatisticsSlice = createSlice({
  name: "kafedraTeacherStatistics",
  initialState,
  reducers: {
    kafedraTeacherStatisticsFetching: state =>{ state.kafedraTeacherStatisticsLoadingStatus = 'loading' },
    kafedraTeacherStatisticsFetched: (state,action) => {
      state.kafedraTeacherStatisticsLoadingStatus = "done";
      state.kafedraTeacherStatistics = action.payload;
    },
    kafedraTeacherStatisticsFetchingError: state => { state.kafedraTeacherStatisticsLoadingStatus = "error" },
  }
})

const { actions,reducer } = kafedraTeacherStatisticsSlice;

export default reducer;
export const { kafedraTeacherStatisticsFetching, kafedraTeacherStatisticsFetched, kafedraTeacherStatisticsFetchingError } = actions;