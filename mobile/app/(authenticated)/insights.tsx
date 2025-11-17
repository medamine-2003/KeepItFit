import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { CustomAlert } from "../../components/CustomAlert";
import api from "../../utils/api";
import { Ionicons } from "@expo/vector-icons";

interface MealInsight {
  id: number;
  image_uri: string | null;
  analysis_data: {
    description?: string;
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    rating?: number;
    suggestion?: string;
  };
  date: string;
}

export default function InsightsScreen() {
  const [insights, setInsights] = useState<MealInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchInsights = async () => {
    try {
      const res = await api.get("/activity/meal-insights");
      setInsights(res.data || []);
    } catch (error: any) {
      console.error("Fetch insights error:", error);
      setAlert({
        visible: true,
        title: "Error",
        message: error?.response?.data?.detail || "Failed to load insights",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>
          Meal Insights
        </ThemedText>
      </View>

      {loading ? (
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#38b386" />
        </View>
      ) : insights.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={60} color="#ccc" />
          <ThemedText style={styles.emptyText}>
            No meal insights yet. Analyze your first meal to see insights!
          </ThemedText>
        </View>
      ) : (
        <View style={styles.insightsList}>
          {insights.map((item) => (
            <View key={item.id} style={styles.insightCard}>
              {item.image_uri && (
                <Image
                  source={{ uri: item.image_uri }}
                  style={styles.mealImage}
                />
              )}
              <View style={styles.insightContent}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Ionicons name="nutrition" size={18} color="#38b386" />
                  <ThemedText
                    style={{ marginLeft: 6, fontWeight: "600", fontSize: 16 }}
                  >
                    {item.analysis_data.description || "Meal"}
                  </ThemedText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <ThemedText style={styles.macroText}>
                    🔥 {item.analysis_data.calories ?? "—"}
                  </ThemedText>
                  <ThemedText style={styles.macroText}>
                    🥩 {item.analysis_data.protein_g ?? "—"}g
                  </ThemedText>
                  <ThemedText style={styles.macroText}>
                    🍞 {item.analysis_data.carbs_g ?? "—"}g
                  </ThemedText>
                  <ThemedText style={styles.macroText}>
                    🥑 {item.analysis_data.fat_g ?? "—"}g
                  </ThemedText>
                </View>
                {item.analysis_data.rating && (
                  <ThemedText style={styles.ratingText}>
                    ⭐ {item.analysis_data.rating}/10
                  </ThemedText>
                )}
                {item.analysis_data.suggestion && (
                  <ThemedText style={styles.tipText}>
                    💡 {item.analysis_data.suggestion}
                  </ThemedText>
                )}
                <ThemedText style={styles.dateText}>
                  {new Date(item.date).toLocaleDateString()} at{" "}
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

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
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  insightsList: {
    padding: 16,
  },
  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  mealImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  insightContent: {
    padding: 16,
  },
  macroText: {
    fontSize: 13,
    color: "#333",
  },
  ratingText: {
    fontSize: 14,
    marginTop: 6,
    color: "#0d265c",
  },
  tipText: {
    fontSize: 13,
    marginTop: 6,
    color: "#555",
    fontStyle: "italic",
  },
  dateText: {
    fontSize: 11,
    marginTop: 8,
    color: "#999",
  },
});
