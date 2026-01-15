import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Player from "./screens/Player";
import Home from "./screens/Home";
import Downloader from "./screens/Downloader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SongsContextProvider from "./src/SongsContext";
import { StatusBar } from "expo-status-bar";

export type RootStackParamList = {
  Home: undefined;
  Player: { id: number };
  Downloader: undefined;
};

const Tab = createMaterialTopTabNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <SongsContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Tab.Navigator tabBarPosition="bottom" screenOptions={{
              tabBarActiveTintColor: DefaultTheme.colors.primary,
              tabBarInactiveTintColor: "grey"
            }}>
              <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} /> }} />
              <Tab.Screen name="Player" component={Player} initialParams={{ id: -1 }} options={{ tabBarIcon: ({ color }) => <AntDesign name="play-circle" size={24} color={color} /> }} />
              <Tab.Screen name="Downloader" component={Downloader} options={{ tabBarIcon: ({ color }) => <AntDesign name="download" size={24} color={color} /> }} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </SongsContextProvider>
      <StatusBar/>
    </PaperProvider>
  );
};