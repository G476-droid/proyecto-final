import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/typeNavigation";
import { LoginForm } from "../../types/auth";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import { loginStyles } from "../../styles/appStyle";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { EcoScanLogo } from "../../components/ui/EcoScanLogo";

type LoginScreenNavigationProp = StackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: LoginScreenNavigationProp) => {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setLoginForm({ ...loginForm, [key]: value });
  };

  const validate = (): boolean => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(loginForm.email)) {
      setEmailError("Ingresa un email valido");
      valid = false;
    }

    if (!isValidPassword(loginForm.password)) {
      setPasswordError("La contrasena debe tener al menos 6 caracteres");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      if (error) {
        Alert.alert("Error al iniciar sesion", error.message);
        return;
      }

      Alert.alert("Bienvenido", "Inicio de sesion correcto.");
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={loginStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={loginStyles.shell}>
          <View style={loginStyles.brandCard}>
            <View style={loginStyles.header}>
              <View style={loginStyles.logoWrap}>
                <EcoScanLogo size={68} />
              </View>
              <Text style={loginStyles.eyebrow}>EcoScan IA</Text>
              <Text style={loginStyles.title}>Bienvenido</Text>
              <Text style={loginStyles.subtitle}>
                Inicia sesion para continuar con el registro y consulta de especies.
              </Text>
            </View>
          </View>

          <View style={loginStyles.form}>
            <Text style={loginStyles.formTitle}>Accede a tu cuenta</Text>
            <Text style={loginStyles.formSubtitle}>
              Usa tu correo registrado para entrar al panel principal.
            </Text>

            <Input
              label="Correo electronico"
              placeholder="ejemplo@correo.com"
              value={loginForm.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Input
              label="Contrasena"
              placeholder="Minimo 6 caracteres"
              value={loginForm.password}
              onChangeText={(value) => handleInputChange("password", value)}
              isPassword
              error={passwordError}
            />

            <Button
              title="Iniciar sesion"
              onPress={handleLogin}
              loading={loading}
              style={loginStyles.button}
            />
          </View>

          <View style={loginStyles.footer}>
            <Text style={loginStyles.footerText}>No tienes cuenta? </Text>
            <Text
              style={loginStyles.link}
              onPress={() => navigation.navigate("Register")}
            >
              Registrate
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
