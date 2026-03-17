


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

    router.push("/(root)/confirm-ride")


  }



  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "95%"]}>

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
