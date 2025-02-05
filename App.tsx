import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ProfileScreen from "./screens/ProfileScreen";

export type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Profile: { user: any };
};



const Stack = createStackNavigator<RootStackParamList>();

const extractToken = () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
  }
  return null;
};

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = extractToken();

    if (token) {
      console.log("✅ Token received:", token);
      setUserToken(token);
      localStorage.setItem("authToken", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const checkAuth = () => {
      const storedToken = localStorage.getItem("authToken");

      // ✅ Ensure the token is valid before setting userToken
      if (storedToken) {
        setUserToken(storedToken);
      } else {
        setUserToken(null);
      }
    };

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
            <Stack.Screen name="Dashboard">
              {() => <DashboardScreen />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {props => <ProfileScreen {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
