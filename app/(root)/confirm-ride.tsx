


import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";


import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore, usePackageStore, useLocationStore, useProfileStore, useRideStore } from "@/store";
import { handleCancelRide } from "@/lib/utils"; 

const ConfirmRide = () => { 
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const {setRide} = useRideStore();
  const {originLatitude, originLongitude, originAddress,
     destinationLatitude, destinationLongitude,
      destinationAddress} = useLocationStore();
  const {packageDescription, packageWeight} = usePackageStore();
  const {profile, setProfile} = useProfileStore();

  const createRideLocally = () =>{

    const selectedDriverObj = drivers.find(
      (d) => d.user_id === selectedDriver
    );
   
    if (!selectedDriverObj) return; // safety check

    const suggestedRide = {
      origin_address: originAddress ?? "",  
      destination_address: destinationAddress ?? "",
      origin_latitude: originLatitude ?? 0,
      origin_longitude: originLongitude ?? 0,
      destination_latitude: destinationLatitude ?? 0,
      destination_longitude: destinationLongitude ?? 0,
      ride_time: selectedDriverObj.time ?? 0, // <-- default 0 if undefined
      fare_price: selectedDriverObj.price ? Number(selectedDriverObj.price) : 0, // convert string to number if needed
      driver_id: selectedDriverObj.user_id,
      ride_state: "requested",
      user_id: profile?.user_id ?? "",
      user_data: {
        name: profile?.name ?? "",
        phone: profile?.phone ?? "",
        profile_image_slug: profile?.profile_image_slug ?? "",
      },
      package_weight: packageWeight ?? 0,
      package_description: packageDescription ?? "",
      created_at: new Date().toISOString(), // null will break TypeScript if Ride expects string
      driver_data: {
        name: selectedDriverObj.name ?? "",
        vehicle_type: selectedDriverObj.vehicle_type ?? 0,
        phone: selectedDriverObj.phone ?? "",
        profile_image_slug: selectedDriverObj.profile_image_slug ?? "",
      },
    };
  
    setRide(suggestedRide);

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
             
              onPress={()=>createRideLocally()}
            /> :
            <></>
            }
              <View className="mx-5 mt-5">
            <CustomButton
              title="Cancel Errand"
              bgVariant="danger"
              onPress={()=>handleCancelRide(router)}
            />
          </View>
          </View>
        )}
      /> 
      }
     
    </RideLayout>
  );
};

export default ConfirmRide;
