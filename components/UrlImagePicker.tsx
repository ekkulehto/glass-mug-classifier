import IconButton from '@/components/IconButton';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (uri: string) => void
}>;

export default function UrlImagePicker({ isVisible, onClose, onConfirm }: Props) {
    const [url, setUrl] = useState("");

    const handleOk = async () => {
        const trimmed = url.trim();
        if (!trimmed) {
            alert('Please enter a valid URL.');
            return;
        }
        try {
            onConfirm(trimmed);
            setUrl("");
        } catch {
            alert('Downloading image failed. Please check the URL.');
        }
    };

    const handleClose = () => {
        setUrl("");
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <Pressable style={styles.modalBackdrop} onPress={handleClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <Pressable>
                        <View style={styles.modalContent}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>Give URL to the image</Text>
                                <Pressable onPress={handleClose}>
                                    <MaterialIcons name='close' color='#fff' size={22} />
                                </Pressable>
                            </View>
                            <View style={styles.urlContent}>
                                <TextInput
                                    value={url}
                                    onChangeText={setUrl}
                                    placeholder='https://example.com/image.jpg'
                                    style={styles.urlInput}
                                    autoFocus={true}
                                />
                                <View style={styles.urlButtonContainer}>
                                    <IconButton icon='cancel' label='Cancel' onPress={handleClose} />
                                    <IconButton icon='check' label='Accept' onPress={handleOk} />
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        marginLeft: '3%',
        marginRight: '3%',
        maxWidth: '100%',
        backgroundColor: '#25292e',
        borderRadius: 18,
        overflow: 'hidden',
    },
    titleContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#464C55',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
    urlContent: {
        padding: 20,
        alignItems: 'center',
    },
    urlInput: {
        height: 45,
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    urlButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    }
});