import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AvatarGroup } from './AvatarGroup';
import { Group } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/utils/formatters';

interface GroupCardProps {
  group: Group;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const router = useRouter();
  const { getGroupBalances } = useData();
  const { user } = useAuth();
  const { theme } = useTheme();

  const balances = getGroupBalances(group.id);
  const userBalance = user ? balances[user.id] || 0 : 0;
  
  const isPositive = userBalance >= 0;
  const balanceText = isPositive 
    ? `You are owed ${formatCurrency(userBalance)}` 
    : `You owe ${formatCurrency(Math.abs(userBalance))}`;

  const handlePress = () => {
    router.push(`/group/${group.id}`);
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={handlePress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{group.name}</Text>
          <AvatarGroup users={group.members} size={36} maxDisplayed={3} />
        </View>
        
        <View style={styles.balanceContainer}>
          <Text 
            style={[
              styles.balance, 
              {
                color: isPositive 
                  ? theme.colors.primary 
                  : theme.colors.secondary,
              }
            ]}
          >
            {balanceText}
          </Text>
          <Text style={styles.memberCount}>
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  memberCount: {
    fontSize: 14,
    opacity: 0.6,
  },
});