import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { predictFromFile, predictFromUrl, type CvPrediction } from '@/api/customVision';
import Button from "@/components/Button";
import CircleButton from '@/components/CircleButton';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';
import Predictions from '@/components/Predictions';
import { Text } from '@/components/ui/text';
import UrlButton from '@/components/UrlButton';
import { useColorScheme } from 'nativewind';

const PlaceholderImage = require('@/assets/images/background-image.png');

type SourceKind = 'none' | 'url' | 'file';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<SourceKind>('none');
  const [preds, setPreds] = useState<CvPrediction[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const {colorScheme} = useColorScheme()

  const useThisPhoto = async () => {
    if (!selectedImage || sourceType === 'none') {
      Alert.alert('Choose image or URL first.');
      return;
    }
    try {
      setLoading(true);
      const data = sourceType === 'url'
        ? await predictFromUrl(selectedImage)
        : await predictFromFile(selectedImage);
      setPreds(data);
      setShowAppOptions(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Prediction failed.');
      setPreds(null);
    } finally {
      setLoading(false);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setSourceType('file');
      setShowAppOptions(true);
    }
  }

  const takeImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setSourceType('file');
      setShowAppOptions(true);
    }
  }

  const handleUrlPicked = (uri: string) => {
    setSelectedImage(uri);
    setSourceType('url');
    setShowAppOptions(true);
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined)
    setSourceType('none');
    setPreds(null);
  };

  return (
    <View className='flex-1 mx-auto items-center mt-10'>
      <View>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        {loading ? (
          <View className='flex-1 mx-auto justify-center'>
            <ActivityIndicator size={'large'} color={colorScheme === 'dark' ? 'white' : 'black'} />
            <Text>Loading...</Text>
          </View>
        ) : (
          preds && <Predictions data={preds} />
        )
        }
      </View >
      {showAppOptions ? (
        <View className='flex-1 mx-auto justify-center'>
          {preds === null && !loading && (
            <Button theme="primary" label='Use this photo' onPress={useThisPhoto} />
          )
          }
          {!loading && (
            <Button label='Choose another photo' onPress={onReset} />
          )
          }
        </View>
      ) : (
        <View className='flex-1 flex-row mx-auto items-center'>
            <UrlButton onConfirm={handleUrlPicked} />
            <CircleButton onPress={pickImageAsync} />
            <IconButton icon='camera-alt' label='Photo' onPress={takeImageAsync} />
        </View>
      )}
    </View>
  );
}