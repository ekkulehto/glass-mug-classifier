import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { predictFromFile, predictFromUrl, type CvPrediction } from '@/api/customVision';
import Button from "@/components/Button";
import CircleButton from '@/components/CircleButton';
import IconButton from '@/components/IconButton';
import ImageViewer from '@/components/ImageViewer';
import Predictions from '@/components/Predictions';
import UrlImagePicker from '@/components/UrlImagePicker';

const PlaceholderImage = require('@/assets/images/background-image.png');

type SourceKind = 'none' | 'url' | 'file';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<SourceKind>('none');
  const [preds, setPreds] = useState<CvPrediction[] | null>(null)
  const [loading, setLoading] = useState(false)

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
      quality: 1,
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
      quality: 1,
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
    setIsModalVisible(false);
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined)
    setSourceType('none');
    setPreds(null);
  };

  const onModalClose = () => {
    setIsModalVisible(false)
  }

  const onAddurl = () => {
    setIsModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
        <Predictions data={preds} />
      </View>
      {showAppOptions ? (
        <View style={styles.footerContainer}>
          <Button theme="primary" label='Use this photo' onPress={useThisPhoto} />
          <Button label='Choose another photo' onPress={onReset} />
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon='link' label={loading ? '...' : 'Url'} onPress={onAddurl} />
            <CircleButton onPress={pickImageAsync} />
            <IconButton icon='camera-alt' label='Photo' onPress={takeImageAsync} />
          </View>
        </View>
      )}
      <UrlImagePicker isVisible={isModalVisible} onClose={onModalClose} onConfirm={handleUrlPicked} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  ImageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})