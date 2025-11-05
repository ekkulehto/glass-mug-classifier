import type { CvPrediction } from '@/api/customVision';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './ui/text';

export default function Predictions({ data }: { data: CvPrediction[] | null }) {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) => b.probability - a.probability);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Results</Text>
            {sorted.map(p => (
                <View key={p.tagName} style={styles.row}>
                    <Text style={styles.tag}>{p.tagName}</Text>
                    <Text style={styles.prob}>{(p.probability * 100).toFixed(1)}%</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        alignSelf: 'center',
        minWidth: 260,
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        marginBottom: 6,
        fontSize: 16,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    tag: {
        color: '#fff',
        fontSize: 15,
    },
    prob: {
        color: '#fff',
        fontVariant: ['tabular-nums']
    }
})