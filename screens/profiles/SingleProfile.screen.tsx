import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	Button,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pet, BodyConditionLog, WeightLog } from "../../types";
import { navigation } from "@/App";
// import { Button } from "@rneui/themed";

type RootStackParamList = {
	SingleProfile: { id: string };
	SignUp: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "SingleProfile">;

// Mock data for development
const mockPet: Pet = {
	id: "1",
	name: "Max",
	species: "Dog",
	breed: "Golden Retriever",
	age: 3,
	created_at: new Date().toISOString(),
	owner_id: "123",
	logs_weight: [
		{ id: "1", pet_id: "1", weight: 25.5, date: "2024-02-25T10:00:00Z" },
		{ id: "2", pet_id: "1", weight: 26.0, date: "2024-01-25T10:00:00Z" },
	],
	logs_bodycondition: [
		{ id: "1", pet_id: "1", body_condition: "3", date: "2024-02-25T10:00:00Z" },
		{ id: "2", pet_id: "1", body_condition: "4", date: "2024-01-25T10:00:00Z" },
	],
	logs_vet_visits: [],
};

function getThisMonthLogs(
	logs_bodycondition: BodyConditionLog[],
	logs_weight: WeightLog[]
) {
	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();

	const latestBodyConditionLog = logs_bodycondition
		.filter(
			(log) =>
				new Date(log.date).getMonth() === currentMonth &&
				new Date(log.date).getFullYear() === currentYear
		)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

	const latestWeightLog = logs_weight
		.filter(
			(log) =>
				new Date(log.date).getMonth() === currentMonth &&
				new Date(log.date).getFullYear() === currentYear
		)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

	return { latestBodyConditionLog, latestWeightLog };
}

const PetCard = ({ pet }: { pet: Pet }) => (
	<View style={styles.card}>
		<Text style={styles.name}>{pet.name}</Text>
		<Text>Species: {pet.species}</Text>
		<Text>Age: {pet.age} years</Text>
	</View>
);

const LogsTable = ({
	weightLogs,
	bodyConditionLogs,
}: {
	weightLogs: WeightLog[];
	bodyConditionLogs: BodyConditionLog[];
}) => (
	<View style={styles.table}>
		<Text style={styles.tableHeader}>Recent Logs</Text>
		{weightLogs.map((log, index) => (
			<View key={index} style={styles.tableRow}>
				<Text>Weight: {log.weight}kg</Text>
				<Text>Date: {new Date(log.date).toLocaleDateString()}</Text>
			</View>
		))}
	</View>
);

const HealthStatus = ({ pet }: { pet: Pet }) => (
	<View style={styles.healthStatus}>
		<Text style={styles.tableHeader}>Health Status</Text>
		<Text>
			Overall Health: {pet?.logs_weight.length > 3 ? "Good" : "Needs More Data"}
		</Text>
		<Text>Last Vet Visit: 2 months ago</Text>
	</View>
);

export const SingleProfileScreen: React.FC<any> = ({ route }) => {
	const { id } = route.params;
	const [pet, setPet] = useState<Pet | null>(null);
	const [loading, setLoading] = useState(true);
	const [thisMonthLogs, setThisMonthLogs] = useState<{
		latestBodyConditionLog: BodyConditionLog | null;
		latestWeightLog: WeightLog | null;
	}>({
		latestBodyConditionLog: null,
		latestWeightLog: null,
	});

	useEffect(() => {
		const fetchPet = async () => {
			try {
				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setPet(mockPet);
			} finally {
				setLoading(false);
			}
		};

		fetchPet();
	}, [id]);

	useEffect(() => {
		if (pet) {
			setThisMonthLogs(
				getThisMonthLogs(pet.logs_bodycondition, pet.logs_weight)
			);
		}
	}, [pet]);

	if (loading) {
		return <ActivityIndicator style={styles.loader} />;
	}

	if (!pet) {
		return (
			<View style={styles.container}>
				<Text>Pet not found</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<PetCard pet={pet} />
			<Button
				onPress={() => {
					navigation.navigate("SignUp");
				}}
				title="fares"
			></Button>
			<View style={styles.monthSummary}>
				<Text style={styles.tableHeader}>This Month's Summary</Text>
				<Text>
					Latest Weight: {thisMonthLogs.latestWeightLog?.weight || "No data"} kg
				</Text>
				<Text>
					Body Condition:
					{thisMonthLogs.latestBodyConditionLog?.body_condition || "No data"}
				</Text>
			</View>

			<HealthStatus pet={pet} />

			<LogsTable
				weightLogs={pet.logs_weight}
				bodyConditionLogs={pet.logs_bodycondition}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		padding: 16,
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		marginBottom: 16,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8,
	},
	table: {
		marginTop: 16,
	},
	tableHeader: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	monthSummary: {
		padding: 16,
		backgroundColor: "#e6f3ff",
		borderRadius: 8,
		marginBottom: 16,
	},
	healthStatus: {
		padding: 16,
		backgroundColor: "#f0fff0",
		borderRadius: 8,
		marginBottom: 16,
	},
});
