import { useAuth, useSignIn } from "@clerk/clerk-expo";
import Feather from '@expo/vector-icons/Feather';
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import OAuth from "@/components/OAuth";
import { icons } from "@/constants";
import { Redirect } from "expo-router";
import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [secureEntry, setSecureEntry] = useState(true)
  const { isSignedIn } = useAuth();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]); 

  if (isSignedIn) return <Redirect href="/(root)/(tabs)/home" />;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[150px]">
          {/* <Image source={images.signUpCar} className="z-0 w-full h-[250px]" /> */}
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <View className='relative'> 
          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={secureEntry}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <TouchableOpacity
          onPress={()=>setSecureEntry(!secureEntry)}
          className="absolute top-[66px] right-5"> 
          {secureEntry ?
           <Feather name='eye' size={24} color='gray'/>
          : 
          <Feather name='eye-off' size={24} color='gray'/>
          }
          </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth mode='login'/>

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
