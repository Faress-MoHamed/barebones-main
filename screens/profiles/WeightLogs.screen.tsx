import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
// import { ChevronDown, ChevronUp } from "react-native-feather";
import { supabase } from "@/utils/supabase";

// Define the type for weight log data
type WeightLog = {
	id: string;
	pet_id: string;
	weight: number;
	date: string;
};

type WeightLogsTabProps = {
	petId?: string; // Optional: to filter logs for a specific pet
};

const WeightLogsTab = ({ petId }: WeightLogsTabProps) => {
	const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first
	console.log(weightLogs);
	const fetchWeightLogs = async () => {
		try {
			setLoading(true);

			let query = supabase
				.from("weight_logs")
				.select(`*,pets(*,auth(*))`)
				.order("date", { ascending: sortOrder === "asc" });

			// If petId is provided, filter by pet_id
			if (petId) {
				query = query.eq("pet_id", petId);
			}

			const { data, error } = await query;

			if (error) {
				console.error("Error fetching weight logs:", error);
				return;
			}

			setWeightLogs(data || []);
		} catch (error) {
			console.error("Unexpected error:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchWeightLogs();
	}, [petId, sortOrder]);

	const onRefresh = () => {
		setRefreshing(true);
		fetchWeightLogs();
	};

	const toggleSortOrder = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const renderWeightLog = ({ item }: { item: WeightLog }) => {
		return (
			<View style={styles.logItem}>
				<View style={styles.weightContainer}>
					<Text style={styles.weightValue}>{item.weight}</Text>
					<Text style={styles.weightUnit}>kg</Text>
				</View>
				<Text style={styles.dateText}>
					{/* {format(new Date(item.date), "MMM d, yyyy")} */}
				</Text>
			</View>
		);
	};

	if (loading && !refreshing) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator color="#0066cc" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Weight Logs</Text>
				<TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
					<Text style={styles.sortButtonText}>
						{sortOrder === "asc" ? "Oldest first" : "Newest first"}
					</Text>
					{sortOrder === "asc" ? "top" : "bottom"}
				</TouchableOpacity>
			</View>

			{weightLogs.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text>No weight logs found</Text>
				</View>
			) : (
				<FlatList
					data={weightLogs}
					renderItem={renderWeightLog}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContainer}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={["#0066cc"]}
						/>
					}
				/>
			)}
		</View>
	);
};
export default WeightLogsTab;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333333",
	},
	sortButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	sortButtonText: {
		fontSize: 14,
		color: "#0066cc",
		marginRight: 4,
	},
	listContainer: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	logItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		marginVertical: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	weightContainer: {
		flexDirection: "row",
		alignItems: "baseline",
	},
	weightValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333333",
	},
	weightUnit: {
		fontSize: 14,
		color: "#666666",
		marginLeft: 4,
	},
	dateText: {
		fontSize: 14,
		color: "#666666",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
});
