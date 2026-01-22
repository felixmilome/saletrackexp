import { router } from "expo-router";
import { Text, View, KeyboardAvoidingView } from "react-native";

import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore, usePackageStore } from "@/store";
import { decimalizeInput } from "@/lib/utils";
import InputField from "@/components/InputField";

import KeyboardAwareInput from  "@/components/KeyboardAwareInput";

const FindRide = () => { 
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

 const{
    packageWeight,
    setPackageWeight,
    packageDescription,
    setPackageDescription
} = usePackageStore();

  return (
    <RideLayout title="Ride">
      <View className="mt-2">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location:any) => setUserLocation(location)}
        />
      </View>

      <View className="mt-2">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location:any) => setDestinationLocation(location)}
        />
      </View>
      <View className="mt-3">

      <Text className="text-lg font-JakartaSemiBold mb-3">Total Package:</Text>
      <View className="px-3">
      <InputField
        label="Est. Weight (Max 2500kg)"
        placeholder="Enter Weight"
        icon={null}
        keyboardType="decimal-pad"
        value={packageWeight !== null ? String(packageWeight) : ""}
        onChangeText={(strNum:any) => {
          const decimal = decimalizeInput(strNum, 2500, 2);
          setPackageWeight(decimal);
        }}
      />
      <InputField
        label="Description"
        placeholder="Describe the package e.g., envelope, box, etc."
        icon={null}
        value={packageDescription ?? ""}
        onChangeText={setPackageDescription}
        multiline={true}
        numberOfLines={3} // optional: sets the visible input height
      /> 
      </View>
      </View>

      {packageWeight && packageDescription &&
        <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />

      }
    </RideLayout>
  );
};

export default FindRide;
