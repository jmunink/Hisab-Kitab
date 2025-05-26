import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { User } from '@/types';
import { Avatar } from './Avatar';

interface AvatarGroupProps {
  users: User[];
  maxDisplayed?: number;
  size?: number;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  users, 
  maxDisplayed = 3,
  size = 40,
}) => {
  const displayedUsers = users.slice(0, maxDisplayed);
  const remainingCount = users.length - maxDisplayed;

  return (
    <View style={styles.container}>
      {displayedUsers.map((user, index) => (
        <View
          key={user.id}
          style={[
            styles.avatarContainer,
            {
              marginLeft: index > 0 ? -size / 3 : 0,
              zIndex: displayedUsers.length - index,
            },
          ]}
        >
          <Avatar user={user} size={size} />
        </View>
      ))}
      
      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size / 3,
            },
          ]}
        >
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 100,
  },
  remainingContainer: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  remainingText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 14,
  },
});