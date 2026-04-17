import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

interface RoleSelectionScreenProps {
  onSelectRole: (role: "artisan" | "particulier") => void;
}

const { width } = Dimensions.get("window");

export function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue !</Text>
        <Text style={styles.subtitle}>
          Pour vous offrir la meilleure expérience, veuillez nous indiquer votre profil.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => onSelectRole("artisan")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconWrapperArtisan}>
              <Feather name="tool" size={32} color="#1E3A8A" />
            </View>
            <Text style={styles.cardTitle}>Je suis réparateur / artisan</Text>
            <Text style={styles.cardDescription}>
              Je propose mes services pour réaliser des travaux ou des dépannages.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => onSelectRole("particulier")}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconWrapperParticulier}>
              <Feather name="home" size={32} color="#F59E0B" />
            </View>
            <Text style={styles.cardTitle}>J'ai un problème</Text>
            <Text style={styles.cardDescription}>
              Je cherche un professionnel pour m'aider à réaliser ou réparer quelque chose.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontFamily: "Raleway_900Black",
    fontSize: 32,
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
    paddingHorizontal: 16,
  },
  cardsContainer: {
    gap: 20,
    alignItems: "center",
  },
  card: {
    width: width - 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    padding: 24,
  },
  iconWrapperArtisan: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapperParticulier: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 20,
    color: "#1E293B",
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: "Raleway_400Regular",
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});
