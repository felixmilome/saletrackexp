


import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";


import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore, usePackageStore, useLocationStore, useProfileStore, useRideStore } from "@/store";
 

const ConfirmRide = () => { 
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const {setRide} = useRideStore();
  const {userLatitude, userLongitude, userAddress,
     destinationLatitude, destinationLongitude,
      destinationAddress} = useLocationStore();
  const {packageDescription, packageWeight} = usePackageStore();
  const {profile, setProfile} = useProfileStore();

  const createRideLocally = (riderDetails: any) =>{
   
    const suggestedRide = {
      origin_address: userAddress,
      destination_address: destinationAddress,
      origin_latitude: userLongitude, 
      origin_longitude: destinationLongitude,
      destination_latitude: destinationLatitude,
      destination_longitude: destinationLongitude,
      ride_time: riderDetails?.time,
      fare_price: riderDetails?.price,
      driver_id: riderDetails?.user_id,
      ride_state: 'requested',
      user_id: profile?.user_id,
      user:{name: profile?.name, phone:profile?.phone, profile_image_slug: profile?.profile_image_slug},
      package_weight: packageWeight,
      package_description: packageDescription,
      created_at: null,
      driver:{name:riderDetails?.name, vehicle_type:riderDetails?.vehicle_type, phone:riderDetails?.phone, profile_image_slug:riderDetails?.profile_image_slug}
    }

    setRide(suggestedRide)

    router.push("/(root)/book-ride")


  }



  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "95%"]}>
      <View className='px-5 mb-1 border-b pb-6  border-gray-300'>
        <Text className="font-bold text-lg text-center">Package: {packageWeight ?? "No Weight"} kg</Text>
        <Text className="text-sm text-center">
              {packageDescription
          ? packageDescription.length > 50
            ? packageDescription.slice(0, 50) + "..."
            : packageDescription
          : "No description yet"}
        </Text>
      </View>

   
     {drivers?.length >0 &&
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item} 
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.user_id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            { selectedDriver ?
            <CustomButton
              title="Select Errand"
             
              onPress={()=>createRideLocally(selectedDriver)}
            /> :
            <></>
            }
          </View>
        )}
      /> 
      }
     
    </RideLayout>
  );
};

export default ConfirmRide;
