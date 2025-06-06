import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, Button, Divider, List } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from '@/components/Avatar';
import { Moon, Sun, CircleHelp as HelpCircle, Settings, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { theme, themeType, setThemeType, isDark } = useTheme();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation handled by AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleTheme = () => {
    setThemeType(isDark ? 'light' : 'dark');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Avatar user={user} size={80} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <Text style={styles.email}>{user?.email || ''}</Text>
            </View>
          </View>
          
          <Button 
            mode="outlined" 
            style={styles.editButton}
            // In a real app, this would navigate to an edit profile screen
            onPress={() => console.log('Edit profile')}
          >
            Edit Profile
          </Button>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <List.Item
            title="Theme"
            description="Light / Dark mode"
            left={props => isDark 
              ? <Moon {...props} size={24} color={theme.colors.primary} /> 
              : <Sun {...props} size={24} color={theme.colors.primary} />
            }
            right={props => (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {isDark ? 'Dark' : 'Light'}
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  color={theme.colors.primary}
                />
              </View>
            )}
          />
          
          <List.Item
            title="Notification Settings"
            left={props => <Settings {...props} size={24} color={theme.colors.primary} />}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <List.Item
            title="Help & FAQ"
            left={props => <HelpCircle {...props} size={24} color={theme.colors.primary} />}
          />
          
          <List.Item
            title="Contact Support"
            left={props => <HelpCircle {...props} size={24} color={theme.colors.primary} />}
          />
        </View>
        
        <View style={styles.logoutSection}>
          <Button 
            mode="outlined" 
            onPress={handleSignOut}
            icon={({ size, color }) => (
              <LogOut size={size} color={color} />
            )}
          >
            Sign Out
          </Button>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
    paddingBottom: 16,
    
    
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
  },
  editButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  logoutSection: {
    padding: 16,
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    marginTop: 24,
  },
  version: {
    fontSize: 12,
    opacity: 0.5,
  },
});