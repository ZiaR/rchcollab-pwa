import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatMessage, StylePreferences, Budget } from '../../types';

interface ChatBotProps {
  onComplete: (preferences: StylePreferences, budget: Budget) => void;
  onSkip: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onComplete, onSkip }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onboardingSteps = [
    {
      question: "Welcome! I'm here to help create your dream space. Shall we get started?",
      type: 'welcome',
    },
    {
      question: "What's your preferred interior design style? (Modern, Traditional, Minimalist, Industrial, etc.)",
      type: 'style',
    },
    {
      question: "What's your total budget for this project?",
      type: 'budget',
    },
    {
      question: "Which rooms are you looking to design?",
      type: 'rooms',
    },
    {
      question: "What's your preferred color palette?",
      type: 'colors',
    },
  ];

  const preferences: StylePreferences = {
    designStyle: [],
    colorScheme: [],
    materials: [],
    priorities: [],
  };

  const budget: Budget = {
    total: 0,
    allocated: {
      furniture: 0,
      decor: 0,
      materials: 0,
      labor: 0,
    },
    currency: 'USD',
  };

  useEffect(() => {
    addMessage({
      id: Date.now().toString(),
      sender: 'bot',
      content: onboardingSteps[0].question,
      timestamp: new Date(),
      type: 'text',
    });

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleUserInput = () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text',
    });

    // Process user input based on current step
    processUserInput(input, currentStep);

    // Clear input and move to next step
    setInput('');
    if (currentStep < onboardingSteps.length - 1) {
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          sender: 'bot',
          content: onboardingSteps[currentStep + 1].question,
          timestamp: new Date(),
          type: 'text',
        });
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else {
      // Onboarding complete
      setTimeout(() => {
        addMessage({
          id: Date.now().toString(),
          sender: 'bot',
          content: "Great! I have everything I need to help you create your perfect space. Let's get started!",
          timestamp: new Date(),
          type: 'text',
        });
        onComplete(preferences, budget);
      }, 1000);
    }
  };

  const processUserInput = (input: string, step: number) => {
    switch (onboardingSteps[step].type) {
      case 'style':
        preferences.designStyle = input.split(',').map(style => style.trim());
        break;
      case 'budget':
        budget.total = parseFloat(input.replace(/[^0-9.]/g, ''));
        // Allocate budget approximately
        budget.allocated = {
          furniture: budget.total * 0.4,
          decor: budget.total * 0.2,
          materials: budget.total * 0.3,
          labor: budget.total * 0.1,
        };
        break;
      case 'colors':
        preferences.colorScheme = input.split(',').map(color => color.trim());
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message, index) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.content}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your answer..."
            placeholderTextColor="#666"
            onSubmitEditing={handleUserInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Skip Onboarding</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageWrapper: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
  },
});

export default ChatBot; 