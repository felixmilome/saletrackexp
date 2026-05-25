import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useMyAgentsStore } from "@/store";
import { formatDateTime } from "@/lib/utils";
import { ProfileData } from "@/types/type";
import CustomButton from "./CustomButton";


const AgentItem = ({ item }: { item: ProfileData }) => {
  const { setSelectedAgentId } = useMyAgentsStore();

  const isAvailable = item?.agent_data?.status === 0;

  const handleManage = () => {
    if (!item?.id) return;

    setSelectedAgentId(item.id);
    router.push("/(root)/agent-errands");
  };

  return (
    <TouchableOpacity
    //   onPress={handlePress}
      className="bg-white p-4 mb-4 rounded-2xl border border-gray-200 shadow-sm"
    >
      {/* Name */}
      <Text className="text-lg font-JakartaBold">
        {item.name}
      </Text>

      {/* Address */}
      <Text className="text-sm text-gray-500 mt-1">
        📍 {item.current_address}
      </Text>

      {/* Status */}
      <View className="flex-row justify-between mt-3">
        <Text
          className={`text-sm font-semibold ${
            isAvailable ? "text-green-600" : "text-red-600"
          }`}
        >
          {isAvailable ? "Available" : "Busy"}
        </Text>
      </View>

      {/* Joined */}
      <Text className="text-xs text-gray-400 mt-2">
        Joined: {item.created_at ? formatDateTime(item.created_at) : "—"}
      </Text>
          <CustomButton
            title="Manage"
            bgVariant="primary"
            onPress={handleManage}
            className="mt-6"
        />
    </TouchableOpacity>
  );
};

export default AgentItem;