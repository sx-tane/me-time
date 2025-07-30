import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import PeacefulLoader from './PeacefulLoader';
import DESIGN_SYSTEM from '../constants/designSystem';

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
                      isCompleted ? DESIGN_SYSTEM.colors.surface.card :
                      isCurrent ? DESIGN_SYSTEM.colors.surface.card :
                      DESIGN_SYSTEM.colors.text.secondary
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
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  loaderSection: {
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
  },
  stepsContainer: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.xl,
    ...DESIGN_SYSTEM.shadows.card,
  },
  stepsTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.subtitle,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    position: 'relative',
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_SYSTEM.spacing.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  stepIconCompleted: {
    backgroundColor: DESIGN_SYSTEM.colors.semantic.success,
  },
  stepIconCurrent: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
  },
  stepIconUpcoming: {
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.regular,
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
  stepTextCompleted: {
    color: DESIGN_SYSTEM.colors.text.primary,
    opacity: 0.6,
  },
  stepTextCurrent: {
    color: DESIGN_SYSTEM.colors.text.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  stepTextUpcoming: {
    color: DESIGN_SYSTEM.colors.text.tertiary,
  },
  stepConnector: {
    position: 'absolute',
    left: 17,
    top: 36,
    width: 2,
    height: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface.divider,
  },
  stepConnectorActive: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    opacity: 0.3,
  },
});

export default StepByStepLoader;