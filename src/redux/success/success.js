import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGET } from "../../utilities/apiHelpers";
const initialState = {
    successData: [],
    loading:false,
    
};

export const setSuccessData = createAsyncThunk(
    'success/setSuccessData',
    async (sessionId, { rejectWithValue }) => {
        console.log("setSuccessData sessionId", sessionId);
        try {
            const response = await apiGET(`/v1/payment/get-session-info/${sessionId}`);
            if (response.status) {
                console.log(response.data?.data);
                return response.data?.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const sucessSlice = createSlice({
    name: "successReducer",
    initialState,
    reducers: {
        setSuccess: (
            state,
            action
        ) => {
            state.successData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder  
            .addCase(setSuccessData.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(setSuccessData.fulfilled, (state, action) => {
                state.successData = action.payload;
                state.loading = false;
            })
            .addCase(setSuccessData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            
    },
});
// Action creators are generated for each case reducer function
export const {
    setSuccess
} = sucessSlice.actions;
export default sucessSlice.reducer;