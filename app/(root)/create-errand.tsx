import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import GoogleTextInput from "@/components/GoogleTextInput";
import { serviceTypes } from "@/constants";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useFromLocationStore, useProfileStore, useErrandStore, useToLocationStore, useDeviceLocationStore} from "@/store";
import { decimalizeInput} from "@/lib/utils";
import InputField from "@/components/InputField";
import { Errand} from "@/types/type";
import { cancelRide } from "@/lib/socket"; 


import KeyboardAwareInput from  "@/components/KeyboardAwareInput";
import { create } from "zustand";

const CreateErrand = () => { 
  // const {
  //   userAddress,
  //   destinationAddress,
  //   setDestinationLocation,
  //   setOriginLocation,
  // } = useLocationStore();

  const {fromLocation, setFromLocation} = useFromLocationStore();
  const {toLocation, setToLocation} = useToLocationStore();
  const { errand, setErrand, updateErrand } = useErrandStore();
  const {profile} = useProfileStore();
  const [service, setService] = useState(3);


const pushActionDescription = (val: string | null) => {
  setErrand({
    ...errand,                // spread previous values
    action_plan: val,
  } as Errand);
};

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


  };


  const createErrand = async() => {
  
      setErrand({
        ...errand, 
        from_address: fromLocation?.address,               // spread previous values
        from_latitude: fromLocation?.latitude,
        from_longitude: fromLocation?.longitude,

        to_address: toLocation?.address,
        to_latitude: toLocation?.latitude,
        to_longitude: toLocation?.longitude,

        agent_id: profile?.id,
      } as Errand);

       router.push("/(root)/find-ride");
    
    }
  return (
    <RideLayout title="Ride">
      <View className="mt-2">
      
        <View className="mt-3">

        {/* <Text className="text-lg font-JakartaSemiBold mb-3">Service Description:</Text> */}
    
      </View>


      <View className="">
        <InputField
          label="Action Plan:"
          placeholder="Brief description of the action plan."
          icon={null}
          value={errand?.action_plan ?? ""}
          onChangeText={pushActionDescription}
          multiline={true}
          numberOfLines={3} // optional: sets the visible input height
        /> 
        </View>
    <Text className="text-lg font-JakartaSemiBold mb-3">From: </Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={fromLocation?.address!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
           handlePress={handleFromPress}
        />
      </View>

      <View className="mt-2">
        <Text className="text-lg font-JakartaSemiBold mb-3">To: </Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={toLocation?.address!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
           handlePress={handleToPress}
        />
      </View>


   

  
      <CustomButton
        title="Create Errand"
        onPress={createErrand}
        className="mt-5"
      />

      <View className="mx-5 mt-12">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              onPress={()=>cancelRide(profile?.id)}
            />
      </View>
      
    </RideLayout>
  );
};

export default CreateErrand;
