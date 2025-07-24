import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import PeacefulLoader from './PeacefulLoader';
import colors from '../constants/colors';

const StepByStepLoader = ({ 
  stage = null, 
  message = "Preparing your moment...",
  showSteps = true 
}) => {
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    { 
      id: 'generating', 
      icon: 'bulb-outline', 
      text: 'Generating task',
      description: 'Creating a personalized activity just for you'
    },
    { 
      id: 'locations', 
      icon: 'location-outline', 
      text: 'Finding nearby spots',
      description: 'Discovering peaceful places for your activity'
    },
    { 
      id: 'finalizing', 
      icon: 'checkmark-circle-outline', 
      text: 'Finalizing everything',
      description: 'Putting the finishing touches together'
    }
  ];

  useEffect(() => {
    console.log('🔄 StepByStepLoader stage changed to:', stage);
    if (stage) {
      const currentStepIndex = steps.findIndex(step => step.id === stage);
      console.log('📍 Current step index:', currentStepIndex);
      if (currentStepIndex !== -1) {
        // Mark previous steps as completed
        const newCompleted = steps.slice(0, currentStepIndex).map(step => step.id);
        console.log('✅ Completed steps:', newCompleted);
        setCompletedSteps(newCompleted);
      }
    }
  }, [stage]);

  const getCurrentStep = () => {
    return steps.find(step => step.id === stage);
  };

  const currentStep = getCurrentStep();
  console.log('🎯 Current step:', currentStep);

  return (
    <MindfulContainer fadeIn slideIn style={styles.container}>
      <View style={styles.loaderSection}>
        <PeacefulLoader 
          message={currentStep?.description || message}
          variant="ripple"
        />
      </View>
      
      {showSteps && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Progress</Text>
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = stage === step.id;
            const isUpcoming = !isCompleted && !isCurrent;
            
            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={[
                  styles.stepIcon,
                  isCompleted && styles.stepIconCompleted,
                  isCurrent && styles.stepIconCurrent,
                  isUpcoming && styles.stepIconUpcoming
                ]}>
                  <Ionicons 
                    name={isCompleted ? 'checkmark' : step.icon} 
                    size={16} 
                    color={
                      isCompleted ? colors.card :
                      isCurrent ? colors.card :
                      colors.lightText
                    }
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                    styles.stepText,
                    isCompleted && styles.stepTextCompleted,
                    isCurrent && styles.stepTextCurrent,
                    isUpcoming && styles.stepTextUpcoming
                  ]}>
                    {step?.text}
                  </Text>
                </View>
                {index < steps.length - 1 && (
                  <View style={[
                    styles.stepConnector,
                    (isCompleted || (isCurrent && index < steps.length - 1)) && styles.stepConnectorActive
                  ]} />
                )}
              </View>
            );
          })}
        </View>
      )}
    </MindfulContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loaderSection: {
    marginBottom: 32,
  },
  stepsContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  stepIconCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIconCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIconUpcoming: {
    backgroundColor: colors.surface,
    borderColor: colors.surface,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.lightText,
  },
  stepTextCompleted: {
    color: colors.primary,
    opacity: 0.7,
  },
  stepTextCurrent: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepTextUpcoming: {
    color: colors.lightText,
  },
  stepConnector: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 16,
    backgroundColor: colors.surface,
  },
  stepConnectorActive: {
    backgroundColor: colors.primary,
  },
});

export default StepByStepLoader;