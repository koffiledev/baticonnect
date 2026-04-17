import React, { useState } from "react";
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, 
  KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

interface ProfileSettingsScreenProps {
  userProfile: any;
  onSave: (updates: any) => void;
  onCancel: () => void;
}

const ARTISAN_PROFESSIONS = [
  "Plombier",
  "Électricien",
  "Menuisier",
  "Peintre",
  "Maçon",
  "Chauffagiste",
  "Charpentier",
  "Serrurier",
  "Jardinier / Paysagiste",
  "Nettoyage / Entretien",
  "Bricolage général"
].sort();

export function ProfileSettingsScreen({ userProfile, onSave, onCancel }: ProfileSettingsScreenProps) {
  const [profession, setProfession] = useState(userProfile?.profession || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  
  // States Modal Métier
  const [showProfessions, setShowProfessions] = useState(false);
  
  // States Location
  const [isLocating, setIsLocating] = useState(false);

  // Par défaut, le mot de passe est soit celui sauvé, soit le numéro de téléphone pour les nouveaux artisans
  const [password, setPassword] = useState(userProfile?.password || userProfile?.phone || "");
  const [showPassword, setShowPassword] = useState(false);

  // Fonction pour récupérer la géolocalisation
  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission refusée", 
          "BatiConnect a besoin de votre permission pour obtenir votre position actuelle."
        );
        setIsLocating(false);
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      let reverseResult = await Location.reverseGeocodeAsync({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude
      });

      if (reverseResult.length > 0) {
        const place = reverseResult[0];
        // Exemple de format: "Paris, 75001"
        const formattedAddress = `${place.city || place.subregion || place.region}, ${place.postalCode || ""}`.replace(/,\s*$/, "");
        setLocation(formattedAddress);
      } else {
        Alert.alert("Erreur", "Impossible de déterminer la ville à partir de vos coordonnées.");
      }
    } catch (error) {
      Alert.alert("Erreur GPS", "Impossible d'accéder à votre position actuelle.");
      console.error(error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = () => {
    onSave({
      profession: profession.trim(),
      location: location.trim(),
      phone: phone.trim(),
      password: password.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          <Text style={styles.title}>Personnalisation</Text>
          <View style={{width: 40}} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subtitle}>
            Mettez à jour vos informations pour rassurer vos futurs clients.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Votre métier</Text>
            <TouchableOpacity 
              style={styles.dropdownButton} 
              activeOpacity={0.7}
              onPress={() => setShowProfessions(true)}
            >
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Feather name="briefcase" size={20} color={profession ? "#1E3A8A" : "#94A3B8"} style={styles.inputIcon} />
                <Text style={profession ? styles.dropdownSelectedText : styles.dropdownPlaceholderText}>
                  {profession ? profession : "Sélectionner un métier..."}
                </Text>
              </View>
              <Feather name="chevron-down" size={20} color="#64748B" style={{marginRight: 16}} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Localisation</Text>
            <View style={[styles.inputWrapper, { paddingRight: 8 }]}>
              <Feather name="map-pin" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1, paddingLeft: 0, paddingRight: 10 }]}
                placeholder="Ex. Paris, Lyon, 75011..."
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity 
                style={styles.gpsButton}
                onPress={handleGetLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Feather name="navigation" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Numéro de contact</Text>
            <View style={styles.inputWrapper}>
              <Feather name="phone" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Votre numéro de mobile"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <View style={[styles.inputWrapper, { paddingRight: 8 }]}>
              <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1, paddingLeft: 0, paddingRight: 10 }]}
                placeholder="Saisir un mot de passe sécurisé"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveButton, (!phone || !password || !profession) && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!phone || !password || !profession}
          >
            <Text style={styles.saveButtonText}>Enregistrer le profil</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      <Modal
        visible={showProfessions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfessions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionnez un métier</Text>
              <TouchableOpacity onPress={() => setShowProfessions(false)} style={styles.closeModalButton}>
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={ARTISAN_PROFESSIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.professionItem, 
                    profession === item && styles.professionItemSelected
                  ]}
                  onPress={() => {
                    setProfession(item);
                    setShowProfessions(false);
                  }}
                >
                  <Text style={[
                    styles.professionItemText,
                    profession === item && styles.professionItemTextSelected
                  ]}>
                    {item}
                  </Text>
                  {profession === item && (
                    <Feather name="check" size={20} color="#1E3A8A" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  title: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 20,
    color: "#1E3A8A",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontFamily: "Raleway_400Regular",
    fontSize: 15,
    color: "#64748B",
    marginBottom: 32,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "Raleway_700Bold",
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Raleway_600SemiBold",
    paddingVertical: 16,
    fontSize: 16,
    color: "#1E293B",
  },
  eyeIcon: {
    padding: 10,
  },
  gpsButton: {
    backgroundColor: "#F59E0B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 18,
  },
  dropdownPlaceholderText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#94A3B8",
  },
  dropdownSelectedText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#1E3A8A",
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  saveButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  saveButtonText: {
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 18,
    color: "#1E3A8A",
  },
  closeModalButton: {
    padding: 4,
  },
  professionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  professionItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  professionItemText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#475569",
  },
  professionItemTextSelected: {
    color: "#1E3A8A",
    fontFamily: "Raleway_800ExtraBold",
  },
});
