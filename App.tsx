import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { RoleSelectionScreen } from "./src/screens/RoleSelectionScreen";
import { ArtisanSignupScreen } from "./src/screens/ArtisanSignupScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProfileSettingsScreen } from "./src/screens/ProfileSettingsScreen";
import { 
  useFonts, 
  Raleway_400Regular, 
  Raleway_600SemiBold, 
  Raleway_700Bold, 
  Raleway_800ExtraBold,
  Raleway_900Black 
} from "@expo-google-fonts/raleway";

const STORAGE_KEY_ONBOARDING = "@baticonnect_onboarding_completed";
const STORAGE_KEY_ROLE = "@baticonnect_user_role";
const STORAGE_KEY_PROFILE = "@baticonnect_user_profile";

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
    Raleway_900Black,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const roleStatus = await AsyncStorage.getItem(STORAGE_KEY_ROLE);
        const profileStatus = await AsyncStorage.getItem(STORAGE_KEY_PROFILE);
        
        if (!cancelled) {
          if (roleStatus) {
            setUserRole(roleStatus);
          }
          if (profileStatus) {
            setUserProfile(JSON.parse(profileStatus));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const finishOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY_ONBOARDING, "1");
    setShowOnboarding(false);
  }, []);

  const handleSelectRole = useCallback(async (role: "artisan" | "particulier") => {
    await AsyncStorage.setItem(STORAGE_KEY_ROLE, role);
    setUserRole(role);

    if (role === "particulier") {
      // Create default profile for Particulier directly
      const newProfile = { id: `PART-${Math.floor(Math.random() * 10000)}`, role: "particulier" };
      await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
      setUserProfile(newProfile);
    }
  }, []);

  const handleArtisanSignup = useCallback(async (profile: { firstName: string; phone: string }) => {
    const newProfile = { ...profile, role: "artisan" };
    await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    setUserProfile(newProfile);
  }, []);

  const handleLogout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY_ROLE);
    await AsyncStorage.removeItem(STORAGE_KEY_PROFILE);
    setUserRole(null);
    setUserProfile(null);
    setShowOnboarding(true); // Redirige directement vers l'onboarding à la déconnexion
  }, []);

  const handleUpdateProfile = useCallback(async (updates: any) => {
    const newProfile = { ...userProfile, ...updates };
    await AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    setUserProfile(newProfile);
    setShowSettings(false);
  }, [userProfile]);

  if (!hydrated || !fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <OnboardingScreen onComplete={finishOnboarding} onSkip={finishOnboarding} />
        <StatusBar style="dark" />
      </>
    );
  }

  if (!userRole) {
    return (
      <>
        <RoleSelectionScreen onSelectRole={handleSelectRole} />
        <StatusBar style="dark" />
      </>
    );
  }

  if (userRole === "artisan" && !userProfile) {
    return (
      <>
        <ArtisanSignupScreen onSignup={handleArtisanSignup} />
        <StatusBar style="dark" />
      </>
    );
  }

  if (showSettings) {
    return (
      <ProfileSettingsScreen 
        userProfile={userProfile}
        onSave={handleUpdateProfile}
        onCancel={() => setShowSettings(false)}
      />
    );
  }

  return (
    <HomeScreen 
      userRole={userRole} 
      userProfile={userProfile} 
      onLogout={handleLogout} 
      onNavigateToSettings={() => setShowSettings(true)}
    />
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
});
