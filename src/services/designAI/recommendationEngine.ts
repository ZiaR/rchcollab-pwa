import { StylePreferences, Room, FurnitureItem, DesignRecommendation } from '../../types';

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string[];
}

interface DesignStyle {
  name: string;
  characteristics: string[];
  recommendedColors: string[];
  recommendedMaterials: string[];
  typicalFurniture: string[];
}

const designStyles: Record<string, DesignStyle> = {
  modern: {
    name: 'Modern',
    characteristics: ['clean lines', 'minimalist', 'functional'],
    recommendedColors: ['#FFFFFF', '#000000', '#808080', '#A0A0A0'],
    recommendedMaterials: ['glass', 'metal', 'concrete'],
    typicalFurniture: ['platform bed', 'minimalist sofa', 'geometric coffee table'],
  },
  traditional: {
    name: 'Traditional',
    characteristics: ['ornate', 'classic', 'symmetrical'],
    recommendedColors: ['#8B4513', '#DEB887', '#CD853F', '#D2B48C'],
    recommendedMaterials: ['wood', 'leather', 'fabric'],
    typicalFurniture: ['wingback chair', 'carved wood bed', 'classic dresser'],
  },
  industrial: {
    name: 'Industrial',
    characteristics: ['raw', 'urban', 'utilitarian'],
    recommendedColors: ['#36454F', '#708090', '#A9A9A9', '#CD853F'],
    recommendedMaterials: ['metal', 'wood', 'concrete', 'brick'],
    typicalFurniture: ['metal bed frame', 'leather sofa', 'pipe shelving'],
  },
  scandinavian: {
    name: 'Scandinavian',
    characteristics: ['minimal', 'natural', 'light'],
    recommendedColors: ['#FFFFFF', '#F5F5F5', '#E6E6FA', '#B0C4DE'],
    recommendedMaterials: ['light wood', 'wool', 'cotton'],
    typicalFurniture: ['simple bed', 'organic shape chair', 'minimal desk'],
  },
};

class RecommendationEngine {
  private calculateColorHarmony(color: string): string[] {
    // Convert hex to HSL and generate complementary and analogous colors
    // This is a simplified version - in a real app, we'd use a color library
    return [
      color,
      // Add complementary and analogous colors here
    ];
  }

  private matchStyleToPreferences(preferences: StylePreferences): DesignStyle[] {
    return Object.values(designStyles)
      .filter(style =>
        preferences.designStyle.some(
          prefStyle => prefStyle.toLowerCase() === style.name.toLowerCase()
        )
      )
      .sort((a, b) => {
        const aMatch = this.calculateStyleMatch(a, preferences);
        const bMatch = this.calculateStyleMatch(b, preferences);
        return bMatch - aMatch;
      });
  }

  private calculateStyleMatch(style: DesignStyle, preferences: StylePreferences): number {
    let score = 0;

    // Check color matches
    score += style.recommendedColors.filter(color =>
      preferences.colorScheme.includes(color)
    ).length;

    // Check material matches
    score += style.recommendedMaterials.filter(material =>
      preferences.materials.includes(material)
    ).length;

    return score;
  }

  private suggestFurnitureLayout(room: Room): FurnitureItem[] {
    // Implement layout optimization algorithm
    // This would consider:
    // - Room dimensions
    // - Traffic flow
    // - Furniture dimensions
    // - Design principles (focal points, balance, etc.)
    return [];
  }

  public generateRecommendations(
    preferences: StylePreferences,
    room: Room
  ): DesignRecommendation[] {
    const matchedStyles = this.matchStyleToPreferences(preferences);
    const recommendations: DesignRecommendation[] = [];

    // Color scheme recommendations
    if (preferences.colorScheme.length > 0) {
      const primaryColor = preferences.colorScheme[0];
      const harmoniousColors = this.calculateColorHarmony(primaryColor);
      
      recommendations.push({
        id: `color-${Date.now()}`,
        type: 'color',
        description: 'Harmonious Color Palette',
        reason: 'Based on your color preferences and design principles',
        confidence: 0.85,
        colors: harmoniousColors,
      });
    }

    // Layout recommendations
    const suggestedLayout = this.suggestFurnitureLayout(room);
    if (suggestedLayout.length > 0) {
      recommendations.push({
        id: `layout-${Date.now()}`,
        type: 'layout',
        description: 'Optimal Furniture Layout',
        reason: 'Maximizes space utilization and flow',
        confidence: 0.75,
        items: suggestedLayout,
      });
    }

    // Style-based recommendations
    matchedStyles.forEach(style => {
      recommendations.push({
        id: `style-${Date.now()}`,
        type: 'material',
        description: `${style.name} Style Elements`,
        reason: `Matches your preference for ${style.name.toLowerCase()} design`,
        confidence: 0.9,
        items: [], // Would include specific furniture recommendations
      });
    });

    return recommendations;
  }

  public getStyleBasedFurniture(style: string): FurnitureItem[] {
    const styleGuide = designStyles[style.toLowerCase()];
    if (!styleGuide) return [];

    // This would typically connect to a furniture database
    // Returning mock data for demonstration
    return styleGuide.typicalFurniture.map((name, index) => ({
      id: `furniture-${index}`,
      name,
      type: 'furniture',
      dimensions: {
        width: 2,
        length: 2,
        height: 1,
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
      },
      price: 500, // Mock price
      material: styleGuide.recommendedMaterials[0],
    }));
  }

  public optimizeForBudget(
    recommendations: DesignRecommendation[],
    budget: number
  ): DesignRecommendation[] {
    return recommendations.map(rec => {
      if (rec.type === 'furniture' && rec.items) {
        // Filter and adjust furniture recommendations based on budget
        const affordableItems = rec.items.filter(item => item.price <= budget * 0.2);
        return {
          ...rec,
          items: affordableItems,
          confidence: affordableItems.length > 0 ? rec.confidence : 0.5,
        };
      }
      return rec;
    });
  }
}

export const recommendationEngine = new RecommendationEngine(); 