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
import { useProfileStore } from "@/store";
import { ProfileData } from "@/types/type";
import { uploadImageFromUri } from "@/lib/utils";

//firebase
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebase";

const Profile = () => {
  const { user } = useUser();
  const { profile, setProfile } = useProfileStore();
  const [fetchedUser, setFetchedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  

  const scrollRef = useRef<ScrollView>(null);


  // const fetchUser = async (email: string) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     setFetchedUser(data.data); // Save user to state
  //   } catch (err) {
  //     console.error("Error fetching user:", err);
  //     setError("Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (user?.primaryEmailAddress?.emailAddress) {
  //     fetchUser(user.primaryEmailAddress.emailAddress);
  //   }
  // }, [user]);
  
  
  
  const [form, setForm] = useState<ProfileData>(profile);
  //console.log(form)

  //temporary frontend editing updater
  const updateForm = <K extends keyof ProfileData>(
    key: string,
    value: ProfileData[K]
  ) => {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // final edit push to zustand and server
  const updateLocalProfile = <K extends keyof ProfileData> (
    key: string,
    value: ProfileData[K]
  ) => {

    const newProfileData = { ...form, [key]: value}
    setProfile(newProfileData);
    
  };

  const uploadImage = async (key: string, value: string, type:string) => {
    
    const slug = await uploadImageFromUri(value);
    updateForm(key, value);
    updateLocalProfile(key, slug)
    saveProfileOnDb(key, slug, type)
    
  }
  
  //Final DbEdit
  const saveProfileOnDb = async <K extends keyof ProfileData> (key: string, value: ProfileData[K], type:string) => {
    try {
      if (type === 'driver_edit'){
        await fetchAPI("/(api)/driver", {
          method: "PATCH", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
      } else if (type === 'client_edit'){
        await fetchAPI("/(api)/user", {
          method: "PATCH", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
      }
      updateLocalProfile(key, value);
    } catch (err) {
      console.log("Auto-save failed", err);
    }
  };
  

  const handleAccountChange = (value: string | null | undefined)  => {
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
             // onBlur={() => saveProfileOnDb(form)}
            />

            <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfileOnDb(form)}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfileOnDb(form)}
            />
 
            <InputField
              label="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfileOnDb(form)}
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
              value={form.car_seats}
              //onChange={(value) => updateForm("car_seats", value)}
              onChange={(value) => 
                {
                  updateForm("car_seats", value);
                  saveProfileOnDb("car_seats", parseInt(value, 10), "driver_edit");
                }
            }
              options={[
                { label: "Foot", value: 0 },
                { label: "Trolley", value: 1 },
                { label: "Mkokoteni", value: 2 },
                { label: "Bicycle", value: 3 },
                { label: "Motorcycle", value: 4 },
                { label: "Tuktuk", value: 5 },
                { label: "Pickup", value: 6 },
                { label: "Van", value: 7 },
                { label: "Lorry", value: 8 },
                
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
