import React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Terminal, AlertCircle, ImageOff } from "lucide-react-native";

export function showLoginSuccessToast() {
  toast.custom(
    <View className="mr-3 ml-3">
      <Alert icon={CheckCircle2}>
        <AlertTitle>Login successful</AlertTitle>
        <AlertDescription>You’re now signed in. Welcome back!</AlertDescription>
      </Alert>
    </View>
  );
}

export function showChooseImageOrUrlFirstToast() {
  toast.custom(
    <View className="mr-3 ml-3">
      <Alert icon={Terminal}>
        <AlertTitle>Action needed</AlertTitle>
        <AlertDescription>Choose image or URL first.</AlertDescription>
      </Alert>
    </View>
  );
}

export function showPredictionErrorToast(e?: unknown) {
  const message =
    (typeof e === "object" && e && "message" in e && String((e as any).message)) ||
    "Prediction failed.";

  toast.custom(
    <View className="mr-3 ml-3">
      <Alert variant="destructive" icon={AlertCircle}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </View>
  );
}

export function showInvalidUrlToast() {
  toast.custom(
    <View className="mr-3 ml-3">
      <Alert variant="destructive" icon={AlertCircle}>
        <AlertTitle>Invalid URL</AlertTitle>
        <AlertDescription>Please enter a valid URL.</AlertDescription>
      </Alert>
    </View>
  );
}

export function showDownloadFailedToast() {
  toast.custom(
    <View className="mr-3 ml-3">
      <Alert variant="destructive" icon={ImageOff}>
        <AlertTitle>Download failed</AlertTitle>
        <AlertDescription>Downloading image failed. Please check the URL.</AlertDescription>
      </Alert>
    </View>
  );
}
