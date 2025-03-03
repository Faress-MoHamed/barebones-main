import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { SheetManager } from "react-native-actions-sheet";
import { supabase } from "@/utils/supabase";
import { useDispatch } from "react-redux";
import { useCustomSelector } from "@/redux/store";
import { setData } from "@/redux/slices/pets.slice";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/App";
interface Pet {
	id: string;
	name: string;
	species: string;
	breed: string;
	age: number;
	created_at: string;
	owner_id: string;
	owner_email: string;
	pet_Image: string;
}

interface PetCardProps {
	pet: Pet;
	onPress?: () => void;
}
const PetCard = ({ pet, onPress }: PetCardProps) => {
	// Use the pet_Image if available, otherwise use a placeholder
	const imageUrl =
		pet.pet_Image || "https://via.placeholder.com/400x300?text=Pet";
	const { data } = useCustomSelector((state) => state.pets);
	const dispatch = useDispatch();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const handleDelete = async () => {
		try {
			const { statusText } = await supabase
				.from("pets")
				.delete()
				.eq("id", pet?.id);
			console.log(statusText);
			dispatch(setData(data?.filter((el) => el.id !== pet?.id)));
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("PetDetailsScreen", {
					id: pet?.id,
				});
			}}
			style={styles1.card}
			activeOpacity={0.9}
		>
			<Image
				source={{ uri: imageUrl }}
				style={styles1.image}
				resizeMode="cover"
			/>
			<View style={styles1.header}>
				<Text style={styles1.name}>{pet.name}</Text>
				<View style={styles1.badge}>
					<Text style={styles1.badgeText}>{pet.species}</Text>
				</View>
			</View>
			<View style={styles1.content}>
				<View style={styles1.infoRow}>
					<Ionicons name="paw" size={16} color="#666" />
					<Text style={styles1.infoText}>{pet.breed}</Text>
				</View>
				<View style={styles1.infoRow}>
					<Ionicons name="calendar" size={16} color="#666" />
					<Text style={styles1.infoText}>
						{pet.age} {pet.age === 1 ? "year" : "years"} old
					</Text>
				</View>
			</View>
			<View style={styles1.footer}>
				<View style={styles1.infoRow}>
					<Ionicons name="person" size={14} color="#999" />
					<Text style={styles1.ownerText}>Owner Email: {pet.owner_email}</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						// console.log("Attempting to show ActionSheet...");
						SheetManager.show("moreSheet", {
							payload: {
								handleDelete: handleDelete,
							},
						});
						SheetManager.hide("moreSheet");
					}}
				>
					<Entypo name="dots-three-vertical" size={20} color="black" />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};
const styles1 = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	image: {
		width: "100%",
		height: 180,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 8,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	badgeText: {
		fontSize: 12,
		textTransform: "capitalize",
	},
	content: {
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6,
	},
	infoText: {
		fontSize: 14,
		marginLeft: 8,
		color: "#333",
	},
	footer: {
		paddingHorizontal: 16,
		paddingBottom: 12,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
		paddingTop: 12,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	ownerText: {
		fontSize: 12,
		color: "#999",
		marginLeft: 4,
	},
});
export default PetCard;
