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
import { useProfileStore, useHospitalStore, useAmbulanceStore } from "@/store";
import { AmbulanceData, HospitalData, ProfileData } from "@/types/type";
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
  const [fetchedUser, setFetchedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPersonalDets, setShowPersonalDets] = useState(true);
  const [showGovtDets, setShowGovtDets] = useState(false);
  const [showVehicleDets, setShowVehicleDets] = useState(false);
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
  const [ambulanceForm, setAmbulanceForm] = useState<AmbulanceData>(ambulance);
  const [hospitalForm, setHospitalForm] = useState<HospitalData>(hospital);

  console.log({profile})

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
  
  const updateAmbulanceForm = <K extends keyof AmbulanceData>(
    key: string,
    value: AmbulanceData[K]
  ) => {

    setAmbulanceForm((prev) => ({
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
   const updateLocalAmbulance = <K extends keyof AmbulanceData> (
    key: string,
    value: AmbulanceData[K]
  ) => {

    const newAmbulanceData = { ...ambulanceForm, [key]: value}
    setAmbulance(newAmbulanceData);
    
  };

  const uploadImage = async (key: string, value: string, type:number) => {
    
    const slug = await uploadImageFromUri(value, profile?.id, key);
    console.log(slug);
    if (type === 0){
      updateProfileForm(key, slug);
      updateLocalProfile(key, slug);
      saveProfileOnDb(key, slug, type);
    } else if (type ===1){
      updateAmbulanceForm(key, slug);
      updateLocalAmbulance(key, slug);
      saveAmbulanceOnDb(key, slug, type);
    }else if (type ===2){
      updateHospitalForm(key, slug);
      updateLocalHospital(key, slug)
      saveHospitalOnDb(key, slug, type)
    }
    
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

  const saveHospitalOnDb = async <K extends keyof HospitalData> (key: string, value: HospitalData[K], type:number) => {

   if (value !== hospital[key]){
      try {
        await fetchAPI("/(api)/user", { 
          method: "PATCH", 
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id:hospital.id, key, value, type }),
        });
        
        updateLocalHospital(key, value);
      } catch (err) {
        console.log("Auto-save failed", err);
      }
    }
  };

  const saveAmbulanceOnDb = async <K extends keyof AmbulanceData> (key: string, value: AmbulanceData[K], type:number) => {

   if (value !== ambulance[key]){
      try {
        await fetchAPI("/(api)/user", { 
          method: "PATCH", 
          // headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id:ambulance.id, key, value, type }),
        });
        
        updateLocalAmbulance(key, value);
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
             title="Personal Details"
              setState={setShowPersonalDets}
            />
            {showPersonalDets &&
              <View className="w-full mx-1 px-2 border-l border-gray-300">

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
                  placeholder={profileForm?.account_type !== null ? accountNameGetter(profileForm?.account_type): ''}
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={false}
                  
                onBlur={() => saveProfileOnDb("phone", profileForm?.phone, 0)}
                  //onBlur={() => saveProfileOnDb(form)}
                />
            
              </View>
            }

           
              
            {/* <RadioInput
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
          */}

          { profile?.account_type === 1 &&
            <>
            <MoreDropDown
             title="Ambulance Details"
              setState={setShowVehicleDets}
            />
            {showVehicleDets &&
              <View className="w-full mx-1 px-2 border-l border-gray-300">
          
                  <InputField
                  label="Rider Verified?"
                  // value={form?.email}
                  value={
                  ambulanceForm?.verified ? "✅ True" : "❌ False"
                  }
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={false}
                  //onBlur={() => saveProfileOnDb(form)}
                  />
                
                  { !ambulanceForm?.verified &&
                    <Text className="text-sm px-2 text-red-600 font-JakartaRegular">
                      Add Details & Wait For Verification
                    </Text>
                  }
                  <InputField
                    label="Hospital / Fleet Code"
                    placeholder={ambulanceForm?.hospital_id && JSON.stringify(ambulanceForm?.hospital_id )|| ""}
                    value={ambulanceForm?.hospital_id && JSON.stringify(ambulanceForm?.hospital_id )|| ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                     editable={false}
                    // editable={form?.name ? false : true}
                    onChangeText={(value)=> updateProfileForm('name', parseInt(value, 10))}  
                    onBlur={() => saveAmbulanceOnDb("name", ambulanceForm?.hospital_id, 0)}
                  />
                  <Text className='font-bold text-green-600'>{hospital?.name}</Text>
                  <CustomDropdown 
                    label="Ambulance Type"
                    value={ambulanceForm?.vehicle_type}
                    //onChange={(value) => updateProfileForm("vehicle_type", value)}
                    onChange={(value) => 
                      {
                        updateAmbulanceForm("vehicle_type", value);
                        saveAmbulanceOnDb("vehicle_type", parseInt(value, 10), 1);
                      }
                  }
                    options={[
                      { label: serviceTypes?.specimen_delivery, value: 0},
                      { label: serviceTypes?.bike_ambulance, value: 1},
                      { label: serviceTypes?.bls_ambulance, value: 2},
                      { label: serviceTypes?.acls_ambulance, value: 3},                 
                    ]}
                  />
                  <InputField
                    label="Number Plate"
                    placeholder={ambulanceForm?.number_plate || ""}
                    value={ambulanceForm?.number_plate || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                    // editable={form?.name ? false : true}
                    onChangeText={(value)=> updateAmbulanceForm('number_plate', value)}
                    
                  onBlur={() => saveAmbulanceOnDb("number_plate", ambulanceForm?.number_plate, 1)}
                  />

                  <InputField
                    label="Vehicle Colour"
                    placeholder={ambulanceForm?.colour || ""}
                    value={ambulanceForm?.colour || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                    // editable={form?.name ? false : true}
                    onChangeText={(value)=> updateAmbulanceForm('colour', value)}
                    
                  onBlur={() => saveAmbulanceOnDb("colour", ambulanceForm?.colour, 1)}
                  />

                  <InputField
                    label="Vehicle Service Description"
                    placeholder={ambulanceForm?.description || "Not Found"}
                    value={ambulanceForm?.description || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 pb-16"
                    editable={true}
                    onChangeText={(value)=> updateAmbulanceForm('description', value)}
                    
                  onBlur={() => saveAmbulanceOnDb("description", ambulanceForm?.description, 1)}
                  />
                  {/* This is for profile not ambulances */}
                  <ImageInput
                    label="National Id"
                    icon={<Feather name="image" size={24} color="gray" />}
                    //value={form?.id_image_slug}
                    value={profile?.id_image_slug ? imageUrlCombiner("id_image_slug", profile?.id_image_slug) : ''}
                    onChange={(uri) => uri && uploadImage("id_image_slug", uri, 0)}
                  />
                  <ImageInput
                    label="Good Conduct"
                    icon={<Feather name="image" size={24} color="gray" />}
                  // value={form?.conduct_image_slug}
                    value={profile?.conduct_image_slug ? imageUrlCombiner("conduct_image_slug", profile?.conduct_image_slug) : ''}
                    onChange={(uri) => uri && uploadImage("conduct_image_slug", uri, 0)}
                  />
                
              </View>
            }
            </>
            }

            {profile?.account_type === 2  &&
              <>
            <MoreDropDown
             title="Hospital Details"
              setState={setShowHospitalDets}
            />
            {showHospitalDets &&
              <View className="w-full mx-1 px-2 border-l border-gray-300">
          
                  {/* <InputField
                  label="Verified?"
                  // value={form?.email}
                  value={
                  profile?.verified ? "✅ True" : "❌ False"
                  }
                  containerStyle="w-full"
                  inputStyle="p-3.5"
                  editable={false}
                  //onBlur={() => saveProfileOnDb(form)}
                  /> */}
                
                  {/* { profile?.account_type === 'driver' && !profile?.verified &&
                    <Text className="text-sm px-2 text-red-600 font-JakartaRegular">
                    Add Details & Wait For Verification
                    </Text>
                  } */}
                  <InputField
                    label="Hospital / Fleet Name"
                    placeholder={hospitalForm?.name || ""}
                    value={hospitalForm?.name || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                    // editable={form?.name ? false : true}
                    onChangeText={(value)=> updateHospitalForm('name', value)}
                    
                  onBlur={() => saveHospitalOnDb("name", hospitalForm?.name, 2)}
                  />

                  <InputField
                    label="Hospital / Fleet Code"
                    placeholder={hospitalForm?.id && JSON.stringify(hospitalForm?.id )|| ""}
                    value={hospitalForm?.id && JSON.stringify(hospitalForm?.id )|| ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                     editable={false}
                    // editable={form?.name ? false : true}
                    // onChangeText={(value)=> updateProfileForm('name', parseInt(value, 10))}  
                    // onBlur={() => saveAmbulanceOnDb("name", hospitalForm?.id, 0)}
                  />
                
                  {/* <InputField
                    label="Registration No."
                    placeholder={hospitalForm?.registration_number || ""}
                    value={hospitalForm?.registration_number || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 text-gray-400"
                    // editable={form?.name ? false : true}
                    onChangeText={(value)=> updateHospitalForm('registration_number', value)}
                    
                  onBlur={() => saveHospitalOnDb("registration_number", hospitalForm?.registration_number, 2)}
                  /> */}

              
{/* 
                  <InputField
                    label="Service Description"
                    placeholder={hospitalForm?.description || "Not Found"}
                    value={hospitalForm?.description || ""}
                    containerStyle="w-full"
                    inputStyle="p-3.5 pb-16"
                    editable={true}
                    onChangeText={(value)=> updateProfileForm('description', value)}
                    
                  onBlur={() => saveProfileOnDb("description", form?.description, "client_edit")}
                  /> */}
                  <ImageInput
                    label="License"
                    icon={<Feather name="image" size={24} color="gray" />}
                    //value={form?.id_image_slug}
                    value={hospitalForm?.license_image_slug ? imageUrlCombiner("license_Image_slug", profile?.id_image_slug) : ''}
                    onChange={(uri) => uri && uploadImage("license_Image_slug", uri, 2)}
                  />
                
                
              </View>
            }
            </>
            }
          
          
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
