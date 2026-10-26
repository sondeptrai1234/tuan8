import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { value: number; size?: number };

export default function RatingStars({ value, size = 16 }: Props) {
  const filled = Math.round(value);
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, color: i <= filled ? colors.star : '#D5D8DE' }}>
          ★
        </Text>
      ))}
    </View>
  );
}