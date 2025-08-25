import { Assignments } from './types';

const STORAGE_KEY = 'intuition-box-assignments';

export const loadAssignments = (): Assignments => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading assignments from localStorage:', error);
  }
  return {};
};

export const saveAssignments = (assignments: Assignments): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error('Error saving assignments to localStorage:', error);
  }
};

export const clearAssignments = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing assignments from localStorage:', error);
  }
};

export const exportAssignments = (assignments: Assignments): void => {
  try {
    const dataStr = JSON.stringify(assignments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contributors.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export assignments:', error);
  }
};

export const copyAssignmentsToClipboard = async (assignments: Assignments): Promise<boolean> => {
  try {
    const dataStr = JSON.stringify(assignments, null, 2);
    await navigator.clipboard.writeText(dataStr);
    return true;
  } catch (error) {
    console.error('Failed to copy assignments to clipboard:', error);
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(assignments, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy also failed:', fallbackError);
      return false;
    }
  }
};

export const loadFromJsonFile = async (): Promise<Assignments> => {
  try {
    const response = await fetch('/data/contributors.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.assignments || {};
  } catch (error) {
    console.error('Failed to load from JSON file:', error);
    return {};
  }
};

export const loadFullAppStateFromJson = async (): Promise<{ contributors: any[], projects: any[], assignments: Assignments }> => {
  try {
    const response = await fetch('/data/contributors.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Check if the file contains only assignments (old format) or full app state
    if (data.contributors && data.projects) {
      // Full app state format
      return {
        contributors: data.contributors || [],
        projects: data.projects || [],
        assignments: data.assignments || {}
      };
    } else {
      // Only assignments format - keep existing contributors and projects
      return {
        contributors: [], // Will be filled from app's default data
        projects: [],    // Will be filled from app's default data
        assignments: data || {}
      };
    }
  } catch (error) {
    console.error('Failed to load full app state from JSON file:', error);
    return { contributors: [], projects: [], assignments: {} };
  }
};
