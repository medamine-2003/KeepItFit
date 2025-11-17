import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { router } from "expo-router";
import api from "../utils/api";
import { AuthContext } from "../components/AuthContext";
import { useLanguage } from "../components/LanguageContext";
import { ThemedText } from "../components/ThemedText";
import { CustomAlert } from "../components/CustomAlert";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({
        visible: true,
        title: "Missing Information",
        message: "Please fill in all fields",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username: email, password });
      const token = res.data.access_token;
      await signIn(token);
      router.replace("/(authenticated)/home");
    } catch (err: any) {
      // Show user-friendly error only
      setAlert({
        visible: true,
        title: "Login Failed",
        message:
          err?.response?.data?.detail ||
          "Invalid credentials. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.title}>
        {t("welcomeBack")}
      </ThemedText>
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={loading ? t("loggingIn") : t("login")}
        onPress={handleLogin}
        disabled={loading}
      />
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>{t("dontHaveAccount")}</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: { marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#38b386",
    fontSize: 14,
  },
});
