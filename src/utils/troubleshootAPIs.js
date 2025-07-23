import aiTaskService from '../services/aiTaskService';
import placesService from '../services/placesService';
import locationService from '../services/locationService';
import config from '../config/environment';

export const runTroubleshootingTests = async () => {
  console.log('🔧 Running API troubleshooting tests...\n');
  
  const results = {
    configuration: {},
    services: {},
    recommendations: []
  };

  // Check configuration
  console.log('📋 Checking Configuration...');
  results.configuration = {
    placesAPIKey: !!config.GOOGLE_PLACES_API_KEY,
    mapsAPIKey: !!config.GOOGLE_MAPS_API_KEY,
    openaiAPIKey: !!config.OPENAI_API_KEY,
    openaiModel: config.OPENAI_MODEL,
    debugLogs: config.ENABLE_DEBUG_LOGS
  };
  
  console.log('Config check:', results.configuration);

  // Test AI Task Generation with variety
  console.log('\n🤖 Testing AI Task Generation Variety...');
  const taskVariants = [];
  
  for (let i = 0; i < 3; i++) {
    try {
      const task = await aiTaskService.generateZenTask({
        timeOfDay: 'morning',
        mood: 'energizing',
        activityLevel: 'gentle'
      });
      taskVariants.push({
        title: task.title,
        category: task.category,
        source: task.source
      });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Task generation ${i + 1} failed:`, error.message);
    }
  }
  
  results.services.aiTasks = {
    working: taskVariants.length > 0,
    variety: new Set(taskVariants.map(t => t.title)).size,
    samples: taskVariants,
    uniqueTitles: taskVariants.length === new Set(taskVariants.map(t => t.title)).size
  };

  // Test Location Service
  console.log('\n📍 Testing Location Service...');
  try {
    const location = await locationService.getCurrentLocation();
    results.services.location = {
      working: true,
      sample: {
        lat: location.latitude.toFixed(4),
        lng: location.longitude.toFixed(4)
      }
    };
    
    // Test Places Service if location works
    console.log('\n🗺️ Testing Places Service...');
    const testTypes = ['cafe', 'park', 'restaurant'];
    const places = await placesService.getNearbyInterestingPlaces({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 1000,
      types: testTypes,
      maxResults: 5
    });
    
    results.services.places = {
      working: Array.isArray(places) && places.length > 0,
      count: places.length,
      types: [...new Set(places.flatMap(p => p.types || []))] .slice(0, 5),
      samples: places.slice(0, 2).map(p => ({ name: p.name, types: p.types }))
    };
    
  } catch (locationError) {
    results.services.location = {
      working: false,
      error: locationError.message
    };
  }

  // Generate recommendations
  console.log('\n💡 Generating Recommendations...');
  
  if (!results.configuration.placesAPIKey) {
    results.recommendations.push('❌ Google Places API key not configured - add to .env file');
  }
  
  if (!results.configuration.openaiAPIKey) {
    results.recommendations.push('❌ OpenAI API key not configured - add to .env file'); 
  }
  
  if (results.services.aiTasks?.working && !results.services.aiTasks.uniqueTitles) {
    results.recommendations.push('⚠️ AI tasks showing some repetition - cache settings updated');
  }
  
  if (results.services.places?.working === false) {
    results.recommendations.push('❌ Places API not returning results - check API key permissions and billing');
  }
  
  if (results.services.aiTasks?.working && results.services.aiTasks.variety >= 2) {
    results.recommendations.push('✅ AI task generation variety improved');
  }
  
  if (results.services.places?.working && results.services.places.count > 0) {
    results.recommendations.push('✅ Places API working correctly');
  }

  // Print summary
  console.log('\n📊 Troubleshooting Summary:');
  console.log('='.repeat(50));
  results.recommendations.forEach(rec => console.log(rec));
  console.log('='.repeat(50));

  return results;
};

export const testAIVariety = async (iterations = 5) => {
  console.log(`\n🎲 Testing AI Task Variety (${iterations} iterations)...\n`);
  
  const tasks = [];
  const prompts = [
    { timeOfDay: 'morning', mood: 'energizing', activityLevel: 'gentle' },
    { timeOfDay: 'afternoon', mood: 'peaceful', activityLevel: 'moderate' },
    { timeOfDay: 'evening', mood: 'contemplative', activityLevel: 'gentle' },
    { timeOfDay: 'any', mood: 'curious', activityLevel: 'gentle' },
    { timeOfDay: 'morning', mood: 'grounded', activityLevel: 'gentle', keywords: ['nature'] }
  ];
  
  for (let i = 0; i < iterations; i++) {
    const prompt = prompts[i % prompts.length];
    try {
      const task = await aiTaskService.generateZenTask(prompt);
      tasks.push({
        iteration: i + 1,
        title: task.title,
        category: task.category,
        source: task.source,
        prompt: prompt
      });
      console.log(`${i + 1}. "${task.title}" (${task.category})`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Iteration ${i + 1} failed:`, error.message);
    }
  }
  
  const uniqueTitles = new Set(tasks.map(t => t.title));
  const uniqueCategories = new Set(tasks.map(t => t.category));
  
  console.log(`\n📈 Variety Analysis:`);
  console.log(`Total tasks: ${tasks.length}`);
  console.log(`Unique titles: ${uniqueTitles.size} (${(uniqueTitles.size/tasks.length*100).toFixed(1)}%)`);
  console.log(`Unique categories: ${uniqueCategories.size}`);
  console.log(`Repetition rate: ${((tasks.length - uniqueTitles.size)/tasks.length*100).toFixed(1)}%`);
  
  return {
    tasks,
    uniqueTitles: uniqueTitles.size,
    totalTasks: tasks.length,
    varietyScore: uniqueTitles.size / tasks.length
  };
};