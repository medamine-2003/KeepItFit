import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Animated } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "../../components/ThemedText";
import { CustomAlert } from "../../components/CustomAlert";
import api from "../../utils/api";
import { Ionicons } from "@expo/vector-icons";

const ACTIVITY_PRESETS = [
  { name: "Running", duration: 30 },
  { name: "Walking", duration: 30 },
  { name: "Cycling", duration: 45 },
  { name: "Swimming", duration: 30 },
  { name: "Yoga", duration: 45 },
  { name: "Weight Training", duration: 60 },
  { name: "HIIT", duration: 20 },
];

export default function ActivityScreen() {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
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

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [aiAnalysisText, setAiAnalysisText] = useState<string | null>(null);
  const [aiAnalysisObj, setAiAnalysisObj] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Recipe generator states
  const [ingredients, setIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null);
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  
  const [weeklyStats, setWeeklyStats] = useState<{
    totalMinutes: number;
    totalActivities: number;
    caloriesBurned: number;
    streak: number;
  }>({ totalMinutes: 0, totalActivities: 0, caloriesBurned: 0, streak: 0 });

  const analysisOpacity = useRef(new Animated.Value(0));

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      const res = await api.get("/activity/stats");
      setWeeklyStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDurationChange = (txt: string) => {
    const digits = txt.replace(/\D/g, "");
    if (!digits) {
      setDuration("");
      return;
    }
    let n = parseInt(digits, 10);
    if (isNaN(n)) {
      setDuration("");
      return;
    }
    n = Math.max(1, Math.min(300, n));
    setDuration(String(n));
  };

  const handleTrackActivity = async (
    activityName?: string,
    activityDuration?: number
  ) => {
    const finalActivity = activityName || activity;
    const finalDuration = activityDuration || parseInt(duration, 10);

    if (!finalActivity || !finalDuration) {
      setAlert({
        visible: true,
        title: "Missing Information",
        message: "Please enter both activity name and duration",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/activity/track-activity", {
        activity: finalActivity,
        duration: finalDuration,
      });
      setAlert({
        visible: true,
        title: "Success!",
        message: "Activity tracked successfully!",
        type: "success",
      });
      setActivity("");
      setDuration("");
      fetchWeeklyStats();
    } catch (error: any) {
      console.error("Error tracking activity:", error);
      setAlert({
        visible: true,
        title: "Error",
        message: error?.response?.data?.detail || "Failed to track activity",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAiAnalysisText(null);
      setAiAnalysisObj(null);
      analysisOpacity.current.setValue(0);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      setAlert({
        visible: true,
        title: "No Image",
        message: "Please select a meal photo first",
        type: "warning",
      });
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("file", {
        uri: imageUri,
        name: `meal.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      const res = await api.post("/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const analysis = res.data?.analysis;
      const analysisText =
        typeof analysis === "string"
          ? analysis
          : analysis?.text || analysis?.note;
      setAiAnalysisText(analysisText || null);
      setAiAnalysisObj(
        typeof analysis === "object" && !analysis?.text && !analysis?.note
          ? analysis
          : null
      );
      Animated.timing(analysisOpacity.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (analysis?.note || analysis?.text) {
        setAlert({
          visible: true,
          title: "Info",
          message: analysisText || "Analysis completed with limited data",
          type: "info",
        });
      } else {
        setAlert({
          visible: true,
          title: "Analysis Ready",
          message: "Meal analysis generated.",
          type: "success",
        });
      }
    } catch (error: any) {
      setAlert({
        visible: true,
        title: "Upload Failed",
        message:
          error?.response?.data?.detail || "Failed to analyze meal image",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setAlert({
        visible: true,
        title: "No Ingredients",
        message: "Please enter available ingredients",
        type: "warning",
      });
      return;
    }

    setGeneratingRecipe(true);
    try {
      const response = await api.post("/plan/generate-recipe", {
        ingredients: ingredients.trim(),
      });
      setGeneratedRecipe(response.data);
      setAlert({
        visible: true,
        title: "Recipe Ready!",
        message: `${response.data.recipe_name} has been generated`,
        type: "success",
      });
    } catch (error: any) {
      setAlert({
        visible: true,
        title: "Generation Failed",
        message: error?.response?.data?.detail || "Unable to generate recipe",
        type: "error",
      });
    } finally {
      setGeneratingRecipe(false);
    }
  };

  const pickCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== "granted") {
      setAlert({
        visible: true,
        title: "Permission required",
        message: "Camera access is needed.",
        type: "warning",
      });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAiAnalysisText(null);
      setAiAnalysisObj(null);
      analysisOpacity.current.setValue(0);
    }
  };
  const selectPreset = (preset: { name: string; duration: number }) => {
    setActivity(preset.name);
    setDuration(preset.duration.toString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>
          Track Your Activity
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#ff6b6b" />
          <ThemedText style={styles.statNumber}>
            {weeklyStats.caloriesBurned}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Cal Burned</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#4ecdc4" />
          <ThemedText style={styles.statNumber}>
            {weeklyStats.totalMinutes}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Minutes</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="barbell" size={24} color="#38b386" />
          <ThemedText style={styles.statNumber}>
            {weeklyStats.totalActivities}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Activities</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#ffd93d" />
          <ThemedText style={styles.statNumber}>
            {weeklyStats.streak}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Quick Activities</ThemedText>
        <View style={styles.presetContainer}>
          {ACTIVITY_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetButton}
              onPress={() => selectPreset(preset)}
            >
              <ThemedText style={styles.presetName}>{preset.name}</ThemedText>
              <ThemedText style={styles.presetDuration}>
                {preset.duration} min
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formSection}>
        <ThemedText style={styles.sectionTitle}>Custom Activity</ThemedText>

        <ThemedText style={styles.label}>Activity Name</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g., Running, Cycling"
          value={activity}
          onChangeText={setActivity}
        />

        <ThemedText style={styles.label}>Duration (minutes)</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g., 30"
          value={duration}
          onChangeText={handleDurationChange}
          keyboardType="numeric"
        />

        <View
          style={[
            styles.buttonContainer,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <Button
            title={loading ? "Tracking..." : "Track Activity"}
            onPress={() => handleTrackActivity()}
            disabled={loading}
          />
          {loading && (
            <ActivityIndicator
              style={{ marginLeft: 12 }}
              size="small"
              color="#38b386"
            />
          )}
        </View>
      </View>

      <View style={styles.formSection}>
        <ThemedText style={styles.sectionTitle}>Meal Analyzer</ThemedText>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="images" size={20} color="#fff" />
              <ThemedText style={styles.imageButtonText}>Gallery</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={pickCamera}>
              <Ionicons name="camera" size={20} color="#fff" />
              <ThemedText style={styles.imageButtonText}>Camera</ThemedText>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={[
                  styles.imageButton,
                  { backgroundColor: uploading ? "#ccc" : "#38b386" },
                ]}
                onPress={uploadImage}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="analytics" size={20} color="#fff" />
                )}
                <ThemedText style={styles.imageButtonText}>
                  {uploading ? "Analyzing..." : "Analyze Meal"}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
          {aiAnalysisObj ? (
            <Animated.View
              style={[styles.analysisBox, { opacity: analysisOpacity.current }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="nutrition" size={20} color="#38b386" />
                <ThemedText style={{ marginLeft: 8, fontWeight: "600" }}>
                  {aiAnalysisObj.description || "Meal analysis"}
                </ThemedText>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText>
                  Calories: {aiAnalysisObj.calories ?? "—"}
                </ThemedText>
                <ThemedText>
                  Protein: {aiAnalysisObj.protein_g ?? "—"}g
                </ThemedText>
                <ThemedText>Carbs: {aiAnalysisObj.carbs_g ?? "—"}g</ThemedText>
                <ThemedText>Fat: {aiAnalysisObj.fat_g ?? "—"}g</ThemedText>
              </View>
              <View style={{ marginTop: 8 }}>
                <ThemedText>
                  Rating: {aiAnalysisObj.rating ?? "—"}/10
                </ThemedText>
                <ThemedText>Tip: {aiAnalysisObj.suggestion || "—"}</ThemedText>
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  try {
                    await api.post("/activity/meal-analysis", {
                      image_uri: imageUri,
                      analysis: aiAnalysisObj,
                    });
                    setAlert({
                      visible: true,
                      title: "Saved",
                      message: "Meal analysis saved to your insights!",
                      type: "success",
                    });
                  } catch (e: any) {
                    setAlert({
                      visible: true,
                      title: "Error",
                      message: e?.response?.data?.detail || "Failed to save",
                      type: "error",
                    });
                  }
                }}
              >
                <Ionicons name="save-outline" size={18} color="#fff" />
                <ThemedText style={{ color: "#fff", marginLeft: 6 }}>
                  Save to Insights
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          ) : aiAnalysisText ? (
            <View style={styles.analysisBox}>
              <ThemedText>{aiAnalysisText}</ThemedText>
            </View>
          ) : null}
        </View>
      </View>

      {/* Recipe Generator Section */}
      <View style={styles.formSection}>
        <ThemedText style={styles.sectionTitle}>🍳 Recipe Generator</ThemedText>
        <ThemedText style={styles.label}>Available Ingredients</ThemedText>
        <TextInput
          style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
          placeholder="e.g., chicken, tomatoes, onions, olive oil, harissa..."
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
        <View style={styles.buttonContainer}>
          <Button
            title={generatingRecipe ? "Generating..." : "Generate Healthy Recipe"}
            onPress={generateRecipe}
            disabled={generatingRecipe}
          />
        </View>
        
        {generatedRecipe && (
          <View style={styles.recipeCard}>
            <ThemedText style={styles.recipeName}>
              {generatedRecipe.recipe_name}
            </ThemedText>
            <ThemedText style={styles.recipeInfo}>
              🍽️ {generatedRecipe.servings} servings • ⏱️ {generatedRecipe.prep_time} + {generatedRecipe.cook_time}
            </ThemedText>
            
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>
                  {generatedRecipe.nutrition?.calories}
                </ThemedText>
                <ThemedText style={styles.nutritionLabel}>Cal</ThemedText>
              </View>
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>
                  {generatedRecipe.nutrition?.protein_g}g
                </ThemedText>
                <ThemedText style={styles.nutritionLabel}>Protein</ThemedText>
              </View>
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>
                  {generatedRecipe.nutrition?.carbs_g}g
                </ThemedText>
                <ThemedText style={styles.nutritionLabel}>Carbs</ThemedText>
              </View>
              <View style={styles.nutritionItem}>
                <ThemedText style={styles.nutritionValue}>
                  {generatedRecipe.nutrition?.fat_g}g
                </ThemedText>
                <ThemedText style={styles.nutritionLabel}>Fat</ThemedText>
              </View>
            </View>

            <ThemedText style={styles.recipeSection}>Ingredients:</ThemedText>
            {generatedRecipe.ingredients?.map((ing: string, i: number) => (
              <ThemedText key={i} style={styles.recipeItem}>• {ing}</ThemedText>
            ))}

            <ThemedText style={styles.recipeSection}>Instructions:</ThemedText>
            {generatedRecipe.instructions?.map((step: string, i: number) => (
              <ThemedText key={i} style={styles.recipeItem}>
                {i + 1}. {step}
              </ThemedText>
            ))}

            {generatedRecipe.health_benefits && (
              <View style={styles.healthBenefits}>
                <ThemedText style={styles.benefitsText}>
                  💚 {generatedRecipe.health_benefits}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <ThemedText style={styles.infoTitle}>💡 Tip</ThemedText>
        <ThemedText style={styles.infoText}>
          Regular physical activity helps improve your wellness score and keeps
          you on track with your fitness goals!
        </ThemedText>
      </View>

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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0d265c",
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  presetButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  presetName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d265c",
    marginBottom: 4,
  },
  presetDuration: {
    fontSize: 12,
    color: "#38b386",
  },
  formSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d265c",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginTop: 20,
  },
  infoSection: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: "#e7f3ff",
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d265c",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#004085",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  analysisBox: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
  },
  saveButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38b386",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d265c",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38b386",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  recipeCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38b386",
    marginBottom: 8,
  },
  recipeInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d265c",
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  recipeSection: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d265c",
    marginTop: 16,
    marginBottom: 8,
  },
  recipeItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  healthBenefits: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: "#2e7d32",
    lineHeight: 20,
  },
});
