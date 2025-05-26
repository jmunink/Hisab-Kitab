import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Card } from 'react-native-paper';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ExpenseCard } from '@/components/ExpenseCard';
import { format } from 'date-fns';

export default function TransactionsScreen() {
  const { expenses, groups } = useData();
  const { theme } = useTheme();
  
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get all expenses, sorted by date (newest first)
  const sortedExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Filter by selected group and category
  const filteredExpenses = sortedExpenses.filter(expense => {
    const groupMatch = selectedGroup ? expense.groupId === selectedGroup : true;
    const categoryMatch = selectedCategory ? expense.category === selectedCategory : true;
    return groupMatch && categoryMatch;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(expenses.map(e => e.category).filter(Boolean)));
  
  // Group expenses by month
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const monthYear = format(expense.date, 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={!selectedGroup}
            onPress={() => setSelectedGroup(null)}
            style={styles.chip}
            mode="outlined"
          >
            All Groups
          </Chip>
          {groups.map(group => (
            <Chip
              key={group.id}
              selected={selectedGroup === group.id}
              onPress={() => setSelectedGroup(group.id)}
              style={styles.chip}
              mode="outlined"
            >
              {group.name}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
            style={styles.chip}
            mode="outlined"
          >
            All Categories
          </Chip>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.chip}
              mode="outlined"
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {Object.entries(groupedExpenses).map(([monthYear, monthExpenses]) => (
          <View key={monthYear}>
            <Text style={styles.monthHeader}>{monthYear}</Text>
            {monthExpenses.map(expense => (
              <ExpenseCard 
                key={expense.id} 
                expense={expense} 
                showGroup={true}
              />
            ))}
          </View>
        ))}
        
        {filteredExpenses.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No transactions found</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 26,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  filterContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  chip: {
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    padding: 8,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.7,
  },
  emptyCard: {
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
});