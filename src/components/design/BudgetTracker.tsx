import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Budget } from '../../types';

interface BudgetTrackerProps {
  budget: Budget;
  onUpdateBudget: (budget: Budget) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, onUpdateBudget }) => {
  const calculateTotalSpent = () => {
    return Object.values(budget.allocated).reduce((acc, curr) => acc + curr, 0);
  };

  const calculateRemainingBudget = () => {
    return budget.total - calculateTotalSpent();
  };

  const getPercentageSpent = (category: keyof typeof budget.allocated) => {
    return ((budget.allocated[category] / budget.total) * 100).toFixed(1);
  };

  const getBudgetStatus = () => {
    const remaining = calculateRemainingBudget();
    if (remaining < 0) {
      return {
        color: '#FF3B30',
        message: 'Over Budget',
      };
    } else if (remaining < budget.total * 0.1) {
      return {
        color: '#FF9500',
        message: 'Near Limit',
      };
    }
    return {
      color: '#34C759',
      message: 'Within Budget',
    };
  };

  const renderCategoryBar = (category: keyof typeof budget.allocated) => {
    const percentage = parseFloat(getPercentageSpent(category));
    const displayName = category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <View key={category} style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryText}>{displayName}</Text>
          <Text style={styles.amountText}>
            {budget.currency} {budget.allocated[category].toLocaleString()}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: percentage > 100 ? '#FF3B30' : '#007AFF',
              },
            ]}
          />
        </View>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
    );
  };

  const handleReallocation = (
    fromCategory: keyof typeof budget.allocated,
    toCategory: keyof typeof budget.allocated,
    amount: number
  ) => {
    if (budget.allocated[fromCategory] < amount) {
      Alert.alert('Error', 'Insufficient funds in source category');
      return;
    }

    const updatedBudget: Budget = {
      ...budget,
      allocated: {
        ...budget.allocated,
        [fromCategory]: budget.allocated[fromCategory] - amount,
        [toCategory]: budget.allocated[toCategory] + amount,
      },
    };

    onUpdateBudget(updatedBudget);
  };

  const status = getBudgetStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.totalBudgetContainer}>
          <Text style={styles.label}>Total Budget</Text>
          <Text style={styles.totalAmount}>
            {budget.currency} {budget.total.toLocaleString()}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.message}
          </Text>
        </View>

        <View style={styles.remainingContainer}>
          <Text style={styles.label}>Remaining</Text>
          <Text
            style={[
              styles.remainingAmount,
              { color: calculateRemainingBudget() < 0 ? '#FF3B30' : '#34C759' },
            ]}
          >
            {budget.currency} {calculateRemainingBudget().toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Budget Allocation</Text>
        {Object.keys(budget.allocated).map(category =>
          renderCategoryBar(category as keyof typeof budget.allocated)
        )}
      </View>

      <TouchableOpacity
        style={styles.optimizeButton}
        onPress={() => {
          // Implement budget optimization logic
          Alert.alert(
            'Budget Optimization',
            'Would you like AI to suggest optimal budget allocation based on your design preferences?',
            [
              {
                text: 'Yes',
                onPress: () => {
                  // Implement AI-based budget optimization
                },
              },
              {
                text: 'No',
                style: 'cancel',
              },
            ]
          );
        }}
      >
        <Text style={styles.optimizeButtonText}>Optimize Budget</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    marginBottom: 16,
  },
  totalBudgetContainer: {
    flex: 1,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
  },
  remainingContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  amountText: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E9E9EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  optimizeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
  },
  optimizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetTracker; 