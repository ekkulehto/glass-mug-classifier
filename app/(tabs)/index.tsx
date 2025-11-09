import * as ImagePicker from 'expo-image-picker';
import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { HelpGuideProvider, useHelpGuide } from '@/components/HelpGuide';

import { predictFromFile, predictFromUrl, type CvPrediction } from '@/api/customVision';
import Button from '@/components/Button';
import { Button as UIButton } from '@/components/ui/button';
import CircleButton from '@/components/CircleButton';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';
import Predictions from '@/components/Predictions';
import { Text } from '@/components/ui/text';
import UrlButton from '@/components/UrlButton';
import { showChooseImageOrUrlFirstToast, showPredictionErrorToast } from '@/lib/toasts';
import { Camera, BadgeQuestionMark } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

const PlaceholderImage = require('@/assets/images/background-image.png');

type SourceKind = 'none' | 'url' | 'file';

function HeaderBinder() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { open } = useHelpGuide();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View className="ml-4">
          <UIButton
            variant="secondary"
            size="icon"
            className="size-10 rounded-full justify-center"
            onPress={open}
            accessibilityLabel="Open help"
          >
            <Icon as={BadgeQuestionMark} strokeWidth={1.1} color={colors.text} size={28} />
          </UIButton>
        </View>
      ),
    });
  }, [navigation, colors.text, open]);

  return null;
}

export default function Index() {
  const headerH = useHeaderHeight();
  const tabBarH = useBottomTabBarHeight();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<SourceKind>('none');
  const [preds, setPreds] = useState<CvPrediction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { colors } = useTheme();

  const useThisPhoto = async () => {
    if (!selectedImage || sourceType === 'none') {
      showChooseImageOrUrlFirstToast();
      return;
    }
    try {
      setLoading(true);
      const data =
        sourceType === 'url'
          ? await predictFromUrl(selectedImage)
          : await predictFromFile(selectedImage);
      setPreds(data);
      setShowAppOptions(true);
    } catch (e: any) {
      showPredictionErrorToast(e);
      setPreds(null);
    } finally {
      setLoading(false);
    }
  };

  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSourceType('file');
      setShowAppOptions(true);
      setPreds(null);
    }
  };

  const takeImageAsync = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSourceType('file');
      setShowAppOptions(true);
      setPreds(null);
    }
  };

  const handleUrlPicked = (uri: string) => {
    setSelectedImage(uri);
    setSourceType('url');
    setShowAppOptions(true);
    setPreds(null);
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined);
    setSourceType('none');
    setPreds(null);
  };

  const hasImage = !!selectedImage;

  return (
    <HelpGuideProvider headerH={headerH} tabBarH={tabBarH}>
      <HeaderBinder />

      <View className="flex-1 px-4 pt-5">
        <View className="w-full items-center">
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        </View>

        <View className="flex-1 w-full items-center justify-center">
          <View className="w-[70%] max-w-[280px]">

            {loading && (
              <View className="items-center justify-center" style={{ minHeight: 100 }}>
                <ActivityIndicator size="large" color={colors.text} />
                <Text className="mt-2">Loading...</Text>
              </View>
            )}

            {!loading && preds && (
              <View>
                <Predictions data={preds} />
              </View>
            )}

            {!loading && showAppOptions && preds === null && (
              <View className="items-center">
                <View>
                  <Button theme="primary" label="Use this photo" onPress={useThisPhoto} />
                </View>
              </View>
            )}

            {!loading && !showAppOptions && (
              <View className="flex-row items-center justify-center gap-x-3" style={{ minHeight: 60 }}>
                <UrlButton onConfirm={handleUrlPicked} />
                <CircleButton onPress={pickImageAsync} />
                <IconButton icon={Camera} label="Photo" onPress={takeImageAsync} />
              </View>
            )}

            {!loading && hasImage && (
              <View className="items-center mt-4">
                <View>
                  <Button label="Choose another photo" onPress={onReset} />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </HelpGuideProvider>
  );
}
