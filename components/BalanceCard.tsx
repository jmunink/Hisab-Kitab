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
      <Card.Content>
        <Text style={styles.title}>{title}</Text>
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
    elevation: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  amount: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});