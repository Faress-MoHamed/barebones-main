import { supabase } from "@/utils/supabase";

// Define the type for a vet visit log based on the database schema
export type VetVisitLog = {
	id: string;
	pet: {
		id: string;
		name: string;
		species: string;
		breed: string;
		age: number;
		created_at: string;
		owner_id: string;
		owner_email: string;
		pet_Image: string;
		description?: string;
		weight?: number;
		medical_history?: string;
	};
	notes: string;
	date: string;
};

/**
 * Fetch all vet visit logs
 */
export const fetchAllVetVisitLogs = async (): Promise<VetVisitLog[]> => {
	try {
		const { data, error } = await supabase
			.from("vet_visit_logs")
			.select("*, pet: pets(*)") // Fetch related pet details
			.order("date", { ascending: false });

		if (error) {
			throw error;
		}
		console.log(data);
		return data || [];
	} catch (error) {
		console.error("Error fetching vet visit logs:", error);
		throw error;
	}
};

/**
 * Fetch vet visit logs for a specific pet
 */
export const fetchVetVisitLogsByPetId = async (
	petId: string
): Promise<VetVisitLog[]> => {
	try {
		const { data, error } = await supabase
			.from("vet_visit_logs")
			.select("*")
			.eq("pet_id", petId)
			.order("date", { ascending: false });

		if (error) {
			throw error;
		}

		return data || [];
	} catch (error) {
		console.error(`Error fetching vet visit logs for pet ${petId}:`, error);
		throw error;
	}
};

/**
 * Fetch a single vet visit log by ID
 */
export const fetchVetVisitLogById = async (
	id: string
): Promise<VetVisitLog | null> => {
	try {
		const { data, error } = await supabase
			.from("vet_visit_logs")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		console.error(`Error fetching vet visit log ${id}:`, error);
		throw error;
	}
};

/**
 * Add a new vet visit log
 */
export const addVetVisitLog = async (
	logData: Omit<VetVisitLog, "id">
): Promise<VetVisitLog> => {
	try {
		const { data, error } = await supabase
			.from("vet_visit_logs")
			.insert([logData])
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		console.error("Error adding vet visit log:", error);
		throw error;
	}
};

/**
 * Update an existing vet visit log
 */
export const updateVetVisitLog = async (
	id: string,
	logData: Partial<Omit<VetVisitLog, "id">>
): Promise<VetVisitLog> => {
	try {
		const { data, error } = await supabase
			.from("vet_visit_logs")
			.update(logData)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		console.error(`Error updating vet visit log ${id}:`, error);
		throw error;
	}
};

/**
 * Delete a vet visit log
 */
export const deleteVetVisitLog = async (id: string): Promise<void> => {
	try {
		const { error } = await supabase
			.from("vet_visit_logs")
			.delete()
			.eq("id", id);

		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(`Error deleting vet visit log ${id}:`, error);
		throw error;
	}
};
