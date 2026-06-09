import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";

interface Props {
  theme: "dark" | "light";
}

const HOSPITALS = [
  {
    id: "1",
    name: "UAMS Medical Center",
    type: "Level I Trauma · Full Obstetric Care",
    distance: "42 miles",
    time: "~55 min",
    phone: "5013865000",
    address: "4301 W Markham St, Little Rock, AR",
    linked: true,
  },
  {
    id: "2",
    name: "Delta Memorial Hospital",
    type: "Level IV Rural Emergency Care",
    distance: "8 miles",
    time: "~12 min",
    phone: "8707935000",
    address: "811 South St, Dumas, AR",
    linked: false,
  },
  {
    id: "3",
    name: "Jefferson Regional Medical Center",
    type: "Level III · OB & Labor Unit",
    distance: "31 miles",
    time: "~38 min",
    phone: "8705412000",
    address: "1600 W 40th Ave, Pine Bluff, AR",
    linked: false,
  },
  {
    id: "4",
    name: "ARcare Rural Health Clinic",
    type: "Prenatal Care · Outpatient Only",
    distance: "5 miles",
    time: "~8 min",
    phone: "8704602000",
    address: "106 Main St, McGehee, AR",
    linked: false,
  },
];

export default function HospitalsScreen({ theme }: Props) {
  const dark = theme === "dark";
  const c = dark ? colors.dark : colors.light;

  const [linkedId, setLinkedId] = useState("1");

  function handleCall(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  function handleDirections(address: string) {
    const query = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: c.accent }]}>MATERNA</Text>
          <Text style={[styles.pageLabel, { color: c.textMuted }]}>Obstetric Care Finder</Text>
        </View>

        {/* Info banner */}
        <View style={[styles.banner, { backgroundColor: c.card, borderColor: c.accent }]}>
          <Text style={[styles.bannerText, { color: c.textMuted }]}>
            📍 Showing hospitals near <Text style={{ color: c.text, fontWeight: "700" }}>McGehee, AR</Text>. Tap a hospital to link it as your preferred care provider.
          </Text>
        </View>

        {/* Hospital cards */}
        {HOSPITALS.map((h) => {
          const isLinked = linkedId === h.id;
          return (
            <View
              key={h.id}
              style={[
                styles.card,
                {
                  backgroundColor: c.card,
                  borderColor: isLinked ? c.accent : c.cardBorder,
                  borderWidth: isLinked ? 2 : 1,
                },
              ]}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hospitalName, { color: c.text }]}>{h.name}</Text>
                  <Text style={[styles.hospitalType, { color: c.textMuted }]}>{h.type}</Text>
                </View>
                {isLinked && (
                  <View style={[styles.linkedBadge, { backgroundColor: c.accent + "22" }]}>
                    <Text style={[styles.linkedText, { color: c.accent }]}>✓ Linked</Text>
                  </View>
                )}
              </View>

              {/* Distance / time */}
              <View style={styles.distanceRow}>
                <Text style={[styles.distanceText, { color: c.textMuted }]}>
                  📍 {h.distance} away · 🚗 {h.time} drive
                </Text>
              </View>

              {/* Action buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: c.accent }]}
                  onPress={() => handleCall(h.phone)}
                >
                  <Text style={styles.btnText}>📞 Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: c.secondaryBtn }]}
                  onPress={() => handleDirections(h.address)}
                >
                  <Text style={[styles.btnText, { color: c.text }]}>🗺 Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: isLinked ? c.secondaryBtn : c.card, borderWidth: 1, borderColor: c.accent },
                  ]}
                  onPress={() => setLinkedId(h.id)}
                >
                  <Text style={[styles.btnText, { color: c.accent }]}>
                    {isLinked ? "✓ Linked" : "Link"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <Text style={[styles.disclaimer, { color: c.textMuted }]}>
          In an emergency always call 911. Hospital data is for informational purposes only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function getColors(mode: "dark" | "light") {
  const isDark = mode === "dark";
  return {
    background: isDark ? "#0f1117" : "#f5f7fa",
    text: isDark ? "#f0f0f0" : "#1a1a1a",
    textMuted: isDark ? "#8a8fa8" : "#6b7280",
    accent: "#6c63ff",
    card: isDark ? "#1c1f2e" : "#ffffff",
    cardBorder: isDark ? "#2e3347" : "#e5e7eb",
    secondaryBtn: isDark ? "#2e3347" : "#e5e7eb",
  };
}

const colors = { dark: getColors("dark"), light: getColors("light") };

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 48 },
  header: { marginBottom: 20, marginTop: 8 },
  screenTitle: { fontSize: 22, fontWeight: "800", letterSpacing: 4 },
  pageLabel: { fontSize: 14, marginTop: 2, letterSpacing: 0.5 },
  banner: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  bannerText: { fontSize: 13, lineHeight: 19 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  hospitalName: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  hospitalType: { fontSize: 12 },
  linkedBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  linkedText: { fontSize: 12, fontWeight: "700" },
  distanceRow: { marginBottom: 14 },
  distanceText: { fontSize: 12 },
  btnRow: { flexDirection: "row", gap: 8 },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  disclaimer: { fontSize: 11, textAlign: "center", marginTop: 8, lineHeight: 16 },
});