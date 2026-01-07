import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useCallback, useEffect } from "react";

import InputField from "@/components/InputField";
import ImageInput from "@/components/ImageInput";
import RadioInput from "@/components/RadioInput";
import CustomDropdown from "@/components/CustomDropdown";
import Feather from '@expo/vector-icons/Feather';
import { fetchAPI } from "@/lib/fetch";

const Profile = () => {
  const { user } = useUser();
  const [fetchedUser, setFetchedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  

  const scrollRef = useRef<ScrollView>(null);


  const fetchUser = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetchAPI(`/(api)/user?email=${encodeURIComponent(email)}`);
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Failed to fetch user");
        setFetchedUser(null);
        return;
      }
  
      setFetchedUser(data.data); // Save user to state
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUser(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);
  
  

  type ProfileForm = {
    account: string;
    vehicle: string;
    profileImage: string | null;
    idImage: string | null;
    conductImage: string | null;
  };
  
  const [form, setForm] = useState<ProfileForm>({
    account: "client",
    vehicle: "1",
    profileImage: null,
    idImage: null,
    conductImage: null,
  });
  //console.log(form)
  const updateForm = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  
  const saveProfile = async (key: string, value: any) => {
    try {
      await fetch("/(api)/driver", {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
    } catch (err) {
      console.log("Auto-save failed", err);
    }
  };
  

  const handleAccountChange = (value: string)  => {
    updateForm("account", value);
  
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 350,
        animated: true,
      });
    }, 50);
  };
  
console.log(fetchedUser);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">My profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
         
            
            <InputField
              label="First name"
              placeholder={user?.firstName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
             // onBlur={() => saveProfile(form)}
            />

            <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfile(form)}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfile(form)}
            />
 
            <InputField
              label="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfile(form)}
            />

               
            <RadioInput
              label="Account"
              value={form.account}
              onChange={handleAccountChange}
              options={[
                {
                  label: "Client",
                  value: "client",
                  // icon: <Feather name="image" size={24} color="gray" />,
                },
                {
                  label: "Rider",
                  value: "rider",
                  // icon: <Feather name="image" size={24} color="gray" />,
                },
              ]}
            />

           {form.account === "rider"  && 
            <>
            <CustomDropdown
              label="Vehicle"
              value={form.vehicle}
              //onChange={(value) => updateForm("vehicle", value)}
              onChange={(value) => 
                {
                  updateForm("vehicle", value)
                  saveProfile("car_seats", parseInt(value, 10))
                }
            }
              options={[
                { label: "Foot", value: "0" },
                { label: "Trolley", value: "1" },
                { label: "Mkokoteni", value: "2" },
                { label: "Bicycle", value: "3" },
                { label: "Motorcycle", value: "4" },
                { label: "Tuktuk", value: "5" },
                { label: "Pickup", value: "6" },
                { label: "Van", value: "7" },
                { label: "Lorry", value: "8" },
                
              ]}
            />


            <ImageInput
              label="Profile Photo"
              icon={<Feather name="image" size={24} color="gray" />}
              value={form.profileImage}
              onChange={(uri) => updateForm("profileImage", uri)}
            />

            <ImageInput
              label="National Id"
              icon={<Feather name="image" size={24} color="gray" />}
              value={form.idImage}
              onChange={(uri) => updateForm("idImage", uri)}
            />
            <ImageInput
              label="Good Conduct"
              icon={<Feather name="image" size={24} color="gray" />}
              value={form.conductImage}
              onChange={(uri) => updateForm("conductImage", uri)}
            />
            </>
            }
          
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
