import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  kafedraTimeTable: {},
  kafedraTimeTableLoadingStatus: "loading",
}

const kafedraTimeTableSlice = createSlice({
  name: "kafedraTimeTable",
  initialState,
  reducers: {
    kafedraTimeTableFetching: state =>{ state.kafedraTimeTableLoadingStatus = 'loading' },
    kafedraTimeTableFetched: (state,action) => {
      state.kafedraTimeTableLoadingStatus = "done";
      state.kafedraTimeTable = action.payload;
      console.log(action.payload,"action payload")
    },
    kafedraTimeTableFetchingError: state => { state.kafedraTimeTableLoadingStatus = "error" },
  }
})

const { actions,reducer } = kafedraTimeTableSlice;

export default reducer;
export const { kafedraTimeTableFetching, kafedraTimeTableFetched, kafedraTimeTableFetchingError } = actions;