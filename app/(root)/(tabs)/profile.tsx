import { useUser } from "@clerk/clerk-expo";
import { useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomDropdown from "@/components/CustomDropdown";
import ImageInput from "@/components/ImageInput";
import InputField from "@/components/InputField";
import RadioInput from "@/components/RadioInput";
import { fetchAPI } from "@/lib/fetch";
import { imageUrlCombiner, uploadImageFromUri } from "@/lib/utils";
import { useProfileStore } from "@/store";
import { ProfileData } from "@/types/type";
import Feather from '@expo/vector-icons/Feather';

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
    
    const slug = await uploadImageFromUri(value, profile?.user_id, key);
    updateForm(key, slug);
    updateLocalProfile(key, slug)
    saveProfileOnDb(key, slug, type)
    
  }
  
  //Final DbEdit
  const saveProfileOnDb = async <K extends keyof ProfileData> (key: string, value: ProfileData[K], type:string) => {

   if (value !== profile[key]){
      try {
        await fetchAPI("/(api)/user", { 
          method: "PATCH", 
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id:profile.user_id, key, value }),
        });
        
        updateLocalProfile(key, value);
      } catch (err) {
        console.log("Auto-save failed", err);
      }
    }
  };
  console.log(form?.account_type);

  const handleAccountChange = (value: string | null | undefined)  => {

    
    updateForm("account_type", value);
    saveProfileOnDb("account_type", value, "client_edit");
  
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 350,
        animated: true,
      });
    }, 50);
  };
  


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
              uri: profile?.profile_image_slug ? imageUrlCombiner("profile_image_slug", profile?.profile_image_slug) : ''
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
         
            
            <InputField
              label="Name"
              placeholder={form?.name || ""}
              value={form?.name || ""}
              containerStyle="w-full"
              inputStyle="p-3.5 text-gray-400"
              // editable={form?.name ? false : true}
              onChangeText={(value)=> updateForm('name', value)}
              
             onBlur={() => saveProfileOnDb("name", form?.name, "client_edit")}
            />

            {/* <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              onChange = {()=>}
              //onBlur={() => saveProfileOnDb(form)}
            /> */}

            <InputField
              label="Email"
              // value={form?.email}
              placeholder={
               form?.email || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
              //onBlur={() => saveProfileOnDb(form)}
            />
 
            <InputField
              label="Phone"
              // value={form?.phone}
              placeholder={form?.phone || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={true}
           
              onChangeText={(value)=> updateForm('phone', value)}
              
             onBlur={() => saveProfileOnDb("phone", form?.phone, "client_edit")}
              //onBlur={() => saveProfileOnDb(form)}
            />

               
            <RadioInput
              label="Account"
              value={form?.account_type}
              onChange={handleAccountChange}
              options={[
                {
                  label: "Client",
                  value: "client",
                  // icon: <Feather name="image" size={24} color="gray" />,
                },
                {
                  label: "Rider",
                  value: "driver",
                  // icon: <Feather name="image" size={24} color="gray" />,
                },
              ]}
            />
             <InputField
              label="Rider Verified?"
              // value={form?.email}
              value={
               profile?.verified ? "True" : "False"
              }
              containerStyle="w-full"
              inputStyle="p-3.5 text-red-500"
              editable={false}
              //onBlur={() => saveProfileOnDb(form)}
            />
              { profile?.account_type === 'driver' && !profile?.verified &&
                <Text className="text-sm px-2 text-red-600 font-JakartaRegular">
                 Add Details & Wait For Verification
                </Text>
              }

           {form?.account_type === "driver"  && 
            <>
            <CustomDropdown
              label="Vehicle"
              value={form?.vehicle_type}
              //onChange={(value) => updateForm("vehicle_type", value)}
              onChange={(value) => 
                {
                  updateForm("vehicle_type", value);
                  saveProfileOnDb("vehicle_type", parseInt(value, 10), "client_edit");
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

            <InputField
              label="Description"
              placeholder={form?.description || "Not Found"}
              value={form?.description || ""}
              containerStyle="w-full"
              inputStyle="p-3.5 pb-16"
              editable={true}
              onChangeText={(value)=> updateForm('description', value)}
              
             onBlur={() => saveProfileOnDb("description", form?.description, "client_edit")}
            />


            <ImageInput
              label="Profile Photo"
              icon={<Feather name="image" size={24} color="gray" />}
              value={profile?.profile_image_slug ? imageUrlCombiner("profile_image_slug", profile?.profile_image_slug) : ''}
              onChange={(uri) => uri && uploadImage("profile_image_slug", uri, "client_edit")}

            />
 
            <ImageInput
              label="National Id"
              icon={<Feather name="image" size={24} color="gray" />}
              //value={form?.id_image_slug}
              value={profile?.id_image_slug ? imageUrlCombiner("id_image_slug", profile?.id_image_slug) : ''}
              onChange={(uri) => uri && uploadImage("id_image_slug", uri, "driver_edit")}
            />
            <ImageInput
              label="Good Conduct"
              icon={<Feather name="image" size={24} color="gray" />}
             // value={form?.conduct_image_slug}
              value={profile?.conduct_image_slug ? imageUrlCombiner("conduct_image_slug", profile?.conduct_image_slug) : ''}
              onChange={(uri) => uri && uploadImage("conduct_image_slug", uri, "driver_edit")}
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
