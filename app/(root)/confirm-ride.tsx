


import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";


import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import {useProfileStore, useRideStore, useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore } from "@/store";
// import { handleCancelRide } from "@/lib/utils"; 

const ConfirmRide = () => { 
  // const { drivers, selectedDriver, setSelectedAmbulance } = useDriverStore();
  const {ride, setRide} = useRideStore();
  const {fromLocation} = useFromLocationStore();
  const {toLocation} = useToLocationStore();
  // const {originLatitude, originLongitude, originAddress,
  //    destinationLatitude, destinationLongitude,
  //     destinationAddress} = useLocationStore();
  // const {packageDescription, packageWeight} = usePackageStore();
  const {profile, setProfile} = useProfileStore();

  const {ambulances, selectedAmbulance,setSelectedAmbulance} = useAmbulanceMarkersStore();

  const createRideLocally = () =>{

    const selectedAmbulanceObj = ambulances.find(
      (a) => a.id === selectedAmbulance
    );
    if (!selectedAmbulanceObj) return;

    //  setRide({
    //     ...ride,                // spread previous values
    //     service_type: val,
    //   } as Ride);

      const newRide = {
        id: null,
        origin_address: fromLocation?.address,
        destination_address: toLocation?.address,
        origin_latitude: fromLocation?.latitude,
        origin_longitude: fromLocation?.longitude,
        destination_latitude: toLocation?.latitude,
        destination_longitude: toLocation?.longitude,
        ride_state: 0,
        service_type: ride?.service_type,
        ride_time: null,
        fare_price: 1000,
        description: ride?.description,
        created_at: Date.now(),
        client_data: {
          id: profile?.id,
          name: profile?.name || null,
          phone: profile?.phone || null,
          image_slug: profile?.image_slug || null,
        },
        driver_data: {
          id: selectedAmbulanceObj?.id,
          name: selectedAmbulanceObj?.name || null,
          vehicle_type: selectedAmbulanceObj?.ambulance_data?.vehicle_type || null,
          phone: selectedAmbulanceObj?.phone || null,
          image_slug: selectedAmbulanceObj?.image_slug || null,
        },
      };
      setRide(newRide);

    router.push("/(root)/book-ride")


  }



  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "95%"]}>
      {/* <View className='px-5 mb-1 border-b pb-6  border-gray-300'>
        <Text className="font-bold text-lg text-center">Package: {packageWeight ?? "No Weight"} kg</Text>
        <Text className="text-sm text-center">
              {packageDescription
          ? packageDescription.length > 50
            ? packageDescription.slice(0, 50) + "..."
            : packageDescription
          : "No description yet"}
        </Text>
      </View> */}

   
     {ambulances?.length >0 &&
      <FlatList
        data={ambulances}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item} 
            selected={selectedAmbulance!}
            setSelected={() => setSelectedAmbulance(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            { selectedAmbulance ?
            <CustomButton
              title="Select Ambulance"
             
              onPress={()=>createRideLocally()}
            /> :
            <></>
            }
              <View className="mx-5 mt-10">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              // onPress={()=>handleCancelRide(router)}
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
