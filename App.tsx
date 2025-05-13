import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatBot from './src/components/onboarding/ChatBot';
import DesignStudioScreen from './src/screens/DesignStudioScreen';
import { StylePreferences, Budget } from './src/types';

export type RootStackParamList = {
  Onboarding: undefined;
  DesignStudio: {
    preferences: StylePreferences;
    budget: Budget;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const handleOnboardingComplete = (preferences: StylePreferences, budget: Budget) => {
    // Navigate to Design Studio with preferences and budget
  };

  const handleOnboardingSkip = () => {
    // Navigate to Design Studio with default preferences and budget
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Onboarding">
            {props => (
              <ChatBot
                onComplete={handleOnboardingComplete}
                onSkip={handleOnboardingSkip}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="DesignStudio"
            component={DesignStudioScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App; 