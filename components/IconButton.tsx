import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from "react-native";
import { Text } from './ui/text';

type Props = {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string,
    onPress: () => void;
};

export default function IconButton({icon, label, onPress}: Props) {
    return (
        <Pressable style={styles.iconButton} onPress={onPress}>
            <MaterialIcons name={icon} size={24} color='#fff'/>
            <Text style={styles.iconButtonLabel}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
})