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
  useHospitalStore,
  useMyAgentsStore,
  useMyRidesStore,
  useProfileStore,
} from "@/store";
import { fetchAPI } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { formatDateTime, statusMap } from "@/lib/utils";
import CustomButton from "@/components/CustomButton";



const AgentErrands = () => {
  const { profile } = useProfileStore();
  const { myAgents, selectedAgentId } = useMyAgentsStore();
  const { setAgentErrands, agentErrands } = useAgentErrandsStore();
  const [loading, setLoading] = useState(true);
  const { hospital } = useHospitalStore();

  useEffect(() => {
    if (selectedAgentId) {
      const getAgentErrands = async () => {
        try {
          if (profile?.account_type === 2) {
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
          }
        } catch (err) {
          console.log(err);
        }
      };

      getAgentErrands();
    }
  }, [selectedAgentId]);

    const handleCreateErrand = () => {
        // Navigate to the Create Errand screen
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

                const status = statusMap[statusKey] ?? {
                label: "Unknown",
                color: "text-gray-500",
                };
            return (
              <TouchableOpacity
                className="bg-white p-4 mb-4 rounded-2xl border border-gray-200 shadow-sm"
                onPress={() => console.log("Errand clicked:", item.id)}
              >
                {/* From → To */}
                <Text className="text-lg font-JakartaBold">
                  {item.from_address} → {item.to_address}
                </Text>

                {/* Status */}
                <Text
                  className={`text-sm font-semibold mt-2 ${status.color}`}
                >
                  {status.label}
                </Text>

                {/* Action Plan */}
                <Text className="text-sm text-gray-600 mt-2">
                  {item.action_plan || "No action plan"}
                </Text>

                {/* Expense */}
                <Text className="text-xs text-gray-400 mt-2">
                  Expense: {item.total_expense ?? 0}
                </Text>

                  {/* Deadline */}
                <Text className="text-xs text-gray-400 mt-1">
                  Created at:{" "}
                  {item.created_at
                    ? formatDateTime(item.created_at)
                    : "—"}
                </Text>

                {/* Deadline */}
                <Text className="text-xs text-gray-400 mt-1">
                  Deadline:{" "}
                  {item.deadline
                    ? formatDateTime(item.deadline)
                    : "—"}
                </Text>
              </TouchableOpacity>
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
                {selectedAgent?.name || "Agent"}'s Errands
                </Text>
                        
                <CustomButton
                    title="Create Errand"
                    onPress={handleCreateErrand}
                    className="my-3"
                />

            </>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AgentErrands;