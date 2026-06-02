import React from "react";
import { View, Text } from "react-native";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { useAuth } from "../context/AuthContext";

const StackNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
};

export default StackNavigator;