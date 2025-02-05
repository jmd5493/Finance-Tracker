import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "../auth/authConfig";


type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile"> & {
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>; // ✅ Add setUserToken as a prop
};

export default function ProfileScreen({ route, navigation, setUserToken }: ProfileScreenProps) {
  const { user } = route.params; // ✅ Extract only user from route.params

  const handleLogout = () => {
    console.log("🔴 Logging out...");
    
    // ✅ Remove token from localStorage
    localStorage.removeItem("authToken");
  
    // ✅ Ensure TypeScript recognizes `window`
    if (typeof window !== "undefined") {
      window.location.href = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${window.location.origin}`;
    }
  };
    

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>Profile</Text>

      {user ? (
        <>
          {user.picture && <Image source={{ uri: user.picture }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>{user.name || "No Name Provided"}</Text>
          <Text style={{ fontSize: 16, color: "gray" }}>{user.email || "No Email Available"}</Text>
        </>
      ) : (
        <Text style={{ fontSize: 16, color: "red" }}>No user data available.</Text>
      )}

      {/* Logout Button */}
      <TouchableOpacity 
        style={{ backgroundColor: "red", padding: 15, borderRadius: 10, marginTop: 20 }}
        onPress={handleLogout}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Logout</Text>
      </TouchableOpacity>

      {/* Back to Dashboard Button */}
      <TouchableOpacity 
        style={{ backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginTop: 10 }}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
