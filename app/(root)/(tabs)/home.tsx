import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images, serviceTypes } from "@/constants";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { useDeviceLocationStore, useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore, useProfileStore, useHospitalStore, resetAllStores, useSocketStore } from "@/store";
import { ProfileData, Ride } from "@/types/type";
import DriverCard from "@/components/DriverCard";
import DriverCardCope from "@/components/DriverCardCope";
import CustomButton from "@/components/CustomButton";
import { sendHello} from "@/lib/socket";
import CustomDropdown from "@/components/CustomDropdown";


const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const {hospital, setHospital} = useHospitalStore();
  const {socket} = useSocketStore();
  

  //const {userAddress, setUserLocation, setDestinationLocation } = useLocationStore();
  const {setDeviceLocation} = useDeviceLocationStore();
  const {fromLocation, setFromLocation} = useFromLocationStore();
  const {toLocation, setToLocation} = useToLocationStore();
  const {ambulances, selectedAmbulance, setSelectedAmbulance} = useAmbulanceMarkersStore();

  const handleSignOut = async() => {
    //signOut();
    try{
      resetAllStores();
      router.replace("/(auth)/sign-in");
    }catch(err){
      console.log(err);
    }
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
   
      if (status !== "granted") {
 
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});


      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });
 

      setDeviceLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta:0.01,
        heading:0,
        address: `${address[0].name}, ${address[0].region}`, 
      });
      setFromLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
         address: `${address[0].name}, ${address[0].region}`,
      })
    })();
  }, []);

  const handleFromPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setFromLocation(location);

    //router.push("/(root)/find-ride");
  };
   
  const handleToPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setToLocation(location);

    router.push("/(root)/find-ride");
  };

  const handleFindRide =()=>{
    router.push("/(root)/find-ride");
  }

  const saveProfileOnDb = async <K extends keyof ProfileData> (key: string, value: ProfileData[K]) => {

    if (value !== profile[key]){
       try {
         await fetchAPI("/(api)/user", { 
           method: "PATCH", 
           // headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ user_id:profile.user_id, key, value }),
         });
         
         const newProfileData = { ...profile, [key]: value}
         setProfile(newProfileData);

       } catch (err) {
         console.log("Auto-save failed", err);
       }
     }
   };

  const handleAccountChange = (value: string | null | undefined)  => {

    saveProfileOnDb("account_type", value);
  
  };

// console.log({socket})

  return ( 
    <SafeAreaView className="flex-1">

      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <></>}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {profile?.name}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

           {/* { profile?.account_type === 'client' && */}

          
    
             
            <View className="mb-2"> 
               <Text className="mb-1 font-bold">From:</Text>
              <GoogleTextInput
                icon={icons.search}
                initialLocation={fromLocation?.address!}
                containerStyle="bg-white shadow-md shadow-neutral-300"
                handlePress={handleFromPress}
              />

            </View>
             <Text className="mb-1 font-bold">To:</Text>
              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white shadow-md shadow-neutral-300"
                handlePress={handleToPress}
              />

              {fromLocation?.address && toLocation?.address &&
                 <CustomButton
                  title="Find Ambulance"
                  onPress={handleFindRide}
                  className="mt-6"
                />
              }


            {/* } */}

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-1">
                Your current location
              </Text>
             
              <View className="flex flex-row items-center bg-transparent  h-[300px]">
                <Map />                     
              </View>
             
                 {profile?.account_type === 2 &&
       <>
       <View className='py-4'>
            <Text className='font-bold text-lg'> Ambulances </Text>
            <Text> Hospital: {hospital?.name}, Code 182</Text>     
       </View>
       
    

       {ambulances?.length >0 &&
       <>
       
      <FlatList
        data={ambulances}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCardCope
            item={item} 
            selected={selectedAmbulance!}
            setSelected={() => setSelectedAmbulance(item.id!)}
          />
        )}
        ListFooterComponent={() => 
          (
            <></>
          // <View className="mx-5 mt-10">
          //   { selectedAmbulance ?
          //   <CustomButton
          //     title="Select Ambulance"
             
          //     onPress={()=>createRideLocally()}
          //   /> :
          //   <></>
          //   }
          //     <View className="mx-5 mt-10">
          //   <CustomButton
          //     title="Cancel"
          //     bgVariant="danger"
          //     // onPress={()=>handleCancelRide(router)}
          //   />
          // </View>
          // </View>
        )
      }
      /> 
      </> 
      
      }
      </>
    }

                   
                {/* <RadioInput
                  label="Account Mode"
                  value={profile?.account_type}
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
                /> */}
               <TouchableOpacity

                onPress={() =>{
                   sendHello(profile?.email);
                   console.log(socket?.id);
                  }}
                
                className="p-4 border bg-red-100">
                  <Text>
                    Say Hello
                  </Text>
                </TouchableOpacity> 
                {/* <View className=" px-4">
                      <View className = "flex flex-row items-center pt-4">
                        <Text className= "text-lg font-JakartaBold">Account Mode:</Text>
                        <Text className= "text-md ml-2 text-blue-600 font-JakartaBold">{profile?.account_type === 'driver' ? 'Rider' : 'Client'}</Text>
                      </View>
                   
                      { profile?.account_type === 'driver' && profile?.verified ?
                      <Text className=" text-sm text-red-600 font-JakartaRegular">
                        ~ Not Rider Verified: Go to profile to verify 
                      </Text> :
                      <Text className=" text-sm text-blue-600 font-JakartaRegular">
                        ~ Wait For Clients To Book You
                    </Text>
                    }
              </View> */}
            </>

            {/* <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text> */}
          </>
        }

      />
      
    </SafeAreaView>
  );
};

export default Home;
