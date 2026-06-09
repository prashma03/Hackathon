import React from "react";
import { sampleSensorData } from "../data/sampleSensorData";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { Home, Hospital, User, Sparkles, Sun, Moon } from "lucide-react-native";
import VitalCard from "../components/VitalCard";

type HomeScreenProps = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export default function HomeScreen({ theme, toggleTheme }: HomeScreenProps) {
  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#05070A" : "#F8FAFC",
    card: isDark ? "#101418" : "#FFFFFF",
    border: isDark ? "#242B33" : "#E2E8F0",
    text: isDark ? "#F8FAFC" : "#0F172A",
    mutedText: isDark ? "#94A3B8" : "#64748B",
    softText: isDark ? "#CBD5E1" : "#475569",
    green: "#22C55E",
    greenSoft: isDark ? "#123524" : "#DCFCE7",
    greenBorder: "#22C55E",
    blue: isDark ? "#93C5FD" : "#2563EB",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.phoneContent}>
          <View style={styles.topRow}>
            <Text style={[styles.time, { color: colors.text }]}>9:41</Text>

            <Pressable
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {isDark ? (
                <Sun size={16} color={colors.text} />
              ) : (
                <Moon size={16} color={colors.text} />
              )}
              <Text style={[styles.themeButtonText, { color: colors.text }]}>
                {isDark ? "Light" : "Dark"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.brandRow}>
            <View style={[styles.brandDot, { backgroundColor: colors.green }]} />
            <Text style={[styles.brand, { color: colors.text }]}>MATERNA</Text>
            <Text style={[styles.week, { color: colors.mutedText }]}>
              Maya · week 28
            </Text>
          </View>

          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderLeftColor: colors.green,
              },
            ]}
          >
            <View style={styles.statusTopRow}>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: colors.greenSoft,
                    borderColor: colors.greenBorder,
                  },
                ]}
              >
                <View
                  style={[styles.statusDot, { backgroundColor: colors.green }]}
                />
                <Text style={[styles.statusText, { color: colors.green }]}>
                  Green · All clear
                </Text>
              </View>

              <Text style={[styles.confidence, { color: colors.mutedText }]}>
                AI confidence 97%
              </Text>
            </View>

            <Text style={[styles.heroTitle, { color: colors.text }]}>
              Everything{"\n"}looks healthy.
            </Text>

            <Text style={[styles.heroBody, { color: colors.softText }]}>
              Materna sees stable vitals in your normal range. Nothing for you
              to do — keep living your day.
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.smallLabel, { color: colors.mutedText }]}>
              WHAT HAPPENS
            </Text>
            <Text style={[styles.actionText, { color: colors.text }]}>
              No action needed
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              What the band is sensing
            </Text>
            <Text style={[styles.liveText, { color: colors.mutedText }]}>
              updating live
            </Text>
          </View>

          <View style={styles.vitalsGrid}>
            <VitalCard title="Heart rate" value="77" unit="bpm" />
            <VitalCard title="HRV" value="60" unit="ms" />
            <VitalCard title="Blood pressure" value="115/74" unit="mmHg" />
            <VitalCard title="Oxygen SpO₂" value="99" unit="%" />
            <VitalCard title="Skin temp" value="98.4" unit="°F" />
            <VitalCard title="Respiration" value="15" unit="/min" />
          </View>

          <Pressable
            style={[
              styles.askButton,
              {
                backgroundColor: isDark ? "#19231E" : "#DCFCE7",
                borderColor: colors.greenBorder,
              },
            ]}
          >
            <Sparkles size={16} color={colors.green} />
            <Text style={[styles.askButtonText, { color: colors.text }]}>
              Ask Materna
            </Text>
          </Pressable>

          <View style={[styles.bottomNav, { borderTopColor: colors.border }]}>
            <View style={styles.navItem}>
              <Home size={22} color={colors.green} />
              <Text style={[styles.navTextActive, { color: colors.green }]}>
                Today
              </Text>
            </View>

            <View style={styles.navItem}>
              <Hospital size={22} color={colors.mutedText} />
              <Text style={[styles.navText, { color: colors.mutedText }]}>
                Hospitals
              </Text>
            </View>

            <View style={styles.navItem}>
              <User size={22} color={colors.mutedText} />
              <Text style={[styles.navText, { color: colors.mutedText }]}>
                Profile
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  phoneContent: {
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
  },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
  },
  brand: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  week: {
    fontSize: 12,
    marginLeft: 8,
  },
  statusCard: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 22,
    padding: 18,
    marginBottom: 24,
  },
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "800",
  },
  confidence: {
    fontSize: 10,
  },
  heroTitle: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "900",
    marginBottom: 14,
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 18,
  },
  smallLabel: {
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  liveText: {
    fontSize: 10,
    letterSpacing: 1,
  },
  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  askButton: {
    alignSelf: "flex-end",
    marginTop: -58,
    marginRight: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  askButtonText: {
    fontSize: 14,
    fontWeight: "800",
  },
  bottomNav: {
    marginTop: 28,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navTextActive: {
    fontSize: 11,
  },
  navText: {
    fontSize: 11,
  },
});