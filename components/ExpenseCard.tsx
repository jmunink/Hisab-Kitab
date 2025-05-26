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
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    color: 'black',
  },
  groupName: {
    fontSize: 14,
fontFamily: 'Inter-Regular',
fontWeight: '500',
    color: 'black',
    marginTop: 2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter-SemiBold',
    color: '#111',
  },
  details: {
    marginTop: 4,
  },
  payerInfo: {
    marginBottom: 8,
  },
  payerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#888',
    marginBottom: 2,
  },
  payer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginVertical: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#111',
    fontFamily: 'Inter-Regular',
  },
  categoryChip: {
    height: 38,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#444',
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#444',
    marginTop: 10,
    lineHeight: 20,
  },
});
