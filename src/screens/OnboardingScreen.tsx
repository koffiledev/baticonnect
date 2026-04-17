import { useCallback, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";

const ACCENT = "#F59E0B";
const PRIMARY = "#1E3A8A";
const MUTED = "#64748B";
const PAGE_BG = ["#F8FAFC", "#FFFBEB", "#EFF6FF"] as const;

type Slide = {
  title: string;
  tagline: string;
  bullets: string[];
  icon: keyof typeof Feather.glyphMap;
};

const SLIDES: Slide[] = [
  {
    title: "BatiConnect",
    tagline:
      "La mise en relation simplifiée entre particuliers et artisans.",
    bullets: [
      "Travaux, rénovation et dépannage au même endroit.",
      "Deux parcours clairs : vous cherchez un pro, ou vous proposez vos services.",
    ],
    icon: "briefcase",
  },
  {
    title: "J’ai des travaux",
    tagline: "Publiez un besoin, recevez des devis qualifiés.",
    bullets: [
      "Moins d’étapes pour décrire votre chantier et lancer la demande.",
      "Une vue unifiée du statut : attente, devis reçus, mission en cours.",
      "Échangez en messagerie rattachée à chaque mission.",
    ],
    icon: "home",
  },
  {
    title: "Je suis artisan",
    tagline: "Développez votre activité près de chez vous.",
    bullets: [
      "Découvrez des chantiers filtrables par distance et par métier.",
      "Envoyez des devis structurés et suivez l’état de vos propositions.",
      "Profils et messagerie pour sécuriser la relation avec le client.",
    ],
    icon: "tool",
  },
];

type Props = {
  onComplete: () => void;
  onSkip: () => void;
};

export function OnboardingScreen({ onComplete, onSkip }: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const topInset = (Constants.statusBarHeight ?? 0) + 8;

  const syncPage = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / Math.max(width, 1));
      setPage(Math.min(Math.max(i, 0), SLIDES.length - 1));
    },
    [width]
  );

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setPage(index);
  };

  const handlePrimary = () => {
    if (page < SLIDES.length - 1) {
      goToPage(page + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: topInset }]}>
        <View style={styles.headerSpacer} />
        <Pressable onPress={onSkip} hitSlop={12} style={styles.skipWrap}>
          <Text style={styles.skip}>Passer</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={syncPage}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.title} style={[styles.page, { width }]}>
            <View
              style={[
                styles.card,
                { backgroundColor: PAGE_BG[index % PAGE_BG.length] },
              ]}
            >
              <View style={styles.visual}>
                <Feather name={slide.icon} size={64} color={index % 2 === 0 ? PRIMARY : ACCENT} />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.tagline}>{slide.tagline}</Text>
              <View style={styles.bulletBlock}>
                {slide.bullets.map((line) => (
                  <View key={line} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === page && styles.dotActive]}
            />
          ))}
        </View>
        <Pressable
          onPress={handlePrimary}
          style={({ pressed }) => [
            styles.cta,
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaLabel}>
            {page < SLIDES.length - 1 ? "Suivant" : "Commencer"}
          </Text>
        </Pressable>
        {page === SLIDES.length - 1 ? (
          <Text style={styles.hint}>
            Vous pourrez consulter certaines offres sans créer de compte (accès
            limité).
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerSpacer: {
    flex: 1,
  },
  skipWrap: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  skip: {
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
    color: PRIMARY,
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    justifyContent: "center",
    minHeight: 420,
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  visual: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: {
    fontFamily: "Raleway_900Black",
    fontSize: 28,
    color: PRIMARY,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 17,
    lineHeight: 24,
    color: "#334155",
    marginBottom: 20,
  },
  bulletBlock: {
    gap: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontFamily: "Raleway_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: MUTED,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 8,
    gap: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  dotActive: {
    width: 24,
    backgroundColor: PRIMARY,
  },
  cta: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaLabel: {
    fontFamily: "Raleway_800ExtraBold",
    color: "#FFFFFF",
    fontSize: 17,
  },
  hint: {
    fontFamily: "Raleway_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: MUTED,
    textAlign: "center",
  },
});
