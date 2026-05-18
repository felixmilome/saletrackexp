import { useSignUp, useAuth } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import Feather from '@expo/vector-icons/Feather';

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images, accountNames } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useStateForPath } from "@react-navigation/native";
import { Redirect } from "expo-router";
import { useProfileStore, useSessionStore } from "@/store";


const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true)
  const { isSignedIn } = useAuth();
  const {setSession} = useSessionStore();
  const {profile, setProfile} = useProfileStore()

  const [form, setForm] = useState({
    account_type:1,
    name: "",
    email: "",
    password: "",
    team_name:"",
    admin_code: ""

  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [errorMessage,setErrorMessage] = useState('');
   const [verifyErrorMessage,setVerifyErrorMessage] = useState('');


  // const onSignUpPress = async () => {
  //   if (!isLoaded) return;
  //   try {
  //     await signUp.create({
  //       account_type:form.account_type
  //       email: form.email,
  //       password: form.password,
  //     });
  //     await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
  //     setVerification({
  //       ...verification,
  //       state: "pending",
  //     });
  //   } catch (err: any) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.log(JSON.stringify(err, null, 2));
  //     Alert.alert("Error", err.errors[0].longMessage);
  //   }
  // };

  const onSignUpPress = async() => {
  
    // const res = await fetchAPI("/(api)/auth/signup", { 
    //               method: "POST",
    //               body: JSON.stringify(form),
    //           });
    
    // //console.log({res});
    // if(res?.success === true){  

    //      setVerification({
    //     ...verification,  
    //     state: "pending",
    //   });
    //   setErrorMessage('Sign Up Success');

    // }else{
    //   setErrorMessage(res?.message);
    // }
    // router.push("/(root)/(tabs)/home");

  }

  const onPressVerify = async () => {
   // if (!isLoaded) return;
    try {
   
       const res = await fetchAPI("/(api)/auth/verify-signup", { 
          method: "POST",
          body: JSON.stringify({
            email: form?.email,
            otp: verification?.code,
          }),
        });
       // console.log({res})
        //await setActive({ session: completeSignUp.createdSessionId });
        if (res.success === true){
            setVerification({
              ...verification,
              state: "success",
            });
            setSession(res?.session_token, res?.email)
            setShowSuccessModal(true)
            
            
        }else{

          setVerification({
            ...verification,
            error: res?.message,
            state: "failed",
          }); 

        }
        setVerifyErrorMessage(res?.message)
  
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: "Server Error",
        state: "failed",
      }); 
    }
  };
  if (profile?.id) return <Redirect href="/(root)/(tabs)/home" />;
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[120px]">
          {/* <Image source={images.signUpCar} className="z-0 w-full h-[250px]" /> */}
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5 font-bold">
            Create Account
          </Text>
         
        </View>
        <View className="px-5 py-2">
          
           <CustomDropdown 
              label="Account Type"
              value={form?.account_type}
              //onChange={(value) => updateForm("vehicle_type", value)}
              onChange={(value) => 
                {
                  console.log(value)
                   setForm({ ...form, account_type: value })
                }
            }
              options={[
                { label: accountNames?.agent, value: 1 },
                { label: accountNames?.admin, value: 2 },
              ]}
            />
            
               {form.account_type === 2 &&
                  <InputField
                    label="Team Name"
                    placeholder="Team Name"
                    icon={icons.person}
                    value={form.team_name}
                    onChangeText={(value) => setForm({ ...form, team_name: value })}
                  />
               }

              <InputField
                label="Admin Name"
                placeholder="Your Name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
            
              <InputField
                label="Email"
                placeholder="Enter Email"
                icon={icons.email}
                textContentType="emailAddress"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
              {form.account_type === 1 &&
                <InputField
                label="Admin Code"
                placeholder="Admin Code"
                icon={icons.person}
                value={form.admin_code}
                onChangeText={(value) => setForm({ ...form, admin_code: value })}
              />
              }
            <View className='relative'> 
              <InputField
                label="Password"
                placeholder="Enter Password"
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
              { errorMessage?.length>0 &&
              <Text className="text-lg font-bold text-blue-500">
              {errorMessage}
            </Text>
            }
          <CustomButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          {/* <OAuth mode="signup" /> */}
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to {form.email}.
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verifyErrorMessage?.length>0 && (
              <Text className="text-blue-500 text-sm mt-1">
                {verifyErrorMessage}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={ async() => {
                router.push(`/(root)/(tabs)/home`);
                setShowSuccessModal(false);
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};
export default SignUp;
