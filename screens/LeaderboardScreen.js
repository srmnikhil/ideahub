import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("top"); // "top" or "upvotes"

  useEffect(() => {
    // Replace with your actual MockAPI URL:
    const url = "https://68a4099ec123272fb9b115b5.mockapi.io/api/v1/ideas";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setIdeas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Sort ideas based on selectedFilter
  const sortedIdeas = [...ideas].sort((a, b) =>
    selectedFilter === "top" ? b.rating - a.rating : b.votes - a.votes
  );

  const top3 = sortedIdeas.slice(0, 3);
  const rest = sortedIdeas.slice(3);

  const podiumColors = {
    0: ["#FCD34D", "#F59E0B"], // gold
    1: ["#A5B4FC", "#4338CA"], // silver
    2: ["#FBBF24", "#B45309"], // bronze
  };

  const rankEmojis = ["🥇", "🥈", "🥉"];

  const renderPodiumCard = (item, index) => (
    <LinearGradient
      key={item.id}
      colors={podiumColors[index]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className={`flex-1 mx-1 rounded-xl justify-center items-center shadow-lg`}
      style={{
        height: index === 0 ? 140 : index === 1 ? 110 : 90,
      }}
    >
      <Text className="text-4xl">{rankEmojis[index]}</Text>
      <Text className="mt-2 font-extrabold text-white text-lg">{item.title}</Text>
      <Text className="text-white text-sm mt-1">
        {selectedFilter === "top" ? `⭐ ${item.rating}` : `❤️ ${item.votes}`}
      </Text>
    </LinearGradient>
  );

  const renderRest = ({ item, index }) => (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["#334155", "#1e293b"]
          : ["#f3f4f6", "#C7D2FE"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-row justify-between bg-slate items-center mb-3 px-4 py-3 rounded-xl shadow-md"
    >
      <View className="flex-row items-center space-x-3">
        <View
          className="w-8 h-8 rounded-full justify-center items-center"
          style={{
            backgroundColor: selectedFilter === "top" ? "#6366F1" : "#F43F5E",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 4,
          }}
        >
          <Text className="text-white font-bold">{index + 4}</Text>
        </View>
        <Text
          className={`text-lg font-semibold ml-1 ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {item.title}
        </Text>
      </View>
      <Text
        className={`font-semibold ${
          colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {selectedFilter === "top" ? `⭐ ${item.rating}` : `❤️ ${item.votes}`}
      </Text>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-slate-700">
        <LottieView
          source={require('../assets/animations/loader.json')} // 👈 path to your animation
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text className="text-lg font-semibold mt-4 text-gray-700 dark:text-white">
          Loading leaderboard (This Week)
        </Text>
      </View>
    );
  }

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600">{error}</Text>
      </View>
    );

  return (
    <View
      className={`flex-1 ${
        colorScheme === "dark" ? "bg-slate-700" : "bg-gray-100"
      }`}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#6366f1", "#334155"]
            : ["#7dd3fc", "#f3f4f6"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-4 pt-8 pb-4 shadow-lg"
      >
        <Text
          className={`text-4xl font-extrabold ${
            colorScheme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Leaderboard (This Week)
        </Text>
        <Text
          className={`mt-1 text-sm font-medium ${
            colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Sorted by {selectedFilter === "top" ? "Top Rating" : "Most Votes"}
        </Text>
      </LinearGradient>

      {/* Filter Buttons */}
      <View className="flex-row px-4 py-4">
        <TouchableOpacity
          onPress={() => setSelectedFilter("top")}
          className={`px-4 py-2 rounded-full mr-3 shadow-md ${
            selectedFilter === "top"
              ? "bg-indigo-500 dark:bg-red-800"
              : "bg-white/90 dark:bg-slate-600"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              selectedFilter === "top"
                ? "text-white font-bold"
                : colorScheme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Top Rated
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedFilter("upvotes")}
          className={`px-4 py-2 rounded-full shadow-md ${
            selectedFilter === "upvotes"
              ? "bg-indigo-500 dark:bg-red-800"
              : "bg-white/90 dark:bg-slate-600"
          }`}
        >
          <Text
            className={`font-semibold text-center ${
              selectedFilter === "upvotes"
                ? "text-white font-bold"
                : colorScheme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Most Upvotes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row justify-between items-end mb-8">
          {top3.map((item, index) => renderPodiumCard(item, index))}
        </View>

        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          renderItem={renderRest}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </View>
  );
}
