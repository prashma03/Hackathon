import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import VitalScreen from "./src/screens/VitalScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AIChatScreen from "./src/screens/AIChatScreen";
import HospitalScreen from "./src/screens/HospitalScreen";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("Today");
  const [showChat, setShowChat] = useState(false);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const dark = theme === "dark";
  const navBg = dark ? "#0f1117" : "#ffffff";
  const navBorder = dark ? "#1e2233" : "#e5e7eb";
  const activeColor = "#6c63ff";
  const inactiveColor = dark ? "#4a4f66" : "#9ca3af";

  if (showChat) {
    return (
      <AIChatScreen
        theme={theme}
        onClose={() => setShowChat(false)}
        name="Maya"
      />
    );
  }

  return (
    <View style={styles.container}>

      {activeTab === "Today" && (
        <HomeScreen
          theme={theme}
          toggleTheme={toggleTheme}
          onAskMaterna={() => setShowChat(true)}
        />
      )}
      {activeTab === "Vitals" && <VitalsScreen theme={theme} />}
      {activeTab === "Hospitals" && <HospitalsScreen theme={theme} />}
      {activeTab === "Profile" && <ProfileScreen theme={theme} />}

      <View style={[styles.nav, { backgroundColor: navBg, borderTopColor: navBorder }]}>
        {[
          { label: "Today", icon: "⌂" },
          { label: "Vitals", icon: "♥" },
          { label: "Hospitals", icon: "🏥" },
          { label: "Profile", icon: "◯" },
        ].map(({ label, icon }) => {
          const isActive = activeTab === label;
          const color = isActive ? activeColor : inactiveColor;
          return (
            <TouchableOpacity
              key={label}
              style={styles.navItem}
              onPress={() => setActiveTab(label)}
            >
              <Text style={[styles.navIcon, { color }]}>{icon}</Text>
              <Text style={[styles.navLabel, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingBottom: 24,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: "center", gap: 2 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
});