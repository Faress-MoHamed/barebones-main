import React, { memo, useEffect, useMemo, useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Image,
	// ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import Selector from "@/components/selector";
// import * as ImagePicker from "expo-image-picker";
import ImagePicker, { launchImageLibrary } from "react-native-image-picker";

import { uploadToCloudinary } from "@/utils/UploadToCloudinary";
import { supabase } from "@/utils/supabase";
import { useCustomSelector } from "@/redux/store";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { uploadToCloudinary } from "@/utils/UploadToCloudinary";

// Form validation function
const validateForm = (pet: {
	name: any;
	species: any;
	breed: any;
	age: any;
	pet_Image: any;
	selectValue: any;
}) => {
	const errors: any = {};

	if (!pet.name || pet.name.length < 2) {
		errors.name = "Pet name must be at least 2 characters";
	}
	if (pet.selectValue !== "Other" && pet.selectValue === "") {
		errors.selectValue = "Please select a species";
	}
	if (!pet.species && pet.selectValue === "Other") {
		errors.species = "Please select a species";
	}

	if (!pet.breed || pet.breed.length < 2) {
		errors.breed = "Breed must be at least 2 characters";
	}

	if (!pet.age || isNaN(pet.age) || pet.age <= 0) {
		errors.age = "Age must be a positive number";
	}

	if (pet.pet_Image && !/^https?:\/\/.+/.test(pet.pet_Image)) {
		errors.pet_Image = "Please enter a valid image URL";
	}

	return errors;
};

const AddPetForm = () => {
	const { data } = useCustomSelector((state) => state.user);
	const navigation = useNavigation();
	const params: any = useRoute();
	const petId = useMemo(() => params.params?.id, [JSON.stringify(params)]);
	console.log(params);
	console.log(petId);
	const [pet, setPet] = useState({
		name: "",
		species: "",
		breed: "",
		age: "",
		pet_Image: "",
		selectValue: "",
	});

	const [errors, setErrors] = useState<any>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setIsLoading] = useState<boolean>(false);
	const openPicker = async () => {
		// const options = ;

		launchImageLibrary(
			{
				mediaType: "photo",
				quality: 1,
			},
			async (response) => {
				if (response.didCancel) {
					console.log("User cancelled image picker");
				} else if (response.errorMessage) {
					console.log("ImagePicker Error: ", response.errorMessage);
				} else if (response.assets && response.assets.length > 0) {
					const selectedImage = response.assets[0];
					setIsLoading(true);
					const url = await uploadToCloudinary(selectedImage.uri);
					setIsLoading(false);
					setPet((prev) => ({ ...prev, pet_Image: url }));
				}
			}
		);
	};
	const handleChange = (field: string, value: string) => {
		setPet({
			...pet,
			[field]: value,
		});

		// Clear error for this field if it exists
		if (errors[field]) {
			setErrors({
				...errors,
				[field]: null,
			});
		}
	};

	const handleSubmit = async () => {
		const formErrors = validateForm(pet);
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			if (petId) {
				// UPDATE existing pet
				await supabase
					.from("pets")
					.update({
						name: pet.name,
						species:
							pet.selectValue !== "Other" ? pet.selectValue : pet.species,
						breed: pet.breed,
						age: parseInt(pet.age, 10),
						pet_Image: pet.pet_Image,
					})
					.eq("id", petId);
			} else {
				// INSERT new pet
				await supabase.from("pets").insert({
					id: uuidv4(),
					name: pet.name,
					species: pet.selectValue !== "Other" ? pet.selectValue : pet.species,
					breed: pet.breed,
					age: parseInt(pet.age, 10),
					created_at: new Date().toISOString(),
					owner_id: data?.id,
					pet_Image:
						pet.pet_Image ||
						`https://via.placeholder.com/400x300?text=${pet.name}`,
				});
			}

			Alert.alert(
				"Success",
				`${pet.name} has been ${petId ? "updated" : "added"}.`,
				[{ text: "OK", onPress: () => navigation.goBack() }]
			);
		} catch (error) {
			Alert.alert("Error", "Failed to save pet. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	console.log(pet?.pet_Image);

	const fetchPetDetails = async () => {
		if (!petId) {
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);

			const { data: petData, error: fetchError } = await supabase
				.from("pets")
				.select("*")
				.eq("id", petId)
				.single();

			if (fetchError) {
				throw fetchError;
			}
			console.log(petData);

			setPet((prev) => ({
				...prev,
				name: petData.name || "",
				species: petData.species || "",
				breed: petData.breed || "",
				age: petData.age ? petData.age.toString() : "",
				pet_Image: petData.pet_Image || "",
				selectValue: [
					"Dog",
					"Cat",
					"Bird",
					"Rabbit",
					"Fish",
					"Reptile",
				].includes(petData.species)
					? petData.species
					: "Other",
			}));
		} catch (err) {
			console.error("Error fetching pet details:", err);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		fetchPetDetails();
	}, [JSON.stringify(petId)]);
	if (loading) {
		return (
			<View
				style={{
					height: 500,
					flex: 1,
					// backgroundColor: "red",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator />
			</View>
		);
	}
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Pet Information</Text>
					<View style={styles.imagePickerContainer}>
						<TouchableOpacity
							style={styles.imagePickerButton}
							onPress={openPicker}
						>
							{pet.pet_Image ? (
								<Image
									source={{
										uri: pet.pet_Image,
									}}
									style={{ width: "100%", height: "100%" }}
								/>
							) : (
								<>
									<View>
										<Ionicons name="cloud-upload" size={50} color={"#504B38"} />
									</View>
									<View>
										<Text>Click to Select Image</Text>
									</View>
								</>
							)}
						</TouchableOpacity>
						{errors.pet_Image && (
							<Text style={styles.errorText}>{errors.pet_Image}</Text>
						)}
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Pet Name</Text>
						<TextInput
							style={[styles.input, errors.name && styles.inputError]}
							placeholder="Enter pet name"
							value={pet.name}
							onChangeText={(text) => handleChange("name", text)}
						/>
						{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
					</View>

					<View style={styles.formGroup}>
						<View
							style={[
								// styles.pickerContainer,
								errors.species && styles.inputError,
							]}
						>
							<Selector
								options={[
									{
										label: "Dog",
										value: "Dog",
									},
									{
										label: "Cat",
										value: "Cat",
									},
									{
										label: "Bird",
										value: "Bird",
									},
									{
										label: "Rabbit",
										value: "Rabbit",
									},
									{
										label: "Fish",
										value: "Fish",
									},
									{
										label: "Reptile",
										value: "Reptile",
									},
									{
										label: "Other",
										value: "Other",
									},
								]}
								value={pet.selectValue}
								onChange={(e) => handleChange("selectValue", e?.value || "")}
								label="Species"
							/>
						</View>
						{errors.selectValue && (
							<Text style={styles.errorText}>{errors.selectValue}</Text>
						)}
					</View>

					{pet.selectValue === "Other" && (
						<View style={styles.formGroup}>
							<Text style={styles.label}>species</Text>
							<TextInput
								style={[styles.input, errors.name && styles.inputError]}
								placeholder="Enter species"
								value={pet.species}
								onChangeText={(text) => handleChange("species", text)}
							/>
							{errors.species && (
								<Text style={styles.errorText}>{errors.species}</Text>
							)}
						</View>
					)}
					<View style={styles.formGroup}>
						<Text style={styles.label}>Breed</Text>
						<TextInput
							style={[styles.input, errors.breed && styles.inputError]}
							placeholder="Enter breed"
							value={pet.breed}
							onChangeText={(text) => handleChange("breed", text)}
						/>
						{errors.breed && (
							<Text style={styles.errorText}>{errors.breed}</Text>
						)}
					</View>

					<View style={styles.formGroup}>
						<Text style={styles.label}>Age (years)</Text>
						<TextInput
							style={[styles.input, errors.age && styles.inputError]}
							placeholder="Enter age"
							value={pet.age}
							onChangeText={(text) => handleChange("age", text)}
							keyboardType="numeric"
						/>
						{errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator color="#fff" />
						) : (
							<View style={styles.buttonContent}>
								<Ionicons name="add-circle-outline" size={18} color="#fff" />
								<Text style={styles.buttonText}>Add Pet</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		// alignItems: "center",
	},
	scrollContainer: {
		padding: 16,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
	},
	formGroup: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: "500",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	inputError: {
		borderColor: "#e53e3e",
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		backgroundColor: "#fff",
	},
	picker: {
		height: 50,
		width: "100%",
	},
	errorText: {
		color: "#e53e3e",
		fontSize: 14,
		marginTop: 4,
	},
	helperText: {
		color: "#666",
		fontSize: 14,
		marginTop: 4,
	},
	button: {
		backgroundColor: "#504B38",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 16,
	},
	buttonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 8,
	},
	imagePickerContainer: {
		height: 120,
		marginBottom: 16,
	},
	imagePickerButton: {
		alignItems: "center",
		justifyContent: "center",
		// backgroundColor: '#fff',
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: "#504B38",
		height: "100%",
		borderRadius: 8,
		gap: 10,
	},
});

export default AddPetForm;
