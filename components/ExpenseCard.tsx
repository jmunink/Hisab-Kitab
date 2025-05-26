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
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {expense.title}
            </Text>
            {showGroup && group && (
              <Text style={[styles.groupName, { color: theme.colors.primary }]}>
                {group.name}
              </Text>
            )}
          </View>
          <Text style={[styles.amount, { color: theme.colors.text }]}>
            {formatCurrency(expense.amount)}
          </Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.payerInfo}>
            <Text style={[styles.payerLabel, { color: theme.colors.placeholder }]}>
              Paid by:
            </Text>
            {payers.map((payer, index) => (
              <Text key={index} style={[styles.payer, { color: theme.colors.text }]}>
                {payer.name} ({formatCurrency(payer.amount)})
              </Text>
            ))}
          </View>
          
          <View style={styles.metaContainer}>
            <Text style={[styles.date, { color: theme.colors.placeholder }]}>
              {formattedDate}
            </Text>
            {expense.category && (
              <Chip 
                mode="outlined" 
                style={[styles.categoryChip, { borderColor: theme.colors.primary }]}
                textStyle={[styles.categoryText, { color: theme.colors.primary }]}
              >
                {expense.category}
              </Chip>
            )}
          </View>
        </View>
        
        {expense.notes && (
          <Text 
            style={[styles.notes, { color: theme.colors.placeholder }]} 
            numberOfLines={2}
          >
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
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  details: {
    marginTop: 8,
  },
  payerInfo: {
    marginBottom: 12,
  },
  payerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  payer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginVertical: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  categoryChip: {
    height: 28,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});