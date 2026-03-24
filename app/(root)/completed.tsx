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
import RatingWithCommentInput from "@/components/RatingWithCommentInput"; 
import { cancelRide } from "@/lib/socket";

const Completed = () => { 

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

  const handleDone = async() => {
  
    

  }
  
  const handleCancelRide = async() => {
    const newRide = {...ride, ride_state:4}
    setRide

    if (profile?.account_type === 0){
 
      cancelRide(ride?.driver_data?.id!)
    
    }
    else{
     cancelRide(ride?.client_data?.id!, true)
     
    }

  };
  


  return (
  
  
     <RideLayout title="Rate Ride">
          <>
          
                  <Text className="text-2xl text-center font-bold text-blue-600 mb-2">
                  {/* {profile?.account_type === 'client' ? "Errand Information" : "Errand Request"} */}
                  {profile?.account_type ===0 ? "Pay and Rate Service": "Rate Client"}
                  </Text>
            
        
                  <RatingWithCommentInput
                    rater_id={profile?.id!}
                    rated_id={profile?.account_type === 0 ? profile?.id! : ride?.driver_data?.id!}
                    ride_id={ride?.id!}
                    onSubmit={({ rating, comment }) => {
                      console.log("rating:", rating);
                      console.log("comment:", comment);
                      handleDone();

                      // send to backend
                      // api.post("/reviews", { rating, comment })
                    }}
                  />
    
                  <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">Price</Text>
                    
                      <Text className="text-lg font-bold font-JakartaRegular">

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
                  {/* <View className="w-full border-b border-white p-4">
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
                    </View> */}
        
                  {/* <View className="flex flex-col w-full items-start justify-center">
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
                  </View>  */}

       
          <View className="mx-5 mt-10">
            <CustomButton
              title="Complete Trip"
              bgVariant="primary"
              onPress = {handleCancelRide}
              // onPress={() => router.push("/(root)/arrived")}
            />
          </View>
          

          {/* <View className="mx-5 mt-5">
            <CustomButton
              title="Cancel Errand"
              bgVariant="danger"
              onPress={()=>handleCancelRide(router)}
            />
          </View> */}
        </>
      </RideLayout>
  );
};

export default Completed;
