import React from "react";
import { Text, TextProps } from "react-native";

export const ThemedText: React.FC<
  TextProps & { type?: "title" | "link" | "body" }
> = ({ children, type = "body", style, ...rest }) => {
  const styles: Record<string, any> = {
    title: { fontSize: 22, fontWeight: "700", color: "#0d265c" },
    link: { color: "#38b386" },
    body: { color: "#0d265c" },
  };
  return (
    <Text style={[styles[type], style]} {...rest}>
      {children}
    </Text>
  );
};
