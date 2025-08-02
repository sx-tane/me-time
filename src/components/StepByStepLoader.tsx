import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import PeacefulLoader from './PeacefulLoader';
import DESIGN_SYSTEM from '../constants/designSystem';
import { JAPANESE_WELLNESS_DESIGN } from '../constants/japaneseWellnessDesign';
import { LoadingStage } from '../types';

interface Step {
  id: LoadingStage;
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  description: string;
}

interface StepByStepLoaderProps {
  stage?: LoadingStage;
  message?: string;
  showSteps?: boolean;
}

const StepByStepLoader: React.FC<StepByStepLoaderProps> = ({ 
  stage = null, 
  message = "Preparing your moment...",
  showSteps = true 
}) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: Step[] = [
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
        const newCompleted = steps.slice(0, currentStepIndex).map(step => step.id).filter(id => id !== null) as string[];
        console.log('✅ Completed steps:', newCompleted);
        setCompletedSteps(newCompleted);
      }
    }
  }, [stage]);

  const getCurrentStep = (): Step | undefined => {
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
            const isCompleted = completedSteps.includes(step.id!);
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
    padding: 8,
  },
  loaderSection: {
    marginBottom: DESIGN_SYSTEM.spacing.xxl,
  },
  stepsContainer: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.background.sanctuary,
    borderRadius: 16,
    padding: 12,
    ...DESIGN_SYSTEM.shadows.card,
    marginHorizontal: 4,
  },
  stepsTitle: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.sizes.md,
    fontWeight: '500',
    color: JAPANESE_WELLNESS_DESIGN.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: JAPANESE_WELLNESS_DESIGN.typography.letterSpacing.zen,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    paddingVertical: 4,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  stepIconCompleted: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary.sage,
  },
  stepIconCurrent: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.primary[500],
  },
  stepIconUpcoming: {
    backgroundColor: JAPANESE_WELLNESS_DESIGN.colors.neutral[100],
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: JAPANESE_WELLNESS_DESIGN.typography.sizes.sm,
    fontWeight: '400',
    color: JAPANESE_WELLNESS_DESIGN.colors.text.secondary,
    letterSpacing: JAPANESE_WELLNESS_DESIGN.typography.letterSpacing.zen,
    lineHeight: JAPANESE_WELLNESS_DESIGN.typography.sizes.sm * 1.4,
  },
  stepTextCompleted: {
    color: DESIGN_SYSTEM.colors.text.primary,
    opacity: 0.6,
  },
  stepTextCurrent: {
    color: JAPANESE_WELLNESS_DESIGN.colors.text.primary,
    fontWeight: '500',
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