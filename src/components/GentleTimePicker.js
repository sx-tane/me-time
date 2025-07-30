import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import DESIGN_SYSTEM from '../constants/designSystem';

const GentleTimePicker = ({ value, onTimeChange, title, description }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempHour, setTempHour] = useState(value.hour);
  const [tempMinute, setTempMinute] = useState(value.minute);

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleConfirm = () => {
    onTimeChange({ hour: tempHour, minute: tempMinute });
    setModalVisible(false);
  };

  const handleCancel = () => {
    setTempHour(value.hour);
    setTempMinute(value.minute);
    setModalVisible(false);
  };

  const renderWheelPicker = (currentValue, setValue, max, label, step = 1) => {
    const values = [];
    for (let i = 0; i <= max; i += step) {
      values.push(i);
    }
    
    return (
      <View style={styles.pickerColumn}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <ScrollView 
          style={styles.wheelPicker}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
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
        </ScrollView>
      </View>
    );
  };

  const QuickTimeButton = ({ time, label, onPress }) => (
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
          </View>
        </View>
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
    padding: DESIGN_SYSTEM.spacing.xxl,
    margin: DESIGN_SYSTEM.spacing.lg,
    minWidth: 340,
    maxHeight: '88%',
    ...DESIGN_SYSTEM.shadows.hero,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.surface.border,
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
    gap: 16,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.lightText,
    marginBottom: 8,
    textAlign: 'center',
  },
  wheelPicker: {
    height: 140,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  wheelItem: {
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    paddingHorizontal: ROUNDED_DESIGN.spacing.comfortable,
    alignItems: 'center',
    marginHorizontal: ROUNDED_DESIGN.spacing.gentle,
    borderRadius: ROUNDED_DESIGN.radius.minimal,
  },
  selectedWheelItem: {
    backgroundColor: colors.accent,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  wheelText: {
    fontSize: 18,
    color: colors.text,
  },
  selectedWheelText: {
    color: colors.WHITE,
    fontWeight: '600',
  },
  quickTimesContainer: {
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    padding: ROUNDED_DESIGN.spacing.gentle,
    backgroundColor: colors.surface,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  quickTimesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  quickTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickTimeButton: {
    flex: 1,
    marginHorizontal: ROUNDED_DESIGN.spacing.minimal,
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    paddingHorizontal: ROUNDED_DESIGN.spacing.gentle,
    backgroundColor: colors.tertiary,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  selectedQuickTime: {
    backgroundColor: colors.accent,
    borderColor: colors.secondary,
    ...ROUNDED_DESIGN.shadows.soft,
    transform: [{ scale: 1.02 }],
  },
  quickTimeLabel: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 2,
  },
  selectedQuickTimeLabel: {
    color: colors.WHITE,
  },
  quickTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectedQuickTimeText: {
    color: colors.WHITE,
  },
  customTimeContainer: {
    marginTop: ROUNDED_DESIGN.spacing.gentle,
    padding: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.surface,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  customTimeTitle: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: ROUNDED_DESIGN.spacing.spacious,
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    backgroundColor: colors.accent + '15',
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    ...ROUNDED_DESIGN.shadows.gentle,
  },
  previewText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.primary,
    letterSpacing: -0.1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: ROUNDED_DESIGN.spacing.comfortable,
  },
  button: {
    flex: 1,
    paddingVertical: ROUNDED_DESIGN.spacing.comfortable,
    borderRadius: ROUNDED_DESIGN.radius.gentle,
    alignItems: 'center',
    ...ROUNDED_DESIGN.shadows.gentle,
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