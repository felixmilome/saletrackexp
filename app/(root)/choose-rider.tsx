


import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";


import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import {useProfileStore, useRideStore, useAmbulanceMarkersStore, useFromLocationStore, useToLocationStore } from "@/store";
// import { handleCancelRide } from "@/lib/utils"; 
import { cancelRide } from "@/lib/socket";

const ChooseRider = () => { 
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

  const handleConfirm = () =>{

    router.push("/(root)/confirm-ride")


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
             
              onPress={()=>handleConfirm()}
            /> :
            <></>
            }
              <View className="mx-5 mt-10">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              onPress={handleCancelRide}
            />
          </View>
          </View>
        )}
      /> 
      }
     
    </RideLayout>
  );
};

export default ChooseRider;
