export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'architect';
  preferences?: StylePreferences;
  budget?: Budget;
}

export interface StylePreferences {
  designStyle: string[];
  colorScheme: string[];
  materials: string[];
  priorities: string[];
}

export interface Budget {
  total: number;
  allocated: {
    furniture: number;
    decor: number;
    materials: number;
    labor: number;
  };
  currency: string;
}

export interface Room {
  id: string;
  name: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  items: FurnitureItem[];
  walls: WallProperties[];
}

export interface FurnitureItem {
  id: string;
  name: string;
  type: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
    rotation: number;
  };
  price: number;
  material?: string;
  color?: string;
}

export interface WallProperties {
  id: string;
  color: string;
  texture?: string;
  windows: Window[];
  doors: Door[];
}

export interface Window {
  id: string;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Door {
  id: string;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  type: 'single' | 'double' | 'sliding';
}

export interface DesignProject {
  id: string;
  name: string;
  client: User;
  architect?: User;
  rooms: Room[];
  budget: Budget;
  status: 'draft' | 'in_review' | 'approved' | 'in_progress' | 'completed';
  created: Date;
  lastModified: Date;
}

export interface DesignRecommendation {
  id: string;
  type: 'furniture' | 'color' | 'layout' | 'material';
  description: string;
  reason: string;
  confidence: number;
  items?: FurnitureItem[];
  colors?: string[];
  estimated_cost?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'architect';
  content: string;
  timestamp: Date;
  type: 'text' | 'suggestion' | 'action';
  metadata?: any;
}

export interface ArchitectPortfolio {
  id: string;
  architect: User;
  projects: PortfolioProject[];
  specializations: string[];
  experience: number;
  rating: number;
  reviews: Review[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  completionDate: Date;
  budget: number;
  style: string[];
}

export interface Review {
  id: string;
  author: User;
  rating: number;
  comment: string;
  date: Date;
  projectId?: string;
} 