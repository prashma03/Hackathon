import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import HospitalMap from "../components/HospitalMap";

interface Props {
  theme: "dark" | "light";
}

const HOSPITALS = [
  {
    id: "1",
    name: "Delta Memorial Hospital",
    type: "Labor & Delivery",
    county: "Desha",
    phone: "8707935000",
    address: "811 South St, Dumas, AR",
    beds: 3,
    hasED: true,
    lat: 33.8876,
    lng: -91.4929,
  },
  {
    id: "2",
    name: "UAMS Medical Center",
    type: "Full OB Care",
    county: "Pulaski",
    phone: "5016865000",
    address: "4301 W Markham St, Little Rock, AR",
    beds: 7,
    hasED: true,
    lat: 34.7465,
    lng: -92.3459,
  },
  {
    id: "3",
    name: "Jefferson Regional Medical Center",
    type: "OB & Labor Unit",
    county: "Jefferson",
    phone: "8705412000",
    address: "1600 W 40th Ave, Pine Bluff, AR",
    beds: 4,
    hasED: true,
    lat: 34.2284,
    lng: -92.0032,
  },
  {
    id: "4",
    name: "ARcare Rural Health Clinic",
    type: "Prenatal Care Only",
    county: "Desha",
    phone: "8704602000",
    address: "106 Main St, McGehee, AR",
    beds: 0,
    hasED: false,
    lat: 33.6337,
    lng: -91.3998,
  },
];

const AMBULANCES = [
  { id: "amb-1", name: "Ambulance 047", county: "Desha", lat: 33.82, lng: -91.45 },
  { id: "amb-2", name: "Ambulance 031", county: "Jefferson", lat: 34.18, lng: -91.91 },
  { id: "amb-3", name: "Ambulance 018", county: "Pulaski", lat: 34.72, lng: -92.3 },
];

const COUNTY_AVAILABILITY = [
  { county: "Desha", ambulances: 1, laborDelivery: "Limited", emergencyDepartment: "Available" },
  { county: "Jefferson", ambulances: 2, laborDelivery: "Available", emergencyDepartment: "Available" },
  { county: "Pulaski", ambulances: 4, laborDelivery: "Available", emergencyDepartment: "Available" },
  { county: "Phillips", ambulances: 1, laborDelivery: "None", emergencyDepartment: "Limited" },
  { county: "Lincoln", ambulances: 1, laborDelivery: "None", emergencyDepartment: "Available" },
];

type LocationStatus = "idle" | "requesting" | "granted" | "denied";
type ResourceType = "ambulance" | "ld" | "ed";

export default function HospitalsScreen({ theme }: Props) {
  const dark = theme === "dark";
  const c = dark ? colors.dark : colors.light;

  const [selectedTab, setSelectedTab] = useState<"map" | "list">("list");
  const [selectedCounty, setSelectedCounty] = useState("All");
  const [countyMenuOpen, setCountyMenuOpen] = useState(false);
  const [linkedId, setLinkedId] = useState("1");
  const [ambulances, setAmbulances] = useState(AMBULANCES);
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLabel, setLocationLabel] = useState("Location not shared");

  const filteredHospitals = useMemo(
    () =>
      selectedCounty === "All"
        ? HOSPITALS
        : HOSPITALS.filter((hospital) => hospital.county === selectedCounty),
    [selectedCounty]
  );

  const filteredAmbulances = useMemo(
    () =>
      selectedCounty === "All"
        ? ambulances
        : ambulances.filter((ambulance) => ambulance.county === selectedCounty),
    [ambulances, selectedCounty]
  );

  const laborDeliveryHospitals = filteredHospitals.filter((hospital) => hospital.beds > 0);
  const emergencyHospitals = filteredHospitals.filter((hospital) => hospital.hasED);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances((current) =>
        current.map((ambulance) => ({
          ...ambulance,
          lat: ambulance.lat + (Math.random() - 0.5) * 0.004,
          lng: ambulance.lng + (Math.random() - 0.5) * 0.004,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedTab === "map" && locationStatus === "idle") {
      requestLocation();
    }
  }, [selectedTab, locationStatus]);

  async function requestLocation() {
    try {
      setLocationStatus("requesting");
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocationStatus("denied");
        setLocationLabel("Location permission was not allowed");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(coordinates);
      setLocationStatus("granted");

      const places = await Location.reverseGeocodeAsync(coordinates);
      const place = places[0];
      if (place) {
        const label = [place.city, place.region].filter(Boolean).join(", ");
        setLocationLabel(label || "Current location");
      } else {
        setLocationLabel("Current location");
      }
    } catch {
      setLocationStatus("denied");
      setLocationLabel("Unable to get current location");
    }
  }

  function handleCall(phone: string) {
    Linking.openURL(`tel:${phone}`);
  }

  function handleDirections(address: string) {
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <View style={[styles.header, { borderBottomColor: c.cardBorder }]}>
        <View>
          <Text style={[styles.screenTitle, { color: c.accent }]}>MATERNA</Text>
          <Text style={[styles.pageLabel, { color: c.textMuted }]}>
            Obstetric Care Finder
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.locationButton, { borderColor: c.accent }]}
          onPress={requestLocation}
        >
          <Text style={[styles.locationButtonText, { color: c.accent }]}>
            Use my location
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.locationRow, { backgroundColor: c.card }]}>
        {locationStatus === "requesting" && <ActivityIndicator size="small" color={c.accent} />}
        <Text style={[styles.locationText, { color: c.textMuted }]}>{locationLabel}</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: c.card, borderBottomColor: c.cardBorder }]}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "map" && styles.activeTab, selectedTab === "map" && { borderBottomColor: c.accent }]}
          onPress={() => setSelectedTab("map")}
        >
          <Text style={[styles.tabText, { color: selectedTab === "map" ? c.accent : c.textMuted }]}>
            Live Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "list" && styles.activeTab, selectedTab === "list" && { borderBottomColor: c.accent }]}
          onPress={() => setSelectedTab("list")}
        >
          <Text style={[styles.tabText, { color: selectedTab === "list" ? c.accent : c.textMuted }]}>
            Hospital List
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.countyPanel, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
        <TouchableOpacity
          style={styles.countySelector}
          onPress={() => setCountyMenuOpen((open) => !open)}
        >
          <View>
            <Text style={[styles.selectorLabel, { color: c.textMuted }]}>COUNTY</Text>
            <Text style={[styles.selectorValue, { color: c.text }]}>
              {selectedCounty === "All" ? "All nearby counties" : `${selectedCounty} County`}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: c.accent }]}>{countyMenuOpen ? "Up" : "Select"}</Text>
        </TouchableOpacity>

        {countyMenuOpen && (
          <View style={[styles.countyOptions, { borderTopColor: c.cardBorder }]}>
            {["All", ...COUNTY_AVAILABILITY.map((item) => item.county)].map((county) => (
              <TouchableOpacity
                key={county}
                style={[
                  styles.countyOption,
                  selectedCounty === county && { backgroundColor: `${c.accent}18` },
                ]}
                onPress={() => {
                  setSelectedCounty(county);
                  setCountyMenuOpen(false);
                }}
              >
                <Text style={{ color: selectedCounty === county ? c.accent : c.text }}>
                  {county === "All" ? "All nearby counties" : `${county} County`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.availabilityRow}>
          <AvailabilityBox
            label="Ambulance"
            value={`${filteredAmbulances.length} available`}
            c={c}
            onPress={() => setSelectedResource("ambulance")}
          />
          <AvailabilityBox
            label="L&D"
            value={`${laborDeliveryHospitals.length} available`}
            c={c}
            onPress={() => setSelectedResource("ld")}
          />
          <AvailabilityBox
            label="ED"
            value={`${emergencyHospitals.length} available`}
            c={c}
            onPress={() => setSelectedResource("ed")}
          />
        </View>
      </View>

      {selectedResource ? (
        <ResourceDetails
          type={selectedResource}
          county={selectedCounty}
          hospitals={
            selectedResource === "ld"
              ? laborDeliveryHospitals
              : selectedResource === "ed"
              ? emergencyHospitals
              : []
          }
          ambulances={selectedResource === "ambulance" ? filteredAmbulances : []}
          c={c}
          onBack={() => setSelectedResource(null)}
          onCall={handleCall}
          onDirections={handleDirections}
        />
      ) : selectedTab === "map" ? (
        <View style={styles.mapSection}>
          <HospitalMap
            dark={dark}
            accent={c.accent}
            userLocation={userLocation}
            hospitals={filteredHospitals}
            ambulances={filteredAmbulances}
            linkedHospitalId={linkedId}
          />
          {locationStatus === "denied" && (
            <TouchableOpacity
              style={[styles.permissionNotice, { backgroundColor: c.card, borderColor: c.accent }]}
              onPress={requestLocation}
            >
              <Text style={[styles.permissionTitle, { color: c.text }]}>Location is off</Text>
              <Text style={[styles.permissionText, { color: c.textMuted }]}>
                Tap to allow location and center the map on nearby care.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {filteredHospitals.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
              <Text style={[styles.emptyTitle, { color: c.text }]}>No L&D hospital listed in this county</Text>
              <Text style={[styles.emptyText, { color: c.textMuted }]}>
                Check the map or select another county for the nearest available care.
              </Text>
            </View>
          ) : (
            filteredHospitals.map((hospital) => {
              const linked = linkedId === hospital.id;
              return (
                <View
                  key={hospital.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: c.card,
                      borderColor: linked ? c.accent : c.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.cardHeading}>
                      <Text style={[styles.hospitalName, { color: c.text }]}>{hospital.name}</Text>
                      <Text style={[styles.hospitalType, { color: c.textMuted }]}>
                        {hospital.type} · {hospital.county} County
                      </Text>
                    </View>
                    {linked && <Text style={[styles.linkedText, { color: c.accent }]}>Linked</Text>}
                  </View>

                  <Text style={[styles.availabilityText, { color: c.textMuted }]}>
                    L&D: {hospital.beds > 0 ? `${hospital.beds} beds` : "Not available"} · ED: {hospital.hasED ? "Available" : "Not available"}
                  </Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: c.accent }]}
                      onPress={() => handleCall(hospital.phone)}
                    >
                      <Text style={styles.primaryButtonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: c.cardBorder }]}
                      onPress={() => handleDirections(hospital.address)}
                    >
                      <Text style={[styles.secondaryButtonText, { color: c.text }]}>Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { borderColor: c.accent, borderWidth: 1 }]}
                      onPress={() => setLinkedId(hospital.id)}
                    >
                      <Text style={[styles.secondaryButtonText, { color: c.accent }]}>
                        {linked ? "Linked" : "Link"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function AvailabilityBox({
  label,
  value,
  c,
  onPress,
}: {
  label: string;
  value: string;
  c: any;
  onPress: () => void;
}) {
  const unavailable = value.startsWith("0");
  const color = unavailable ? "#e11d48" : value === "Limited" ? "#d97706" : "#22C55E";

  return (
    <TouchableOpacity
      style={[styles.availabilityBox, { borderColor: c.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.availabilityLabel, { color: c.textMuted }]}>{label}</Text>
      <Text style={[styles.availabilityValue, { color }]}>{value}</Text>
      <Text style={[styles.availabilityLink, { color: c.textMuted }]}>View details</Text>
    </TouchableOpacity>
  );
}

function ResourceDetails({
  type,
  county,
  hospitals,
  ambulances,
  c,
  onBack,
  onCall,
  onDirections,
}: {
  type: ResourceType;
  county: string;
  hospitals: typeof HOSPITALS;
  ambulances: typeof AMBULANCES;
  c: any;
  onBack: () => void;
  onCall: (phone: string) => void;
  onDirections: (address: string) => void;
}) {
  const title =
    type === "ambulance"
      ? "Available ambulances"
      : type === "ld"
      ? "Labor & Delivery care"
      : "Emergency departments";

  return (
    <ScrollView contentContainerStyle={styles.resourceScroll}>
      <TouchableOpacity style={styles.resourceBack} onPress={onBack}>
        <Text style={[styles.resourceBackText, { color: c.accent }]}>Back to care finder</Text>
      </TouchableOpacity>

      <Text style={[styles.resourceTitle, { color: c.text }]}>{title}</Text>
      <Text style={[styles.resourceSubtitle, { color: c.textMuted }]}>
        {county === "All" ? "All nearby counties" : `${county} County`}
      </Text>

      {type === "ambulance" &&
        ambulances.map((ambulance) => (
          <View
            key={ambulance.id}
            style={[styles.resourceCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}
          >
            <View style={styles.resourceCardTop}>
              <View>
                <Text style={[styles.resourceName, { color: c.text }]}>{ambulance.name}</Text>
                <Text style={[styles.resourceMeta, { color: c.textMuted }]}>
                  {ambulance.county} County
                </Text>
              </View>
              <View style={styles.movingBadge}>
                <Text style={styles.movingBadgeText}>Moving live</Text>
              </View>
            </View>
            <Text style={[styles.resourceMeta, { color: c.textMuted }]}>
              Location updates every 3 seconds on the live map.
            </Text>
          </View>
        ))}

      {type !== "ambulance" &&
        hospitals.map((hospital) => (
          <View
            key={hospital.id}
            style={[styles.resourceCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}
          >
            <Text style={[styles.resourceName, { color: c.text }]}>{hospital.name}</Text>
            <Text style={[styles.resourceMeta, { color: c.textMuted }]}>
              {hospital.type} · {hospital.county} County
            </Text>
            <Text style={[styles.resourceAvailability, { color: "#22C55E" }]}>
              {type === "ld"
                ? `${hospital.beds} L&D beds listed`
                : "Emergency department available"}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: c.accent }]}
                onPress={() => onCall(hospital.phone)}
              >
                <Text style={styles.primaryButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: c.cardBorder }]}
                onPress={() => onDirections(hospital.address)}
              >
                <Text style={[styles.secondaryButtonText, { color: c.text }]}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      {(type === "ambulance" ? ambulances.length === 0 : hospitals.length === 0) && (
        <View style={[styles.emptyCard, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
          <Text style={[styles.emptyTitle, { color: c.text }]}>No availability listed</Text>
          <Text style={[styles.emptyText, { color: c.textMuted }]}>
            Select another county or call 911 during an emergency.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function getColors(mode: "dark" | "light") {
  const dark = mode === "dark";
  return {
    background: dark ? "#0f1117" : "#f5f7fa",
    text: dark ? "#f0f0f0" : "#1a1a1a",
    textMuted: dark ? "#8a8fa8" : "#6b7280",
    accent: "#6c63ff",
    card: dark ? "#1c1f2e" : "#ffffff",
    cardBorder: dark ? "#2e3347" : "#e5e7eb",
  };
}

const colors = { dark: getColors("dark"), light: getColors("light") };

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  screenTitle: { fontSize: 18, fontWeight: "900", letterSpacing: 3 },
  pageLabel: { fontSize: 12, marginTop: 2 },
  locationButton: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  locationButtonText: { fontSize: 11, fontWeight: "700" },
  locationRow: { minHeight: 34, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18 },
  locationText: { fontSize: 11 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 2 },
  tabText: { fontSize: 13, fontWeight: "700" },
  countyPanel: { margin: 12, borderWidth: 1, borderRadius: 12, overflow: "hidden" },
  countySelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12 },
  selectorLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  selectorValue: { fontSize: 14, fontWeight: "700", marginTop: 2 },
  chevron: { fontSize: 11, fontWeight: "700" },
  countyOptions: { borderTopWidth: 1, paddingVertical: 4 },
  countyOption: { paddingHorizontal: 12, paddingVertical: 10 },
  availabilityRow: { flexDirection: "row", paddingHorizontal: 8, paddingBottom: 8, gap: 6 },
  availabilityBox: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 8, minHeight: 70 },
  availabilityLabel: { fontSize: 9, fontWeight: "700", marginBottom: 4 },
  availabilityValue: { fontSize: 11, fontWeight: "800" },
  availabilityLink: { fontSize: 8, marginTop: 5 },
  mapSection: { flex: 1, minHeight: 300 },
  permissionNotice: { position: "absolute", left: 14, right: 14, bottom: 14, borderWidth: 1, borderRadius: 10, padding: 12 },
  permissionTitle: { fontSize: 13, fontWeight: "800" },
  permissionText: { fontSize: 11, marginTop: 3 },
  scroll: { padding: 12, paddingBottom: 40 },
  emptyCard: { borderWidth: 1, borderRadius: 12, padding: 18 },
  emptyTitle: { fontSize: 15, fontWeight: "800" },
  emptyText: { fontSize: 12, lineHeight: 18, marginTop: 6 },
  card: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  cardHeading: { flex: 1 },
  hospitalName: { fontSize: 15, fontWeight: "800" },
  hospitalType: { fontSize: 11, marginTop: 3 },
  linkedText: { fontSize: 11, fontWeight: "800" },
  availabilityText: { fontSize: 11, marginTop: 10 },
  buttonRow: { flexDirection: "row", gap: 7, marginTop: 12 },
  actionButton: { flex: 1, borderRadius: 8, paddingVertical: 9, alignItems: "center" },
  primaryButtonText: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
  secondaryButtonText: { fontSize: 11, fontWeight: "700" },
  resourceScroll: { padding: 14, paddingBottom: 40 },
  resourceBack: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 6 },
  resourceBackText: { fontSize: 12, fontWeight: "700" },
  resourceTitle: { fontSize: 22, fontWeight: "900" },
  resourceSubtitle: { fontSize: 12, marginTop: 3, marginBottom: 16 },
  resourceCard: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10 },
  resourceCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  resourceName: { fontSize: 15, fontWeight: "800" },
  resourceMeta: { fontSize: 11, marginTop: 4 },
  resourceAvailability: { fontSize: 11, fontWeight: "700", marginTop: 10 },
  movingBadge: { backgroundColor: "#14532d", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  movingBadgeText: { color: "#4ade80", fontSize: 9, fontWeight: "800" },
});
