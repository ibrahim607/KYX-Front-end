# Project Name

This project has been restructured to use a custom folder structure with React Navigation and Zustand.

## Structure

- `/src` forms the core of the application.
  - `api`: Axios client and endpoints.
  - `assets`: Images, fonts, icons, and theme.
  - `shared`: Global components, hooks, store, and utils.
  - `features`: Feature-based modules (Auth, Onboarding, Booking, etc.).
  - `navigation`: Navigation stacks (App, Auth, Root).

## Getting Started

1.  Install dependencies: `npm install`
2.  Start the app: `npx expo start`

## Performance Recommendations

To ensure the project remains as fast as possible, consider using the following libraries:

1.  **@shopify/flash-list**: Use this instead of the standard `FlatList`. It runs on the UI thread and is significantly faster for large lists.
    - Installation: `npx expo install @shopify/flash-list`

2.  **react-native-mmkv**: The fastest key/value storage for React Native (orders of magnitude faster than AsyncStorage).
    - Installation: `npx expo install react-native-mmkv`

3.  **expo-image**: Already installed. Use `<Image>` from `expo-image` instead of React Native's default Image component for better caching and performance.

4.  **react-native-reanimated**: Already installed. Use this for all animations to ensure they run on the UI thread.

5.  **Hermes**: Ensure Hermes is enabled in your `app.json` (managed workflow usually enables it by default) for faster startup times and smaller bundle sizes.
