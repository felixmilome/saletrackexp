import { View, Text, TouchableOpacity } from "react-native";
import { useState, ReactNode } from "react";
import Feather from "@expo/vector-icons/Feather";

type DropdownOption = {
  label: string;
  value: any;
  icon?: ReactNode;
};

type DropdownFieldProps = {
  label?: string;
  options: DropdownOption[];
  value: any | null;
  onChange: (value: any) => void;
  placeholder?: string;
  containerStyle?: string;
  labelStyle?: string;
  dropdownStyle?: string;
  optionStyle?: string;
};

const CustomDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  containerStyle,
  labelStyle,
  dropdownStyle,
  optionStyle,
}: DropdownFieldProps) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View className="my-2 w-full">
      {label && (
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
      )}

      {/* Trigger */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((p) => !p)}
        className={`flex flex-row items-center justify-between bg-neutral-100 rounded-lg border border-neutral-100 p-4 ${containerStyle}`}
      >
        <Text
          className={`font-JakartaSemiBold text-[15px] ${
            selected ? "text-neutral-800" : "text-gray-400"
          }`}
        >
          {selected?.label ?? placeholder}
        </Text>

        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {/* Options */}
      {open && (
        <View
          className={`mt-2 rounded-lg border border-neutral-200 bg-white overflow-hidden ${dropdownStyle}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.7}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex flex-row items-center px-4 py-3 ${
                  isSelected ? "bg-primary-50" : "bg-white"
                } ${optionStyle}`}
              >
                {option.icon && <View className="mr-3">{option.icon}</View>}

                <Text
                  className={`font-JakartaSemiBold ${
                    isSelected ? "text-primary-600" : "text-neutral-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CustomDropdown;
