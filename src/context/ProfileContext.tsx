import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Profile {
  name: string;
  avatar: string;
  dietaryPreferences: string[];
  conditions: string[];
  allergens: string[];
  isSetUp: boolean;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  resetProfile: () => void;
}

const defaultProfile: Profile = {
  name: 'Member 1',
  avatar: 'mint',
  dietaryPreferences: [],
  conditions: [],
  allergens: [],
  isSetUp: false,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products' },
  { id: 'non_vegetarian', label: 'Non-Vegetarian', description: 'Includes meat, fish, and poultry' },
];

export const CONDITION_OPTIONS = [
  { id: 'diabetes', label: 'Diabetes', severity: 'ok', description: 'Monitor sugar & high-glycemic carbs' },
  { id: 'bp', label: 'High BP Risk', severity: 'warn', description: 'Monitor sodium levels' },
  { id: 'cholesterol', label: 'High Cholesterol', severity: 'warn', description: 'Monitor trans & saturated fats' },
  { id: 'celiac', label: 'Celiac Disease', severity: 'bad', description: 'Strict wheat/gluten avoidance' },
];

export const ALLERGEN_OPTIONS = [
  { id: 'peanuts', label: 'Peanuts', severity: 'bad' },
  { id: 'tree_nuts', label: 'Tree Nuts', severity: 'bad' },
  { id: 'dairy', label: 'Dairy', severity: 'bad' },
  { id: 'eggs', label: 'Eggs', severity: 'bad' },
  { id: 'soy', label: 'Soy', severity: 'bad' },
  { id: 'wheat', label: 'Wheat', severity: 'bad' },
  { id: 'shellfish', label: 'Shellfish', severity: 'bad' },
];

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
