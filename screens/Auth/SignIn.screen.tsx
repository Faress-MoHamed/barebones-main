import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Image,
	ActivityIndicator,
	TextInput,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/user.slice";

interface SignInProps {
	navigation: any;
}

export default function SignIn({ navigation }: SignInProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	async function signInWithEmail() {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password");
			return;
		}

		setLoading(true);
		const { error, data } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		setLoading(false);
		console.log(data);
		if (error) {
			Alert.alert("Error", error.message);
		} else {
			dispatch(
				login({
					data: data?.user,
					token: data?.session?.access_token,
					refreshToken: data?.session?.refresh_token,
				})
			);
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.logoContainer}>
				<Image
					source={{ uri: "https://via.placeholder.com/150" }}
					style={styles.logo}
				/>
				<Text style={styles.title}>Welcome Back</Text>
				<Text style={styles.subtitle}>Sign in to your account</Text>
			</View>

			<View style={styles.formContainer}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						onChangeText={setEmail}
						value={email}
						placeholder="email@address.com"
						autoCapitalize="none"
						keyboardType="email-address"
						textContentType="emailAddress"
						autoComplete="email"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						onChangeText={setPassword}
						value={password}
						secureTextEntry={true}
						placeholder="Password"
						autoCapitalize="none"
						textContentType="password"
						autoComplete="password"
					/>
				</View>

				<TouchableOpacity
					style={[styles.button, loading && styles.buttonDisabled]}
					onPress={signInWithEmail}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text style={styles.buttonText}>Sign In</Text>
					)}
				</TouchableOpacity>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Don't have an account? </Text>
					<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
						<Text style={styles.footerLink}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 60,
		marginBottom: 20,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 20,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginTop: 5,
	},
	formContainer: {
		padding: 20,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		fontWeight: "500",
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	button: {
		backgroundColor: "#4C51BF",
		height: 50,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 15,
	},
	buttonDisabled: {
		backgroundColor: "#a0a0a0",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 20,
	},
	footerText: {
		color: "#666",
	},
	footerLink: {
		color: "#4C51BF",
		fontWeight: "bold",
	},
});
