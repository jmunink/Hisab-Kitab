import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BalanceCard } from '@/components/BalanceCard';
import { ExpenseCard } from '@/components/ExpenseCard';
import { GroupCard } from '@/components/GroupCard';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user } = useAuth();
  const { getUserBalance, groups, expenses } = useData();
  const router = useRouter();
  const { theme } = useTheme();
  
  const { totalOwed, totalOwedToUser } = getUserBalance();
  
  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  // Get recent groups (last 3)
  const recentGroups = [...groups]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);
  
  const goToCreateGroup = () => {
    // TODO: Implement create group modal
    console.log('Create group');
  };
  
  const goToAddExpense = () => {
    // Open group selection or go to add expense if only one group
    if (groups.length === 1) {
      router.push(`/group/${groups[0].id}/add-expense`);
    } else if (groups.length > 1) {
      router.push('/groups');
    } else {
      goToCreateGroup();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'Friend'}</Text>
          <Text style={styles.subtitle}>Here's your spending summary</Text>
        </View>
        
        <View style={styles.balanceContainer}>
          <BalanceCard
            title="You are owed"
            amount={totalOwedToUser}
            isPositive={true}
          />
          <BalanceCard
            title="You owe"
            amount={totalOwed}
            isPositive={false}
          />
        </View>
        
        {/* Recent Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <Text
              style={[styles.sectionLink, { color: theme.colors.primary }]}
              onPress={() => router.push('/transactions')}
            >
              View All
            </Text>
          </View>
          
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense, index) => (
              <Animated.View 
                key={expense.id}
                entering={FadeInUp.delay(index * 100).duration(400)}
              >
                <ExpenseCard expense={expense} showGroup={true} />
              </Animated.View>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No expenses yet</Text>
              </Card.Content>
            </Card>
          )}
        </View>
        
        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <Text
              style={[styles.sectionLink, { color: theme.colors.primary }]}
              onPress={() => router.push('/groups')}
            >
              View All
            </Text>
          </View>
          
          {recentGroups.length > 0 ? (
            recentGroups.map((group, index) => (
              <Animated.View 
                key={group.id}
                entering={FadeInUp.delay(index * 100).duration(400)}
              >
                <GroupCard group={group} />
              </Animated.View>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No groups yet</Text>
              </Card.Content>
            </Card>
          )}
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={goToAddExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  balanceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  sectionLink: {
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  spacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});