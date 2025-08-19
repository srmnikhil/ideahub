import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  ToastAndroid,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function IdeaSubmissionScreen({ navigation }) {
  const [startupName, setStartupName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const colorScheme = useColorScheme();

  // Input refs
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async () => {
    if (!startupName || !tagline || !description) {
      Alert.alert("Oops!", "Please fill all fields.");
      return;
    }

    const fakeRating = Math.floor(Math.random() * 101);

    const idea = {
      title: startupName,
      tagline,
      description,
      rating: fakeRating,
      votes: 0,
    };

    try {
      const response = await axios.post(
        "https://68a4099ec123272fb9b115b5.mockapi.io/api/v1/ideas",
        idea,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      ToastAndroid.show("Your idea has been submitted.", ToastAndroid.SHORT);

      // Clear form
      setStartupName("");
      setTagline("");
      setDescription("");

      // Navigate back with new idea
      navigation.navigate("Home", { newIdea: response.data });
    } catch (error) {
      ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-100 dark:bg-slate-700">
      {/* Header */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#6366f1", "#334155"]
            : ["#7dd3fc", "#f3f4f6"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-4 pt-8 pb-4"
      >
        <Text className="text-4xl font-bold text-gray-800 dark:text-white">
          Submit Your Startup Idea:
        </Text>
        <Text className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          Share your idea and get AI-powered feedback instantly.
        </Text>
      </LinearGradient>

      {/* Form */}
      <View className="p-5 space-y-4">
        {/* Startup Name */}
        <View>
          <Text className="mb-2 text-lg font-semibold text-gray-700 dark:text-white">Startup Name</Text>
          <TextInput
            className="w-full bg-white dark:bg-indigo-200 p-4 rounded-xl border border-gray-300"
            placeholder="Enter startup name"
            placeholderTextColor={colorScheme === "dark" ? "#334155" : "#6b7280"}
            value={startupName}
            onChangeText={setStartupName}
            returnKeyType="next"
            onSubmitEditing={() => taglineRef.current?.focus()}
          />
        </View>

        {/* Tagline */}
        <View>
          <Text className="mb-2 text-lg mt-4 font-semibold text-gray-700 dark:text-white">Tagline</Text>
          <TextInput
            ref={taglineRef}
            className="w-full bg-white dark:bg-indigo-200 p-4 rounded-xl border border-gray-300"
            placeholder="Enter tagline"
            placeholderTextColor={colorScheme === "dark" ? "#334155" : "#6b7280"}
            value={tagline}
            onChangeText={setTagline}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />
        </View>

        {/* Description */}
        <View>
          <Text className="mb-2 text-lg mt-4 font-semibold text-gray-700 dark:text-white">Description</Text>
          <TextInput
            ref={descriptionRef}
            className="w-full bg-white dark:bg-indigo-200 p-4 min-h-32 rounded-xl border border-gray-300 text-base"
            placeholder="Enter description"
            placeholderTextColor={colorScheme === "dark" ? "#334155" : "#6b7280"}
            value={description}
            onChangeText={setDescription}
            multiline
            blurOnSubmit={true}
            returnKeyType="done"
            onSubmitEditing={handleSubmit} // Press "Enter" here to submit
            style={{ textAlignVertical: "top" }}
          />
        </View>
      </View>

      {/* Submit Button */}
      <View className="px-5 pb-8 absolute bottom-20 w-full">
        <TouchableOpacity
          className="w-full border-2 border-indigo-600 dark:border-red-500 dark:border-0 dark:bg-red-800 p-4 rounded-full"
          onPress={handleSubmit}
        >
          <Text className="text-indigo-600 dark:text-white font-extrabold text-center text-xl">
            Submit Idea
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
