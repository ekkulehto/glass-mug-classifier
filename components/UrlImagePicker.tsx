import IconButton from '@/components/IconButton';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren, useState } from "react";
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (uri: string) => void
}>;

export default function UrlImagePicker({ isVisible, onClose, onConfirm }: Props) {
    const [url, setUrl] = useState("")

    const handleOk = async () => {
        const trimmed = url.trim();
        try {
            await Image.prefetch(trimmed);
            onConfirm(trimmed);
            setUrl("");
        } catch {
            alert('Downloading image failed. Please check the URL.')
        }
    }

    const handleClose = () => {
        setUrl("");
        onClose();
    };

    if (!isVisible) return null;
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.modalContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Give URL to the image</Text>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name='close' color='#fff' size={22} />
                        </Pressable>
                    </View>
                    <View style={styles.urlContent}>
                        <TextInput
                            value={url}
                            onChangeText={setUrl}
                            placeholder='https://example.com/image.jpg'
                            style={styles.urlInput}

                        />
                        <View style={styles.urlButtonContainer}>
                            <IconButton icon='cancel' label='Cancel' onPress={handleClose} />
                            <IconButton icon='check' label='Accept' onPress={handleOk} />
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        height: '25%',
        width: '100%',
        backgroundColor: '#25292e',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    },
    titleContainer: {
        height: '16%',
        backgroundColor: '#464C55',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    urlInput: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        backgroundColor: '#fff',
        padding: 10,
        margin: 12,
    },
    urlButtonContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})