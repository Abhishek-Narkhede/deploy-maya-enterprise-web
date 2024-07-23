import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGET } from "../../utilities/apiHelpers";
const initialState = {
    globalConfigData: [],
    status: 'idle',
    error: null,
};

export const fetchGlobalConfig = createAsyncThunk(
    'cart/fetchglobalConfig',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGET(`/v1/global-config/get-config`);
            if (response.status) {
                console.log(response?.data?.data?.data[0]);
                return response?.data?.data?.data[0];
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const globalConfigSlice = createSlice({
    name: "globalConfigReducer",
    initialState,
    reducers: {
        setGlobalConfig: (
            state,
            action
        ) => {
            state.globalConfigData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalConfig.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGlobalConfig.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.globalConfigData = action.payload;
            })
            .addCase(fetchGlobalConfig.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});
// Action creators are generated for each case reducer function
export const {
    setGlobalConfig,
} = globalConfigSlice.actions;
export default globalConfigSlice.reducer;