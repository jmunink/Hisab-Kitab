import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { User } from '@/types';

interface AvatarProps {
  user?: User;
  size?: number;
  name?: string;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  user, 
  size = 40,
  name,
  style 
}) => {
  const displayName = user?.name || name || '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const avatarUrl = user?.avatar;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: '#666666',
    fontWeight: '600',
  },
});