import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PlaceCard } from '../components/PlaceCard';
import { GentleButton } from '../components/GentleButton';
import ChillButton from '../components/ChillButton';
import LocationSuggestionCard from '../components/LocationSuggestionCard';
import PeacefulLoader from '../components/PeacefulLoader';
import MindfulContainer from '../components/MindfulContainer';
import { COLORS, ZEN_THEMES } from '../constants/colors';
import { 
  getAIEnhancedPeacefulSpots, 
  getAIEnhancedInterestingSpots, 
  generateZenTasksForCurrentMoment,
  searchSpotsForTask 
} from '../services/suggestionService';
import { getShadowStyles } from '../utils/platformDetection';

export const DiscoverScreen = () => {
  const [locationPermission, setLocationPermission] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [currentMode, setCurrentMode] = useState('peaceful'); // 'peaceful', 'interesting', 'tasks'
  const [peacefulSpots, setPeacefulSpots] = useState([]);
  const [interestingSpots, setInterestingSpots] = useState([]);
  const [aiTasks, setAiTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskRelatedSpots, setTaskRelatedSpots] = useState([]);
  const [loadingAbortController, setLoadingAbortController] = useState(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission) {
      loadContent();
    }
  }, [locationPermission, currentMode, keywords]);

  // Cleanup effect to cancel pending requests on unmount
  useEffect(() => {
    return () => {
      if (loadingAbortController) {
        loadingAbortController.abort();
      }
    };
  }, [loadingAbortController]);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const loadContent = async () => {
    if (!locationPermission) return;
    
    // Cancel any existing loading request
    if (loadingAbortController) {
      loadingAbortController.abort();
    }
    
    // Prevent duplicate requests if already loading
    if (loading) return;
    
    const abortController = new AbortController();
    setLoadingAbortController(abortController);
    setLoading(true);
    setSelectedTask(null);
    setTaskRelatedSpots([]);
    
    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      
      if (abortController.signal.aborted) return;
      
      if (currentMode === 'peaceful') {
        const spots = await getAIEnhancedPeacefulSpots(keywordList, { maxResults: 8 });
        if (!abortController.signal.aborted) {
          setPeacefulSpots(spots);
        }
      } else if (currentMode === 'interesting') {
        const spots = await getAIEnhancedInterestingSpots(keywordList, { maxResults: 8 });
        if (!abortController.signal.aborted) {
          setInterestingSpots(spots);
        }
      } else if (currentMode === 'tasks') {
        const tasks = await generateZenTasksForCurrentMoment(keywordList);
        if (!abortController.signal.aborted) {
          setAiTasks(tasks);
        }
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error('Error loading content:', error);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
        setLoadingAbortController(null);
      }
    }
  };

  const handleTaskSelection = async (task) => {
    if (selectedTask?.id === task.id) {
      // Deselect if clicking the same task
      setSelectedTask(null);
      setTaskRelatedSpots([]);
      return;
    }
    
    setSelectedTask(task);
    setTaskRelatedSpots([]);
    
    try {
      const spots = await searchSpotsForTask(task);
      setTaskRelatedSpots(spots);
    } catch (error) {
      console.error('Error searching spots for task:', error);
    }
  };

  const renderModeButtons = () => (
    <View style={styles.modeSelector}>
      <ChillButton
        title="🕯️ Peaceful"
        variant={currentMode === 'peaceful' ? 'primary' : 'zen'}
        size="small"
        onPress={() => setCurrentMode('peaceful')}
        style={[styles.modeButton, currentMode === 'peaceful' && styles.activeModeButton]}
      />
      <ChillButton
        title="✨ Interesting"
        variant={currentMode === 'interesting' ? 'primary' : 'zen'}
        size="small"
        onPress={() => setCurrentMode('interesting')}
        style={[styles.modeButton, currentMode === 'interesting' && styles.activeModeButton]}
      />
      <ChillButton
        title="🎋 AI Tasks"
        variant={currentMode === 'tasks' ? 'primary' : 'zen'}
        size="small"
        onPress={() => setCurrentMode('tasks')}
        style={[styles.modeButton, currentMode === 'tasks' && styles.activeModeButton]}
      />
    </View>
  );

  const renderKeywordInput = () => (
    <View style={styles.keywordSection}>
      <Text style={styles.keywordLabel}>Keywords (optional)</Text>
      <TextInput
        style={styles.keywordInput}
        value={keywords}
        onChangeText={setKeywords}
        placeholder="meditation, nature, art..."
        placeholderTextColor={COLORS.mutedText}
        multiline={false}
        onSubmitEditing={loadContent}
      />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      const loadingMessages = {
        peaceful: "Finding peaceful spots to soothe your soul...",
        interesting: "Discovering fascinating places nearby...",
        tasks: "Creating mindful moments for you..."
      };
      
      return (
        <MindfulContainer fadeIn style={styles.loadingContainer}>
          <PeacefulLoader 
            message={loadingMessages[currentMode] || "Finding peaceful moments..."} 
            variant="floating"
          />
        </MindfulContainer>
      );
    }

    if (currentMode === 'peaceful') {
      return (
        <View>
          <Text style={styles.sectionTitle}>Peaceful spots within walking distance</Text>
          <Text style={styles.sectionSubtitle}>
            {peacefulSpots.length > 0 ? `${peacefulSpots.length} places to find inner calm nearby` : 'Places to find inner calm nearby'}
          </Text>
          {peacefulSpots.map((spot, index) => (
            <LocationSuggestionCard 
              key={`peaceful_${index}`} 
              suggestion={spot} 
              style={styles.zenCard}
            />
          ))}
        </View>
      );
    }

    if (currentMode === 'interesting') {
      return (
        <View>
          <Text style={styles.sectionTitle}>Interesting spots within walking distance</Text>
          <Text style={styles.sectionSubtitle}>
            {interestingSpots.length > 0 ? `${interestingSpots.length} places to spark curiosity nearby` : 'Places to spark curiosity nearby'}
          </Text>
          {interestingSpots.map((spot, index) => (
            <LocationSuggestionCard 
              key={`interesting_${index}`} 
              suggestion={spot} 
              style={styles.zenCard}
            />
          ))}
        </View>
      );
    }

    if (currentMode === 'tasks') {
      return (
        <View>
          <Text style={styles.sectionTitle}>AI-Generated Zen Tasks</Text>
          <Text style={styles.sectionSubtitle}>
            {aiTasks.length > 0 ? `${aiTasks.length} mindful activities for this moment` : 'Mindful activities for this moment'}
          </Text>
          {aiTasks.map((task, index) => (
            <TouchableOpacity 
              key={`task_${index}`} 
              style={[styles.taskCard, selectedTask?.id === task.id && styles.selectedTaskCard]}
              onPress={() => handleTaskSelection(task)}
              activeOpacity={0.7}
            >
              <View style={styles.taskHeader}>
                <Ionicons 
                  name={task.icon || 'leaf-outline'} 
                  size={24} 
                  color={COLORS.accent} 
                />
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskTime}>{task.timeEstimate}</Text>
                <Text style={styles.taskCategory}>{task.category}</Text>
              </View>
              {selectedTask?.id === task.id && (
                <View style={styles.taskAction}>
                  <Text style={styles.taskActionText}>🔍 Finding places for this task...</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {selectedTask && taskRelatedSpots.length > 0 && (
            <View style={styles.relatedSpotsSection}>
              <Text style={styles.relatedSpotsTitle}>Perfect spots for: {selectedTask.title}</Text>
              {taskRelatedSpots.map((spot, index) => (
                <LocationSuggestionCard 
                  key={`related_${index}`} 
                  suggestion={spot} 
                  style={styles.zenCard}
                />
              ))}
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Discover nearby zen</Text>
          <Text style={styles.subtitle}>
            Within walking distance of your current location
          </Text>
        </View>

        {locationPermission ? (
          <>
            {renderModeButtons()}
            {renderKeywordInput()}
            {renderContent()}
          </>
        ) : (
          <View style={styles.permissionCard}>
            <Ionicons name="location-outline" size={32} color={COLORS.accent} />
            <Text style={styles.permissionTitle}>Location helps find zen nearby</Text>
            <Text style={styles.permissionText}>
              We'll find peaceful and interesting spots within walking distance, 
              plus generate personalized mindful tasks just for you.
            </Text>
            <ChillButton
              title="Enable location"
              variant="primary"
              onPress={checkLocationPermission}
              style={styles.permissionButton}
              breathe={true}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: 'center',
    fontWeight: '300',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  activeModeButton: {
    ...getShadowStyles({
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  keywordSection: {
    marginBottom: 25,
  },
  keywordLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '400',
  },
  keywordInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.lightText,
    fontStyle: 'italic',
  },
  zenCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 16,
    ...getShadowStyles({
      shadowColor: COLORS.stone,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    }),
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
    ...getShadowStyles({
      shadowColor: COLORS.stone,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    }),
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  taskDescription: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  taskCategory: {
    fontSize: 12,
    color: COLORS.mutedText,
    backgroundColor: COLORS.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    textTransform: 'lowercase',
  },
  selectedTaskCard: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: COLORS.accentSoft,
  },
  taskAction: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  taskActionText: {
    fontSize: 13,
    color: COLORS.accent,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  relatedSpotsSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  relatedSpotsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  permissionCard: {
    backgroundColor: COLORS.mist,
    borderRadius: 24,
    padding: 30,
    marginTop: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  permissionButton: {
    minWidth: 140,
  },
});