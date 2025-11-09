import * as React from "react";
import type { CvPrediction } from "@/api/customVision";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Progress } from "@/components/ui/progress";

type Props = {
  data: CvPrediction[] | null;
  title?: string;
  staggerMs?: number;
};

export default function Predictions({
  data,
  title = "Results",
  staggerMs = 120,
}: Props) {
  if (!data || data.length === 0) return null;

  const sorted = React.useMemo(
    () => [...data].sort((a, b) => b.probability - a.probability),
    [data]
  );

  const [values, setValues] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const zero: Record<string, number> = {};
    for (const p of sorted) zero[p.tagName] = 0;
    setValues(zero);

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    sorted.forEach((p, idx) => {
      const target = Math.max(0, Math.min(100, p.probability * 100));
      const t = setTimeout(() => {
        setValues((prev) => ({ ...prev, [p.tagName]: target }));
      }, 200 + idx * staggerMs);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [sorted, staggerMs]);

  return (
    <View className="gap-3">
      <Text className="text-center font-semibold text-card-foreground">
        {title}
      </Text>

      <View className="gap-4">
        {sorted.map((p) => {
          const pct = values[p.tagName] ?? 0;
          return (
            <View key={p.tagName} className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-card-foreground">{p.tagName}</Text>
                <Text
                  className="text-sm text-card-foreground"
                  style={{ fontVariant: ["tabular-nums"] }}
                >
                  {pct.toFixed(1)}%
                </Text>
              </View>

              <Progress value={pct} className="h-2 w-full" />
            </View>
          );
        })}
      </View>
    </View>
  );
}
