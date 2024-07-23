import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiDELETE, apiGET, apiPOST, apiPUT } from "../../utilities/apiHelpers";
const initialState = {
    cartData: [],
    selectedPrescription: [],
    selectedAddress: [],
    status: 'idle',
    error: null,
    currentStep: 0,
    totalCartAmount: 0,
    prescriptionDuration: 0,
    prescriptionType: "",
    prescriptionDurationUnit: "",
    orderMode: "",
    enquiryId: "",
};

// Async thunk to delete cart item
export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiDELETE(`/v1/cart/delete/${id}`);
            if (response.status) {
                return id;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({ type, id, quantity }, { rejectWithValue }) => {
        const updatedQuantity = type === 'increment' ? quantity + 1 : quantity - 1;
        const payload = { quantity: updatedQuantity };

        try {
            const response = await apiPUT(`/v1/cart/update/${id}`, payload);
            if (response.status) {
                return { id, quantity: updatedQuantity };
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const resetUserCartData = createAsyncThunk(
    'cart/resetUserCartData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiDELETE(`/v1/cart/remove-user-cart`);
            if (response.status) {
                console.log(response.data.data);
                return response.data.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const setUserCartData = createAsyncThunk(
    'cart/setUserCartData',
    async (userId, { rejectWithValue }) => {
        console.log("setUserCartData userId", userId);
        try {
            const response = await apiGET(`/v1/cart/all-by-user/${userId}`);
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

export const updateOrderSummaryForEnquiry = createAsyncThunk(
    'cart/updateOrderSummaryForEnquiry',
    async ({ orderId, userId }, { rejectWithValue }) => {
        console.log("setUserCartData userId", userId, orderId);
        const orderSummaryData = {};
        try {
            const orderResponse = await apiGET(`/v1/order/${orderId}`);
            if (orderResponse.status) {
                orderSummaryData.selectedAddress = orderResponse.data?.data[0]?.addressDetails;
                orderSummaryData.selectedPrescription = [orderResponse.data?.data[0]?.prescriptionData];
                console.log(orderResponse.data?.data[0]);
                const orderItems = orderResponse.data?.data[0]?.orderItemData;
                console.log("orderItems", orderResponse.data?.data[0].orderItemData);
                if (orderItems && orderItems.length > 0) {
                    const addToCartPayloads = orderItems.map(item => ({
                        productId: item.productId,
                        userId: userId,
                        quantity: item.quantity || 1
                    }));

                    const addToCart = async (payload) => {
                        try {
                            const response = await apiPOST('/v1/cart/add', payload);
                            return response;
                        } catch (error) {
                            return rejectWithValue(error.response.data);
                        }
                    };

                    await Promise.all(addToCartPayloads.map(payload => addToCart(payload)));
                }
                const userCartResponse = await apiGET(`/v1/cart/all-by-user/${userId}`);
                if (userCartResponse.status) {
                    console.log(userCartResponse.data?.data);
                    orderSummaryData.cartData = userCartResponse.data?.data;
                } else {
                    return rejectWithValue(userCartResponse.data);
                }
                console.log("orderSummaryData", orderSummaryData);
                return orderSummaryData;
            } else {
                return rejectWithValue(orderResponse.data);
            }

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const cartSlice = createSlice({
    name: "cartsReducer",
    initialState,
    reducers: {
        setCart: (
            state,
            action
        ) => {
            state.cartData = action.payload;
        },
        updateStep: (
            state,
            action
        ) => {
            state.currentStep = action.payload;
        },
        updateSelectedPrescription: (
            state,
            action
        ) => {
            state.selectedPrescription = action.payload;
            state.currentStep = 2;
        },
        updateSelectedAddress: (
            state,
            action
        ) => {
            state.selectedAddress = action.payload;
            state.currentStep = 3;
        },
        updateSelectedPrescriptionDuration: (
            state,
            action
        ) => {
            state.prescriptionDuration = action.payload;
            state.currentStep = 0;
        },
        updateSelectedPrescriptionType: (
            state,
            action
        ) => {
            state.prescriptionType = action.payload;
            state.currentStep = 0;
        },
        updateSelectedPrescriptionDurationUnit: (
            state,
            action
        ) => {
            state.prescriptionDurationUnit = action.payload;
            state.currentStep = 0;
        },
        updateOrderSummary: (
            state,
            action
        ) => {
            state.currentStep = 4;
        },
        addTotalCartAmount: (
            state,
            action
        ) => {
            state.totalCartAmount = String(action.payload);
        },
        resetCurrentStep: (
            state,
            action
        ) => {
            state.currentStep = 0;
        },
        setOrderMode: (
            state,
            action
        ) => {
            console.log("setOrderMode", action.payload);
            state.orderMode = action.payload;
        },
        setEnquiryId: (
            state,
            action
        ) => {
            state.enquiryId = action.payload;
        },
        resetStateForEnquiry: (
            state,
            action
        ) => {
            state.selectedPrescription = []
            state.selectedAddress = []
            state.status = 'idle'
            state.error = null
            state.currentStep = 0
            state.totalCartAmount = 0
            state.prescriptionDuration = 0
            state.prescriptionType = ""
            state.prescriptionDurationUnit = ""
            // state.orderMode = ""
            // state.enquiryId = ""
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.cartData = state.cartData.filter(item => item._id !== action.payload);
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.cartData = state.cartData.map(item =>
                    item._id === action.payload.id ? { ...item, quantity: action.payload.quantity, total_price: action.payload.quantity * item.productDetails.discountedPrice } : item
                );
            })
            .addCase(resetUserCartData.fulfilled, (state, action) => {
                state.cartData = []
                state.selectedPrescription = []
                state.selectedAddress = []
                state.status = 'idle'
                state.error = null
                state.currentStep = 0
                state.totalCartAmount = 0
            })
            .addCase(resetUserCartData.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(setUserCartData.fulfilled, (state, action) => {
                state.cartData = action.payload;
            })
            .addCase(setUserCartData.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateOrderSummaryForEnquiry.fulfilled, (state, action) => {
                console.log(action.payload);
                state.cartData = action.payload.cartData;
                state.currentStep = 3;
                state.selectedAddress = action.payload.selectedAddress;
                state.selectedPrescription = action.payload.selectedPrescription;
            })
            .addCase(updateOrderSummaryForEnquiry.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});
// Action creators are generated for each case reducer function
export const {
    setCart, updateStep, updateSelectedPrescription, updateSelectedAddress, updateOrderSummary, addTotalCartAmount, resetCurrentStep, updateSelectedPrescriptionDuration, updateSelectedPrescriptionDurationUnit, updateSelectedPrescriptionType, setOrderMode, setEnquiryId, resetStateForEnquiry
} = cartSlice.actions;
export default cartSlice.reducer;