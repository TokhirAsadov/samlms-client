import {createSlice} from "@reduxjs/toolkit";

const questionsSlice = createSlice({
    name: "questionsContent",
    initialState: {
        count: 5,
        allQuestions: [],
        configQuestions: {}
    },
    reducers: {
        addQiuestion: (state, action) => {
            state.allQuestions.push(action.payload);
        },
        deleteQuestion: (state, action) => {
            state.allQuestions = state.allQuestions.filter(item => item.question !== action.payload)
            state.count--;
        },
        addNewQuestionArea: (state, action) => {
            state.count++;
        },
        addConfigQuestions: (state, action) => {
            state.configQuestions = action.payload;
        }
    }
})

const {actions, reducer} = questionsSlice
export const {addQiuestion, deleteQuestion, addNewQuestionArea, addConfigQuestions} = actions

export default reducer;