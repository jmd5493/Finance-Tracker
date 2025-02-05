import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "../auth/authConfig";

export default function HomeScreen() {
    const login = () => {
        console.log("✅ Redirecting to Auth0 login...");
        localStorage.removeItem("authToken"); // ✅ Ensure local storage is cleared before logging in
        window.location.href = `https://${AUTH0_DOMAIN}/authorize?client_id=${AUTH0_CLIENT_ID}&response_type=token&scope=openid profile email&redirect_uri=${window.location.origin}`;
      };
      

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Personal Finance Tracker</Text>

      {/* Login Button */}
      <TouchableOpacity 
        style={{ backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginBottom: 10 }}
        onPress={login}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
