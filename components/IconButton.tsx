import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { useTheme } from "@react-navigation/native";
import type { LucideIcon } from "lucide-react-native";

type Props = {
  icon: LucideIcon;          // esim. Camera, User, Settings...
  label: string;
  onPress?: () => void;
};

export default function IconButton({ icon: IconComp, label, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Button onPress={onPress} className="flex-col items-center justify-center" style={{backgroundColor: colors.background}}>
      <IconComp size={24} strokeWidth={1.3} color={colors?.primary ?? "#000"} />
      <Text className="mt-2" style={{color: colors.primary}}>{label}</Text>
    </Button>
  );
}
