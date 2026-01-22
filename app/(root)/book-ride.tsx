import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { useEffect } from "react";
import { fetchAPI } from "@/lib/fetch";


import CustomButton from "@/components/CustomButton";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime, getVehicleType, roundToNearestTen } from "@/lib/utils";
import { useDriverStore, useLocationStore, useProfileStore, useRideStore, useSocketStore } from "@/store";
import { router } from "expo-router";
import { sendRideRequest, acceptRideRequest } from "@/lib/socket";


const BookRide = () => {
  const { user } = useUser();
  const { profile, setProfile } = useProfileStore(); 
  const { userAddress, destinationAddress } = useLocationStore();
  const {ride, setRide} = useRideStore();
  const { drivers, selectedDriver } = useDriverStore();
  const clearDestination = useLocationStore((s) => s.clearDestination);
  const {socket, setSocket} = useSocketStore();

  const driverDetails = drivers?.filter(
    (driver) => driver.user_id === selectedDriver,
  )[0];

  const handleAcceptErrand = async() => {

    if(!ride) return;

    if (profile?.account_type === 'client'){

      sendRideRequest(ride);
    
    }else{
     
      const acceptedRide = {...ride, ride_state:"accepted"}
      setRide(acceptedRide);
      acceptRideRequest(acceptedRide);
      await fetchAPI("/(api)/ride", { 
        method: "POST",
        body: JSON.stringify(acceptedRide),
      });
      router.push("/(root)/approaching")

    }

  }

  useEffect(() => {
    if(socket){
    socket.on("ride:accepted", (ride:any) => {
     setRide(ride);
    });

    router.push("/(root)/approaching")

    return () => socket.off("ride:accepted");
  }
  }, []);

  const handleCancelRide = () => {
 
    clearDestination(); 
    router.push("/(root)/(tabs)/home")
  };


  return (
  
      <RideLayout title={profile?.account_type === 'client' ? "Book Errand" : "Errand Request"} >
        <>
          <Text className="text-xl text-center font-JakartaSemiBold mb-2">
          {profile?.account_type === 'client' ? "Errand Information" : "Errand Request"}
          </Text>

          <View className="flex flex-col w-full items-center justify-center mt-2">
            <View className=" w-full flex flex-row items-center justify-center">
            <Image
              source={{ uri: driverDetails?.profile_image_slug }}
              className="w-12 h-12 rounded-full mr-0"
            />
            
            </View>

            <View className="flex w-full flex-row items-center justify-around border-b border-general-700 mt-2 ">
            <Image
              source={getVehicleType(driverDetails?.vehicle_type)?.image}
              className="w-16 h-16 rounded-full mr-4"
            />
              <Text className="text-base font-JakartaSemiBold mr-4">
                {driverDetails?.title}
              </Text>

              <View className="flex flex-row items-center space-x-0.5">
                <Image
                  source={icons.star}
                  className="w-6 h-6 mr-1"
                  resizeMode="contain"
                />
                <Text className="text-sm font-JakartaRegular">
                  {driverDetails?.rating}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-bold font-JakartaRegular">Errand Price</Text>
            
              <Text className="text-lg font-bold font-JakartaRegular text-green-600">
                Kshs. {driverDetails?.price && roundToNearestTen(driverDetails?.price)}
              </Text>
              
            </View>

            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
              <Text className="text-lg font-bold font-JakartaRegular">Pickup Time</Text>
              <Text className="text-base font-JakartaRegular">
                {formatTime(driverDetails?.time!)}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between w-full py-3">
              <Text className="text-lg font-bold font-JakartaRegular">Vehicle</Text>
              <Text className="text-base font-JakartaRegular">
                {getVehicleType(driverDetails?.vehicle_type)?.name}
              </Text>
            </View>
          </View>

          <View className="flex flex-col w-full items-start justify-center mt-5">
            <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
              <Image source={icons.to} className="w-6 h-6" />
              <Text className="text-base font-JakartaRegular ml-2">
                {userAddress}
              </Text>
            </View>

            <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
              <Image source={icons.point} className="w-6 h-6" />
              <Text className="text-base font-JakartaRegular ml-2">
                {destinationAddress}
              </Text>
            </View>
          </View>

          <View className="mx-5 mt-5">
      
       
           <CustomButton
              title = {profile?.account_type === 'client' ? "Select Errand" : "Accept Errand"}
              onPress={handleAcceptErrand}
            /> 
          </View>

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

export default BookRide;
