import { useAuth, useSignIn } from "@clerk/clerk-expo";
import Feather from '@expo/vector-icons/Feather';
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import OAuth from "@/components/OAuth";
import { icons } from "@/constants";
import { Redirect } from "expo-router";
import CustomButton from "../../components/CustomButton";
import InputField from "../../components/InputField";
import { useProfileStore, useSessionStore } from "@/store";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [secureEntry, setSecureEntry] = useState(true);
  const {profile, setProfile} = useProfileStore();
  // const { isSignedIn } = useAuth();
  const [errorMessage,setErrorMessage] = useState('');
  const {setSession} = useSessionStore()


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
 
    try {
       const res = await fetchAPI("/(api)/auth/login", { 
                        method: "POST",
                        body: JSON.stringify(form),
                    });
          //console.log({res})
          if(res?.success === true){  
              setErrorMessage('Sign In Success');
              setSession(res?.session_token, res?.email);
              router.push(`/(root)/(tabs)/home`)

            }else{
              setErrorMessage(res?.message);
            }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [form]); 

    if (profile?.id) return <Redirect href="/(root)/(tabs)/home" />;

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
           { errorMessage?.length>0 &&
              <Text className="text-2xl font-bold text-blue-500">
              {errorMessage}
            </Text>
            }
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
          className="absolute top-[60px] right-5"> 
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

          {/* <OAuth mode='login'/> */}

          <Link
            href="/forgot-password"
            className="text-lg text-center text-general-200 mt-10"
          >
            Can't log in?{" "}
            <Text className="text-primary-500">Forgot Password</Text>
          </Link>

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
