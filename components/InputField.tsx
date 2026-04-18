import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  multiline = false,
  numberOfLines,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-lg border border-neutral-100 focus:border-primary-500  ${containerStyle} ${
              multiline ? "items-start" : "items-center"
            }`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`${
                multiline ? "rounded-lg p-3 text-left" : "rounded-full p-4"
              } font-JakartaSemiBold text-[15px] flex-1 ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              multiline={multiline}
              placeholderTextColor="#9CA3AF"
              numberOfLines={multiline ? numberOfLines || 3 : 1}
              textAlignVertical={multiline ? "top" : "center"}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


export default InputField;
