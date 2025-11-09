import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Image as ExpoImage, type ImageErrorEventData } from "expo-image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useGraphAvatarSource } from "@/hooks/useGraphAvatar";
import { cn } from "@/lib/utils";
import type { TriggerRef } from "@rn-primitives/popover";
import { LogOutIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

export function UserMenu() {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);
  const { signOut, profile, graphAccessToken, isLoading: isProfileLoading } = useAuth();

  const fullName = profile?.displayName ?? "";
  const email = profile?.email ?? "";
  const initials = fullName ? getInitials(fullName) : "";
  
  const initialsReady = !isProfileLoading && !!fullName;

  const { source, recyclingKey } = useGraphAvatarSource(graphAccessToken);

  console.log('[UserMenu] Renderöidään. isProfileLoading:', isProfileLoading, 'profile:', profile, 'initialsReady:', initialsReady, 'recyclingKey:', recyclingKey);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    await new Promise<void>((res) => setTimeout(res, 300));
    signOut();
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-10 rounded-full">
          <UserAvatar
            className="size-10"
            fullName={fullName || "Signed user"}
            initials={initials}
            initialsReady={initialsReady}
            source={source}
            recyclingKey={recyclingKey}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="p-0">
        <View className="border-border gap-3 p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar
              className="size-10"
              fullName={fullName || "Signed user"}
              initials={initials}
              initialsReady={initialsReady}
              source={source}
              recyclingKey={recyclingKey}
            />
            <View className="flex-1">
              <Text className="font-medium leading-5">{fullName || "Signed user"}</Text>
              {email ? (
                <Text className="text-muted-foreground text-sm font-normal leading-4">
                  {email}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar({
  className,
  fullName,
  initials,
  initialsReady,
  source,
  recyclingKey,
}: Omit<React.ComponentProps<typeof Avatar>, "alt"> & {
  fullName: string;
  initials: string;
  initialsReady: boolean; 
  source?: any;
  recyclingKey: string;
}) {
  const hasImage = !!source;
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [recyclingKey]);

  const showSkeleton = !initialsReady && !hasImage || (hasImage && !imageLoaded && !imageError);
  const showFallback = initialsReady && (!hasImage || imageError);

  const handleLoad = () => {
    console.log('[UserAvatar] Kuvan lataus ONNISTUI. Source:', source);
    setImageLoaded(true);
  };
  
  const handleError = (event: ImageErrorEventData) => {
    console.error('[UserAvatar] Kuvan lataus EPÄONNISTUI. Source:', source, 'Virhe:', event.error);
    setImageError(true);
  };

  return (
    <View className={cn("relative", className)}>
      <Avatar alt={`${fullName}'s avatar`} className="size-full">
        {hasImage && !imageError ? (
          <ExpoImage
            source={source}
            style={{ width: "100%", height: "100%", borderRadius: 9999 }}
            cachePolicy="memory-disk"
            recyclingKey={recyclingKey}
            onLoad={handleLoad}
            onError={handleError}
          />
        ) : null}

        {showFallback ? (
          <AvatarFallback>
            <Text>{initials}</Text>
          </AvatarFallback>
        ) : null}
      </Avatar>

      {showSkeleton ? (
        <Skeleton className="pointer-events-none absolute inset-0 h-full w-full rounded-full" />
      ) : null}
    </View>
  );
}

function getInitials(name: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");
}