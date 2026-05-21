import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTimestamp } from "@/lib/utils";

type Props = {
  title: string;
  onChangeValue?: (date: Date) => void;
};

export default function DateTimePickerScreen({
  title,
  onChangeValue,
}: Props) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time" | null>(null);

  const onChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setMode(null);

    if (selectedDate) {
      setDate(selectedDate);
      onChangeValue?.(selectedDate); // send to parent
    }
  };

  return (
    <View style={{backgroundColor: "white", paddingVertical:12, gap: 8, borderRadius: 12,}}>
      <Text style={{ fontSize: 16, fontWeight: "600", margin:4 }}>{title} {formatTimestamp(date.toISOString())} </Text>

      {/* <Text style={{ fontSize: 16, fontWeight: "600" }}>{formatTimestamp(date.toISOString())}</Text> */}

            <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
                onPress={() => setMode("date")}
                style={{
                flex: 1,
                padding: 10,
                backgroundColor: "#ddd",
                borderRadius: 8,
                alignItems: "center",
                }}
            >
                <Text>Select Date</Text>
            </Pressable>

            <Pressable
                onPress={() => setMode("time")}
                style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#ddd",
                borderRadius: 8,
                alignItems: "center",
                }}
            >
                <Text>Select Time</Text>
            </Pressable>
            </View>

      {mode && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
          is24Hour={false}
        />
      )}
    </View>
  );
}