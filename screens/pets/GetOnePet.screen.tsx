"use client";

import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, type NavigationProp } from "@react-navigation/native";
import { supabase } from "@/utils/supabase";
import { SheetManager } from "react-native-actions-sheet";
import { useDispatch } from "react-redux";
import { useCustomSelector } from "@/redux/store";
import { setData } from "@/redux/slices/pets.slice";
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
	description?: string;
	weight?: number;
	medical_history?: string;
}

const PetDetailsScreen = () => {
	const route: any = useRoute();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const dispatch = useDispatch();
	const { data } = useCustomSelector((state) => state.pets);

	const [pet, setPet] = useState<Pet | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Get the pet ID from route params
	const petId = route.params?.id;

	useEffect(() => {
		fetchPetDetails();
	}, []);

	const fetchPetDetails = async () => {
		if (!petId) {
			setError("Pet ID is missing");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);

			const { data: petData, error: fetchError } = await supabase
				.from("pets")
				.select("*")
				.eq("id", petId)
				.single();

			if (fetchError) {
				throw fetchError;
			}

			setPet(petData);
		} catch (err) {
			console.error("Error fetching pet details:", err);
			setError("Failed to load pet details");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!pet) return;

		Alert.alert("Delete Pet", `Are you sure you want to delete ${pet.name}?`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					try {
						setLoading(true);
						const { error: deleteError } = await supabase
							.from("pets")
							.delete()
							.eq("id", pet.id);

						if (deleteError) throw deleteError;

						// Update the redux store
						dispatch(setData(data?.filter((el) => el.id !== pet.id)));

						// Navigate back
						navigation.goBack();
					} catch (err) {
						console.error("Error deleting pet:", err);
						Alert.alert("Error", "Failed to delete pet");
					} finally {
						setLoading(false);
					}
				},
			},
		]);
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#504B38" />
				<Text style={styles.loadingText}>Loading pet details...</Text>
			</View>
		);
	}

	if (error || !pet) {
		return (
			<View style={styles.errorContainer}>
				<MaterialIcons name="error-outline" size={60} color="#FF6B6B" />
				<Text style={styles.errorText}>{error || "Pet not found"}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={fetchPetDetails}>
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// Use the pet_Image if available, otherwise use a placeholder
	const imageUrl =
		pet.pet_Image || "https://via.placeholder.com/400x300?text=Pet";

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.moreButton}
					onPress={() => {
						SheetManager.show("moreSheet", {
							payload: {
								handleDelete: handleDelete,
							},
						});
					}}
				>
					<Ionicons name="ellipsis-vertical" size={24} color="#333" />
				</TouchableOpacity>
			</View>

			<Image
				source={{ uri: imageUrl }}
				style={styles.image}
				resizeMode="cover"
			/>

			<View style={styles.infoContainer}>
				<View style={styles.nameRow}>
					<Text style={styles.name}>{pet.name}</Text>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>{pet.species}</Text>
					</View>
				</View>

				<View style={styles.detailsCard}>
					<Text style={styles.sectionTitle}>Pet Details</Text>

					<View style={styles.detailRow}>
						<View style={styles.detailItem}>
							<Ionicons name="paw" size={20} color="#504B38" />
							<Text style={styles.detailLabel}>Breed</Text>
							<Text style={styles.detailValue}>{pet.breed}</Text>
						</View>

						<View style={styles.detailItem}>
							<Ionicons name="calendar" size={20} color="#504B38" />
							<Text style={styles.detailLabel}>Age</Text>
							<Text style={styles.detailValue}>
								{pet.age} {pet.age === 1 ? "year" : "years"}
							</Text>
						</View>

						{pet.weight && (
							<View style={styles.detailItem}>
								<Ionicons name="scale" size={20} color="#504B38" />
								<Text style={styles.detailLabel}>Weight</Text>
								<Text style={styles.detailValue}>{pet.weight} kg</Text>
							</View>
						)}
					</View>
				</View>

				{pet.description && (
					<View style={styles.descriptionCard}>
						<Text style={styles.sectionTitle}>About</Text>
						<Text style={styles.descriptionText}>{pet.description}</Text>
					</View>
				)}

				{pet.medical_history && (
					<View style={styles.medicalCard}>
						<Text style={styles.sectionTitle}>Medical History</Text>
						<Text style={styles.medicalText}>{pet.medical_history}</Text>
					</View>
				)}

				<View style={styles.ownerCard}>
					<Text style={styles.sectionTitle}>Owner Information</Text>
					<View style={styles.ownerInfo}>
						<Ionicons name="person" size={20} color="#504B38" />
						<Text style={styles.ownerEmail}>{pet.owner_email}</Text>
					</View>
					<Text style={styles.createdAt}>
						Added on {new Date(pet.created_at).toLocaleDateString()}
					</Text>
				</View>

				<View style={styles.actionButtons}>
					<TouchableOpacity
						style={[styles.actionButton, styles.editButton]}
						onPress={() =>
							navigation.navigate(
								"Tabs" as any,
								{
									screen: "AddPetForm",
									params: { id: pet?.id },
								} as any
							)
						}
					>
						<Ionicons name="create-outline" size={20} color="#FFF" />
						<Text style={styles.actionButtonText}>Edit Pet</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.actionButton, styles.deleteButton]}
						onPress={handleDelete}
					>
						<Ionicons name="trash-outline" size={20} color="#FFF" />
						<Text style={styles.actionButtonText}>Delete</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: "#666",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f9fa",
		padding: 20,
	},
	errorText: {
		marginTop: 12,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	retryButton: {
		marginTop: 20,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#504B38",
		borderRadius: 8,
	},
	retryButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		top: 50,
		left: 0,
		right: 0,
		zIndex: 10,
		paddingHorizontal: 16,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	moreButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: 300,
	},
	infoContainer: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		marginTop: -24,
		paddingHorizontal: 16,
		paddingTop: 24,
		paddingBottom: 40,
	},
	nameRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	name: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
	},
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: "#E8F0FE",
	},
	badgeText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#504B38",
		textTransform: "capitalize",
	},
	detailsCard: {
		backgroundColor: "#FFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
		marginBottom: 12,
	},
	detailRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	detailItem: {
		width: "48%",
		backgroundColor: "#F8F9FA",
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		alignItems: "flex-start",
	},
	detailLabel: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
	detailValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginTop: 2,
	},
	descriptionCard: {
		backgroundColor: "#FFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	descriptionText: {
		fontSize: 16,
		lineHeight: 24,
		color: "#555",
	},
	medicalCard: {
		backgroundColor: "#FFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	medicalText: {
		fontSize: 16,
		lineHeight: 24,
		color: "#555",
	},
	ownerCard: {
		backgroundColor: "#FFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	ownerInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	ownerEmail: {
		fontSize: 16,
		color: "#333",
		marginLeft: 8,
	},
	createdAt: {
		fontSize: 14,
		color: "#999",
	},
	actionButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		borderRadius: 12,
		flex: 1,
		marginHorizontal: 6,
	},
	editButton: {
		backgroundColor: "#504B38",
	},
	deleteButton: {
		backgroundColor: "#FF6B6B",
	},
	actionButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
});

export default PetDetailsScreen;
