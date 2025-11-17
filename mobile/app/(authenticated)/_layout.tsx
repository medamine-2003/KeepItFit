import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text, StyleSheet } from "react-native";
import { useLanguage } from "../../components/LanguageContext";
import { ChatAssistant } from "../../components/ChatAssistant";

const CustomHeader = ({ title }: { title: string }) => (
  <View style={styles.headerContainer}>
    <Image
      source={require("../../assets/images/logo.png")}
      style={styles.headerLogo}
      resizeMode="contain"
    />
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

export default function AuthenticatedLayout() {
  const { t } = useLanguage();
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#38b386",
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleAlign: "left",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t("home"),
            headerTitle: () => <CustomHeader title={t("home")} />,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: t("myPlan"),
            headerTitle: () => <CustomHeader title={t("myPlan")} />,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="fitness" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: t("activity"),
            headerTitle: () => <CustomHeader title={t("activity")} />,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="barbell" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: t("insights"),
            headerTitle: () => <CustomHeader title={t("insights")} />,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="analytics" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("profile"),
            headerTitle: () => <CustomHeader title={t("profile")} />,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <ChatAssistant />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0d265c",
  },
});
