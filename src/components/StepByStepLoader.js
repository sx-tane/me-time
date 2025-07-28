import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MindfulContainer from './MindfulContainer';
import PeacefulLoader from './PeacefulLoader';
import colors, { ROUNDED_DESIGN } from '../constants/colors';

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
    padding: ROUNDED_DESIGN.spacing.spacious,
  },
  loaderSection: {
    marginBottom: ROUNDED_DESIGN.spacing.generous,
  },
  stepsContainer: {
    backgroundColor: colors.card,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    padding: ROUNDED_DESIGN.spacing.spacious,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  stepsTitle: {
    fontSize: ROUNDED_DESIGN.typography.medium,
    fontWeight: '400',
    color: colors.text,
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    textAlign: 'center',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    position: 'relative',
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: ROUNDED_DESIGN.radius.full,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ROUNDED_DESIGN.spacing.comfortable,
  },
  stepIconCompleted: {
    backgroundColor: colors.success,
  },
  stepIconCurrent: {
    backgroundColor: colors.primary,
  },
  stepIconUpcoming: {
    backgroundColor: colors.buttonBg,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: ROUNDED_DESIGN.typography.body,
    fontWeight: '400',
    color: colors.lightText,
  },
  stepTextCompleted: {
    color: colors.text,
    opacity: 0.6,
  },
  stepTextCurrent: {
    color: colors.text,
    fontWeight: '400',
  },
  stepTextUpcoming: {
    color: colors.mutedText,
  },
  stepConnector: {
    position: 'absolute',
    left: 17,
    top: 36,
    width: 2,
    height: ROUNDED_DESIGN.spacing.spacious,
    backgroundColor: colors.divider,
  },
  stepConnectorActive: {
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
});

export default StepByStepLoader;