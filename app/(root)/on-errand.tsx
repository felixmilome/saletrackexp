import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView, Alert } from "react-native";
import { useState } from "react";

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import GoogleTextInput from "@/components/GoogleTextInput";
import { serviceTypes } from "@/constants";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useFromLocationStore, useProfileStore, useAgentStore, useErrandStore, useToLocationStore, useDeviceLocationStore} from "@/store";
import { decimalizeInput, formatTimestamp} from "@/lib/utils";
import InputField from "@/components/InputField";
import { Errand} from "@/types/type";
import { cancelRide } from "@/lib/socket"; 
import { fetchAPI } from "@/lib/fetch";


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
  const { errand, setErrand, clearErrand, updateErrand } = useErrandStore();
  const {profile} = useProfileStore();
  const [service, setService] = useState(3);
  const {agent, setAgent} = useAgentStore();


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


  const completeTask = async() => {
  
      setErrand({
        ...errand, 
        status: 3, // 1 for pending, 2 for active, 3 for completed, 4 reported, 5 for cancelled
  
      } as Errand);

       try {

                    const ended_at = new Date().toISOString()
                    console.log("Completed At:", ended_at);
         
                    const res = await fetchAPI("/(api)/errand", { 
                      method: "POST", 
                      body: JSON.stringify({id: errand?.id, agent_id: profile?.id, status: 3, ended_at: ended_at}),
                    });
       
                    console.log("Errand created successfully", res);
      
                    if (res?.success){
                          router.push("/(root)/on-errand");
                          // setAgent({...agent, current_errand_id: res.data.id });
                          setErrand(res.data);         
                    }else{
                      Alert.alert("Error", "Failed Please Try Again.");
                    }
              
                  } catch (err) {
                    console.log("Auto-save failed", err);
                     Alert.alert("Error", "Failed Please Try Again.");
              }

      

       router.push("/(root)/complete-errand");
    
    }
  return (
    <RideLayout title="On Task">
      <View className="mt-2">

                  {errand?.created_at && (
                    <View className="flex flex-row items-center justify-between w-full py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">
                        Created At:
                      </Text>
        
                      <Text className="text-base font-JakartaRegular flex-1 ml-4 flex-wrap">
                        {formatTimestamp(errand.created_at)}
                      </Text>
                    </View>
                  )}
          <View className="flex flex-row items-center justify-between w-full py-3">
            <Text className="text-lg font-bold font-JakartaRegular">
              Plan:
            </Text>

            <Text className="text-base font-JakartaRegular flex-1 ml-4 flex-wrap">
              {errand?.action_plan}
            </Text>
          </View>
            <View className="flex flex-row items-center justify-between w-full py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">From:</Text>
                      <Text className="text-base font-JakartaRegular flex-1 ml-4 flex-wrap">
                         {fromLocation?.address!}
                      </Text>
          </View>
            <View className="flex flex-row items-center justify-between w-full py-3">
                      <Text className="text-lg font-bold font-JakartaRegular">To:</Text>
                      <Text className="text-base font-JakartaRegular flex-1 ml-4 flex-wrap">
                         {toLocation?.address!}
                      </Text>
          </View>
      </View>
      
      <CustomButton
        title="Complete Task"
        onPress={completeTask}
        className="mt-8"
      />

      <View className="mx-5 mt-8">
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
