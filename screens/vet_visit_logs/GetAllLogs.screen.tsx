"use client";

import { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	RefreshControl,
	SafeAreaView,
	StatusBar,
} from "react-native";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { fetchAllVetVisitLogs, type VetVisitLog } from "./LogsServiece";
import { SheetManager } from "react-native-actions-sheet";
import type { RootStackParamList } from "@/App";

export default function VetVisitLogsScreen() {
	const [logs, setLogs] = useState<VetVisitLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	// Function to fetch vet visit logs from Supabase
	const fetchVetVisitLogs = useCallback(async () => {
		try {
			setError(null);
			const data = await fetchAllVetVisitLogs();
			setLogs(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
			console.error("Error fetching vet visit logs:", err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	// Initial data fetch
	useEffect(() => {
		fetchVetVisitLogs();
	}, [fetchVetVisitLogs]);

	// Handle pull-to-refresh
	const onRefresh = () => {
		setRefreshing(true);
		fetchVetVisitLogs();
	};

	// Format the timestamp for display
	// const formatDate = (dateString: string) => {
	// 	try {
	// 		return format(new Date(dateString), "MMM d, yyyy h:mm a");
	// 	} catch (err) {
	// 		return "Invalid date";
	// 	}
	// };

	// Navigate to detail screen
	// Render each vet visit log item
	const renderItem = ({ item }: { item: VetVisitLog }) => (
		<TouchableOpacity style={styles.card}>
			<View style={styles.cardHeader}>
				<Text style={styles.petId}>Pet Name: {item.pet?.name}</Text>
				<Text style={styles.date}>{item.date}</Text>
			</View>
			<Text style={styles.notes} numberOfLines={2}>
				{item.notes || "No notes available"}
			</Text>
		</TouchableOpacity>
	);

	// Show loading indicator
	if (loading && !refreshing) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color="#504B38" />
				<Text style={styles.loadingText}>Loading vet visit logs...</Text>
			</View>
		);
	}

	// Show error message if fetch failed
	if (error && !refreshing) {
		return (
			<View style={styles.centered}>
				<Text style={styles.errorText}>Error: {error}</Text>
				<TouchableOpacity
					style={styles.retryButton}
					onPress={fetchVetVisitLogs}
				>
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Vet Visit Logs</Text>
			</View>

			<FlatList
				data={logs}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>No vet visit logs found</Text>
					</View>
				}
			/>
			<TouchableOpacity
				onPress={() => {
					SheetManager.show("petSheet");
				}}
				style={styles.addButton}
			>
				<Text style={styles.addButtonText}>Add New Vet Visit</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	header: {
		padding: 16,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333333",
	},
	addButton: {
		backgroundColor: "#504B38",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		margin: 20,
	},
	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	listContainer: {
		padding: 16,
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	petId: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333333",
	},
	date: {
		fontSize: 14,
		color: "#666666",
	},
	notes: {
		fontSize: 15,
		color: "#444444",
		lineHeight: 20,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666666",
	},
	errorText: {
		fontSize: 16,
		color: "#ff3b30",
		textAlign: "center",
		marginBottom: 16,
	},
	retryButton: {
		backgroundColor: "#504B38",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 6,
	},
	retryButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
	},
	emptyContainer: {
		padding: 20,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		color: "#666666",
		textAlign: "center",
	},
});
