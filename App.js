import React, { useEffect, useState } from "react";
import { Alert, AppState } from "react-native";
import * as Updates from "expo-updates";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import IdeaSubmissionScreen from "./screens/IdeaSubmissionScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import GetStartedScreen from "./screens/GetStartedScreen"; // Import the new screen

const Tab = createBottomTabNavigator();

const STORAGE_KEY = 'hasStarted';

export default function App() {
  const colorScheme = useColorScheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(null); // null while loading

  // Check if user already clicked Get Started before
  const checkStarted = async () => {
    try {
      const started = await AsyncStorage.getItem(STORAGE_KEY);
      setShowGetStarted(started !== 'true');
    } catch (e) {
      setShowGetStarted(true); // fallback: show get started screen
    }
  };

  useEffect(() => {
    checkStarted();
  }, []);

  // Auto-hide get started after 3 seconds
  useEffect(() => {
    if (showGetStarted === true) {
      const timer = setTimeout(() => {
        onGetStartedPress();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showGetStarted]);

  const onGetStartedPress = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      console.log("Failed to save start state", e);
    }
    setShowGetStarted(false);
  };

  const showUpdateAlert = () => {
    if (isUpdating) return;

    Alert.alert(
      "Update Available",
      "A new version of the app is available. Restart to update now?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: async () => {
            try {
              setIsUpdating(true);
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            } catch (e) {
              console.log("Update fetch/reload failed:", e);
              Alert.alert("Update Failed", "Unable to update the app right now.");
              setIsUpdating(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const checkForUpdates = async () => {
    if (__DEV__) return; // Don't check in development
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        showUpdateAlert();
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkForUpdates();
      }
    });

    return () => subscription.remove();
  }, []);

  if (showGetStarted === null) {
    // Still loading the AsyncStorage check, you can show a loader here if you want
    return null;
  }

  if (showGetStarted === true) {
    return <GetStartedScreen onGetStarted={onGetStartedPress} />;
  }

  // Once GetStarted is done, show main app
  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />

      <NavigationContainer>
        {/* Top gradient background */}
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["#6366f1", "#6366f1"]
              : ["#38bdf8", "#e0f2fe"]
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 100,
            zIndex: -1,
          }}
        />

        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarShowLabel: true,
              tabBarActiveTintColor:
                colorScheme === "dark" ? "#991B1B" : "#6366f1",
              tabBarInactiveTintColor: "#6b7280",
              tabBarLabelStyle: {
                fontWeight: "800",
                fontSize: 12,
                color:
                  colorScheme === "dark" ? "#ffffff" : "#111827", // Optional override
              },
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "Home") iconName = "home";
                else if (route.name === "Submit") iconName = "add-circle";
                else if (route.name === "Leaderboard") iconName = "trophy";
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarStyle: {
                position: "absolute",
                bottom: 20,
                marginLeft: 20,
                marginRight: 20,
                height: 60,
                borderRadius: 30,
                backgroundColor:
                  colorScheme === "dark" ? "#000000" : "#ffffff",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                borderTopWidth: 0,
                paddingTop: 5,
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Submit" component={IdeaSubmissionScreen} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
