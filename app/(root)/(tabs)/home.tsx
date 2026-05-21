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

// console

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images, serviceTypes } from "@/constants";
import { fetchAPI, useFetch } from "@/lib/fetch";
import { useDeviceLocationStore, useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore, useProfileStore, useHospitalStore, resetAllStores, useSocketStore, useErrandStore } from "@/store";
import { Errand, ProfileData, Ride } from "@/types/type";
import DriverCard from "@/components/DriverCard";
import DriverCardCope from "@/components/DriverCardCope";
import CustomButton from "@/components/CustomButton";
import { sendHello} from "@/lib/socket";
import CustomDropdown from "@/components/CustomDropdown";
import { useLiveDeviceLocation } from "@/hooks/useDeviceLocation";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import DateTimePickerScreen from "@/components/DateTimePickerRn";


const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const {hospital, setHospital} = useHospitalStore();
  const {socket} = useSocketStore();
  

  //const {userAddress, setUserLocation, setDestinationLocation } = useLocationStore();
  const {deviceLocation, setDeviceLocation} = useDeviceLocationStore();
  const {fromLocation, setFromLocation} = useFromLocationStore();
  const {toLocation, setToLocation} = useToLocationStore();
  const {ambulances, selectedAmbulance, setSelectedAmbulance} = useAmbulanceMarkersStore();
  const { errand, setErrand, clearErrand, updateErrand } = useErrandStore();
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


  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
   
  //     if (status !== "granted") {
 
  //       setHasPermission(false);
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});


  //     const address = await Location.reverseGeocodeAsync({
  //       latitude: location.coords?.latitude!,
  //       longitude: location.coords?.longitude!,
  //     });
 

  //     setDeviceLocation({
  //       latitude: location.coords?.latitude,
  //       longitude: location.coords?.longitude,
  //       latitudeDelta: 0.01,
  //       longitudeDelta:0.01,
  //       heading:0,
  //       address: `${address[0].name}, ${address[0].region}`, 
  //     });
  //     setFromLocation({
  //       latitude: location.coords?.latitude,
  //       longitude: location.coords?.longitude,
  //        address: `${address[0].name}, ${address[0].region}`,
  //     })

  //      try {
  //      const res = await fetchAPI("/(api)/user/edit-profile", { 
  //                       method: "PATCH",
  //                       body: JSON.stringify(
  //                         {
  //                           id: profile?.id,
  //                           table: "users",
  //                           date:{
  //                             current_latitude: location.coords?.latitude,
  //                             current_longitude: location.coords?.longitude,
  //                             current_address: `${address[0].name}, ${address[0].region}`,  
  //                           }
  //                         }
  //                       ),
  //                   });
        
  //     } catch (err: any) {
  //       console.log(JSON.stringify(err, null, 2));
  //     }
      
  //   })();
  // }, []);

    // note
  // usefromloc is for inputs only but for rides ride obj
  
  useLiveDeviceLocation();

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

    // router.push("/(root)/find-ride");
  };

  const pushKeyValue = <K extends keyof Errand>(
    key: K,
    value: Errand[K]
  ) => {
    setErrand({
      ...errand,
      [key]: value,
    } as Errand);
  };

  const handleCreateErrand =()=>{
     router.push("/(root)/create-errand");
  }
    const handleScheduleErrand =()=>{
     router.push("/(root)/create-errand");
  }


  return ( 
    <SafeAreaView className="flex-1 p-4">
          <>
            <View className="flex flex-row items-center justify-between my-5 ">
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
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-2">
                Current Locations
              </Text>

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
                  title="Create Errand"
                  onPress={handleCreateErrand}
                  className="mt-6"
                />
              }
                 <CustomButton
                  title="Schedule Errand"
                  onPress={handleScheduleErrand}
                  className="mt-6"
                />

              {/* <DateTimePickerScreen
                  title="Deadline:"
                  onChangeValue={(date) => {
                    console.log("Selected:", date);
                  }}
            /> */}

             
              <View className="flex flex-row items-center bg-transparent  h-[300px] mt-2 rounded-lg overflow-hidden">
                <Map />                     
              </View>
             
     {/* {profile?.account_type === 2 &&
       <>
       <View className='py-4'>
            <Text className='font-bold text-lg'> Ambulances </Text>
            <Text> Hospital: {hospital?.name}, Code 182</Text>     
       </View>
      </>
    } */}

            </>


          </>
  
      
    </SafeAreaView>
  );
};

export default Home;
