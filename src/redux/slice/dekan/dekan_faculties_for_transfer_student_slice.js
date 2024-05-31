import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  transferFaculties: {},
  transferFacultiesId: "",
  transferFacultiesLoadingStatus: "loading",
}

const dekanFacultiesForTransferStudentSlice = createSlice({
  name: "transferFaculties",
  initialState,
  reducers: {
    transferFacultiesFetching: state =>{ state.transferFacultiesLoadingStatus = 'loading' },
    transferFacultiesFetched: (state,action) => {
      state.transferFacultiesLoadingStatus = "done";
      state.transferFaculties = action.payload;
    },
    transferFacultiesFetchingError: state => { state.transferFacultiesLoadingStatus = "error" },
    transferFacultiesFetchedId: (state,action) => {
      state.transferFacultiesLoadingStatus = "id_done";
      state.transferFacultiesId = action.payload;
    },
  }
})

const { actions,reducer } = dekanFacultiesForTransferStudentSlice;

export default reducer;
export const { transferFacultiesFetching, transferFacultiesFetched, transferFacultiesFetchingError } = actions;