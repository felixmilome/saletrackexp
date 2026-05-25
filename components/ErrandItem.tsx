import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Errand } from "@/types/type";
import { useProfileStore } from "@/store";
import { useErrandStore } from "@/store";

const ErrandItem = ({ item }: { item: Errand }) => {
  const { profile } = useProfileStore();
  const { setErrand } = useErrandStore();

  const accountType = profile?.account_type;

  const statusMap: Record<number, { label: string; color: string }> = {
    1: { label: "Pending", color: "#f59e0b" },
    2: { label: "In Progress", color: "#3b82f6" },
    3: { label: "Completed", color: "#10b981" },
  };

  const statusKey = typeof item?.status === "number" ? item.status : 1;

  const status = statusMap[statusKey] ?? {
    label: "Unknown",
    color: "#6b7280",
  };

  const handleStart = () => {
    setErrand(item);
    router.push("/(root)/on-errand");
  };

  const handleEdit = () => {
    setErrand(item);
    router.push("/(root)/create-errand");
  };

  return (
    <View className="bg-white p-4 mb-4 rounded-2xl border border-gray-200">
      <Text className="text-lg font-bold">
        {item.from_address} → {item.to_address}
      </Text>

      <Text style={{ color: status.color, marginTop: 6, fontWeight: "600" }}>
        {status.label}
      </Text>

      <Text className="text-sm text-gray-600 mt-2">
        {item.action_plan || "No action plan"}
      </Text>

      <Text className="text-xs text-gray-400 mt-2">
        Expense: {item.total_expense ?? 0}
      </Text>

      <Text className="text-xs text-gray-400 mt-1">
        Created: {item.created_at || "—"}
      </Text>

      <Text className="text-xs text-gray-400 mt-1">
        Deadline: {item.deadline || "—"}
      </Text>

      {/* Agent */}
      {accountType === 2 && item.status === 1 && (
        <TouchableOpacity
          onPress={handleEdit}
          className="mt-6 bg-green-600 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Start Task</Text>
        </TouchableOpacity>
      )}

      {/* User */}
      {accountType === 1 && (
        <>
          {item.status === 1 && (
            <TouchableOpacity
              onPress={handleStart}
              className="mt-6 bg-black py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Start Task</Text>
            </TouchableOpacity>
          )}

          {item.status === 2 && (
            <TouchableOpacity
              onPress={handleStart}
              className="mt-6 bg-black py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Resume Task</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default ErrandItem;