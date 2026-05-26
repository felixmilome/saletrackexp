import { useUser } from "@clerk/clerk-expo";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import RideCard from "@/components/RideCard";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Errand, Ride } from "@/types/type";
import { router } from "expo-router";
import { icons } from "@/constants";
import {
  useAgentErrandsStore,
  useErrandStore,
  useHospitalStore,
  useMyAgentsStore,
  useMyRidesStore,
  useProfileStore,
} from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { formatDateTime, formatTimestamp, statusMap } from "@/lib/utils";
import CustomButton from "@/components/CustomButton";
import ErrandItem from "@/components/ErrandItem";
import Map from "@/components/Map";



const AgentErrands = () => {
  const { profile } = useProfileStore();
  const { myAgents, selectedAgentId } = useMyAgentsStore();
  const { setAgentErrands, agentErrands } = useAgentErrandsStore();
  const [loading, setLoading] = useState(true);
  const { hospital } = useHospitalStore();
  const { setErrand } = useErrandStore();

  useEffect(() => {
    if (selectedAgentId) {
      const getAgentErrands = async () => {
        try {
          // if (profile?.account_type === 2) {
            const res = await fetchAPI(
              "/(api)/errand/get-agent-errands",
              {
                method: "POST",
                body: JSON.stringify({
                  agent_id: selectedAgentId,
                }),
              }
            );

            setAgentErrands(res?.data || []);
          // }
        } catch (err) {
          console.log(err);
        }
      };
 
      getAgentErrands();
    }
  }, [selectedAgentId]);

    const handleEditErrand = async(item: Errand)=> {
      setErrand(item)
       router.push("/(root)/create-errand");
        // Navigate to the Create Errand screen
    }
     const handleCreateErrand = ()=> {
  
       router.push("/(root)/create-errand");
        // Navigate to the Create Errand screen
    }
      const handleStartErrand = async(item: Errand) => {
        setErrand(item)
        router.push("/(root)/on-errand");
      }

    const selectedAgent = myAgents.find(agent => agent.id === selectedAgentId);

  return (
    <SafeAreaView className="flex-1 bg-white">

      {agentErrands.length > 0 && (
        <FlatList
          data={agentErrands}
          keyExtractor={(item, index) =>
            item?.id != null ? item.id.toString() : index.toString()
          }
          className="px-5"
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }: { item: Errand }) => {
                const statusKey =
                typeof item?.status === "number" ? item.status : 1;
                console.log(statusKey, item?.action_plan);

                const status = statusMap[statusKey] ?? {
                label: "Unknown",
                color: "text-gray-500",
                };
                console.log(status, "status");
            return (
              <ErrandItem item={item} />
            );
          }}
          ListHeaderComponent={
            <>
                <TouchableOpacity className="w-14 h-14 ml-4 bg-gray-200 rounded-full items-center justify-center" onPress={() => router.back()}>
                            <View className="">
                                <Image
                                source={icons.backArrow}
                                resizeMode="contain"
                                className="w-12 h-12"
                                />
                            </View>
                </TouchableOpacity>
                
                <Text className="text-xl font-JakartaBold mt-5 ml-3">
                {selectedAgent?.name || "Agent"}'s Tasks
                </Text>
                        
                <CustomButton
                    title="Add Task"
                    onPress={handleCreateErrand}
                    className="my-3"
                />
                <View className="flex flex-row items-center bg-transparent  h-[300px] my-4 rounded-lg overflow-hidden">
                  <Map/>
                </View>

            </>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AgentErrands;