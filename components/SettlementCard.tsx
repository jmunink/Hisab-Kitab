import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { Avatar } from './Avatar';
import { Settlement } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react-native';

interface SettlementCardProps {
  settlement: Settlement;
  onSettle: (settlementId: string) => void;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ 
  settlement, 
  onSettle 
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    onSettle(settlement.id);
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        <View style={styles.usersContainer}>
          <View style={styles.userSection}>
            <Avatar user={settlement.fromUser} size={40} />
            <Text style={styles.userName}>{settlement.fromUser.name}</Text>
          </View>
          
          <View style={styles.arrowContainer}>
            <ArrowRight size={20} color={theme.colors.primary} />
            <Text style={[styles.amount, { color: theme.colors.primary }]}>
              {formatCurrency(settlement.amount)}
            </Text>
          </View>
          
          <View style={styles.userSection}>
            <Avatar user={settlement.toUser} size={40} />
            <Text style={styles.userName}>{settlement.toUser.name}</Text>
          </View>
        </View>
        
        <Button 
          mode="outlined" 
          onPress={handlePress}
          style={styles.button}
        >
          Record Settlement
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userSection: {
    alignItems: 'center',
    flex: 1,
  },
  userName: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  amount: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    marginTop: 8,
  },
});