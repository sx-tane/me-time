/**
 * AI Response Parser with Type Safety
 * Ensures consistent parsing of OpenAI responses with fallback handling
 */

// Default task structure
const DEFAULT_TASK = {
  title: 'Take a moment to breathe',
  description: 'Pause for a few minutes and focus on your breathing. Take slow, deep breaths and let your mind settle.',
  timeEstimate: '5-10 minutes',
  category: 'mindful',
  icon: 'heart'
};

// Valid categories and their default icons
const VALID_CATEGORIES = {
  mindful: 'heart',
  sensory: 'flower',
  movement: 'walk',
  reflection: 'book',
  discovery: 'compass',
  rest: 'moon',
  creative: 'brush',
  nature: 'leaf',
  social: 'people'
};

// Valid icon names (from Ionicons)
const VALID_ICONS = [
  'heart', 'heart-outline', 'flower', 'flower-outline', 'walk', 'walk-outline',
  'book', 'book-outline', 'compass', 'compass-outline', 'moon', 'moon-outline',
  'brush', 'brush-outline', 'leaf', 'leaf-outline', 'people', 'people-outline',
  'star', 'star-outline', 'sunny', 'sunny-outline', 'ear', 'ear-outline',
  'eye', 'eye-outline', 'hand-left', 'hand-left-outline', 'water', 'water-outline',
  'fitness', 'fitness-outline', 'cafe', 'cafe-outline', 'musical-note', 'musical-note-outline'
];

/**
 * Validates if a string is a valid time estimate
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid time format
 */
const isValidTimeEstimate = (time) => {
  if (!time || typeof time !== 'string') return false;
  
  // Check for patterns like "5-10 minutes", "15 minutes", "1 hour", etc.
  const timePattern = /^\d+(-\d+)?\s*(minute|minutes|min|mins|hour|hours|hr|hrs)$/i;
  return timePattern.test(time);
};

/**
 * Sanitizes and validates a task object
 * @param {object} task - Raw task object from AI
 * @returns {object} Validated and sanitized task
 */
const sanitizeTask = (task) => {
  // Ensure task is an object
  if (!task || typeof task !== 'object') {
    console.warn('Invalid task object, using default');
    return DEFAULT_TASK;
  }

  // Validate and sanitize title
  const title = task.title && typeof task.title === 'string' 
    ? task.title.trim().substring(0, 100) // Limit length
    : DEFAULT_TASK.title;

  // Validate and sanitize description
  const description = task.description && typeof task.description === 'string'
    ? task.description.trim().substring(0, 500) // Limit length
    : DEFAULT_TASK.description;

  // Validate category
  const category = task.category && VALID_CATEGORIES.hasOwnProperty(task.category)
    ? task.category
    : 'mindful'; // Default category

  // Validate icon - use category default if invalid
  const icon = task.icon && VALID_ICONS.includes(task.icon)
    ? task.icon
    : VALID_CATEGORIES[category];

  // Validate time estimate
  const timeEstimate = isValidTimeEstimate(task.timeEstimate)
    ? task.timeEstimate
    : DEFAULT_TASK.timeEstimate;

  return {
    title,
    description,
    timeEstimate,
    category,
    icon
  };
};

/**
 * Parses AI response text and extracts JSON
 * @param {string} responseText - Raw response from OpenAI
 * @returns {object|null} Parsed task object or null
 */
const extractJSONFromResponse = (responseText) => {
  if (!responseText || typeof responseText !== 'string') {
    return null;
  }

  // Try to find JSON in code blocks first
  const codeBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      return parsed;
    } catch (e) {
      console.warn('Failed to parse JSON from code block:', e.message);
    }
  }

  // Try to find any JSON object in the text
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (e) {
      console.warn('Failed to parse JSON from text:', e.message);
    }
  }

  // Try to parse the entire response as JSON
  try {
    const parsed = JSON.parse(responseText);
    return parsed;
  } catch (e) {
    console.warn('Failed to parse entire response as JSON:', e.message);
  }

  return null;
};

/**
 * Main parser function for AI responses
 * @param {string} aiResponse - Raw response from OpenAI
 * @returns {object} Validated task object (never fails)
 */
export const parseAIResponse = (aiResponse) => {
  console.log('🤖 Parsing AI response...');
  
  try {
    // Extract JSON from response
    const extracted = extractJSONFromResponse(aiResponse);
    
    if (!extracted) {
      console.warn('Could not extract JSON from AI response, using default task');
      return DEFAULT_TASK;
    }

    // Handle array responses (take first item)
    const taskData = Array.isArray(extracted) ? extracted[0] : extracted;
    
    // Sanitize and validate the task
    const sanitizedTask = sanitizeTask(taskData);
    
    console.log('✅ Successfully parsed AI task:', sanitizedTask.title);
    return sanitizedTask;
    
  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    return DEFAULT_TASK;
  }
};

/**
 * Parses multiple tasks from AI response
 * @param {string} aiResponse - Raw response from OpenAI
 * @param {number} maxTasks - Maximum number of tasks to return
 * @returns {array} Array of validated task objects
 */
export const parseMultipleAIResponses = (aiResponse, maxTasks = 5) => {
  console.log('🤖 Parsing multiple AI responses...');
  
  const tasks = [];
  
  try {
    // Try to extract all JSON blocks
    const jsonBlocks = aiResponse.match(/```json\s*([\s\S]*?)\s*```/g) || [];
    
    for (const block of jsonBlocks) {
      if (tasks.length >= maxTasks) break;
      
      const match = block.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1].trim());
          const sanitized = sanitizeTask(parsed);
          tasks.push(sanitized);
        } catch (e) {
          console.warn('Failed to parse JSON block:', e.message);
        }
      }
    }
    
    // If no tasks found, try parsing as single response
    if (tasks.length === 0) {
      tasks.push(parseAIResponse(aiResponse));
    }
    
    console.log(`✅ Parsed ${tasks.length} tasks from AI response`);
    return tasks;
    
  } catch (error) {
    console.error('❌ Error parsing multiple AI responses:', error);
    return [DEFAULT_TASK];
  }
};

// Export utilities
export const AIResponseParser = {
  parse: parseAIResponse,
  parseMultiple: parseMultipleAIResponses,
  sanitizeTask,
  isValidTimeEstimate,
  DEFAULT_TASK,
  VALID_CATEGORIES,
  VALID_ICONS
};

export default AIResponseParser;