


import { router } from "expo-router";
import { FlatList, View , Text} from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";


import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout"; 
import { useDriverStore, usePackageStore  } from "@/store";


const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const {packageDescription, packageWeight} = usePackageStore();
  console.log(packageDescription);

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

   
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <DriverCard
            item={item} 
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(item.id!)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Errand"
              onPress={() => router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
     
    </RideLayout>
  );
};

export default ConfirmRide;
