import { useUser } from "@clerk/clerk-expo";
import { useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomDropdown from "@/components/CustomDropdown";
import ImageInput from "@/components/ImageInput";
import InputField from "@/components/InputField";
import RadioInput from "@/components/RadioInput";
import { fetchAPI } from "@/lib/fetch";
import { accountNameGetter, imageUrlCombiner, uploadImageFromUri } from "@/lib/utils";
import { useProfileStore, useHospitalStore, useAmbulanceStore, useAdminStore, useAgentStore } from "@/store";
import { AdminData, AmbulanceData, HospitalData, ProfileData } from "@/types/type";
import Feather from '@expo/vector-icons/Feather';
import MoreDropDown from "@/components/MoreDropdown";
import { accountNames, serviceTypes } from "@/constants";



//firebase
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/firebase";

// vehicle_type

const Profile = () => {
  const { user } = useUser();
  const { profile, setProfile } = useProfileStore();
  const { hospital, setHospital } = useHospitalStore();
  const { ambulance, setAmbulance } = useAmbulanceStore();
  const {admin, setAdmin} = useAdminStore();
  const {agent, setAgent} = useAgentStore();
  const [fetchedUser, setFetchedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPersonalDets, setShowPersonalDets] = useState(true);
  const [showGovtDets, setShowGovtDets] = useState(false);
  const [showAdminDets, setShowAdminDets] = useState(false);
  const [showHospitalDets, setShowHospitalDets] = useState(false);


  

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
  
  
  
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  const [adminForm, setAdminForm] = useState<AdminData>(admin);
  const [hospitalForm, setHospitalForm] = useState<HospitalData>(hospital);

  //console.log({profile})

  //temporary frontend editing updater
  const updateProfileForm = <K extends keyof ProfileData>(
    key: string,
    value: ProfileData[K]
  ) => {

    setProfileForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const updateAdminForm = <K extends keyof AdminData>(
    key: string,
    value: AdminData[K]
  ) => {

    setAdminForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateHospitalForm = <K extends keyof HospitalData>(
    key: string,
    value: HospitalData[K]
  ) => {

    setHospitalForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // final edit push to zustand and server
  const updateLocalProfile = <K extends keyof ProfileData> (
    key: string,
    value: ProfileData[K]
  ) => {

    const newProfileData = { ...profileForm, [key]: value}
    setProfile(newProfileData);
    
  };

  const updateLocalHospital = <K extends keyof HospitalData> (
    key: string,
    value: HospitalData[K]
  ) => {

    const newHospitalData = { ...hospitalForm, [key]: value}
    setHospital(newHospitalData);
    
  };
   const updateLocalAdmin = <K extends keyof AdminData> (
    key: string,
    value: AdminData[K]
  ) => {

    const newAdminData = { ...adminForm, [key]: value}
    setAdmin(newAdminData);
    
  };

  const uploadImage = async (key: string, value: string, type:number) => {
    
    const slug = await uploadImageFromUri(value, profile?.id, key);
    console.log(slug);
    if (type === 0){
      updateProfileForm(key, slug);
      updateLocalProfile(key, slug);
      saveProfileOnDb(key, slug, type);
    } else if (type ===2){
      updateAdminForm(key, slug);
      updateLocalAdmin(key, slug);
      saveAdminOnDb(key, slug, type);
    }
    // else if (type ===2){
    //   updateHospitalForm(key, slug);
    //   updateLocalHospital(key, slug)
    //   saveHospitalOnDb(key, slug, type)
    // }
    
  }
  
  //Final DbEdit
  const saveProfileOnDb = async <K extends keyof ProfileData> (key: string, value: ProfileData[K], type:number) => {

   if (value !== profile[key]){
      try {
        await fetchAPI("/(api)/user", { 
          method: "PATCH", 
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id:profile.id, key, value, type }),
        });
        
        updateLocalProfile(key, value);
      } catch (err) {
        console.log("Auto-save failed", err);
      }
    }
  };

  // const saveHospitalOnDb = async <K extends keyof HospitalData> (key: string, value: HospitalData[K], type:number) => {

  //  if (value !== hospital[key]){
  //     try {
  //       await fetchAPI("/(api)/user", { 
  //         method: "PATCH", 
  //         // headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id:hospital.id, key, value, type }),
  //       });
        
  //       updateLocalHospital(key, value);
  //     } catch (err) {
  //       console.log("Auto-save failed", err);
  //     }
  //   }
  // };

  const saveAdminOnDb = async <K extends keyof AdminData> (key: string, value: AdminData[K], type:number) => {

   if (value !== admin[key]){
      try {
        await fetchAPI("/(api)/user", { 
          method: "PATCH", 
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id:admin.id, key, value, type }),
        });
         
        updateLocalAdmin(key, value);
      } catch (err) {
        console.log("Auto-save failed", err);
      }
    }
  };


  // const handleAccountChange = (value: string | null | undefined)  => {

    
  //   updateProfileForm("account_type", value);
  //   saveProfileOnDb("account_type", value, "client_edit");
  
  //   setTimeout(() => {
  //     scrollRef.current?.scrollTo({
  //       y: 350,
  //       animated: true,
  //     });
  //   }, 50);
  // };




  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">My Profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: profile?.image_slug ? imageUrlCombiner("image_slug", profile?.image_slug) : ''
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">

            <MoreDropDown
             title="Profile Details"
              setState={setShowPersonalDets}
            />

            {showPersonalDets &&
              <View className="w-full mx-2 px-3 border-l border-gray-200">

                <ImageInput
                label="Profile Photo"
                icon={<Feather name="image" size={24} color="gray" />}
                value={profileForm?.image_slug ? imageUrlCombiner("image_slug", profileForm?.image_slug) : ''}
                onChange={(uri) => uri && uploadImage("image_slug", uri, 0)}

                />
  
          
                
                <InputField
                  label="Name"
                  placeholder={profileForm?.name || ""}
                  value={profileForm?.name || ""}
                  containerStyle="w-full"
                  inputStyle="p-3.5 text-gray-400"
                  // editable={form?.name ? false : true}
                  onChangeText={(value)=> updateProfileForm('name', value)}
                  
                onBlur={() => saveProfileOnDb("name", profileForm?.name, 0)}
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
                  profileForm?.email || "Not Found"
                  }
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={false}
                  //onBlur={() => saveProfileOnDb(form)}
                />
  
                <InputField
                  label="Phone"
                  // value={form?.phone}
                  placeholder={profileForm?.phone || "Not Found"}
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={true}
              
                  onChangeText={(value)=> updateProfileForm('phone', value)}
                  
                onBlur={() => saveProfileOnDb("phone", profileForm?.phone, 0)}
                  //onBlur={() => saveProfileOnDb(form)}
                />

                 <InputField
                  label="Account Type"
                  // value={form?.phone}
                  placeholder={profileForm?.account_type !== null ?
                     profileForm?.account_type === 1 ? 'Agent' :
                     'Admin' :
                      'Unknown'}
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={false}
                  
                onBlur={() => saveProfileOnDb("phone", profileForm?.phone, 0)}
                  //onBlur={() => saveProfileOnDb(form)}
                />
            
              </View>
            }

            <>
            <MoreDropDown
             title="Admin Details"
              setState={setShowAdminDets}
            />
            {showAdminDets &&
              <View className="w-full mx-1 px-2 border-l border-gray-200">
          
                  <InputField
                    label="Admin Id"
                    placeholder={adminForm?.id && JSON.stringify(adminForm?.id )|| ""}
                    value={adminForm?.id && JSON.stringify(adminForm?.id )|| ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                     editable={false}
                  />
                  {/* <Text className='font-bold text-green-600'>{admin?.team_name}</Text> */}
                  <InputField
                    label="Team Name"
                    placeholder={adminForm?.team_name || ""}
                    value={adminForm?.team_name || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                    editable={profile?.account_type === 2 ? true : false}
                    onChangeText={(value)=> updateAdminForm('team_name', value)}
                    
                  onBlur={() => saveAdminOnDb("team_name", adminForm?.team_name, 2)}
                  />

                
              </View>
            }
            </>
            
          
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
