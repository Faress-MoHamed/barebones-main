import { useFonts } from "expo-font";

import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function CustomTabBar({
	state,
	descriptors,
	navigation,
	...props
}: any) {
	const [RobotoLoaded] = useFonts({
		boldRoboto: require("@/assets/fonts/Roboto/Roboto-Bold.ttf"),
		normalRoboto: require("@/assets/fonts/Roboto/Roboto-Regular.ttf"),
	});

	if (!RobotoLoaded) {
		return <ActivityIndicator />;
	}
	return (
		<View style={styles.tabBarContainer}>
			<TouchableOpacity
				// key={index}
				style={styles.tabItem}
				onPress={() => navigation.navigate("AllPets")}
			>
				<MaterialIcons
					name="pets"
					size={20}
					color={state?.index === 0 ? "#504B38" : "white"}
				/>
				<Text numberOfLines={1} style={styles.labelText}>
					All pets
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.tabItem}
				onPress={() => navigation.navigate("WeightLogs")}
			>
				<FontAwesome5
					name="weight"
					size={20}
					color={state?.index === 1 ? "#504B38" : "white"}
				/>
				<Text numberOfLines={1} style={styles.labelText}>
					Weight Logs
				</Text>
			</TouchableOpacity>
			{/* Home Button (Special Case) */}
			<View style={styles.homeButtonWrapper}>
				<TouchableOpacity
					style={[
						styles.homeButton,
						// state.index === 0 && styles.activeHomeButton,
					]}
					onPress={() => navigation.navigate("AddPetForm")}
				>
					<AntDesign name="plus" size={24} color={"white"} />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				// key={index}
				style={styles.tabItem}
				onPress={() => navigation.navigate("BodyCondition")}
			>
				<FontAwesome5
					name="dog"
					size={24}
					color={state?.index === 2 ? "#504B38" : "white"}
				/>
				<Text numberOfLines={1} style={styles.labelText}>
					Body condition
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				// key={index}
				style={styles.tabItem}
				onPress={() => navigation.navigate("VetVisitLogsScreen")}
			>
				<FontAwesome6
					name="user-doctor"
					size={24}
					color={state?.index === 3 ? "#504B38" : "white"}
				/>
				<Text numberOfLines={1} style={styles.labelText}>
					Vets Log
				</Text>
			</TouchableOpacity>
		</View>
	);
}
const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "#f5f5f5",
	},
	screenText: {
		fontSize: 18,
	},
	tabBarContainer: {
		// position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		// height: 80,
		backgroundColor: "#CBA35C",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
	},
	homeButtonWrapper: {
		// position: "absolute",
		// left: 20,
		bottom: 25,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 10,
		width: 60,
		backgroundColor: "white",
		borderRadius: "50%",
	},
	homeButton: {
		borderWidth: 5,
		borderColor: "white",
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#504B38",
		justifyContent: "center",
		alignItems: "center",
		fontSize: 28,
		fontWeight: 800,
		color: "white",
		// marginBottom: 5,
	},
	labelText: { fontFamily: "normalRoboto", paddingTop: 4 },
	homeText: {
		color: "white",
		fontSize: 12,
	},
	tabBar: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "white",
		borderRadius: 30,
		marginLeft: 70,
		height: 60,
		justifyContent: "space-around",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	tabItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// height: "100%",
		color: "#504B38",
		fontFamily: "normalRoboto",
		gap: 8,
	},
});
