import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
	data:
		| {
				age: number;
				breed: string;
				created_at: string;
				id: string;
				name: string;
				owner_email: string;
				owner_id: string;
				pet_Image: string;
				species: string;
		  }[]
		| null
		| undefined;
} = {
	data: null,
};

export const petSlice = createSlice({
	name: "pets",
	initialState,
	reducers: {
		setData: (state, action) => {
			state.data = action.payload;
		},
		clearData: (state, action) => {
			state.data = initialState.data;
		},
	},
});

export const { setData } = petSlice.actions;

export const PetReducer = petSlice.reducer;
