import React from "react";
import { View, Button, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../components/LanguageContext";
import { ThemedText } from "../components/ThemedText";

export default function Welcome() {
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          {t("welcomeTitle")}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {t("welcomeSubtitle")}
        </ThemedText>
        <ThemedText style={styles.description}>
          {t("welcomeDescription")}
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryButtonText}>{t("getStarted")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.secondaryButtonText}>{t("logIn")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#38b386",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: "#0d265c",
    marginBottom: 24,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#38b386",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#38b386",
  },
  secondaryButtonText: {
    color: "#38b386",
    fontSize: 18,
    fontWeight: "bold",
  },
});
