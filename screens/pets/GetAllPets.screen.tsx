import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import PetCard from "./PetCard";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useCustomSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setData } from "@/redux/slices/pets.slice";
import { Alert } from "react-native";

const GetAllPets = () => {
	const { data } = useCustomSelector((state) => state.pets);

	const dispatch = useDispatch();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data, error } = await supabase.from("getallpets").select("*");
				if (error) {
					Alert.alert("Error", "Failed to get pets. Please try again.", [
						{ text: "OK" },
					]);
				} else {
					dispatch(setData(data));
				}
				// console.log(res);
			} catch (error) {
				console.log(error);
			}
		};
		console.log("fetching");
		fetchData();
	}, []);

	return (
		// <SafeAreaView>
		<View style={styles.container}>
			<Text style={styles.title}>Pet Gallery</Text>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<PetCard
						pet={item}
						onPress={() => console.log(`Selected pet: ${item.name}`)}
					/>
				)}
				contentContainerStyle={styles.listContent}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 16,
		// paddingHorizontal: 10,
		paddingVertical: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	listContent: {
		paddingBottom: 20,
	},
});

export default GetAllPets;
