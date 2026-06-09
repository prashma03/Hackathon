// Import AsyncStorage to save data on the device
import AsyncStorage from "@react-native-async-storage/async-storage";

// Name of the storage location
const PROFILE_KEY = "@materna_profile";

// Profile information that will be saved
export interface ProfileData {
  age: string;
  weightLbs: string;
  heightFt: string;
  heightIn: string;
  pregnancyWeek: string;
  previousPregnancies: string;
  medications: string;
  emergencyContact: string;
  preferredHospital: string;

  hasMiscarriage: boolean;
  hasHighBP: boolean;
  hasDiabetes: boolean;
  hasAnemia: boolean;
  hasCSection: boolean;
}

// Save the user's profile
export const saveProfile = async (profile: ProfileData) => {
  try {
    // Turn the profile into text and save it
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.log("Error saving profile:", error);
  }
};

// Load the saved profile
export const loadProfile = async (): Promise<ProfileData | null> => {
  try {
    // Get the saved data
    const data = await AsyncStorage.getItem(PROFILE_KEY);

    // If data exists, turn it back into an object
    if (data) {
      return JSON.parse(data);
    }

    // No profile found
    return null;
  } catch (error) {
    console.log("Error loading profile:", error);
    return null;
  }
};

// Delete the saved profile
export const clearProfile = async () => {
  try {
    // Remove the saved data
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.log("Error clearing profile:", error);
  }
};