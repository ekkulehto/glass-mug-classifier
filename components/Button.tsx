import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { Text } from './ui/text';
import { useTheme } from '@react-navigation/native';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
  /** Täyttää vanhemman leveyden (esim. sama linja kuin Results-card) */
  fullWidth?: boolean;
  /** Mahdollisuus ohittaa container-tyyli (esim. marginaalit) */
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function Button({
  label,
  theme,
  onPress,
  fullWidth = false,
  containerStyle,
  disabled = false,
}: Props) {
  const containerBase = [
    styles.buttonContainer,
    fullWidth ? styles.block : styles.fixed,
    containerStyle,
  ];

  const { colors } = useTheme();

  if (theme === 'primary') {
    return (
      <View style={[containerBase, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.text }]}
          onPress={disabled ? undefined : onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          <FontAwesome name="picture-o" size={18} color={colors.background} style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: colors.background }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={containerBase}>
      <Pressable
        style={styles.button}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.buttonLabel, {color: colors.text}]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    alignSelf: 'stretch', // mahdollistaa venymisen
  },
  block: {
    width: '100%',
    marginHorizontal: 0,
  },
  fixed: {
    width: 320,
    marginHorizontal: 20,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});
