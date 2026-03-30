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
import { sendRideRequest, acceptRideRequest, cancelRide} from "@/lib/socket";
import { Ride } from "@/types/type";


const ConfirmRide = () => {
  
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


  const handleConfirmRide = async() => {
    //router.push("/(root)/approaching") 
 
    if(!ride) return;

    if (profile?.account_type === 0){
      console.log('confirm press')
      const requestedRide = {...ride, id:null, ride_state:0}
      sendRideRequest(requestedRide);
     
    }else{
     
      const acceptedRide = {...ride, ride_state:1}
      setRide(acceptedRide);
      acceptRideRequest(acceptedRide); //socket
   
      
    

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
  
      // <RideLayout title={profile?.account_type === 'client' ? "Request" : "Errand Request"} >
        <RideLayout title={"Confirm"} >
        <>
          <Text className="text-2xl text-center font-bold text-blue-600 mb-2">
          {/* {profile?.account_type === 'client' ? "Errand Information" : "Errand Request"} */}
          {profile?.account_type ===0 ? "Verify details then confirm": "Emergency request"}
          </Text>
        { profile?.account_type === 0 &&
          <View className="flex flex-col w-full items-center justify-center mt-2">
            <View className=" w-full flex flex-row items-center justify-center">
            {ride?.driver_data?.image_slug &&  ride?.driver_data?.image_slug?.length>0 &&
              <Image
    
               source={{
                            uri: ride?.driver_data?.image_slug ? imageUrlCombiner("image_slug", ride?.driver_data?.image_slug) : ''
                    }}
              className="w-12 h-12 rounded-full mr-0"
            />}
            
            </View>

            <View className="flex w-full flex-row items-center justify-around border-b border-general-700 mt-2 ">
            <Image
              source={ambulanceDetails?.ambulance_data?.vehicle_type!==null ? ambulanceDetails?.ambulance_data?.vehicle_type!==undefined && getVehicleType(ambulanceDetails?.ambulance_data?.vehicle_type)?.image : ""}
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
            {ride?.client_data?.image_slug && ride?.client_data?.image_slug?.length>0 &&
              <Image
    
               source={{
                            uri: ride?.client_data?.image_slug ? imageUrlCombiner("image_slug", ride?.client_data?.image_slug) : ''
                    }}
              className="w-12 h-12 rounded-full mr-0"
            />
            }
            
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

          <View className="mx-5 mt-5">
      
       
           <CustomButton
              // title = {profile?.account_type === 'client' ? "Select Errand" : "Accept Errand"}
                title = {"Confirm"}
              onPress={handleConfirmRide}
            /> 
          </View>

          <View className="mx-5 mt-5">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              onPress={handleCancelRide}
            />
          </View>

       
        </>
      </RideLayout>
  );
};

export default ConfirmRide;
