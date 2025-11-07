import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button as UIButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "./ui/text";

import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import PrimaryButton from "@/components/Button";
import { Link } from "lucide-react-native";
import { Camera } from 'lucide-react-native';

type HelpCtx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const HelpContext = createContext<HelpCtx | null>(null);

export function useHelpGuide() {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error("HelpGuideProvider missing");
  return ctx;
}

const STORAGE_KEY = "help_seen_v1";
const ICON_COL_WIDTH = 96; // kiinteä ikonipalsta: tasainen tekstin aloituskohta

export function HelpGuideProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ✅ Avaa vain ensimmäisellä kerralla (kun saavut indeksiin kirjautumisen jälkeen)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(STORAGE_KEY);
        if (!seen && mounted) {
          setIsOpen(true);
          await AsyncStorage.setItem(STORAGE_KEY, "1");
        }
      } catch {
        if (mounted) setIsOpen(true); // fallback: näytä ohje jos storage ei toimi
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Mitoitus headerin ja tabbarin väliin (safe area huomioiden)
  const { height: winH } = useWindowDimensions();
  const headerH = useHeaderHeight();
  const tabBarH = safeUseBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const availableH = Math.max(0, winH - headerH - tabBarH - insets.top - insets.bottom);

  const ctx = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <HelpContext.Provider value={ctx}>
      {children}

      <Dialog open={isOpen} onOpenChange={(v) => (v ? open() : close())}>
        <DialogContent
          className="w-full max-w-[100%] p-0"
          style={{
            height: availableH,
            marginTop: headerH + insets.top,
            marginBottom: tabBarH + insets.bottom,
          }}
        >
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>How to use the app</DialogTitle>
            <DialogDescription>
              Choose a source, preview the image, then send it to the classifier. The buttons below are examples.
            </DialogDescription>
          </DialogHeader>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingTop: 8 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {/* 1) URL */}
            <Section title="1) Enter an image URL">
              <Disabled>
                <View className="mx-3">
                  <Card className="border border-border/60 bg-card">
                    <CardContent className="p-3">
                      <Row>
                        <IconCell>
                          <IconButton icon={Link} label="URL" onPress={() => {}} />
                        </IconCell>
                        <Text className="text-sm text-card-foreground flex-1 shrink">
                          Paste a direct image link and press “Use Image”.
                        </Text>
                      </Row>
                    </CardContent>
                  </Card>
                </View>
              </Disabled>
            </Section>

            {/* 2) Galleria */}
            <Section title="2) Or pick from gallery">
              <Disabled>
                <View className="mx-3">
                  <Card className="border border-border/60 bg-card">
                    <CardContent className="p-3">
                      <Row>
                        <IconCell>
                          <View style={{ marginLeft: -45, marginRight: -45 }}>
                            <CircleButton onPress={() => {}} />
                          </View>
                        </IconCell>
                        <Text className="text-sm text-card-foreground flex-1 shrink">
                          Pick an image from your gallery.
                        </Text>
                      </Row>
                    </CardContent>
                  </Card>
                </View>
              </Disabled>
            </Section>

            {/* 3) Kamera */}
            <Section title="3) Or take a photo">
              <Disabled>
                <View className="mx-3">
                  <Card className="border border-border/60 bg-card">
                    <CardContent className="p-3">
                      <Row>
                        <IconCell>
                          <IconButton icon={Camera} label="Camera" onPress={() => {}} />
                        </IconCell>
                        <Text className="text-sm text-card-foreground flex-1 shrink">
                          Open the camera and take a photo.
                        </Text>
                      </Row>
                    </CardContent>
                  </Card>
                </View>
              </Disabled>
            </Section>

            {/* 4) Lähetys luokittelijalle */}
            <Section title="4) Send to classifier">
              <Disabled>
                <View className="items-center mt-2">
                  <PrimaryButton theme="primary" label="Use this photo" onPress={() => {}} />
                </View>

                <View className="mx-3 mt-3">
                  <Card className="border border-border/60 bg-card">
                    <CardContent className="p-3">
                      <Text className="text-center font-semibold text-card-foreground">Results</Text>
                      <View className="mt-2 gap-3">
                        <ResultRow label="glass" value="72%" />
                        <ResultRow label="mug" value="22%" />
                      </View>
                    </CardContent>
                  </Card>
                </View>
              </Disabled>
            </Section>
          </ScrollView>

          <DialogFooter className="px-4 pb-4">
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

/** Turvallinen tabbar-korkeus — palauttaa 0 jos ei olla TabNavigatorissa */
function safeUseBottomTabBarHeight() {
  try {
    return useBottomTabBarHeight();
  } catch {
    return 0;
  }
}

/** Yhtenäinen rivikaava: vakioleveyden ikonipalsta + joustava tekstipalsta */
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

/** Apukomponentit */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="flex gap-2 mb-10">
      <Text className="text-base font-semibold text-white">{title}</Text>
      {children}
    </View>
  );
}

function Disabled({ children }: { children: React.ReactNode }) {
  return (
    <View pointerEvents="none" style={{ opacity: 0.95 }}>
      {children}
    </View>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <Row>
      <View className="flex-1 flex-row items-center justify-between mx-10">
        <Text className="text-sm text-card-foreground">{label}</Text>
        <Text className="text-sm text-card-foreground">{value}</Text>
      </View>
    </Row>
  );
}
