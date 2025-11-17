import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { AuthContext } from "../../components/AuthContext";
import { useLanguage } from "../../components/LanguageContext";
import { ThemedText } from "../../components/ThemedText";
import { CustomAlert } from "../../components/CustomAlert";

export default function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const { language, setLanguage, t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [diet, setDiet] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [localImageUri, setLocalImageUri] = useState("");
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
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    if (user) {
      setAge(user.age?.toString() || "");
      setWeight(user.weight?.toString() || "");
      setHeight(user.height?.toString() || "");
      setGoal(user.goal || "");
      setDiet(user.diet || "");
      setActivityLevel(user.activity_level || "");
      setHealthConditions(user.health_conditions || "");
      setProfilePicture(user.profile_picture || "");
      setLocalImageUri(""); // Clear local preview when user data loads
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updateData: any = {};
      if (age) updateData.age = parseInt(age, 10);
      if (weight) updateData.weight = parseInt(weight, 10);
      if (height) updateData.height = parseInt(height, 10);
      if (goal) updateData.goal = goal;
      if (diet) updateData.diet = diet;
      if (activityLevel) updateData.activity_level = activityLevel;
      if (healthConditions) updateData.health_conditions = healthConditions;

      await api.post("/auth/update-profile", updateData);
      setAlert({
        visible: true,
        title: "Success!",
        message: "Profile updated successfully!",
        type: "success",
      });
      setEditing(false);
      // Refresh user data
      const response = await api.get("/auth/me");
      // Update context if needed
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setAlert({
        visible: true,
        title: "Update Failed",
        message: error?.response?.data?.detail || "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setConfirmSignOut(true);
  };

  const confirmSignOutAction = async () => {
    setConfirmSignOut(false);
    await signOut();
    router.replace("/welcome");
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      setAlert({
        visible: true,
        title: "Permission Required",
        message: "Please grant camera roll permissions to upload a profile picture",
        type: "warning",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // Show local preview immediately
      setLocalImageUri(result.assets[0].uri);
      await uploadProfilePicture(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "profile.jpg";
      
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: filename,
      } as any);

      const response = await api.post("/auth/upload-profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      const uploadedUrl = response.data.profile_picture;
      console.log("Profile picture URL:", uploadedUrl);
      
      // Add cache-busting query parameter
      const urlWithTimestamp = `${uploadedUrl}?t=${Date.now()}`;
      setProfilePicture(urlWithTimestamp);
      setLocalImageUri(""); // Clear local preview after successful upload
      
      console.log("Setting profile picture to:", urlWithTimestamp);
      
      setAlert({
        visible: true,
        title: "Success",
        message: "Profile picture updated!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      setLocalImageUri(""); // Clear local preview on error
      setAlert({
        visible: true,
        title: "Upload Failed",
        message: error?.response?.data?.detail || "Failed to upload profile picture",
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>
          Profile
        </ThemedText>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        <TouchableOpacity onPress={handlePickImage} style={styles.profilePictureContainer}>
          {uploadingImage ? (
            <View style={styles.profilePicturePlaceholder}>
              <ActivityIndicator size="large" color="#38b386" />
            </View>
          ) : localImageUri ? (
            <Image source={{ uri: localImageUri }} style={styles.profilePicture} />
          ) : profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <ThemedText style={styles.profilePicturePlaceholderText}>+</ThemedText>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickImage}>
          <ThemedText style={styles.changePhotoText}>
            {profilePicture || localImageUri ? t("changePhoto") : t("addPhoto")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>{t("username")}:</ThemedText>
          <ThemedText style={styles.value}>
            {user?.username || "N/A"}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>{t("email")}:</ThemedText>
          <ThemedText style={styles.value}>{user?.email || "N/A"}</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>
            {t("personalInfo")}
          </ThemedText>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <ThemedText style={styles.editButton}>{t("editProfile")}</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View>
            <ThemedText style={styles.inputLabel}>Age</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <ThemedText style={styles.inputLabel}>Weight (kg)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Weight in kg"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />

            <ThemedText style={styles.inputLabel}>Height (cm)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Height in cm"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <ThemedText style={styles.inputLabel}>
              Goal (lose/maintain/gain)
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="lose, maintain, or gain"
              value={goal}
              onChangeText={setGoal}
            />

            <ThemedText style={styles.inputLabel}>
              Diet (balanced/vegan/keto)
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="balanced, vegan, or keto"
              value={diet}
              onChangeText={setDiet}
            />

            <ThemedText style={styles.inputLabel}>Activity Level</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="sedentary, light, moderate, very_active, extra_active"
              value={activityLevel}
              onChangeText={setActivityLevel}
            />

            <ThemedText style={styles.inputLabel}>Health Conditions</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any health conditions (optional)"
              value={healthConditions}
              onChangeText={setHealthConditions}
              multiline
              numberOfLines={3}
            />

            <View style={styles.buttonRow}>
              <View style={styles.button}>
                <Button
                  title={t("cancel")}
                  onPress={() => setEditing(false)}
                  color="#666"
                />
              </View>
              <View style={styles.button}>
                <Button
                  title={loading ? t("saving") : t("save")}
                  onPress={handleUpdateProfile}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Age:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.age || "Not set"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Weight:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.weight ? `${user.weight} kg` : "Not set"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Height:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.height ? `${user.height} cm` : "Not set"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Goal:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.goal
                  ? user.goal.charAt(0).toUpperCase() + user.goal.slice(1)
                  : "Not set"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Diet:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.diet
                  ? user.diet.charAt(0).toUpperCase() + user.diet.slice(1)
                  : "Not set"}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Activity Level:</ThemedText>
              <ThemedText style={styles.value}>
                {user?.activity_level || "Not set"}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Language Switcher Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>
            {t("language")}
          </ThemedText>
        </View>
        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "en" && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage("en")}
          >
            <Ionicons
              name="language"
              size={20}
              color={language === "en" ? "#fff" : "#38b386"}
              style={styles.languageIcon}
            />
            <Text
              style={[
                styles.languageText,
                language === "en" && styles.languageTextActive,
              ]}
            >
              {t("english")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "ar" && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage("ar")}
          >
            <Ionicons
              name="language"
              size={20}
              color={language === "ar" ? "#fff" : "#38b386"}
              style={styles.languageIcon}
            />
            <Text
              style={[
                styles.languageText,
                language === "ar" && styles.languageTextActive,
              ]}
            >
              {t("arabic")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signOutSection}>
        <Button title={t("signOut")} onPress={handleSignOut} color="#dc3545" />
      </View>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      <CustomAlert
        visible={confirmSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        type="warning"
        confirmText="Sign Out"
        onClose={() => {
          if (confirmSignOut) {
            confirmSignOutAction();
          } else {
            setConfirmSignOut(false);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#38b386",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d265c",
  },
  editButton: {
    color: "#38b386",
    fontSize: 16,
    fontWeight: "600",
  },
  profilePictureSection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profilePictureContainer: {
    marginBottom: 12,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#38b386",
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#38b386",
    borderStyle: "dashed",
  },
  profilePicturePlaceholderText: {
    fontSize: 48,
    color: "#999",
  },
  changePhotoText: {
    color: "#38b386",
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d265c",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d265c",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
  signOutSection: {
    margin: 20,
    marginTop: 0,
  },
  languageContainer: {
    flexDirection: "row",
    gap: 12,
  },
  languageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#38b386",
    backgroundColor: "#fff",
  },
  languageButtonActive: {
    backgroundColor: "#38b386",
    borderColor: "#38b386",
  },
  languageIcon: {
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38b386",
  },
  languageTextActive: {
    color: "#fff",
  },
});
