import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
	isLoggedIn: boolean;
	data: any;
	token: string | null;
	refreshToken: string | null;
} = {
	isLoggedIn: false,
	data: null,
	token: null,
	refreshToken: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (
			state,
			action: PayloadAction<{ data: any; token: string; refreshToken?: string }>
		) => {
			state.isLoggedIn = true;
			state.data = action.payload.data;
			state.token = action.payload.token;
			if (action.payload.refreshToken) {
				state.refreshToken = action.payload.refreshToken;
			}
		},
		signUp: (state, action: PayloadAction<{ data: any; token: string }>) => {
			state.isLoggedIn = true;
			state.data = action.payload.data;
			state.token = action.payload.token;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.data = null;
			state.token = null;
		},
		updateUserDetails: (state, action: PayloadAction<Partial<any>>) => {
			if (state.data) {
				state.data = { ...state.data, ...action.payload };
			}
		},
	},
});

export const {
	login,
	logout,
	updateUserDetails,

	signUp,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
