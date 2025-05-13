import React, { useState, useRef } from 'react';
import {
  View,
  PanResponder,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Room, FurnitureItem } from '../../types';

interface InteriorCanvasProps {
  room: Room;
  onUpdateRoom: (updatedRoom: Room) => void;
  onSelectItem: (item: FurnitureItem) => void;
}

const InteriorCanvas: React.FC<InteriorCanvasProps> = ({
  room,
  onUpdateRoom,
  onSelectItem,
}) => {
  const [scale, setScale] = useState(1);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [gridVisible, setGridVisible] = useState(true);
  
  // Calculate canvas dimensions based on room size and screen
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height * 0.7; // 70% of screen height
  const roomAspectRatio = room.dimensions.length / room.dimensions.width;
  
  const canvasWidth = screenWidth * 0.9; // 90% of screen width
  const canvasHeight = canvasWidth * roomAspectRatio;
  
  // Scale factors to convert between real dimensions and screen pixels
  const pixelsPerFoot = canvasWidth / room.dimensions.width;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (selectedItem) {
          const newX = gestureState.moveX / pixelsPerFoot;
          const newY = gestureState.moveY / pixelsPerFoot;
          
          // Update item position if within room boundaries
          if (isWithinBoundaries(newX, newY, selectedItem)) {
            updateItemPosition(selectedItem.id, newX, newY);
          }
        }
      },
      onPanResponderRelease: () => {
        if (selectedItem) {
          setSelectedItem(null);
          onUpdateRoom({ ...room });
        }
      },
    })
  ).current;

  const isWithinBoundaries = (x: number, y: number, item: FurnitureItem) => {
    return (
      x >= 0 &&
      x + item.dimensions.width <= room.dimensions.width &&
      y >= 0 &&
      y + item.dimensions.length <= room.dimensions.length
    );
  };

  const updateItemPosition = (itemId: string, x: number, y: number) => {
    const updatedItems = room.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          position: {
            ...item.position,
            x,
            y,
          },
        };
      }
      return item;
    });

    onUpdateRoom({
      ...room,
      items: updatedItems,
    });
  };

  const handleTouchStart = (x: number, y: number) => {
    // Convert screen coordinates to room coordinates
    const roomX = x / pixelsPerFoot;
    const roomY = y / pixelsPerFoot;

    // Find if any item was touched
    const touchedItem = room.items.find(item => {
      const itemBounds = {
        left: item.position.x,
        right: item.position.x + item.dimensions.width,
        top: item.position.y,
        bottom: item.position.y + item.dimensions.length,
      };

      return (
        roomX >= itemBounds.left &&
        roomX <= itemBounds.right &&
        roomY >= itemBounds.top &&
        roomY <= itemBounds.bottom
      );
    });

    if (touchedItem) {
      setSelectedItem(touchedItem);
      onSelectItem(touchedItem);
    }
  };

  const renderGrid = () => {
    if (!gridVisible) return null;

    const gridSize = 2; // 2 feet per grid cell
    const gridLines = [];
    const numVerticalLines = Math.floor(room.dimensions.width / gridSize);
    const numHorizontalLines = Math.floor(room.dimensions.length / gridSize);

    // Vertical lines
    for (let i = 1; i < numVerticalLines; i++) {
      const x = (i * gridSize * pixelsPerFoot);
      gridLines.push(
        <View
          key={`v${i}`}
          style={[
            styles.gridLine,
            {
              left: x,
              height: canvasHeight,
            },
          ]}
        />
      );
    }

    // Horizontal lines
    for (let i = 1; i < numHorizontalLines; i++) {
      const y = (i * gridSize * pixelsPerFoot);
      gridLines.push(
        <View
          key={`h${i}`}
          style={[
            styles.gridLine,
            {
              top: y,
              width: canvasWidth,
            },
          ]}
        />
      );
    }

    return gridLines;
  };

  const renderFurniture = () => {
    return room.items.map(item => (
      <View
        key={item.id}
        style={[
          styles.furnitureItem,
          {
            width: item.dimensions.width * pixelsPerFoot,
            height: item.dimensions.length * pixelsPerFoot,
            left: item.position.x * pixelsPerFoot,
            top: item.position.y * pixelsPerFoot,
            backgroundColor: item === selectedItem ? '#007AFF80' : '#007AFF40',
            transform: [{ rotate: `${item.position.rotation}deg` }],
          },
        ]}
      >
        <Text style={styles.furnitureLabel}>{item.name}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.canvas,
          {
            width: canvasWidth,
            height: canvasHeight,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {renderGrid()}
        {renderFurniture()}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setGridVisible(!gridVisible)}
        >
          <Text style={styles.buttonText}>
            {gridVisible ? 'Hide Grid' : 'Show Grid'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            const newScale = scale === 1 ? 1.5 : 1;
            setScale(newScale);
          }}
        >
          <Text style={styles.buttonText}>
            {scale === 1 ? 'Zoom In' : 'Zoom Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#eee',
    width: 1,
    height: 1,
  },
  furnitureItem: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  furnitureLabel: {
    fontSize: 10,
    color: '#007AFF',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 8,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InteriorCanvas; 