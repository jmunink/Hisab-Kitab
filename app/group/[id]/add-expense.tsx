import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ExpenseSplit, SplitMethod } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function AddExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroup, addExpense } = useData();
  const { theme } = useTheme();
  
  const group = getGroup(id);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [date] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // Split method state
  const [splitMethod, setSplitMethod] = useState<SplitMethod>(SplitMethod.EQUAL);
  
  // Payer selection state
  const [selectedPayers, setSelectedPayers] = useState<Record<string, number>>({});
  
  // Split between state
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({});
  
  // Initialize split amounts when amount changes
  useEffect(() => {
    if (amount && group && splitMethod === SplitMethod.EQUAL) {
      const totalAmount = parseFloat(amount);
      if (!isNaN(totalAmount)) {
        const perPerson = totalAmount / group.members.length;
        const newSplitAmounts: Record<string, number> = {};
        group.members.forEach(member => {
          newSplitAmounts[member.id] = perPerson;
        });
        setSplitAmounts(newSplitAmounts);
      }
    }
  }, [amount, group, splitMethod]);

  const handlePayerAmountChange = (userId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSelectedPayers(prev => ({
      ...prev,
      [userId]: numValue
    }));
  };

  const handleSplitAmountChange = (userId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSplitAmounts(prev => ({
      ...prev,
      [userId]: numValue
    }));
  };

  const validateForm = () => {
    if (!title.trim() || !amount || !group) return false;
    
    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) return false;
    
    // Validate payers
    const totalPaid = Object.values(selectedPayers).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalPaid - totalAmount) > 0.01) return false;
    
    // Validate splits
    const totalSplit = Object.values(splitAmounts).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalSplit - totalAmount) > 0.01) return false;
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !group) return;
    
    try {
      setIsLoading(true);
      
      const paidBy: ExpenseSplit[] = Object.entries(selectedPayers)
        .filter(([_, amount]) => amount > 0)
        .map(([userId, amount]) => ({
          userId,
          amount
        }));
      
      const splitBetween: ExpenseSplit[] = Object.entries(splitAmounts)
        .filter(([_, amount]) => amount > 0)
        .map(([userId, amount]) => ({
          userId,
          amount
        }));
      
      await addExpense(
        id,
        title,
        parseFloat(amount),
        paidBy,
        splitBetween,
        splitMethod,
        date,
        category,
        notes
      );
      
      router.back();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Add New Expense</Text>
      
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        left={<TextInput.Affix text="$" />}
      />
      
      <TextInput
        label="Category (Optional)"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Split Method</Text>
        <SegmentedButtons
          value={splitMethod}
          onValueChange={value => setSplitMethod(value as SplitMethod)}
          buttons={[
            { value: SplitMethod.EQUAL, label: 'Equal' },
            { value: SplitMethod.EXACT, label: 'Exact' }
          ]}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paid By</Text>
        {group.members.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <Chip
              mode="outlined"
              selected={selectedPayers[member.id] > 0}
              style={styles.memberChip}
            >
              {member.name}
            </Chip>
            <TextInput
              value={selectedPayers[member.id]?.toString() || ''}
              onChangeText={value => handlePayerAmountChange(member.id, value)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.amountInput}
              left={<TextInput.Affix text="$" />}
            />
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Split Between</Text>
        {group.members.map(member => (
          <View key={member.id} style={styles.memberRow}>
            <Chip
              mode="outlined"
              selected={splitAmounts[member.id] > 0}
              style={styles.memberChip}
            >
              {member.name}
            </Chip>
            <TextInput
              value={splitAmounts[member.id]?.toString() || ''}
              onChangeText={value => handleSplitAmountChange(member.id, value)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.amountInput}
              left={<TextInput.Affix text="$" />}
              disabled={splitMethod === SplitMethod.EQUAL}
            />
          </View>
        ))}
      </View>
      
      <TextInput
        label="Notes (Optional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSave}
        loading={isLoading}
        disabled={!validateForm() || isLoading}
        style={styles.saveButton}
      >
        Save Expense
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberChip: {
    flex: 1,
    marginRight: 8,
  },
  amountInput: {
    width: 120,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});