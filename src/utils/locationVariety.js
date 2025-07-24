import locationService from '../services/locationService';

export const calculateLocationSimilarity = (locations1, locations2) => {
  if (!locations1 || !locations2) return 0;
  
  const names1 = locations1.map(l => l.place?.name?.toLowerCase()).filter(Boolean);
  const names2 = locations2.map(l => l.place?.name?.toLowerCase()).filter(Boolean);
  
  if (names1.length === 0 || names2.length === 0) return 0;
  
  const commonNames = names1.filter(name => names2.includes(name));
  const similarity = (commonNames.length / Math.max(names1.length, names2.length)) * 100;
  
  return similarity;
};

export const getLocationDiversity = (locations) => {
  if (!locations || locations.length < 2) return 100;
  
  let totalDistance = 0;
  let comparisons = 0;
  
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const loc1 = locations[i].place?.location;
      const loc2 = locations[j].place?.location;
      
      if (loc1 && loc2) {
        const distance = locationService.calculateDistance(
          loc1.lat, loc1.lng, 
          loc2.lat, loc2.lng
        );
        totalDistance += distance;
        comparisons++;
      }
    }
  }
  
  if (comparisons === 0) return 50;
  
  const averageDistance = totalDistance / comparisons;
  
  // Convert to diversity score (0-100)
  // 100m = low diversity, 1000m+ = high diversity
  return Math.min(100, (averageDistance / 10)); // Scale: 1000m = 100 points
};

export const analyzeLocationVariety = (currentLocations, previousLocations) => {
  const similarity = calculateLocationSimilarity(currentLocations, previousLocations);
  const diversity = getLocationDiversity(currentLocations);
  
  const variety = {
    similarity: similarity,
    diversity: diversity,
    varietyScore: (100 - similarity) + diversity,
    isVaried: similarity < 50 && diversity > 30,
    suggestions: []
  };
  
  if (similarity > 70) {
    variety.suggestions.push('High similarity to previous locations detected');
  }
  
  if (diversity < 20) {
    variety.suggestions.push('Locations are clustered too closely together');
  }
  
  if (variety.varietyScore > 120) {
    variety.suggestions.push('Excellent location variety achieved');
  }
  
  return variety;
};