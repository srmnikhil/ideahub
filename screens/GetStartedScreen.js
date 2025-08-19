import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function GetStartedContent({ onGetStarted }) {
  return (
    <View className="flex-1 bg-gray-100 dark:bg-slate-700">
      {/* Background fix for the bottom-right curve */}
      <View className="absolute bottom-0 right-0 h-32 w-32 bg-white z-0" />

      {/* Top section with image and rounded corner */}
      <View className="flex-1 bg-sky-300 dark:bg-indigo-500 rounded-br-[6rem] overflow-hidden z-10">
        <View className="flex-1 items-center justify-center">
          <Image
            source={require('../assets/startup.png')} // Replace with your image
            resizeMode="contain"
            style={{ width: width * 0.8, height: 300 }}
          />
        </View>
      </View>

      {/* Bottom section */}
      <View className="flex-1 bg-sky-300 dark:bg-indigo-500">
        <View className="flex-1 bg-gray-100 dark:bg-slate-700 items-center justify-center rounded-tl-[6rem] overflow-hidden">
          <Text className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">
            Welcome to IdeaHub 🚀
          </Text>

          <Text className="text-lg text-center text-gray-700 dark:text-white mb-8">
            Share your startup ideas, explore others, and get real-time feedback.
          </Text>

          <TouchableOpacity
            onPress={onGetStarted}
            className="bg-indigo-600 dark:bg-red-800 px-12 py-4 rounded-full shadow-md"
          >
            <Text className="text-white text-lg font-semibold">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
