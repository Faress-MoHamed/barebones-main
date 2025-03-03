"use client";

import { useState } from "react";
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
	ScrollView,
	TextInput,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useDispatch, useSelector } from "react-redux";
import { useCustomSelector } from "@/redux/store";

interface SignUpProps {
	navigation: any;
}

export default function SignUp({ navigation }: SignUpProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	async function signUpWithEmail() {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
		});

		setLoading(false);

		if (error) {
			Alert.alert("Error", error.message);
		} else if (!data.session) {
			Alert.alert("Success", "Please check your email for verification!");
			navigation.navigate("SignIn");
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.logoContainer}>
					<Image source={{ uri: "@/assets/favicon.png" }} style={styles.logo} />
					<Text style={styles.title}>Create Account</Text>
					<Text style={styles.subtitle}>Sign up to get started</Text>
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

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Confirm Password</Text>
						<TextInput
							style={styles.input}
							onChangeText={setConfirmPassword}
							value={confirmPassword}
							secureTextEntry={true}
							placeholder="Confirm Password"
							autoCapitalize="none"
							textContentType="password"
							autoComplete="password"
						/>
					</View>

					<TouchableOpacity
						style={[styles.button, loading && styles.buttonDisabled]}
						onPress={signUpWithEmail}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="white" />
						) : (
							<Text style={styles.buttonText}>Sign Up</Text>
						)}
					</TouchableOpacity>

					<View style={styles.footer}>
						<Text style={styles.footerText}>Already have an account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
							<Text style={styles.footerLink}>Sign In</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	scrollContainer: {
		flexGrow: 1,
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
		backgroundColor: "#4C51BF",
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
