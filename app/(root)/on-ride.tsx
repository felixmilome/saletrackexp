import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View, ScrollView } from "react-native";
import { useEffect } from "react";
import { fetchAPI } from "@/lib/fetch";


import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime, getVehicleType, getServiceByNumber, roundToNearestTen, handleCancelRide, imageUrlCombiner } from "@/lib/utils";
import { useAmbulanceStore, useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore, useProfileStore, useRideStore, useSocketStore } from "@/store";
import { router } from "expo-router";
import { sendRideCompleted, sendRiderWaiting} from "@/lib/socket";
import { Ride } from "@/types/type";
import { cancelRide } from "@/lib/socket";

const OnRide = () => {

  const { profile, setProfile } = useProfileStore(); 
  // const { userAddress, destinationAddress } = useLocationStore();
  const {fromLocation} = useFromLocationStore();
  const {toLocation} = useToLocationStore();
  const {ride, setRide} = useRideStore();
  const { ambulances, selectedAmbulance } = useAmbulanceMarkersStore();



  const {socket, setSocket} = useSocketStore();

  const ambulanceDetails = ambulances?.filter(
    (ambulance) => ambulance.id === selectedAmbulance,
  )[0]; 


  
  const handleComplete = async() => {

    if(!ride) return;

    if (profile?.account_type !==0 ){
     
      
      const newRide = {...ride, ride_state:4 }
      setRide(newRide);
     if( ride?.client_data?.id){
        sendRideCompleted(ride?.client_data?.id); //socket
      // router.push("/(root)/arrived");
     }

    }

  }

    const handleCancelRide = () => {
  
      if (profile?.account_type === 0){
   
        cancelRide(ride?.driver_data?.id!)
      
      }
      else{
       cancelRide(ride?.client_data?.id!)
       
      }
  
    };






  return (
  
      <RideLayout title="On Ride">
          <>
                  <Text className="text-2xl text-center font-bold text-blue-600 mb-2">
                  {/* {profile?.account_type === 'client' ? "Errand Information" : "Errand Request"} */}
                  {profile?.account_type ===0 ? "OnRide Destination": "OnRide Destination"}
                  </Text>
                { profile?.account_type === 0 &&
                  <View className="flex flex-col w-full items-center justify-center mt-2">
                    <View className=" w-full flex flex-row items-center justify-center">
                    <Image
            
                       source={{
                                    uri: ride?.driver_data?.image_slug ? imageUrlCombiner("image_slug", ride?.driver_data?.image_slug) : ''
                            }}
                      className="w-12 h-12 rounded-full mr-0"
                    />
                    
                    </View>
        
                    <View className="flex w-full flex-row items-center justify-around border-b border-general-700 mt-2 ">
                    <Image
                      source={ambulanceDetails?.ambulance_data?.vehicle_type!==null ? ambulanceDetails?.ambulance_data?.vehicle_type!==undefined && getVehicleType(ambulanceDetails.ambulance_data?.vehicle_type)?.image : ""}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                      <Text className="text-base font-JakartaSemiBold mr-4">
                        {ambulanceDetails?.name}
                      </Text>
        
                      <View className="flex flex-row items-center space-x-0.5">
                        <Image
                          source={icons.star}
                          className="w-6 h-6 mr-1"
                          resizeMode="contain"
                        />
                        <Text className="text-sm font-JakartaRegular">
                          {/* {ambulanceDetails?.rating} */} 4
                        </Text>
                      </View>
                    </View>
                  </View>
                } 
        
                { profile?.account_type !== 0 &&
                  <View className="flex flex-col w-full items-center justify-center mt-2">
                    <View className=" w-full flex flex-row items-center justify-center">
                    <Image
            
                       source={{
                                    uri: ride?.client_data?.image_slug ? imageUrlCombiner("image_slug", ride?.client_data?.image_slug) : ''
                            }}
                      className="w-12 h-12 rounded-full mr-0"
                    />
                    
                    </View>
        
                    <View className="flex w-full flex-row items-center justify-around border-b border-general-700 mt-2 ">
                    {/* <Image
                      source={ambulanceDetails.ambulance_data?.vehicle_type!==null ? ambulanceDetails.ambulance_data?.vehicle_type!==undefined && getVehicleType(ambulanceDetails.ambulance_data?.vehicle_type)?.image : ""}
                      className="w-16 h-16 rounded-full mr-4"
                    /> */}
                      <Text className="text-base font-JakartaSemiBold mr-4">
                        {ride?.client_data?.name}
                      </Text>
        
                      <View className="flex flex-row items-center space-x-0.5">
                        <Image
                          source={icons.star}
                          className="w-6 h-6 mr-1"
                          resizeMode="contain"
                        />
                        <Text className="text-sm font-JakartaRegular">
                          {/* {ambulanceDetails?.rating} */} 4
                        </Text>
                      </View>
                    </View>
                  </View>
                }
        
                  <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">Price</Text>
                    
                      <Text className="text-lg font-bold font-JakartaRegular">
                        {/* Kshs. {ambulanceDetails?.price && roundToNearestTen(Number(ambulanceDetails.price))} */}
                        Kshs. {ride?.price}
                       </Text>
                      
                    </View>
        
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">Pickup Time</Text>
                      <Text className="text-base font-JakartaRegular">
                        {/* {formatTime(ambulanceDetails?.time!)}? */}
                        {ride?.pickup_estimate_minutes} min
                      </Text>
                    </View>
                    
        
                    <View className="flex flex-row items-center justify-between w-full py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">Vehicle</Text>
                      <Text className="text-base font-JakartaRegular">
                         {ambulanceDetails?.ambulance_data?.vehicle_type!==null && ambulanceDetails?.ambulance_data?.vehicle_type!==undefined && getServiceByNumber(ambulanceDetails?.ambulance_data?.vehicle_type)}
                      </Text>
                    </View>
                    
                  </View>
                  <View className="w-full border-b border-white p-4">
                      <Text className="text-lg font-bold font-JakartaRegular mr-2">Description:</Text>
                      <ScrollView
                          style={{ maxHeight: 120 }} // grows with text until 120
                          showsVerticalScrollIndicator={true}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "JakartaRegular",
                            }}
                          >
                            {ride?.description} 
                          </Text>
                      </ScrollView>
                    </View>
        
                  <View className="flex flex-col w-full items-start justify-center">
                    <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
                      <Image source={icons.to} className="w-4 h-4" />
                      <Text className="text-sm font-JakartaRegular ml-2">
                        {fromLocation?.address}
                      </Text>
                    </View>
        
                    <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
                      <Image source={icons.point} className="w-4 h-4" />
                      <Text className="text-sm font-JakartaRegular ml-2">
                        {toLocation?.address}
                      </Text>
                    </View>
                  </View> 

          {profile.account_type !== 0 && 
          <View className="mx-5 mt-10">
            <CustomButton
              title="Complete Trip"
              bgVariant="primary"
              onPress = {handleComplete}
              // onPress={() => router.push("/(root)/arrived")}
            />
          </View>
          }

          <View className="mx-5 mt-5">
            <CustomButton
              title="Cancel Errand"
              bgVariant="danger"
              onPress={handleCancelRide}
            />
          </View>
        </>
      </RideLayout>
  );
};

export default OnRide;
