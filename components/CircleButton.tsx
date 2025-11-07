import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
    onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
    const { colors } = useTheme();

    return (
        <View style={styles.circleButtonContainer}>
            <Pressable
                onPress={onPress}
                style={[
                    styles.circleButton,
                    {
                        backgroundColor: colors.text
                    }
                ]}
            >
                <MaterialIcons name='add' size={38} color={colors.background} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    circleButtonContainer: {
        width: 84,
        height: 84,
        marginHorizontal: 45,
        borderWidth: 4,
        borderColor: '#ffd33d',
        borderRadius: 42,
        padding: 3,
    },
    circleButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 42,
    }
})