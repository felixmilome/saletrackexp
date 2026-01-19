import { useOAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import { fetchAPI } from "@/lib/fetch";

type OAuthProps = {
  mode: "signup" | "login";
};

const OAuth = ({ mode }: OAuthProps) => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user, isLoaded, isSignedIn } = useUser();

  const [loading, setLoading] = useState(false);
  const [oauthDone, setOauthDone] = useState(false);

  const createNeonUser = async (userData: { name: string; email: string; clerkId: string }) => {
    try {
      const res = await fetchAPI("/(api)/user", { 
        method: "POST",
        body: JSON.stringify(userData), 
      });
      if (!res.ok) console.error("Failed to create Neon user:", await res.text());
    } catch (err) {
      console.error("Neon DB error:", err);
    }
  }; 

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleOAuth(startOAuthFlow);
      console.log("OAuth result:", result);

      if (result.code === "session_exists") {
        router.replace("/(root)/(tabs)/home");
        return;
      }

      if (result.success) {
        setOauthDone(true); // mark that OAuth completed
      } else {
        Alert.alert("Error", result.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setLoading(false);
    }
  };

  // Wait for Clerk to populate the user after OAuth
  useEffect(() => {
  
    if (oauthDone && isLoaded && isSignedIn && user) {
      
    
      
      (async () => {

        if (mode === "signup") {
  
          await createNeonUser({
            name: `${user.firstName} ${user.lastName}`,
            email: user.primaryEmailAddress?.emailAddress || "",
            clerkId: user.id,
          });
          router.replace("/(root)/(tabs)/home");
        }
        // router.replace("/(root)/(tabs)/home");   // Activate this on sign in

      })();
    }
  }, [oauthDone, isLoaded, isSignedIn, user]);

  return (
    <View>
      {/* Divider */}
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" className="mt-5" />
      ) : (
        <CustomButton
          title={mode === "signup" ? "Sign Up with Google" : "Log In with Google"}
          className="mt-5 w-full shadow-none"
          IconLeft={() => <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2" />}
          bgVariant="outline"
          textVariant="primary"
          onPress={handleGoogleSignIn}
        />
      )}
    </View>
  );
};

export default OAuth;
