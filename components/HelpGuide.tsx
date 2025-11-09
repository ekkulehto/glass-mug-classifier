import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import { Link, Camera } from "lucide-react-native";


import {
  FullScreenDialog as Dialog,
  FullScreenDialogContent as DialogContent,
  FullScreenDialogDescription as DialogDescription,
  FullScreenDialogFooter as DialogFooter,
  FullScreenDialogHeader as DialogHeader,
  FullScreenDialogTitle as DialogTitle,
  FullScreenDialogClose as DialogClose,
} from "@/components/FullScreenDialog";

import { Button as UIButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "./ui/text";
import { Progress } from "@/components/ui/progress";

import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import PrimaryButton from "@/components/Button";

type HelpCtx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const HelpContext = createContext<HelpCtx | null>(null);

export function useHelpGuide() {
  const ctx = useContext(HelpContext);
  if (!ctx) {
    throw new Error("useHelpGuide must be used within a HelpGuideProvider");
  }
  return ctx;
}

const ICON_COL_WIDTH = 96;

export function HelpGuideProvider({
  children,
  headerH = 0,
  tabBarH = 0,
}: {
  children: React.ReactNode;
  headerH?: number;
  tabBarH?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const topOffset = headerH;
  const bottomOffset = tabBarH;

  const ctx = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  const panGesture = useRef(
    Gesture.Pan()
      .activeOffsetX(16)
      .failOffsetY([-8, 8])
  ).current;

  const combinedGesture = Gesture.Simultaneous(panGesture);

  return (
    <HelpContext.Provider value={ctx}>
      {children}
      <Dialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
        <DialogContent
          className="p-0 m-0 border-0"
          style={{
            flex: 1,
            marginTop: topOffset,
            marginBottom: bottomOffset,
          }}
        >
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>How to use the app</DialogTitle>
            <DialogDescription className="pb-3">
              Choose a source, preview the image, then send it to the
              classifier. The buttons below are examples.
            </DialogDescription>
          </DialogHeader>

          <GestureDetector gesture={combinedGesture}>
            <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  padding: 16,
                  paddingBottom: 24,
                }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                <Section title="1) Enter an image URL">
                  <View className="mx-3">
                    <Card>
                      <CardContent className="p-3">
                        <Row>
                          <IconCell>
                            <IconButton icon={Link} label="URL" disabled />
                          </IconCell>
                          <Text className="text-sm text-card-foreground flex-1 shrink">
                            Paste a direct image link and press “Use Image”.
                          </Text>
                        </Row>
                      </CardContent>
                    </Card>
                  </View>
                </Section>

                <Section title="2) Or pick from gallery">
                  <View className="mx-3">
                    <Card>
                      <CardContent className="p-3">
                        <Row>
                          <IconCell>
                            <View style={{ marginLeft: -45, marginRight: -45 }}>
                              <CircleButton onPress={() => {}} disabled />
                            </View>
                          </IconCell>
                          <Text className="text-sm text-card-foreground flex-1 shrink">
                            Pick an image from your gallery.
                          </Text>
                        </Row>
                      </CardContent>
                    </Card>
                  </View>
                </Section>

                <Section title="3) Or take a photo">
                  <View className="mx-3">
                    <Card>
                      <CardContent className="p-3">
                        <Row>
                          <IconCell>
                            <IconButton icon={Camera} label="Camera" disabled />
                          </IconCell>
                          <Text className="text-sm text-card-foreground flex-1 shrink">
                            Open the camera and take a photo.
                          </Text>
                        </Row>
                      </CardContent>
                    </Card>
                  </View>
                </Section>

                <Section title="4) Send to classifier">
                  <View className="mx-3 mt-2">
                    <PrimaryButton
                      theme="primary"
                      label="Use this photo"
                      fullWidth
                      disabled
                    />
                  </View>
                  <View className="mx-3 mt-3">
                    <Card>
                      <CardContent className="p-3">
                        <Text className="text-center font-semibold text-card-foreground">
                          Results
                        </Text>
                        <View className="mt-3 gap-4">
                          <ResultRow label="glass" percent={72} />
                          <ResultRow label="mug" percent={22} />
                        </View>
                      </CardContent>
                    </Card>
                  </View>
                </Section>
              </ScrollView>
            </View>
          </GestureDetector>

          <DialogFooter className="px-4 p-4">
            <DialogClose asChild>
              <UIButton>
                <Text>Continue</Text>
              </UIButton>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HelpContext.Provider>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View className="flex-row items-center gap-7">{children}</View>;
}

function IconCell({ children }: { children?: React.ReactNode }) {
  return (
    <View
      style={{
        width: ICON_COL_WIDTH,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children ?? null}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex gap-2 mb-10">
      <Text className="text-base font-semibold text-foreground">{title}</Text>
      {children}
    </View>
  );
}

function ResultRow({ label, percent }: { label: string; percent: number }) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <View className="gap-2 mx-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-card-foreground">{label}</Text>
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
}
