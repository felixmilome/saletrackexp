import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

type AmPm = "AM" | "PM";

type State = {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  ampm: AmPm;
};

export default function HorizontalDateTime() {
  const [state, setState] = useState<State>({
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
    ampm: "AM",
  });

  const update = (key: keyof State, value: string) => {
    setState((p) => ({ ...p, [key]: value }));
  };

  const toUTC = () => {
    let hour = parseInt(state.hour || "0", 10);
    const minute = parseInt(state.minute || "0", 10);

    if (state.ampm === "PM" && hour !== 12) hour += 12;
    if (state.ampm === "AM" && hour === 12) hour = 0;

    const date = new Date(
      Number(state.year),
      Number(state.month) - 1,
      Number(state.day),
      hour,
      minute
    );

    return date.toISOString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Date Time</Text>

      <Text style={styles.utc}>UTC: {toUTC()}</Text>

      {/* ROW */}
      <View style={styles.row}>
        <TextInput
          placeholder="DD"
          keyboardType="number-pad"
          value={state.day}
          onChangeText={(v) => update("day", v)}
          style={styles.input}
        />

        <Text style={styles.sep}>/</Text>

        <TextInput
          placeholder="MM"
          keyboardType="number-pad"
          value={state.month}
          onChangeText={(v) => update("month", v)}
          style={styles.input}
        />

        <Text style={styles.sep}>/</Text>

        <TextInput
          placeholder="YYYY"
          keyboardType="number-pad"
          value={state.year}
          onChangeText={(v) => update("year", v)}
          style={[styles.input, { width: 80 }]}
        />
      </View>

      {/* TIME ROW */}
      <View style={styles.row}>
        <TextInput
          placeholder="HH"
          keyboardType="number-pad"
          value={state.hour}
          onChangeText={(v) => update("hour", v)}
          style={styles.input}
        />

        <Text style={styles.sep}>:</Text>

        <TextInput
          placeholder="MM"
          keyboardType="number-pad"
          value={state.minute}
          onChangeText={(v) => update("minute", v)}
          style={styles.input}
        />

        <Pressable
          onPress={() =>
            setState((p) => ({
              ...p,
              ampm: p.ampm === "AM" ? "PM" : "AM",
            }))
          }
          style={styles.ampm}
        >
          <Text style={{ fontWeight: "600" }}>{state.ampm}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  utc: {
    fontSize: 12,
    color: "#666",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: 55,
    textAlign: "center",
    borderRadius: 6,
  },

  sep: {
    fontSize: 18,
    fontWeight: "600",
  },

  ampm: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
});