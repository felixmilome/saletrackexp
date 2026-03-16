import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView } from "react-native";
import { useState } from "react";

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import GoogleTextInput from "@/components/GoogleTextInput";
import { serviceTypes } from "@/constants";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useFromLocationStore, useRideStore, useToLocationStore, useDeviceLocationStore} from "@/store";
import { decimalizeInput, handleCancelRide } from "@/lib/utils";
import InputField from "@/components/InputField";
import { Ride } from "@/types/type";


import KeyboardAwareInput from  "@/components/KeyboardAwareInput";

const FindRide = () => { 
  // const {
  //   userAddress,
  //   destinationAddress,
  //   setDestinationLocation,
  //   setOriginLocation,
  // } = useLocationStore();

  const {fromLocation, setFromLocation} = useFromLocationStore();
  const {toLocation, setToLocation} = useToLocationStore();
  const { ride, setRide, updateRide } = useRideStore();
  const [service, setService] = useState(3);


const pushDescription = (val: string | null) => {
  setRide({
    ...ride,                // spread previous values
    description: val,
  } as Ride);
};

const pushService = (val: number | null) => {
  setRide({
    ...ride,                // spread previous values
    service_type: val,
  } as Ride);
};
//console.log({ride});
  return (
    <RideLayout title="Ride">
      <View className="mt-2">
      
        <View className="mt-3">

        {/* <Text className="text-lg font-JakartaSemiBold mb-3">Service Description:</Text> */}
    
      </View>

         <CustomDropdown 
              label="Choose Service Type:"
              value={ride?.service_type}
              //onChange={(value) => updateForm("vehicle_type", value)}
              onChange={(value) => 
                {
                
                  pushService(value);
                
                }
            }
              options={[
                  { label: serviceTypes?.specimen_delivery, value: 0},
                  { label: serviceTypes?.bike_ambulance, value: 1},
                  { label: serviceTypes?.bls_ambulance, value: 2},
                  { label: serviceTypes?.acls_ambulance, value: 3},    
                
              ]}
        />
            <View className="">
        <InputField
          label="Description:"
          placeholder="Describe the Patient or Specimen."
          icon={null}
          value={ride?.description ?? ""}
          onChangeText={pushDescription}
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
          handlePress={(location:any) => setFromLocation(location)}
        />
      </View>

      <View className="mt-2">
        <Text className="text-lg font-JakartaSemiBold mb-3">To: </Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={toLocation?.address!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location:any) => setToLocation(location)}
        />
      </View>


   

  
      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />

      <View className="mx-5 mt-12">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              onPress={()=>handleCancelRide(router)}
            />
      </View>
      
    </RideLayout>
  );
};

export default FindRide;
