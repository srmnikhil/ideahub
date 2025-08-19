# IdeaHub 🚀

IdeaHub is a React Native mobile app built with Expo that lets users share, explore, and get feedback on innovative startup ideas. It’s designed to foster a creative community where entrepreneurs and enthusiasts can upvote ideas and track leaderboards, all with a sleek UI and automatic light/dark theme support.

## App Description

IdeaHub empowers users to:

- Submit their startup ideas.
- Browse ideas submitted by others.
- Upvote ideas they like.
- View ideas and leaderboard sorted by top-rated or most upvoted.
- Experience automatic light and dark themes that follow the device’s system preferences.
- Receive real-time updates through OTA (over-the-air) updates.

## Tech Stack Used

- **React Native** (Expo SDK 53)
- **Expo CLI & EAS Build** for development and deployment
- **React Navigation** (native-stack and bottom-tabs) for app navigation
- **Tailwind (via NativeWind)** for utility-first styling
- **Expo Updates** for over-the-air updates
- **Expo LinearGradient** for gradient backgrounds
- **Expo Vector Icons** for icons
- **Axios** for API calls
- **Async Storage** for local storage
- **Lottie React Native** for animations

## Features Implemented

- Submit startup ideas with title, tagline, and detailed description.
- Browse and upvote ideas with real-time feedback.
- View ideas sorted by top-rated or most upvoted in the leaderboard.
- Expand/collapse idea descriptions with "Read More"/"Read Less" functionality.
- Automatic light and dark theme switching according to the device theme.
- Animated loaders during data fetching.
- Share ideas using the device's native share options.
- Smooth tab navigation with icons.

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- Expo CLI installed globally

```bash
npm install -g expo-cli
```
## **Installation**

1.  Clone the repository:

```bash
git clone https://github.com/srmnikhil/ideahub.git
cd ideahub
```

2.  Install dependencies:

```bash
npm install
# or
yarn install
```

3.  Start the development server:

```bash
expo start
# or
npx expo start
```

4.  Open the Expo Go app on your phone and scan the QR code displayed to run the app locally.

## **Build and install APK**
**Build APK with EAS**
```bash
eas build --platform android
```
Follow the prompts to configure credentials if needed.

Once built, download the APK from the EAS build link.

**Installing APK on Android Device**
- [Download](https://ideahubapp.vercel.app/IdeaHub.apk) the APK file to your Android device.

- Enable **Install from Unknown Sources** in your device settings.

- Open the APK file and install IdeaHub.

## **OTA Updates**
This app supports over-the-air (OTA) updates via Expo Updates. New updates can be published without needing a full rebuild.

## **Folder Structure**
```bash
/assets       # App images, icons, splash screens
/components   # Reusable UI components
/screens      # Main screens (Home, Submit, Leaderboard)
/utils        # Utility/helper functions
/App.js       # App entry point
```

## **Contributing**
Pull requests and suggestions are welcome!

## **License**
MIT License © 2025 Nikhil Sharma

## **Contact**
Email: srmnikhilswn@gmail.com

GitHub: https://github.com/srmnikhil

LinkedIn: https://linkedin.com/in/srmnikhil
