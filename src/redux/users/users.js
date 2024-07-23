import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userData: null,
    cartupdate: null,
    access: { expires: null, token: null },
    refresh: { expires: null, token: null },
    cartCount: 0,
    lastpath: "/",
    cartCount: 0
};


export const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setUser: (
            state,
            action
        ) => {
            console.log("redux", state, action);
            return {
                ...state,
                userData: action.payload,
                access: action.payload.access,
                refresh: action.payload.refresh,
            };
        },
        removeUser: (state, action) => {
            return {
                userData: null,
                access: { expires: null, token: null },
                refresh: { expires: null, token: null },
            }
        },
        setCartCount: (state, action) => {
            return {
                cartCount: state.payload.cartCount,
            }
        },
        setCartUpdate: (state, action) => {
            console.log("state paylaod", action.payload)
            return {
                ...state,
                cartupdate: action.payload,
            }
        },
        setlastpath: (state, action) => {
            console.log("state paylaod", action.payload)
            return {
                ...state,
                lastpath: action.payload,
            }
        },
        setAddress: (state, action) => {
            console.log("state paylaod", action.payload)
            return {
                ...state,
                address: action.payload,
            }
        },
        updateUser: (state, action) => {
            return {
                ...state,
                userData: action.payload.user,
            }
        },
        setCartCount: (state, action) => {
            console.log("setCartCount", action.payload);
            return {
                ...state,
                cartCount: action.payload,
            }
        }
    },
});
// Action creators are generated for each case reducer function
export const {
    setUser,
    removeUser,
    setCartCount,
    updateUser,
    setCartUpdate,
    setAddress,
    setlastpath

} = userSlice.actions;
export default userSlice.reducer;