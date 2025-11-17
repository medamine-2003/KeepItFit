import React from "react";
import { View, ViewProps } from "react-native";

export const ThemedView: React.FC<ViewProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={[{ flex: 1, backgroundColor: "#ffffff" }, style]} {...rest}>
      {children}
    </View>
  );
};
