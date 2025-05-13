import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import InteriorCanvas from '../components/design/InteriorCanvas';
import BudgetTracker from '../components/design/BudgetTracker';
import { recommendationEngine } from '../services/designAI/recommendationEngine';
import {
  Room,
  FurnitureItem,
  Budget,
  StylePreferences,
  DesignRecommendation,
} from '../types';

const DesignStudioScreen: React.FC = () => {
  const [activeRoom, setActiveRoom] = useState<Room>({
    id: '1',
    name: 'Living Room',
    dimensions: {
      width: 20,
      length: 15,
      height: 10,
    },
    items: [],
    walls: [],
  });

  const [budget, setBudget] = useState<Budget>({
    total: 25000,
    allocated: {
      furniture: 10000,
      decor: 5000,
      materials: 7500,
      labor: 2500,
    },
    currency: 'USD',
  });

  const [preferences, setPreferences] = useState<StylePreferences>({
    designStyle: ['Modern', 'Minimalist'],
    colorScheme: ['#FFFFFF', '#000000', '#808080'],
    materials: ['wood', 'metal', 'glass'],
    priorities: ['functionality', 'aesthetics'],
  });

  const [recommendations, setRecommendations] = useState<DesignRecommendation[]>([]);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'budget' | 'recommendations'>('design');

  const { width } = useWindowDimensions();

  useEffect(() => {
    // Generate initial recommendations
    const newRecommendations = recommendationEngine.generateRecommendations(
      preferences,
      activeRoom
    );
    setRecommendations(newRecommendations);
  }, [preferences, activeRoom]);

  const handleRoomUpdate = (updatedRoom: Room) => {
    setActiveRoom(updatedRoom);
    // Recalculate recommendations based on new room layout
    const newRecommendations = recommendationEngine.generateRecommendations(
      preferences,
      updatedRoom
    );
    setRecommendations(newRecommendations);
  };

  const handleBudgetUpdate = (updatedBudget: Budget) => {
    setBudget(updatedBudget);
    // Optimize recommendations based on new budget
    const optimizedRecommendations = recommendationEngine.optimizeForBudget(
      recommendations,
      updatedBudget.total
    );
    setRecommendations(optimizedRecommendations);
  };

  const handleItemSelect = (item: FurnitureItem) => {
    setSelectedItem(item);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'design':
        return (
          <View style={styles.canvasContainer}>
            <InteriorCanvas
              room={activeRoom}
              onUpdateRoom={handleRoomUpdate}
              onSelectItem={handleItemSelect}
            />
            {selectedItem && (
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{selectedItem.name}</Text>
                <Text style={styles.itemPrice}>
                  {budget.currency} {selectedItem.price.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        );
      case 'budget':
        return (
          <BudgetTracker
            budget={budget}
            onUpdateBudget={handleBudgetUpdate}
          />
        );
      case 'recommendations':
        return (
          <ScrollView style={styles.recommendationsContainer}>
            {recommendations.map(recommendation => (
              <View key={recommendation.id} style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>
                  {recommendation.description}
                </Text>
                <Text style={styles.recommendationReason}>
                  {recommendation.reason}
                </Text>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      { width: `${recommendation.confidence * 100}%` },
                    ]}
                  />
                  <Text style={styles.confidenceText}>
                    {Math.round(recommendation.confidence * 100)}% Match
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Design Studio</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'design' && styles.activeTab]}
            onPress={() => setActiveTab('design')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'design' && styles.activeTabText,
              ]}
            >
              Design
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
            onPress={() => setActiveTab('budget')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'budget' && styles.activeTabText,
              ]}
            >
              Budget
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'recommendations' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('recommendations')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'recommendations' && styles.activeTabText,
              ]}
            >
              Recommendations
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
  itemDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#666',
  },
  recommendationsContainer: {
    padding: 16,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  recommendationReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#34C759',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default DesignStudioScreen; 