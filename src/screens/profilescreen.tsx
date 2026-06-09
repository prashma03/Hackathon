import { saveProfile, loadProfile, clearProfile } from "../storage/profileStorage";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Props {
  theme: "dark" | "light";
}

export default function ProfileScreen({ theme }: Props) {
  const dark = theme === "dark";
  const c = dark ? colors.dark : colors.light;

  const [age, setAge] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [pregnancyWeek, setPregnancyWeek] = useState("");
  const [previousPregnancies, setPreviousPregnancies] = useState("");
  const [medications, setMedications] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [preferredHospital, setPreferredHospital] = useState("");

  const [hasMiscarriage, setHasMiscarriage] = useState(false);
  const [hasHighBP, setHasHighBP] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasAnemia, setHasAnemia] = useState(false);
  const [hasCSection, setHasCSection] = useState(false);

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { backgroundColor: c.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.screenTitle, { color: c.accent }]}>MATERNA</Text>
          <Text style={[styles.pageLabel, { color: c.textMuted }]}>My Profile</Text>
        </View>

        <SectionHeader label="Personal" color={c.sectionHeader} />

        <View style={styles.row}>
          <Field label="Age" value={age} onChangeText={setAge} placeholder="e.g. 28" keyboardType="numeric" c={c} style={{ flex: 1, marginRight: 8 }} />
          <Field label="Pregnancy week" value={pregnancyWeek} onChangeText={setPregnancyWeek} placeholder="e.g. 28" keyboardType="numeric" c={c} style={{ flex: 1 }} />
        </View>

        <View style={styles.row}>
          <Field label="Weight (lbs)" value={weightLbs} onChangeText={setWeightLbs} placeholder="e.g. 145" keyboardType="numeric" c={c} style={{ flex: 1, marginRight: 8 }} />
          <Field label="Height (ft)" value={heightFt} onChangeText={setHeightFt} placeholder="5" keyboardType="numeric" c={c} style={{ flex: 1, marginRight: 8 }} />
          <Field label="In" value={heightIn} onChangeText={setHeightIn} placeholder="4" keyboardType="numeric" c={c} style={{ flex: 0.6 }} />
        </View>

        <Field label="Previous pregnancies" value={previousPregnancies} onChangeText={setPreviousPregnancies} placeholder="e.g. 1" keyboardType="numeric" c={c} />

        <SectionHeader label="Medical history" color={c.sectionHeader} />

        <ToggleRow label="History of miscarriage" value={hasMiscarriage} onToggle={setHasMiscarriage} c={c} />
        <ToggleRow label="High blood pressure" value={hasHighBP} onToggle={setHasHighBP} c={c} />
        <ToggleRow label="Diabetes" value={hasDiabetes} onToggle={setHasDiabetes} c={c} />
        <ToggleRow label="Anemia" value={hasAnemia} onToggle={setHasAnemia} c={c} />
        <ToggleRow label="Previous C-section" value={hasCSection} onToggle={setHasCSection} c={c} />

        <Field label="Current medications" value={medications} onChangeText={setMedications} placeholder="List any medications, or leave blank" multiline c={c} />

        <SectionHeader label="Emergency & care" color={c.sectionHeader} />

        <Field label="Emergency contact (name & phone)" value={emergencyContact} onChangeText={setEmergencyContact} placeholder="e.g. John Smith · 501-555-0199" c={c} />
        <Field label="Preferred hospital or clinic" value={preferredHospital} onChangeText={setPreferredHospital} placeholder="e.g. UAMS Medical Center, Little Rock" c={c} />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: c.accent }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saved ? "✓  Profile saved" : "Save profile"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: c.textMuted }]}>
          Your information is stored only on this device and is never shared without your permission.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.sectionHeader, { color }]}>{label.toUpperCase()}</Text>;
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
  multiline?: boolean;
  c: any;
  style?: object;
}

function Field({ label, value, onChangeText, placeholder, keyboardType = "default", multiline = false, c, style }: FieldProps) {
  return (
    <View style={[styles.fieldWrapper, style]}>
      <Text style={[styles.label, { color: c.textMuted }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: c.inputBg, borderColor: c.inputBorder, color: c.text },
          multiline && { height: 72, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        returnKeyType={multiline ? "default" : "done"}
      />
    </View>
  );
}

function ToggleRow({ label, value, onToggle, c }: { label: string; value: boolean; onToggle: (v: boolean) => void; c: any }) {
  return (
    <View style={[styles.toggleRow, { borderBottomColor: c.divider }]}>
      <Text style={[styles.toggleLabel, { color: c.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: c.switchTrackOff, true: c.accent }} thumbColor="#fff" />
    </View>
  );
}

function getColors(mode: "dark" | "light") {
  const isDark = mode === "dark";
  return {
    background: isDark ? "#0f1117" : "#f5f7fa",
    text: isDark ? "#f0f0f0" : "#1a1a1a",
    textMuted: isDark ? "#8a8fa8" : "#6b7280",
    accent: "#6c63ff",
    sectionHeader: isDark ? "#6c63ff" : "#4f46e5",
    inputBg: isDark ? "#1c1f2e" : "#ffffff",
    inputBorder: isDark ? "#2e3347" : "#d1d5db",
    placeholder: isDark ? "#4a4f66" : "#9ca3af",
    divider: isDark ? "#1e2233" : "#e5e7eb",
    switchTrackOff: isDark ? "#2e3347" : "#d1d5db",
  };
}

const colors = { dark: getColors("dark"), light: getColors("light") };

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 48 },
  header: { marginBottom: 24, marginTop: 8 },
  screenTitle: { fontSize: 22, fontWeight: "800", letterSpacing: 4 },
  pageLabel: { fontSize: 14, marginTop: 2, letterSpacing: 0.5 },
  sectionHeader: { fontSize: 11, fontWeight: "700", letterSpacing: 2, marginTop: 28, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "flex-end" },
  fieldWrapper: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 5, letterSpacing: 0.3 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, borderBottomWidth: 1 },
  toggleLabel: { fontSize: 15, flex: 1, paddingRight: 12 },
  saveButton: { marginTop: 32, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  disclaimer: { fontSize: 11, textAlign: "center", marginTop: 16, lineHeight: 16 },
});