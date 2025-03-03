import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Platform,
	ScrollView,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
// import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "@/utils/supabase";
import DatePickerComponent from "@/components/datePicker";
// import { supabase } from "../lib/supabase"; // Adjust path as needed

// Pet type definition
interface Pet {
	id: string;
	name: string;
	// Add other pet properties as needed
}

// Record type definition based on your Supabase schema
interface PetRecord {
	id?: string;
	pet_id: string;
	notes: string;
	date: string;
}

interface PetRecordSheetProps {
	onClose: () => void;
	onSuccess: () => void;
}

const PetRecordSheet = ({ onClose, onSuccess }: PetRecordSheetProps) => {
	const actionSheetRef = useRef<ActionSheetRef>(null);
	const [pets, setPets] = useState<Pet[]>([]);
	const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
	const [showPetSelector, setShowPetSelector] = useState(false);
	const [notes, setNotes] = useState("");
	const [date, setDate] = useState<any>();
	// const [showDatePicker, setShowDatePicker] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchPets();
	}, []);
	console.log("this is Daaaaaaate", date);

	const fetchPets = async () => {
		try {
			const { data, error } = await supabase
				.from("pets") // Assuming you have a 'pets' table
				.select("id, name")
				.order("name");
			console.log(error);
			if (error) throw error;

			if (data) {
				setPets(data);
				if (data.length > 0) {
					setSelectedPet(data[0]);
				}
			}
		} catch (error) {
			console.error("Error fetching pets:", error);
		}
	};

	// const handleDateChange = (selectedDate) => {
	// 	if (selectedDate) {
	// 		setDate(selectedDate);
	// 	}
	// };

	const handleSubmit = async () => {
		if (!selectedPet) {
			alert("Please select a pet");
			return;
		}

		if (!notes.trim()) {
			alert("Please enter notes");
			return;
		}

		setLoading(true);

		try {
			const newRecord: PetRecord = {
				pet_id: selectedPet.id,
				notes: notes.trim(),
				date: "",
			};

			const { error } = await supabase
				.from("pet_records") // Adjust table name as needed
				.insert(newRecord);
			console.log(error, newRecord);
			if (error) throw error;

			setLoading(false);
			onSuccess();
			actionSheetRef.current?.hide();
		} catch (error) {
			setLoading(false);
			console.error("Error adding record:", error);
			alert("Failed to add record. Please try again.");
		}
	};

	return (
		<ActionSheet ref={actionSheetRef} gestureEnabled={true} onClose={onClose}>
			<View style={styles.container}>
				<Text style={styles.title}>Add Pet Record</Text>

				{/* Main Form */}
				{!showPetSelector ? (
					<ScrollView style={styles.formContainer}>
						{/* Pet Selector Button */}
						<View style={styles.fieldContainer}>
							<Text style={styles.label}>Pet</Text>
							<TouchableOpacity
								style={styles.petSelector}
								onPress={() => setShowPetSelector(true)}
							>
								<Text style={styles.petSelectorText}>
									{selectedPet ? selectedPet.name : "Select a pet"}
								</Text>
							</TouchableOpacity>
						</View>
						{/* Notes Field */}
						<View style={styles.fieldContainer}>
							<Text style={styles.label}>Notes</Text>
							<TextInput
								style={styles.textInput}
								multiline
								numberOfLines={4}
								value={notes}
								onChangeText={setNotes}
								placeholder="Enter notes about the pet"
							/>
						</View>
						<DatePickerComponent
							value={date as any}
							onChangeDate={(selectedDate) => {
								console.log("selectedDate", selectedDate);
								if (selectedDate) {
									setDate(selectedDate?.toLocaleDateString());
								}
							}}
							lebel="date"
						/>

						{/* Date Picker */}
						{/* <View style={styles.fieldContainer}>
							<Text style={styles.label}>Date</Text>
							<TouchableOpacity
								style={styles.dateSelector}
								onPress={() => setShowDatePicker(true)}
							>
								<Text style={styles.dateSelectorText}>{date}</Text>
							</TouchableOpacity> */}
						{/* </View> */}

						{/* Submit Button */}
						<TouchableOpacity
							style={styles.submitButton}
							onPress={handleSubmit}
							disabled={loading}
						>
							<Text style={styles.submitButtonText}>
								{loading ? "Saving..." : "Save Record"}
							</Text>
						</TouchableOpacity>
					</ScrollView>
				) : (
					/* Pet Selector View */
					<View style={styles.selectorContainer}>
						<Text style={styles.selectorTitle}>Select a Pet</Text>
						<ScrollView style={styles.petList}>
							{pets.map((pet) => (
								<TouchableOpacity
									key={pet.id}
									style={[
										styles.petItem,
										selectedPet?.id === pet.id && styles.selectedPetItem,
									]}
									onPress={() => {
										setSelectedPet(pet);
										setShowPetSelector(false);
									}}
								>
									<Text
										style={[
											styles.petItemText,
											selectedPet?.id === pet.id && styles.selectedPetItemText,
										]}
									>
										{pet.name}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => setShowPetSelector(false)}
						>
							<Text style={styles.backButtonText}>Back</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</ActionSheet>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		// minHeight: 300,
		// overflow: "scroll",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	formContainer: {
		// maxHeight: 500,
	},
	fieldContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: "500",
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#f9f9f9",
		textAlignVertical: "top",
		// minHeight: 200,
	},
	petSelector: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#f9f9f9",
	},
	petSelectorText: {
		fontSize: 16,
	},
	dateSelector: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#f9f9f9",
	},
	dateSelectorText: {
		fontSize: 16,
	},
	submitButton: {
		backgroundColor: "#504B38",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 16,
	},
	submitButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	selectorContainer: {
		minHeight: 300,
	},
	selectorTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	petList: {
		// maxHeight: 300,
	},
	petItem: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	selectedPetItem: {
		backgroundColor: "#e6f7ff",
	},
	petItemText: {
		fontSize: 16,
	},
	selectedPetItemText: {
		fontWeight: "bold",
		color: "#504B38",
	},
	backButton: {
		marginTop: 16,
		padding: 12,
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
		alignItems: "center",
	},
	backButtonText: {
		fontSize: 16,
		color: "#333",
	},
});

export default PetRecordSheet;
