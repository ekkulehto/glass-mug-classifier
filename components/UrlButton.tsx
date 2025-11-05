import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Label } from './ui/label';

type Props = {
    label?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    placeholder?: string;
    onConfirm: (url: string) => void | Promise<void>;
    style?: ViewStyle;
};

export default function UrlButton({ label = 'URL', icon = 'link', placeholder = 'https://example.com/image.jpg', onConfirm, style }: Props) {
    const [open, setOpen] = React.useState(false);
    const [url, setUrl] = React.useState('');

    const handleSave = async () => {
        const trimmed = url.trim();
        if (!trimmed) {
            alert('Please enter a valid URL.');
            return;
        }
        try {
            await onConfirm(trimmed);
            setUrl('');
            setOpen(false);
        } catch {
            alert('Downloading image failed. Please check the URL.');
        }
    };

    const handleClose = () => {
        setUrl("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Pressable>
                    <MaterialIcons name={icon} size={24} color="#fff" />
                    <Text style={styles.iconButtonLabel}>{label}</Text>
                </Pressable>
            </DialogTrigger>

            <DialogContent className="max-w-[100%]">
                <DialogHeader>
                    <DialogTitle>Give URL to the image</DialogTitle>
                    <DialogDescription>
                        Paste the direct link to the image and press 'Use image'
                    </DialogDescription>
                </DialogHeader>

                <View className="flex gap-4">
                    <View className="flex gap-3">
                        <Label>Image URL</Label>
                        <Input
                            value={url}
                            onChangeText={setUrl}
                            placeholder={placeholder}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            returnKeyType="done"
                            onSubmitEditing={handleSave}
                            autoFocus
                        />
                    </View>
                </View>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onPress={handleClose}>
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <Button onPress={handleSave}>
                        <Text>Use Image</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12
    }
});
