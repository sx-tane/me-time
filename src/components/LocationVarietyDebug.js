import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeLocationVariety } from '../utils/locationVariety';
import locationHistoryService from '../services/locationHistoryService';
import colors from '../constants/colors';

const LocationVarietyDebug = ({ currentSuggestion, previousSuggestion, visible = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  React.useEffect(() => {
    if (visible && currentSuggestion?.locationSuggestions) {
      const variety = analyzeLocationVariety(
        currentSuggestion.locationSuggestions,
        previousSuggestion?.locationSuggestions
      );
      setAnalysis(variety);
    }
  }, [currentSuggestion, previousSuggestion, visible]);

  if (!visible || !analysis) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return colors.waveBlue; // Wave blue for excellent
    if (score >= 60) return colors.sunrise; // Sandy gold for good
    return colors.deepWater; // Deep ocean blue for needs improvement
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={styles.title}>🗺️ Location Variety Debug</Text>
        <Text style={styles.toggle}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Variety Analysis</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Overall Score:</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(analysis.varietyScore) }]}>
                {analysis.varietyScore.toFixed(1)} ({getScoreText(analysis.varietyScore)})
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Similarity to Previous:</Text>
              <Text style={styles.scoreValue}>{analysis.similarity.toFixed(1)}%</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Geographic Diversity:</Text>
              <Text style={styles.scoreValue}>{analysis.diversity.toFixed(1)}/100</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Is Varied:</Text>
              <Text style={[styles.scoreValue, { color: analysis.isVaried ? colors.waveBlue : colors.deepWater }]}>
                {analysis.isVaried ? '✅ Yes' : '❌ No'}
              </Text>
            </View>
          </View>

          {analysis.suggestions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              {analysis.suggestions.map((suggestion, index) => (
                <Text key={index} style={styles.suggestion}>• {suggestion}</Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Locations</Text>
            {currentSuggestion?.locationSuggestions?.slice(0, 3).map((loc, index) => (
              <Text key={index} style={styles.location}>
                {index + 1}. {loc.place.name} ({loc.relevance})
              </Text>
            ))}
          </View>

          {previousSuggestion?.locationSuggestions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Previous Locations</Text>
              {previousSuggestion.locationSuggestions.slice(0, 3).map((loc, index) => (
                <Text key={index} style={[styles.location, styles.previousLocation]}>
                  {index + 1}. {loc.place.name} ({loc.relevance})
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  toggle: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
    paddingTop: 0,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.lightText,
  },
  scoreValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: 'bold',
  },
  suggestion: {
    fontSize: 10,
    color: colors.lightText,
    marginBottom: 1,
  },
  location: {
    fontSize: 10,
    color: colors.lightText,
    marginBottom: 1,
  },
  previousLocation: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
});

export default LocationVarietyDebug;