import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  RefreshControl,
} from "react-native";
import api from "../../utils/api";
import { ThemedText } from "../../components/ThemedText";
import { CustomAlert } from "../../components/CustomAlert";

interface MealPlanDay {
  day: number;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface WorkoutDay {
  day: number;
  workout: string;
  duration: number;
}

interface Plan {
  daily_calories: number;
  bmr: number;
  tdee: number;
  goal: string;
  diet: string;
  meal_plan: MealPlanDay[];
  workout_routine: WorkoutDay[];
  wellness_score: number;
}

export default function PlanScreen() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
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

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await api.post("/plan/generate-plan");
      setPlan(response.data);
    } catch (error: any) {
      // Silent logging, show user-friendly alert only
      if (error?.response?.status === 401) {
        setAlert({
          visible: true,
          title: "Session Expired",
          message: "Please log in again to continue.",
          type: "warning",
        });
      } else if (error?.response?.status === 400) {
        setAlert({
          visible: true,
          title: "Incomplete Profile",
          message: error?.response?.data?.detail || "Please complete your profile to generate a plan.",
          type: "info",
        });
      } else if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
        setAlert({
          visible: true,
          title: "Connection Issue",
          message: "Unable to connect to the server. Please check your internet connection.",
          type: "error",
        });
      } else {
        setAlert({
          visible: true,
          title: "Unable to Generate Plan",
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await generatePlan();
    setRefreshing(false);
  };

  useEffect(() => {
    generatePlan();
  }, []);

  if (loading && !plan) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38b386" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.centered}>
        <ThemedText style={styles.emptyText}>
          Complete your profile to generate a personalized plan
        </ThemedText>
        <Button title="Generate Plan" onPress={generatePlan} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerText}>
          Your Personalized Plan
        </ThemedText>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>Daily Calories</ThemedText>
          <ThemedText style={styles.statValue}>
            {plan.daily_calories}
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>BMR</ThemedText>
          <ThemedText style={styles.statValue}>{plan.bmr}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>TDEE</ThemedText>
          <ThemedText style={styles.statValue}>{plan.tdee}</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Meal Plan ({plan.diet})
        </ThemedText>
        {plan.meal_plan.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <ThemedText style={styles.dayTitle}>Day {day.day}</ThemedText>
            <View style={styles.mealRow}>
              <ThemedText style={styles.mealLabel}>Breakfast:</ThemedText>
              <ThemedText style={styles.mealValue}>{day.breakfast}</ThemedText>
            </View>
            <View style={styles.mealRow}>
              <ThemedText style={styles.mealLabel}>Lunch:</ThemedText>
              <ThemedText style={styles.mealValue}>{day.lunch}</ThemedText>
            </View>
            <View style={styles.mealRow}>
              <ThemedText style={styles.mealLabel}>Dinner:</ThemedText>
              <ThemedText style={styles.mealValue}>{day.dinner}</ThemedText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Workout Routine
        </ThemedText>
        {plan.workout_routine.map((day) => (
          <View key={day.day} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <ThemedText style={styles.dayTitle}>Day {day.day}</ThemedText>
              <ThemedText style={styles.duration}>
                {day.duration} min
              </ThemedText>
            </View>
            <ThemedText style={styles.workoutText}>{day.workout}</ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Regenerate Plan" onPress={generatePlan} />
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#38b386",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
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
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38b386",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#38b386",
    marginBottom: 8,
  },
  mealRow: {
    paddingVertical: 4,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d265c",
  },
  mealValue: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  workoutCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: "#38b386",
    fontWeight: "600",
  },
  workoutText: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  buttonContainer: {
    margin: 20,
  },
});
