import {
	createNavigationContainerRef,
	NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SingleProfileScreen } from "./screens/profiles/SingleProfile.screen";
import SignIn from "./screens/Auth/SignIn.screen";
import SignUp from "./screens/Auth/SignUp.screen";
import { Provider } from "react-redux";
import { store, useCustomSelector } from "./redux/store";
import React, { useEffect } from "react";
import screens from "./screens";
import "@/sheets";

import {
	FlatList,
	Text,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
import CustomTabBar from "./components/TabBar";
import GetAllPets from "./screens/pets/GetAllPets.screen";
import {
	registerSheet,
	SheetManager,
	SheetProvider,
} from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PetDetailsScreen from "./screens/pets/GetOnePet.screen";
import VetVisitLogsScreen from "./screens/vet_visit_logs/GetAllLogs.screen";

// ✅ Move this above usage
export type RootStackParamList = {
	[K in keyof typeof screens]: Record<string, any> | undefined;
} & {
	Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export const navigation = createNavigationContainerRef<RootStackParamList>();

export default function App() {
	return (
		<SheetProvider context="global">
			<Provider store={store}>
				<AppNavigator />
			</Provider>
		</SheetProvider>
	);
}

function AppNavigator() {
	const userState = useCustomSelector((state) => state.user);
	const isLoggedIn = userState?.isLoggedIn ?? false;
	const data = userState?.data ?? null;

	return (
		// <SafeAreaProvider>
		<NavigationContainer>
			{/* <View style={{ paddingVertical: 40 }}> */}
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{!isLoggedIn ? (
					<>
						<Stack.Screen
							name="SignUp"
							component={SignUp}
							options={{ title: "Auth" }}
						/>
						<Stack.Screen
							name="SignIn"
							component={SignIn}
							options={{ title: "Auth" }}
						/>
					</>
				) : (
					<>
						<Stack.Screen name="Tabs" component={React.memo(BottomTabs)} />
						<Stack.Screen
							name="SingleProfileScreen"
							component={SingleProfileScreen}
							options={{ title: "Pet Profile" }}
							initialParams={{ id: "1" }}
						/>
						<Stack.Screen
							name="PetDetailsScreen"
							component={PetDetailsScreen}
						/>
					</>
				)}
			</Stack.Navigator>
			{/* </View> */}
		</NavigationContainer>
	);
}

// 🎯 Bottom Tab Navigator
function BottomTabs() {
	return (
		<Tab.Navigator
			tabBar={(props) => <CustomTabBar {...props} />}
			screenOptions={{ headerShown: false }}
			// screenLayout={({ children }) => (
			// 	<View style={{ paddingVertical: 40 }}>{children}</View>
			// )}
		>
			<Tab.Screen name="AllPets" component={GetAllPets} />
			<Tab.Screen name="WeightLogs" component={screens.WeightLogsTab} />
			<Tab.Screen name="AddPetForm" component={screens.AddPetForm} />
			<Tab.Screen name="BodyCondition" component={BodyConditionScreen} />
			<Tab.Screen name="VetVisitLogsScreen" component={VetVisitLogsScreen} />
		</Tab.Navigator>
	);
}

// 📌 Sample Data
const weightLogs = [{ id: "1", weight: "5.4 kg", date: "2025-02-25" }];
const bodyConditions = [{ id: "1", condition: "Normal", date: "2025-02-25" }];
const vetVisits = [
	{ id: "1", notes: "Routine checkup, all good.", date: "2025-02-10" },
];
const Dummy = () => (
	<>
		<Text>fares</Text>
	</>
);

// 📌 Screens
const WeightLogsScreen = () => (
	<View style={styles.container}>
		<Text style={styles.title}>Weight Logs</Text>
		<FlatList
			data={weightLogs}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={styles.logItem}>
					<Text>{item.weight}</Text>
					<Text>{item.date}</Text>
				</View>
			)}
		/>
	</View>
);

const BodyConditionScreen = () => (
	<View style={styles.container}>
		<Text style={styles.title}>Body Condition</Text>
		<FlatList
			data={bodyConditions}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={styles.logItem}>
					<Text>{item.condition}</Text>
					<Text>{item.date}</Text>
				</View>
			)}
		/>
	</View>
);

const VetVisitsScreen = () => (
	<View style={styles.container}>
		<Text style={styles.title}>Vet Visits</Text>
		<FlatList
			data={vetVisits}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={styles.logItem}>
					<Text>{item.notes}</Text>
					<Text>{item.date}</Text>
				</View>
			)}
		/>
		<TouchableOpacity
			onPress={() => {
				SheetManager.show("petSheet");
			}}
			style={styles.addButton}
		>
			<Text style={styles.addButtonText}>Add New Vet Visit</Text>
		</TouchableOpacity>
	</View>
);
// import React from "react";

// export default PetCard;
// 📌 Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
	logItem: {
		padding: 10,
		marginBottom: 10,
		backgroundColor: "white",
		borderRadius: 5,
	},
	addButton: {
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},
	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	listContent: {
		paddingBottom: 20,
	},
});
