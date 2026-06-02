import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AppStackParamList } from "./typeNavigation";

import { HomeScreen } from "../screens/app/HomeScreen";
import { DetailScreen } from "../screens/app/DetailScreen";
import CreateSpeciesScreen from "../screens/app/CreateSpeciesScreen";
import MapScreen from "../screens/app/MapScreen";
import ProfileScreen from "../screens/app/ProfileScreen";

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#4F46E5",
        headerTitleStyle: {
          fontWeight: "700" as const,
          color: "#1A202C",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: "Detalle de especie",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="CreateSpecies"
        component={CreateSpeciesScreen}
        options={{
          title: "Registrar especie",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Mapa de especies",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Mi perfil",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;