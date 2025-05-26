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
    paddingBottom: 16,
    backgroundColor: '#fff',
    position: 'relative',
    paddingTop: 16,
    marginTop: 15,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    marginTop: 10,
    color: '#000',
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    zIndex: 1,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 6,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter-Regular',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 15,
    paddingVertical: 16,
  },
  spacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
    bottom: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
