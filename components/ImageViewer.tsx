import { Image } from "expo-image";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { useTheme } from '@react-navigation/native';

type Props = {
    imgSource: ImageSourcePropType;
    selectedImage?: string;
}

export default function ImageViewer({imgSource, selectedImage}: Props) {
  const imageSource = selectedImage ? {uri: selectedImage} : imgSource;
  const { colors } = useTheme();

  return (
        <Image source={imageSource} style={[styles.image, {borderColor: colors.text}]} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    maxWidth: '85%',
    aspectRatio: 3 / 3.3,
    borderRadius: 18,
    borderWidth: 1,
  }
});