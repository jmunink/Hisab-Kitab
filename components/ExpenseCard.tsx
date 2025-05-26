import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Expense } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseCardProps {
  expense: Expense;
  showGroup?: boolean;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  showGroup = false 
}) => {
  const router = useRouter();
  const { getGroup } = useData();
  const { theme } = useTheme();

  const group = getGroup(expense.groupId);
  
  const totalPaid = expense.paidBy.reduce((sum, payment) => sum + payment.amount, 0);
  const payers = expense.paidBy.map(payment => {
    const user = group?.members.find(m => m.id === payment.userId);
    return {
      name: user?.name || 'Unknown',
      amount: payment.amount,
      percentage: (payment.amount / totalPaid) * 100
    };
  });

  const formattedDate = format(expense.date, 'MMM d, yyyy');

  const handlePress = () => {
    router.push(`/expense/${expense.id}`);
  };

  return (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={handlePress}
    >
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{expense.title}</Text>
            {showGroup && group && (
              <Text style={styles.groupName}>{group.name}</Text>
            )}
          </View>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.payerInfo}>
            <Text style={styles.payerLabel}>Paid by:</Text>
            {payers.map((payer, index) => (
              <Text key={index} style={styles.payer}>
                {payer.name} ({formatCurrency(payer.amount)})
              </Text>
            ))}
          </View>
          
          <View style={styles.metaContainer}>
            <Text style={styles.date}>{formattedDate}</Text>
            {expense.category && (
              <Chip 
                mode="outlined" 
                style={styles.categoryChip}
                textStyle={styles.categoryText}
              >
                {expense.category}
              </Chip>
            )}
          </View>
        </View>
        
        {expense.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {expense.notes}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  groupName: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  details: {
    marginTop: 8,
  },
  payerInfo: {
    marginBottom: 8,
  },
  payerLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  payer: {
    fontSize: 14,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  categoryChip: {
    height: 24,
  },
  categoryText: {
    fontSize: 12,
  },
  notes: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    fontStyle: 'italic',
  },
});