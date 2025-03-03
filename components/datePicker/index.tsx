import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface DatePickerComponentProps {
	lebel?: string;
	onChangeDate?: (date: Date) => void;
	value?: Date;
}

const DatePickerComponent = ({
	lebel,
	onChangeDate,
	value,
}: DatePickerComponentProps) => {
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState(value instanceof Date ? value : new Date());

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{lebel}</Text>

			<TouchableOpacity
				style={styles.inputContainer}
				onPress={() => setOpen(true)}
			>
				<Text style={styles.inputText}>{date.toDateString()}</Text>
				<Icon name="calendar" size={20} color="#666" style={styles.icon} />
			</TouchableOpacity>

			{open && Platform.OS === "android" && (
				<DateTimePicker
					value={date}
					mode="date"
					display="spinner"
					is24Hour={true}
					themeVariant="light"
					textColor="black"
					onChange={(event, selectedDate) => {
						setOpen(false);
						console.log("Event:", event);
						console.log("Raw selectedDate:", selectedDate);

						// If selectedDate is empty, try to use the timestamp from the native event.
						if (!selectedDate || Object.keys(selectedDate).length === 0) {
							if (event.nativeEvent && event.nativeEvent.timestamp) {
								const newDate = new Date(event.nativeEvent.timestamp);
								console.log("Constructed newDate from timestamp:", newDate);
								setDate(newDate);
								onChangeDate?.(newDate);
							} else {
								console.warn("No valid date information found.");
							}
						} else {
							setDate(selectedDate);
							onChangeDate?.(selectedDate);
						}
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { paddingVertical: 16 },
	label: { fontSize: 16, marginBottom: 8, color: "#000" },
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#fff",
	},
	icon: { marginLeft: 8 },
	inputText: { flex: 1, color: "#666" },
});

export default DatePickerComponent;
