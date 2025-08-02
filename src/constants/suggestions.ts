import { Suggestion, PeacefulSpot } from '../types';

export const suggestions: Suggestion[] = [
  { id: 1, text: "Find a bench you've never sat on", type: "discovery", icon: "search" },
  { id: 2, text: "Watch clouds for as long as feels right", type: "mindful", icon: "cloud-outline" },
  { id: 3, text: "Take the long way home", type: "movement", icon: "walk" },
  { id: 4, text: "Notice five sounds around you", type: "mindful", icon: "ear-outline" },
  { id: 5, text: "Write one word about how you feel", type: "reflection", icon: "pencil-outline" },
  { id: 6, text: "Sit somewhere new for 10 breaths", type: "mindful", icon: "time-outline" },
  { id: 7, text: "Follow a bird's path with your eyes", type: "discovery", icon: "eye-outline" },
  { id: 8, text: "Touch three different textures", type: "sensory", icon: "hand-left-outline" },
  { id: 9, text: "Find the oldest tree nearby", type: "discovery", icon: "leaf-outline" },
  { id: 10, text: "Do absolutely nothing for a moment", type: "rest", icon: "pause-outline" },
  { id: 11, text: "Listen to your breathing without changing it", type: "mindful", icon: "heart-outline" },
  { id: 12, text: "Find a color you haven't noticed today", type: "discovery", icon: "color-palette-outline" },
  { id: 13, text: "Walk barefoot on grass", type: "sensory", icon: "footsteps-outline" },
  { id: 14, text: "Watch how light moves through leaves", type: "mindful", icon: "sunny-outline" },
  { id: 15, text: "Smell something pleasant", type: "sensory", icon: "flower-outline" }
];

export const peacefulSpots: PeacefulSpot[] = [
  { id: 1, name: "Hidden Garden Café", type: "cafe", distance: "5 min walk", icon: "cafe-outline" },
  { id: 2, name: "Riverside Bench", type: "nature", distance: "8 min walk", icon: "water-outline" },
  { id: 3, name: "Old Library Reading Room", type: "library", distance: "10 min walk", icon: "book-outline" },
  { id: 4, name: "Hilltop Viewpoint", type: "viewpoint", distance: "15 min walk", icon: "telescope-outline" },
  { id: 5, name: "Quiet Bookstore Corner", type: "bookstore", distance: "7 min walk", icon: "library-outline" }
];