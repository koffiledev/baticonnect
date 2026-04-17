import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

interface ArtisanSignupScreenProps {
  onSignup: (profile: { firstName: string; phone: string }) => void;
}

const { width } = Dimensions.get("window");

export function ArtisanSignupScreen({ onSignup }: ArtisanSignupScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (firstName.trim() && phone.trim()) {
      onSignup({ firstName: firstName.trim(), phone: phone.trim() });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Inscription Artisan</Text>
          <Text style={styles.subtitle}>
            Créez votre compte pour commencer à proposer vos services.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jean"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 06 12 34 56 78"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.alertBox}>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 8}}>
              <Feather name="info" size={18} color="#1E3A8A" style={{marginRight: 8}} />
              <Text style={styles.alertTitle}>Information importante</Text>
            </View>
            <Text style={styles.alertText}>
              Pour faciliter votre première connexion, chaque nouveau compte aura un mot de passe par défaut qui sera votre numéro de téléphone.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.button, (!firstName || !phone) && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={!firstName || !phone}
          >
            <Text style={styles.buttonText}>Valider mon inscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "Raleway_900Black",
    fontSize: 28,
    color: "#1E3A8A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Raleway_400Regular",
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Raleway_700Bold",
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    fontFamily: "Raleway_600SemiBold",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
  },
  alertBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertTitle: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 14,
    color: "#1E3A8A",
  },
  alertText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
});
