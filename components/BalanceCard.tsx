import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/utils/formatters';

interface BalanceCardProps {
  title: string;
  amount: number;
  isPositive?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  title, 
  amount,
  isPositive = true 
}) => {
  const { theme } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text
          style={[
            styles.amount,
            {
              color: isPositive 
                ? theme.colors.primary 
                : theme.colors.secondary,
            },
          ]}
        >
          {formatCurrency(amount)}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 8,
    elevation: 3,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
    fontFamily: 'Inter-Medium',
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});