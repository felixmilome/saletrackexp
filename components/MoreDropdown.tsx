import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

type MoreDropDownProps = {
  title: string;
  setState: (open: boolean) => void;
  containerStyle?: string;
  labelStyle?: string;
};

const MoreDropDown = ({
  title,
  setState,
  containerStyle,
  labelStyle,
}: MoreDropDownProps) => {
  const [open, setOpen] = useState(false);

  const handlePress = () => {
    const newState = !open;
    setOpen(newState);
    setState(newState); // exposes state to parent
  };

  return (
    <View className="my-2 w-full">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        className={`flex flex-row items-center justify-between bg-neutral-100 rounded-lg border border-neutral-100 p-4 ${containerStyle}`}
      >
        <Text
          className={`text-[15px] font-JakartaSemiBold text-neutral-800 ${labelStyle}`}
        >
          {title}
        </Text>

        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
    </View>
  );
};

export default MoreDropDown;