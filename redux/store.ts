import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user.slice";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { PetReducer } from "./slices/pets.slice";

const reducer = combineReducers({
	user: userReducer,
	pets: PetReducer,
});

export type RootState = ReturnType<typeof reducer>;

export const store = configureStore({
	reducer, // ✅ Use combined reducer directly
});

export const useCustomSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
