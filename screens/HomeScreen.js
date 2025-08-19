import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ToastAndroid,
  ActivityIndicator,
  Vibration,
  Share
} from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your MockAPI endpoint
const API_URL = "https://68a4099ec123272fb9b115b5.mockapi.io/api/v1/ideas";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState({});
  const [selectedFilter, setSelectedFilter] = useState("top");
  const [expandedItems, setExpandedItems] = useState({});
  const [readMoreAvailable, setReadMoreAvailable] = useState({});

  // Load liked items from AsyncStorage
  useEffect(() => {
    loadLikedItems();
    fetchIdeas();
  }, []);

  // Load from AsyncStorage on app start
  const loadLikedItems = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem("likedItems");
      if (storedLikes) {
        setLikedItems(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error("Failed to load liked items", error);
    }
  };

  const saveLikedItems = async (items) => {
    try {
      await AsyncStorage.setItem("likedItems", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save liked items", error);
    }
  };

  const fetchIdeas = async () => {
    try {
      const response = await axios.get(API_URL);
      setIdeas(response.data);
    } catch (error) {
      console.error("Failed to fetch ideas:", error);
      ToastAndroid.show("Failed to load ideas", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (idea) => {
    try {
      const message = `🚀 Startup Idea: ${idea.title}\n\n💡 Tagline: ${idea.tagline}\n\n📄 Description: ${idea.description}\n\n⭐️ Rating: ${idea.rating} | 🗳 Votes: ${idea.votes}`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      ToastAndroid.show("Sharing failed!", ToastAndroid.SHORT);
    }
  };

  const handleUpvote = async (id) => {
    const isLiked = likedItems[id] || false;

    // Prevent multiple likes (like once per device)
    if (isLiked) {
      ToastAndroid.show("Already liked this idea.", ToastAndroid.SHORT);
      return;
    }

    const idea = ideas.find((item) => item.id === id);
    if (!idea) return;

    const updatedVotes = idea.votes + 1;

    try {
      await axios.patch(`${API_URL}/${id}`, {
        votes: updatedVotes,
      });

      const updatedLikedItems = {
        ...likedItems,
        [id]: true,
      };

      setIdeas((prevIdeas) =>
        prevIdeas.map((item) =>
          item.id === id ? { ...item, votes: updatedVotes } : item
        )
      );

      setLikedItems(updatedLikedItems);
      saveLikedItems(updatedLikedItems);
      Vibration.vibrate(50);
      ToastAndroid.show("You liked this idea!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Failed to update votes:", error);
      ToastAndroid.show("Failed to update vote", ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItems[item.id] || false;
    const isReadMore = readMoreAvailable[item.id] || false;

    return (
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#334155", "#1e293b"]
            : ["#f3f4f6", "#C7D2FE"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mb-4 rounded-xl shadow-md px-4 py-4"
        style={{ overflow: "hidden" }}
      >
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-yellow-600">
            AI Rating: {item.rating} ★
          </Text>
          <Text className="text-sm text-orange-600">
            Votes: {item.votes}
          </Text>
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          {item.title}
        </Text>
        <Text className="text-sm italic text-gray-800 dark:text-slate-200">
          {item.tagline}
        </Text>

        <Text
          className="mt-2 text-md leading-5 text-justify text-gray-800 dark:text-slate-300"
          numberOfLines={isExpanded ? undefined : 3}
          onTextLayout={(e) => {
            if (
              e.nativeEvent.lines.length > 3 &&
              !readMoreAvailable[item.id]
            ) {
              setReadMoreAvailable((prev) => ({
                ...prev,
                [item.id]: true,
              }));
            }
          }}
        >
          <Text className="font-bold">About us: </Text>
          {item.description}
        </Text>

        <View className="flex-row justify-between items-center mt-3">
          {/* Like Button */}
          <View className="flex-row space-x-4 items-center">
            <TouchableOpacity
              onPress={() => handleUpvote(item.id)}
              className="flex-row items-center px-2 rounded-full"
            >
              <AntDesign
                name={likedItems[item.id] ? "heart" : "hearto"}
                size={28}
                color={
                  likedItems[item.id]
                    ? "red"
                    : colorScheme === "dark"
                      ? "white"
                      : "black"
                }
              />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              onPress={() => handleShare(item)}
              className="flex-row items-center px-2 rounded-full"
            >
              <AntDesign
                name="sharealt"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>

          {/* Read More Button */}
          {isReadMore && (
            <TouchableOpacity
              onPress={() =>
                setExpandedItems((prev) => ({
                  ...prev,
                  [item.id]: !prev[item.id],
                }))
              }
              className="px-3 py-2 dark:bg-red-800 dark:border-0 border-2 border-indigo-500 rounded-full"
            >
              <Text className="text-indigo-500 font-bold dark:text-white dark:font-medium">
                {isExpanded ? "... Read Less" : "... Read More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    );
  };

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (selectedFilter === "upvotes") {
      return b.votes - a.votes;
    } else {
      return b.rating - a.rating;
    }
  });

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
          Loading startup ideas...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 dark:bg-slate-700">
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
          Discover Startup Ideas
        </Text>
        <Text className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          Browse, Rate, and Vote on Innovative Startup Ideas
        </Text>
      </LinearGradient>

      {/* Filter Buttons */}
      <View className="flex-row px-4 py-4">
        <TouchableOpacity
          onPress={() => setSelectedFilter("top")}
          className={`px-4 py-2 rounded-full mr-3 shadow-md ${selectedFilter === "top"
            ? "bg-indigo-500 dark:bg-red-800"
            : "bg-white/90 dark:bg-slate-600"
            }`}
        >
          <Text
            className={`font-semibold text-center ${selectedFilter === "top"
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
          className={`px-4 py-2 rounded-full shadow-md ${selectedFilter === "upvotes"
            ? "bg-indigo-500 dark:bg-red-800"
            : "bg-white/90 dark:bg-slate-600"
            }`}
        >
          <Text
            className={`font-semibold text-center ${selectedFilter === "upvotes"
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

      {/* Ideas List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        data={sortedIdeas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
