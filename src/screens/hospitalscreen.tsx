import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from "react-native";
import { ArrowLeft, Landmark, Layers } from "lucide-react-native";

export default function HospitalScreen({ theme, navigate }) {
  const isDark = theme === "dark";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#05070A" : "#F8FAFC" }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate("Home")}><ArrowLeft size={24} color={isDark ? "#FFF" : "#000"} /></Pressable>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#000" }]}>Obstetric Care Finder</Text>
        <Pressable onPress={() => navigate("HospitalDashboard")}><Layers size={20} color="#22C55E" /></Pressable>
      </View>

      <ScrollView style={{ padding: 16 }}>
        <View style={styles.card}>
          <Landmark size={20} color="#22C55E" />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: "#FFF", fontWeight: "700" }}>Delta Memorial Hospital</Text>
            <Text style={{ color: "#64748B", fontSize: 12 }}>Level IV Rural Emergency Care Support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  title: { fontSize: 18, fontWeight: "800" },
  card: { flexDirection: "row", backgroundColor: "#101418", padding: 16, borderRadius: 14, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: "#242B33" }
});