import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
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

export default function SignUp() {
  const { signIn } = useContext(AuthContext);
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [diet, setDiet] = useState("balanced");
  const [activityLevel, setActivityLevel] = useState("moderate");
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

  const handleSignup = async () => {
    if (!username || !email || !password || !age || !weight || !height) {
      setAlert({
        visible: true,
        title: "Missing Information",
        message: "Please fill in all required fields",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const body = {
        username,
        email,
        password,
        age: parseInt(age, 10),
        weight: parseInt(weight, 10),
        height: parseInt(height, 10),
        goal,
        diet,
        activity_level: activityLevel,
      };
      const res = await api.post("/auth/register", body);
      const token = res.data.access_token;
      await signIn(token);
      router.replace("/(authenticated)/home");
    } catch (err: any) {
      // Show user-friendly error only
      setAlert({
        visible: true,
        title: "Sign Up Failed",
        message:
          err?.response?.data?.detail ||
          "Unable to create account. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.title}>
        {t("createAccount")}
      </ThemedText>
      
      <ThemedText style={styles.sectionTitle}>{t("accountInfo")}</ThemedText>
      <TextInput
        placeholder={t("username")}
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <ThemedText style={styles.sectionTitle}>{t("personalInfo")}</ThemedText>
      <TextInput
        placeholder={t("age") + " *"}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder={t("weight") + " *"}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder={t("height") + " *"}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <ThemedText style={styles.sectionTitle}>{t("fitnessGoals")}</ThemedText>
      <ThemedText style={styles.label}>{t("goal")}:</ThemedText>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[styles.pickerButton, goal === "lose" && styles.pickerButtonActive]}
          onPress={() => setGoal("lose")}
        >
          <Text style={[styles.pickerText, goal === "lose" && styles.pickerTextActive]}>{t("goalLose")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, goal === "maintain" && styles.pickerButtonActive]}
          onPress={() => setGoal("maintain")}
        >
          <Text style={[styles.pickerText, goal === "maintain" && styles.pickerTextActive]}>{t("goalMaintain")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, goal === "gain" && styles.pickerButtonActive]}
          onPress={() => setGoal("gain")}
        >
          <Text style={[styles.pickerText, goal === "gain" && styles.pickerTextActive]}>{t("goalGain")}</Text>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.label}>{t("dietPreference")}:</ThemedText>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[styles.pickerButton, diet === "balanced" && styles.pickerButtonActive]}
          onPress={() => setDiet("balanced")}
        >
          <Text style={[styles.pickerText, diet === "balanced" && styles.pickerTextActive]}>{t("dietBalanced")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, diet === "vegan" && styles.pickerButtonActive]}
          onPress={() => setDiet("vegan")}
        >
          <Text style={[styles.pickerText, diet === "vegan" && styles.pickerTextActive]}>{t("dietVegan")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, diet === "keto" && styles.pickerButtonActive]}
          onPress={() => setDiet("keto")}
        >
          <Text style={[styles.pickerText, diet === "keto" && styles.pickerTextActive]}>{t("dietKeto")}</Text>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.label}>{t("activityLevel")}:</ThemedText>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[styles.pickerButton, activityLevel === "sedentary" && styles.pickerButtonActive]}
          onPress={() => setActivityLevel("sedentary")}
        >
          <Text style={[styles.pickerText, activityLevel === "sedentary" && styles.pickerTextActive]}>{t("activitySedentary")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, activityLevel === "moderate" && styles.pickerButtonActive]}
          onPress={() => setActivityLevel("moderate")}
        >
          <Text style={[styles.pickerText, activityLevel === "moderate" && styles.pickerTextActive]}>{t("activityModerate")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pickerButton, activityLevel === "very_active" && styles.pickerButtonActive]}
          onPress={() => setActivityLevel("very_active")}
        >
          <Text style={[styles.pickerText, activityLevel === "very_active" && styles.pickerTextActive]}>{t("activityVeryActive")}</Text>
        </TouchableOpacity>
      </View>
      
      <Button
        title={loading ? "Creating account..." : "Sign up"}
        onPress={handleSignup}
        disabled={loading}
      />
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "stretch", gap: 12 },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { marginBottom: 12, textAlign: "center" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d265c",
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  pickerButtonActive: {
    backgroundColor: "#38b386",
    borderColor: "#38b386",
  },
  pickerText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  pickerTextActive: {
    color: "#fff",
    fontWeight: "600",
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
