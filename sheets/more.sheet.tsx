import { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, Text } from "react-native";
import type { ActionSheetRef } from "react-native-actions-sheet";
import ActionSheet from "react-native-actions-sheet";
import EvilIcons from "@expo/vector-icons/EvilIcons";
export interface ActionSheetPayloadProps {
	handleDelete?: any;
}

const MoreActionSheet: React.FC<{ payload: ActionSheetPayloadProps }> = ({
	payload: { handleDelete },
}) => {
	const actionSheetRef = useRef<ActionSheetRef>(null);

	return (
		<ActionSheet
			containerStyle={styles.actionSheetContainer}
			id="moreSheet"
			ref={actionSheetRef}
			isModal
			// overlayColor="red"
		>
			<TouchableOpacity
				onPress={handleDelete && handleDelete}
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					padding: 15,
				}}
			>
				<Text style={{ color: "#E74D3C" }}>Delete Item</Text>
				<EvilIcons name="trash" size={24} color="black" />
			</TouchableOpacity>
		</ActionSheet>
	);
};

export default MoreActionSheet;

const styles = StyleSheet.create({
	actionSheetContainer: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: "hidden",
		height: 70,
		// backgroundColor: "red",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f0f0f0",
		borderRadius: 10,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		height: 40,
		fontSize: 16,
	},
	item: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
});
