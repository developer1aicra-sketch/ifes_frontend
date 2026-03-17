import { createSlice } from "@reduxjs/toolkit";

const competitionSlice = createSlice({
    name: "competition",
    initialState: {
        list: [],
        eventList:[],
        single: null,   // ✅ single competition object
        loading: 0,     // 0 = idle, 1 = loading, 2 = completed
        error: null,
    },
    reducers: {
        // ===== Fetch All Competitions =====
        fetchCompetitionsRequest: (state) => {
            state.loading = 1;
            state.error = null;
        },
        fetchCompetitionsSuccess: (state, action) => {
            state.loading = 2;
            // Store the competitions array directly
            state.list = Array.isArray(action.payload) ? action.payload : [];
        },
        fetchCompetitionsFailure: (state, action) => {
            state.loading = 2;
            state.error = action.payload;
        },

        // ===== Fetch Single Competition =====
        fetchCompetitionRequest: (state) => {
            state.loading = 1;
            state.error = null;
            state.single = null;
        },
        fetchCompetitionSuccess: (state, action) => {
            state.loading = 2;
            state.single = action.payload; // ✅ correct
        },
        fetchCompetitionFailure: (state, action) => {
            state.loading = 2;
            state.error = action.payload;
        },
           fetchEventRequest: (state) => {
            state.loading = 1;
            state.error = null;
        },
        fetchEventSuccess: (state, action) => {
            state.loading = 2;
            state.eventList = action.payload;
        },
        fetchEventFailure: (state, action) => {
            state.loading = 2;
            state.error = action.payload;
        },
    },
});

export const {
    fetchCompetitionsRequest,
    fetchCompetitionsSuccess,
    fetchCompetitionsFailure,
    fetchCompetitionRequest,
    fetchCompetitionSuccess,
    fetchCompetitionFailure,
    fetchEventRequest,
    fetchEventSuccess,
    fetchEventFailure,
} = competitionSlice.actions;

export default competitionSlice.reducer;

// ===== Selectors =====
export const selectCompetitions = (state) => state.competition.list || [];
export const selectEventList = (state) => state.competition.eventList.data;

// Single competition selector
export const selectSingleCompetition = (state) => state.competition.single;

// Loading & error
export const selectCompetitionsLoading = (state) =>
    state.competition.loading;

export const selectCompetitionsError = (state) =>
    state.competition.error;

export const selectIsCompetitionsLoading = (state) =>
    state.competition.loading === 1;

export const selectHasCompetitionsLoaded = (state) =>
    state.competition.loading === 2 && !state.competition.error;
