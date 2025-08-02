import React, { useState } from 'react';
import type { JSX } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import DESIGN_SYSTEM from '../constants/designSystem';
import { ViewStyle, TextStyle } from '../types';

interface TimeValue {
  hour: number;
  minute: number;
}

interface GentleTimePickerProps {
  value: TimeValue;
  onTimeChange: (time: TimeValue) => void;
  title: string;
  description: string;
}

interface QuickTimeButtonProps {
  time: TimeValue;
  label: string;
  onPress: () => void;
}

const GentleTimePicker: React.FC<GentleTimePickerProps> = ({ value, onTimeChange, title, description }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tempHour, setTempHour] = useState<number>(value.hour);
  const [tempMinute, setTempMinute] = useState<number>(value.minute);

  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleConfirm = (): void => {
    onTimeChange({ hour: tempHour, minute: tempMinute });
    setModalVisible(false);
  };

  const handleCancel = (): void => {
    setTempHour(value.hour);
    setTempMinute(value.minute);
    setModalVisible(false);
  };

  const renderWheelPicker = (currentValue: number, setValue: (value: number) => void, max: number, label: string, step = 1): JSX.Element => {
    const values: number[] = [];
    for (let i = 0; i <= max; i += step) {
      values.push(i);
    }
    
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <View style={styles.wheelPicker}>
          {values.map(num => (
            <TouchableOpacity
              key={num}
              style={[
                styles.wheelItem,
                currentValue === num && styles.selectedWheelItem
              ]}
              onPress={() => setValue(num)}
            >
              <Text style={[
                styles.wheelText,
                currentValue === num && styles.selectedWheelText
              ]}>
                {num.toString().padStart(2, '0')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const QuickTimeButton: React.FC<QuickTimeButtonProps> = ({ time, label, onPress }) => (
    <TouchableOpacity
      style={[
        styles.quickTimeButton,
        (tempHour === time.hour && tempMinute === time.minute) && styles.selectedQuickTime
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.quickTimeLabel,
        (tempHour === time.hour && tempMinute === time.minute) && styles.selectedQuickTimeLabel
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.quickTimeText,
        (tempHour === time.hour && tempMinute === time.minute) && styles.selectedQuickTimeText
      ]}>
        {formatTime(time.hour, time.minute)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.timeButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.timeText}>
            {formatTime(value.hour, value.minute)}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={handleCancel}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
            <Text style={styles.modalTitle}>Choose your time</Text>
            <Text style={styles.modalSubtitle}>When would you like a gentle reminder?</Text>
            
            {/* Quick Time Presets */}
            <View style={styles.quickTimesContainer}>
              <Text style={styles.quickTimesTitle}>Common times</Text>
              <View style={styles.quickTimesRow}>
                <QuickTimeButton 
                  time={{ hour: 7, minute: 0 }} 
                  label="Early" 
                  onPress={() => { setTempHour(7); setTempMinute(0); }}
                />
                <QuickTimeButton 
                  time={{ hour: 9, minute: 0 }} 
                  label="Morning" 
                  onPress={() => { setTempHour(9); setTempMinute(0); }}
                />
                <QuickTimeButton 
                  time={{ hour: 12, minute: 0 }} 
                  label="Noon" 
                  onPress={() => { setTempHour(12); setTempMinute(0); }}
                />
              </View>
              <View style={styles.quickTimesRow}>
                <QuickTimeButton 
                  time={{ hour: 15, minute: 0 }} 
                  label="Afternoon" 
                  onPress={() => { setTempHour(15); setTempMinute(0); }}
                />
                <QuickTimeButton 
                  time={{ hour: 18, minute: 0 }} 
                  label="Evening" 
                  onPress={() => { setTempHour(18); setTempMinute(0); }}
                />
                <QuickTimeButton 
                  time={{ hour: 21, minute: 0 }} 
                  label="Night" 
                  onPress={() => { setTempHour(21); setTempMinute(0); }}
                />
              </View>
            </View>

            {/* Custom Time Picker */}
            <View style={styles.customTimeContainer}>
              <Text style={styles.customTimeTitle}>Or choose your own time</Text>
              <View style={styles.timePickerContainer}>
                {renderWheelPicker(tempHour, setTempHour, 23, 'Hour')}
                {renderWheelPicker(tempMinute, setTempMinute, 59, 'Minute', 15)}
              </View>
            </View>
            
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>
                {formatTime(tempHour, tempMinute)}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Set time</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.surface.border,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  description: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.secondary,
  },
  timeButton: {
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.colors.primary,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  timeText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DESIGN_SYSTEM.colors.background.primary,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    margin: DESIGN_SYSTEM.spacing.md,
    minWidth: 340,
    maxHeight: '95%',
    ...DESIGN_SYSTEM.shadows.hero,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.surface.border,
  },
  modalScrollContent: {
    padding: DESIGN_SYSTEM.spacing.xl,
  },
  modalTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.title,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.primary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  modalSubtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.light,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: DESIGN_SYSTEM.spacing.sm,
  },
  pickerLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    textAlign: 'center',
  },
  wheelPicker: {
    maxHeight: 120,
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    padding: DESIGN_SYSTEM.spacing.xs,
    overflow: 'hidden',
  },
  wheelItem: {
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    paddingHorizontal: DESIGN_SYSTEM.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    width: 32,
    height: 28,
  },
  selectedWheelItem: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  wheelText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.primary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
  },
  selectedWheelText: {
    color: DESIGN_SYSTEM.colors.interactiveText,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
  },
  quickTimesContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  quickTimesTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center',
  },
  quickTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  quickTimeButton: {
    flex: 1,
    marginHorizontal: DESIGN_SYSTEM.spacing.xs,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    backgroundColor: DESIGN_SYSTEM.colors.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  selectedQuickTime: {
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    borderColor: DESIGN_SYSTEM.colors.accent.blue,
    ...DESIGN_SYSTEM.shadows.card,
  },
  quickTimeLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.secondary,
    marginBottom: 2,
  },
  selectedQuickTimeLabel: {
    color: DESIGN_SYSTEM.colors.interactiveText,
  },
  quickTimeText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  selectedQuickTimeText: {
    color: DESIGN_SYSTEM.colors.interactiveText,
  },
  customTimeContainer: {
    marginTop: DESIGN_SYSTEM.spacing.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.surface.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  customTimeTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.small,
    color: DESIGN_SYSTEM.colors.text.secondary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: DESIGN_SYSTEM.colors.primary + '15',
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  previewText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.title,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    color: DESIGN_SYSTEM.colors.primary,
    letterSpacing: DESIGN_SYSTEM.typography.letterSpacing.tight,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: DESIGN_SYSTEM.spacing.sm,
    ...DESIGN_SYSTEM.shadows.subtle,
  },
  cancelButton: {
    backgroundColor: DESIGN_SYSTEM.colors.background.tertiary,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.surface.border,
  },
  cancelButtonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.text.primary,
  },
  confirmButton: {
    backgroundColor: DESIGN_SYSTEM.colors.interactive,
    ...DESIGN_SYSTEM.shadows.card,
  },
  confirmButtonText: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.body,
    color: DESIGN_SYSTEM.colors.interactiveText,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.semibold,
  },
});

export default GentleTimePicker;