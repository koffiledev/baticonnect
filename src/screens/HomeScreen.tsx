import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

interface HomeScreenProps {
  userRole: string;
  userProfile: any;
  onLogout: () => void;
  onNavigateToSettings?: () => void;
}

// Données fictives pour la démo
const MOCK_REQUESTS = [
  { id: '1', title: 'Fuite d\'eau salle de bain', type: 'Plomberie', status: 'pending', date: "Aujourd'hui, 10:30", client: 'Alice M.' },
  { id: '2', title: 'Installation de prise électrique', type: 'Électricité', status: 'pending', date: 'Hier, 15:45', client: 'Jean P.' },
  { id: '3', title: 'Montage meuble TV', type: 'Bricolage', status: 'accepted', date: 'Il y a 2 jours', client: 'Sophie L.' },
];

export function HomeScreen({ userRole, userProfile, onLogout, onNavigateToSettings }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState("home"); // "home", "missions", "profile"

  // Séparation virtuelle des demandes pour l'artisan fictif
  const pendingRequests = MOCK_REQUESTS.filter(r => r.status === 'pending');
  const myMissions = MOCK_REQUESTS.filter(r => r.status === 'accepted');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.mainWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>BatiConnect</Text>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {userRole === "particulier" && (
              <View style={styles.card}>
                <View style={styles.iconContainer}>
                  <Feather name="smile" size={32} color="#1E3A8A" />
                </View>
                <Text style={styles.welcomeTitle}>Bienvenue !</Text>
                <Text style={styles.idText}>Un compte par défaut a été créé pour vous.</Text>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>Votre ID : {userProfile?.id}</Text>
                </View>
                
                <TouchableOpacity style={styles.editProfileButton} onPress={onNavigateToSettings}>
                  <Feather name="settings" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                  <Text style={styles.editProfileButtonText}>Personnaliser mon profil</Text>
                </TouchableOpacity>
                
                <View style={styles.noteBox}>
                  <Feather name="info" size={16} color="#B45309" style={{marginBottom: 8}} />
                  <Text style={styles.noteBoxText}>
                    Note : Par défaut sur la plateforme, le mot de passe correspond au numéro de téléphone renseigné.
                  </Text>
                </View>
              </View>
            )}

            {userRole === "artisan" && (
              <View style={{ width: '100%' }}>
                {activeTab === "home" && (
                  <>
                    <View style={[styles.card, { marginBottom: 24 }]}>
                      <View style={styles.headerArtisan}>
                        <View style={styles.avatarContainer}>
                          <Text style={styles.avatarText}>{userProfile?.firstName?.charAt(0) || "A"}</Text>
                        </View>
                        <View>
                          <Text style={styles.welcomeTitleLeft}>Bonjour, {userProfile?.firstName}</Text>
                          <Text style={styles.subTitleArtisan}>{userProfile?.profession || "Artisan"}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                          <Text style={styles.statNumber}>{myMissions.length}</Text>
                          <Text style={styles.statLabel}>En cours</Text>
                        </View>
                        <View style={styles.statBox}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.statNumber}>5.0</Text>
                            <Feather name="star" size={14} color="#F59E0B" style={{marginLeft: 2}} />
                          </View>
                          <Text style={styles.statLabel}>Avis</Text>
                        </View>
                        <View style={styles.statBox}>
                          <Text style={styles.statNumber}>120 FCFA</Text>
                          <Text style={styles.statLabel}>Revenus</Text>
                        </View>
                      </View>

                      {!userProfile?.profession && (
                        <View style={styles.noteBox}>
                           <View style={{flexDirection: "row", alignItems: "center", marginBottom: 4}}>
                             <Feather name="info" size={14} color="#B45309" style={{marginRight: 6}} />
                             <Text style={[styles.noteBoxText, {fontFamily: "Raleway_700Bold", marginBottom: 0}]}>Rappel</Text>
                           </View>
                          <Text style={styles.noteBoxText}>
                            N'oubliez pas de renseigner votre métier dans l'onglet Profil pour recevoir des offres ciblées !
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.sectionTitle}>Demandes lancées par des particuliers</Text>
                    {pendingRequests.map(req => (
                      <View key={req.id} style={styles.requestCard}>
                        <View style={styles.requestHeader}>
                          <Text style={styles.requestType}>{req.type}</Text>
                          <Text style={styles.requestDate}>{req.date}</Text>
                        </View>
                        <Text style={styles.requestTitle}>{req.title}</Text>
                        <Text style={styles.requestClient}>Par {req.client}</Text>
                        <TouchableOpacity style={styles.acceptButton}>
                          <Text style={styles.acceptButtonText}>Proposer mes services</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <Text style={styles.sectionTitle}>Demandes que vous avez acceptées</Text>
                    {myMissions.length > 0 ? (
                      myMissions.map(req => (
                        <View key={req.id} style={styles.requestCard}>
                          <View style={styles.requestHeader}>
                            <Text style={styles.requestTypeInProgress}>En cours</Text>
                            <Text style={styles.requestDate}>{req.date}</Text>
                          </View>
                          <Text style={styles.requestTitle}>{req.title}</Text>
                          <Text style={styles.requestClient}>Client : {req.client}</Text>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Aucune mission</Text>
                        <Text style={styles.emptySubtitle}>Vous n'avez pas encore accepté de demandes.</Text>
                      </View>
                    )}
                  </>
                )}

                {activeTab === "missions" && (
                  <View style={styles.emptyState}>
                    <Feather name="list" size={32} color="#9CA3AF" />
                    <Text style={styles.emptyTitle}>Historique des missions</Text>
                    <Text style={styles.infoText}>Retrouvez ici toutes vos missions passées.</Text>
                  </View>
                )}
                
                {activeTab === "profile" && (
                  <View style={{ width: '100%' }}>
                    <View style={[styles.card, { alignItems: 'center', marginBottom: 24 }]}>
                      <View style={[styles.avatarContainer, { width: 80, height: 80, borderRadius: 40, marginBottom: 16, marginRight: 0 }]}>
                        <Text style={[styles.avatarText, { fontSize: 32 }]}>{userProfile?.firstName?.charAt(0) || "A"}</Text>
                      </View>
                      <Text style={styles.welcomeTitle}>{userProfile?.firstName}</Text>
                      <Text style={styles.subTitleArtisan}>
                        {userProfile?.profession ? userProfile.profession : "Métier non renseigné"}
                      </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Informations professionnelles</Text>
                    <View style={[styles.card, { padding: 0, overflow: 'hidden', marginBottom: 24 }]}>
                      <View style={styles.profileRow}>
                        <Feather name="phone" size={20} color="#64748B" />
                        <Text style={styles.profileRowText}>
                          {userProfile?.phone || "Numéro non renseigné"}
                        </Text>
                      </View>
                      <View style={[styles.profileRow, { borderBottomWidth: 0 }]}>
                        <Feather name="map-pin" size={20} color="#64748B" />
                        <Text style={styles.profileRowText}>
                          {userProfile?.location ? userProfile.location : "Localisation non renseignée"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.editProfileButton} onPress={onNavigateToSettings}>
                      <Feather name="edit-3" size={18} color="#FFFFFF" style={{marginRight: 8}} />
                      <Text style={styles.editProfileButtonText}>Personnaliser mon profil</Text>
                    </TouchableOpacity>
                  </View>
                )}

              </View>
            )}
          </View>
        </ScrollView>

        {userRole === "artisan" && (
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
              <Feather name="home" size={24} color={activeTab === "home" ? "#1E3A8A" : "#9CA3AF"} />
              <Text style={[styles.navText, activeTab === "home" && styles.navTextActive]}>Accueil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("missions")}>
              <Feather name="list" size={24} color={activeTab === "missions" ? "#1E3A8A" : "#9CA3AF"} />
              <Text style={[styles.navText, activeTab === "missions" && styles.navTextActive]}>Missions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("profile")}>
              <Feather name="user" size={24} color={activeTab === "profile" ? "#1E3A8A" : "#9CA3AF"} />
              <Text style={[styles.navText, activeTab === "profile" && styles.navTextActive]}>Profil</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mainWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: "Raleway_900Black",
    fontSize: 24,
    color: "#1E3A8A",
    letterSpacing: -0.5,
  },
  logoutButton: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  profileRowText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 15,
    color: "#1E293B",
    marginLeft: 16,
  },
  editProfileButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  editProfileButtonText: {
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  welcomeTitle: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 24,
    color: "#1E3A8A",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeTitleLeft: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 20,
    color: "#1E3A8A",
  },
  subTitleArtisan: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  idText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 16,
  },
  idBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: "center",
  },
  idBadgeText: {
    fontFamily: "Raleway_700Bold",
    color: "#1E3A8A",
    fontSize: 16,
  },
  infoText: {
    fontFamily: "Raleway_400Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  noteBox: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  noteBoxText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 13,
    color: "#B45309",
    lineHeight: 18,
  },
  headerArtisan: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontFamily: "Raleway_700Bold",
    color: "#FFF",
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontFamily: "Raleway_800ExtraBold",
    fontSize: 16,
    color: "#1E3A8A",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 12,
    color: "#64748B",
  },
  sectionTitle: {
    fontFamily: "Raleway_700Bold",
    fontSize: 18,
    color: "#1E3A8A",
    marginTop: 10,
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  requestType: {
    fontFamily: "Raleway_600SemiBold",
    backgroundColor: "#EFF6FF",
    color: "#1E3A8A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    overflow: "hidden",
  },
  requestTypeInProgress: {
    fontFamily: "Raleway_600SemiBold",
    backgroundColor: "#ECFDF5",
    color: "#059669",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    overflow: "hidden",
  },
  requestDate: {
    fontFamily: "Raleway_400Regular",
    color: "#94A3B8",
    fontSize: 12,
  },
  requestTitle: {
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 4,
  },
  requestClient: {
    fontFamily: "Raleway_400Regular",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },
  acceptButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    fontFamily: "Raleway_700Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderColor: "#E2E8F0",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
    color: "#334155",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: "Raleway_400Regular",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "space-around",
    paddingBottom: 24,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  navTextActive: {
    color: "#1E3A8A",
    fontFamily: "Raleway_700Bold",
  },
});
