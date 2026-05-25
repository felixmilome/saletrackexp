import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView, Alert } from "react-native";
import { useState } from "react";

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import GoogleTextInput from "@/components/GoogleTextInput";
import { serviceTypes } from "@/constants";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useFromLocationStore, useProfileStore, useErrandStore, useToLocationStore, useDeviceLocationStore, useAgentStore, useMyAgentsStore} from "@/store";
import { decimalizeInput} from "@/lib/utils";
import InputField from "@/components/InputField";
import { Errand} from "@/types/type";
import { cancelRide } from "@/lib/socket"; 
import { fetchAPI } from "@/lib/fetch";

import KeyboardAwareInput from  "@/components/KeyboardAwareInput";
import { create } from "zustand";
import DateTimePickerScreen from "@/components/DateTimePickerRn";

const CreateErrand = () => { 
  // const {
  //   userAddress,
  //   destinationAddress,
  //   setDestinationLocation,
  //   setOriginLocation,
  // } = useLocationStore();

  const {fromLocation, setFromLocation} = useFromLocationStore();
  const {toLocation, setToLocation} = useToLocationStore();
  const { errand, setErrand, clearErrand, updateErrand } = useErrandStore();
  const {profile} = useProfileStore();
  const {agent, setAgent} = useAgentStore();
  const [service, setService] = useState(3);
   const {myAgents, setMyAgents, selectedAgentId, setSelectedAgentId} = useMyAgentsStore();


const pushKeyValue = <K extends keyof Errand>(
  key: K,
  value: Errand[K]
) => {
  setErrand({
    ...errand,
    [key]: value,
  } as Errand);
};


 const handleFromPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // setFromLocation(location);
    pushKeyValue("from_address", location.address);
    pushKeyValue("from_latitude", location.latitude);
    pushKeyValue("from_longitude", location.longitude);
    //router.push("/(root)/find-ride");
  };
   
  const handleToPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // setToLocation(location);
    pushKeyValue("to_address", location.address);
    pushKeyValue("to_latitude", location.latitude);
    pushKeyValue("to_longitude", location.longitude);

    //router.push("/(root)/find-ride");
  };


  const scheduleErrand = async() => {

      const newErrand =  { 
        ...errand, 
        status:1, // 1 for pending/scheduled, 2 for active, 3 for completed, 4 for cancelled
        from_address: fromLocation?.address,               // spread previous values
        from_latitude: fromLocation?.latitude,
        from_longitude: fromLocation?.longitude,

        to_address: toLocation?.address,
        to_latitude: toLocation?.latitude,
        to_longitude: toLocation?.longitude,

        agent_id: profile?.account_type === 1 ? profile?.id : selectedAgentId,
      } as Errand;
      console.log(newErrand)
      
      //  setErrand(newErrand);
  

        try {
              const res = await fetchAPI("/(api)/errand", { 
                method: "POST", 
                body: JSON.stringify(newErrand),
              });

              console.log("Errand created successfully", res);

              if (res?.success){
                    router.push("/(root)/(tabs)/agents");
                    Alert.alert("Success", "Scheduled successfully.");
                    // setAgent({...agent, current_errand_id: res.data.id });
                    // setErrand(res.data);         
              }else{
                Alert.alert("Error", "Failed Please Try Again.");
              }
        
            } catch (err) {
              console.log("Auto-save failed", err);
               Alert.alert("Error", "Failed Please Try Again.");
        }


    }


  const startErrand = async() => {

      const newErrand =  { 
        ...errand, 
        status:2, // 1 for pending, 2 for active, 3 for completed, 4 for cancelled
        from_address: fromLocation?.address,               // spread previous values
        from_latitude: fromLocation?.latitude,
        from_longitude: fromLocation?.longitude,

        to_address: toLocation?.address,
        to_latitude: toLocation?.latitude,
        to_longitude: toLocation?.longitude,

        agent_id: profile?.id,
      } as Errand;
      
       setErrand(newErrand);
  

        try {
              const res = await fetchAPI("/(api)/errand", { 
                method: "POST", 
                body: JSON.stringify(newErrand),
              });

              console.log("Errand created successfully", res);

              if (res?.success){
                    router.push("/(root)/on-errand");
                    setAgent({...agent, current_errand_id: res.data.id });
                    setErrand(res.data);         
              }else{
                Alert.alert("Error", "Failed Please Try Again.");
              }
        
            } catch (err) {
              console.log("Auto-save failed", err);
               Alert.alert("Error", "Failed Please Try Again.");
        }


    }
  return (
    <RideLayout title="Create Task">
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
          onChangeText={(val) => pushKeyValue("action_plan", val)}
          multiline={true}
          numberOfLines={3} // optional: sets the visible input height
        /> 
        </View>

        
    <Text className="text-lg font-JakartaSemiBold mb-3">From: </Text>
        <GoogleTextInput 
          icon={icons.target}
          initialLocation={errand?.from_address!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
           handlePress={handleFromPress}
        />
      </View>

      <View className="mt-2">
        <Text className="text-lg font-JakartaSemiBold mb-3">To: </Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={errand?.to_address!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
           handlePress={handleToPress}
        />
      </View>

        <DateTimePickerScreen
                  title="Deadline:"
                  onChangeValue={async(date) => {
                    const strDate = date.toISOString();
                    pushKeyValue("deadline", strDate)
                    console.log("Selected:", date);
                  }}
        />


      <CustomButton
        title="Schedule Task"
        onPress={scheduleErrand}
        className="mt-5"
      />

  
      <CustomButton
        title="Start Task"
        onPress={startErrand}
        className="mt-5"
        bgVariant="success"
      />


      <View className=" mt-8">
            <CustomButton
              title="Cancel"
              bgVariant="danger"
              onPress={()=>{
                clearErrand();
                router.push("/(root)/(tabs)/home");
              }}
            />
      </View>
      
    </RideLayout>
  );
};

export default CreateErrand;
