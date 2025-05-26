import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Appbar, Divider, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from '@/components/Avatar';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getExpense, getGroup } = useData();
  const { theme } = useTheme();
  
  const expense = getExpense(id);
  const group = expense ? getGroup(expense.groupId) : null;
  
  const handleBack = () => {
    router.back();
  };
  
  if (!expense || !group) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }
  
  // Find payers and their amounts
  const payers = expense.paidBy.map(payment => {
    const user = group.members.find(member => member.id === payment.userId);
    return {
      user,
      amount: payment.amount,
    };
  });
  
  // Find who owes what
  const debtors = expense.splitBetween.map(split => {
    const user = group.members.find(member => member.id === split.userId);
    return {
      user,
      amount: split.amount,
    };
  });
  
  const formattedDate = format(expense.date, 'MMMM d, yyyy');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Expense Details" />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{expense.title}</Text>
          <Text style={styles.groupName}>in {group.name}</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paid by</Text>
          
          {payers.map((payer, index) => (
            <List.Item
              key={index}
              title={payer.user?.name || 'Unknown'}
              description={formatCurrency(payer.amount)}
              left={props => 
                <Avatar 
                  {...props} 
                  user={payer.user} 
                  size={40} 
                  style={styles.avatar} 
                />
              }
            />
          ))}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Split between</Text>
          
          {debtors.map((debtor, index) => (
            <List.Item
              key={index}
              title={debtor.user?.name || 'Unknown'}
              description={formatCurrency(debtor.amount)}
              left={props => 
                <Avatar 
                  {...props} 
                  user={debtor.user} 
                  size={40} 
                  style={styles.avatar} 
                />
              }
            />
          ))}
        </View>
        
        {expense.notes && (
          <>
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notes}>{expense.notes}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  avatar: {
    marginRight: 16,
    alignSelf: 'center',
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
  },
});