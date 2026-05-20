import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView, Alert } from "react-native";
import { useState } from "react";

import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";
import GoogleTextInput from "@/components/GoogleTextInput";
import { serviceTypes } from "@/constants";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useFromLocationStore, useProfileStore, useErrandStore, useToLocationStore, useDeviceLocationStore, useAgentStore} from "@/store";
import { decimalizeInput} from "@/lib/utils";
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
  const { errand, setErrand, clearErrand } = useErrandStore();
  const {profile} = useProfileStore();
  const {agent, setAgent} = useAgentStore();
  const [service, setService] = useState(3);


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


  const sendReport = async() => {

        try {
            const newErrand = {...errand, status:5} as Errand;
              const res = await fetchAPI("/(api)/errand", { 
                method: "POST", 
                body: JSON.stringify(newErrand),
              });

              console.log("Errand created successfully", res);

              if (res?.success){
                    Alert.alert("Success", "Errand Reported Successfully");
                    router.push("/(root)/(tabs)/home");
                    setAgent({...agent, current_errand_id: res.data.id });
                    clearErrand();       
              }else{
                Alert.alert("Error", "Failed Please Try Again.");
              }
        
            } catch (err) {
              console.log("Auto-save failed", err);
               Alert.alert("Error", "Failed Please Try Again.");
        }


    }
  return (
    <RideLayout title="Send Task Report">
      <View className="mt-2">
      
        <View className="mt-3">

        {/* <Text className="text-lg font-JakartaSemiBold mb-3">Service Description:</Text> */}
    
      </View>


      <View className="">
          <InputField
            label="Who did you meet:"
            placeholder="Name of the Person you met"
            icon={null}
            value={errand?.met ?? ""}
            onChangeText={(val) => pushKeyValue("met", val)}
            multiline={true}
            numberOfLines={3} // optional: sets the visible input height
          /> 
        </View>
        <View className="">
          <InputField
            label="Discussion Points:"
            placeholder="What did you discuss?"
            icon={null}
            value={errand?.discussion_points ?? ""}
            onChangeText={(val) => pushKeyValue("discussion_points", val)}
            multiline={true}
            numberOfLines={3} // optional: sets the visible input height
          /> 
        </View>
        <View className="">
            <InputField
              label="Total Expenses:"
              placeholder="Enter the total expenses for the errand."
              icon={null}
              value={errand?.total_expense?.toString() ?? ""}
             onChangeText={(val) => {
                  const num = Number(val);
                  pushKeyValue("total_expense", isNaN(num) ? 0 : num);
                }}
              multiline={true}
              numberOfLines={3}
            />
        </View>

      </View>




   

  
      <CustomButton
        title="Send Report"
        onPress={sendReport}
        className="mt-5"
      />

      <View className="mx-5 mt-12">
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
