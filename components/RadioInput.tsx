import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type RadioOption = {
  label: string;
  value: string |null | undefined;
  icon?: ReactNode;
};

type RadioInputFieldProps = {
  label?: string;
  options: RadioOption[]; // pass 2 options here
  value: string | null | undefined;
  onChange: (value: string | null | undefined) => void;
  containerStyle?: string;
  labelStyle?: string;
  optionStyle?: string;
};

const RadioInput = ({
  label,
  options,
  value,
  onChange,
  containerStyle,
  labelStyle,
  optionStyle,
}: RadioInputFieldProps) => {
  return (
    <View className="my-2 w-full">
      {label && (
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
      )}

      <View
        className={`flex flex-row gap-3 ${containerStyle}`}
      >
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.8}
              onPress={() => {option?.value !== value && onChange(option.value)}}
              className={`flex-1 flex-row items-center justify-center rounded-lg border p-4 ${
                selected
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 bg-neutral-100"
              } ${optionStyle}`}
            >
              {/* {option.icon && <View className="mr-2">{option.icon}</View>} */}

              <Text
                className={`font-JakartaSemiBold ${
                  selected ? "text-primary-600" : "text-neutral-600"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default RadioInput;
