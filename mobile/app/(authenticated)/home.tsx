import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import api from "../../utils/api";
import { AuthContext } from "../../components/AuthContext";
import { ThemedText } from "../../components/ThemedText";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<
    { activity: string; duration: number; date?: string }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchWellnessScore = async () => {
    try {
      const response = await api.get("/plan/wellness-score");
      setWellnessScore(response.data.wellness_score);
    } catch (error) {
      // Silent error - wellness score will show as "--"
      setWellnessScore(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchRecent = async () => {
    try {
      const res = await api.get("/activity/recent");
      setRecent(res.data || []);
    } catch (e) {
      // Silent error - recent activities will show empty
      setRecent([]);
    }
  };
  useEffect(() => {
    fetchWellnessScore();
    fetchRecent();
  }, []);

  // duplicate removed
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38b386" />
      </View>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchWellnessScore(), fetchRecent()]);
    setRefreshing(false);
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.greeting}>
          Welcome back, {user?.username || "User"}!
        </ThemedText>
      </View>

      <View style={styles.scoreCard}>
        <ThemedText style={styles.scoreLabel}>Your Wellness Score</ThemedText>
        <ThemedText style={styles.scoreValue}>
          {wellnessScore !== null ? wellnessScore : "--"}
        </ThemedText>
        <ThemedText style={styles.scoreSubtext}>out of 100</ThemedText>
      </View>

      <View style={styles.infoSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Quick Stats
        </ThemedText>

        {user?.age && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Age:</ThemedText>
            <ThemedText style={styles.statValue}>{user.age} years</ThemedText>
          </View>
        )}

        {user?.weight && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Weight:</ThemedText>
            <ThemedText style={styles.statValue}>{user.weight} kg</ThemedText>
          </View>
        )}

        {user?.height && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Height:</ThemedText>
            <ThemedText style={styles.statValue}>{user.height} cm</ThemedText>
          </View>
        )}

        {user?.goal && (
          <View style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Goal:</ThemedText>
            <ThemedText style={styles.statValue}>
              {user.goal.charAt(0).toUpperCase() + user.goal.slice(1)}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.infoSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Recent Activities
        </ThemedText>
        {recent.map((a, i) => (
          <View key={i} style={styles.statRow}>
            <ThemedText style={styles.statLabel}>{a.activity}</ThemedText>
            <ThemedText style={styles.statValue}>{a.duration} min</ThemedText>
          </View>
        ))}
        <TouchableOpacity onPress={() => {}} style={{ marginTop: 12 }}>
          <ThemedText type="link">View all</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Today&apos;s Tip
        </ThemedText>
        <ThemedText style={styles.tipText}>
          Stay hydrated! Aim to drink at least 8 glasses of water throughout the
          day.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#38b386",
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
  },
  scoreCard: {
    margin: 20,
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#38b386",
  },
  scoreSubtext: {
    fontSize: 14,
    color: "#999",
  },
  infoSection: {
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
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d265c",
  },
  tipsSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#fff3cd",
    borderRadius: 16,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#856404",
  },
});
