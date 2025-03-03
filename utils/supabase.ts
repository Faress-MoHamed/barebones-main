import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jujxismihmwdujywazbb.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1anhpc21paG13ZHVqeXdhemJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MjIwOTQsImV4cCI6MjA1NjQ5ODA5NH0.65-drbJnzcR7xRWS-f3ajUkZavI7Y2hWI18ed1q3pVY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
