import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { useTheme } from "@react-navigation/native";
import type { LucideIcon } from "lucide-react-native";

type Props = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function IconButton({ icon: IconComp, label, onPress, disabled = false }: Props) {
  const { colors } = useTheme();

  return (
    <Button
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className="flex-col items-center justify-center"
      style={{ backgroundColor: colors.background }}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <IconComp size={24} strokeWidth={1.3} color={colors.text} />
      <Text className="mt-2" style={{ color: colors.text }}>{label}</Text>
    </Button>
  );
}
