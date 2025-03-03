import { navigation } from "@/App";
import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
// import BackIcon from "";
interface HeaderNavBarProp {
	title?: string;
	canGoBack?: boolean;
}

export default function HeaderNavBar({ title, canGoBack }: HeaderNavBarProp) {
	return (
		<View>
			{title && (
				<View style={styles.header}>
					{canGoBack && (
						<TouchableOpacity
							style={{ position: "absolute", left: 20 }}
							onPress={() => navigation.goBack()}
						>
							<Image
								source={{
									uri: "@/assets/chevron-right.svg",
								}}
							/>
							{/* <BackIcon /> */}
						</TouchableOpacity>
					)}

					<Text style={styles.title}>{title}</Text>

					{/* {refresh && (
            <CustomTouchableOpacity
              style={{ position: 'absolute', right: 20 }}
              onPress={refresh}>
              <AntDesign name="reload1" size={24} color={colors.white} />
            </CustomTouchableOpacity>
          )} */}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		height: 60,
		backgroundColor: "#4C51BF",
		justifyContent: "center",
		alignItems: "center",
		borderBottomEndRadius: 15,
		borderBottomStartRadius: 15,
	},
	title: {
		color: "#fff",
		fontSize: 20,
		// fontFamily: "",
	},
});
