import React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Terminal, AlertCircle, ImageOff } from "lucide-react-native";

function ToastFrame({ children }: { children: React.ReactNode }) {

  return (
    <View
      style={{
        alignSelf: "center",
        width: '100%',
        paddingHorizontal: 12,
      }}
    >
      {children}
    </View>
  );
}

function showFramedToast(node: React.ReactNode, id?: string | number) {
  toast.custom(<ToastFrame>{node}</ToastFrame>, { id });
}

export function showLoginSuccessToast() {
  showFramedToast(
    <Alert icon={CheckCircle2}>
      <AlertTitle>Login successful</AlertTitle>
      <AlertDescription>You’re now signed in. Welcome back!</AlertDescription>
    </Alert>,
    'login-success-toast'
  );
}

export function showChooseImageOrUrlFirstToast() {
  showFramedToast(
    <Alert icon={Terminal}>
      <AlertTitle>Action needed</AlertTitle>
      <AlertDescription>Choose image or URL first.</AlertDescription>
    </Alert>,
    'showChooseImageOrUrlFirstToast'
  );
}

export function showPredictionErrorToast(e?: unknown) {
  const message =
    (typeof e === "object" && e && "message" in (e as any) && String((e as any).message)) ||
    "Prediction failed.";

  showFramedToast(
    <Alert variant="destructive" icon={AlertCircle}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>,
    'showPredictionErrorToast'
  );
}

export function showInvalidUrlToast() {
  showFramedToast(
    <Alert variant="destructive" icon={AlertCircle}>
      <AlertTitle>Invalid URL</AlertTitle>
      <AlertDescription>Please enter a valid URL.</AlertDescription>
    </Alert>,
    'showInvalidUrlToast'
  );
}

export function showDownloadFailedToast() {
  showFramedToast(
    <Alert variant="destructive" icon={ImageOff}>
      <AlertTitle>Download failed</AlertTitle>
      <AlertDescription>Downloading image failed. Please check the URL.</AlertDescription>
    </Alert>,
    'showDownloadFailedToast'
  );
}
