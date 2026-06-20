import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { ArrowLeft, ArrowRight, Check, Shield, AlertCircle, Heart, Leaf, Sprout, Drumstick } from 'lucide-react-native';
import { useProfile, DIETARY_OPTIONS, CONDITION_OPTIONS, ALLERGEN_OPTIONS } from '@/context/ProfileContext';
import { useTheme } from '@/hooks/use-theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const AVATAR_COLORS = [
  { id: 'mint', color: '#2ECC71', name: 'Mint Emerald' },
  { id: 'teal', color: '#20B2AA', name: 'Ocean Teal' },
  { id: 'coral', color: '#E74C3C', name: 'Sunset Coral' },
  { id: 'gold', color: '#F1C40F', name: 'Honey Gold' },
  { id: 'purple', color: '#9B59B6', name: 'Royal Purple' },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { profile, updateProfile } = useProfile();
  
  // Local wizard state
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name || 'Member 1');
  const [avatarColor, setAvatarColor] = useState(profile.avatar || 'mint');
  const [selectedDiet, setSelectedDiet] = useState<string[]>(profile.dietaryPreferences || []);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(profile.conditions || []);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(profile.allergens || []);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': 'https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Regular.ttf',
    'Outfit-Bold': 'https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Bold.ttf',
  });

  const getFontFamily = (weight: 'regular' | 'bold') => {
    if (fontsLoaded) {
      return weight === 'bold' ? 'Outfit-Bold' : 'Outfit-Regular';
    }
    return Platform.OS === 'web' ? 'sans-serif' : 'System';
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    updateProfile({
      name,
      avatar: avatarColor,
      dietaryPreferences: selectedDiet,
      conditions: selectedConditions,
      allergens: selectedAllergens,
      isSetUp: true,
    });
    
    // Navigate to dashboard
    router.replace('/');
  };

  const toggleDiet = (id: string) => {
    setSelectedDiet((prev) => (prev.includes(id) ? [] : [id]));
  };

  const toggleCondition = (id: string) => {
    setSelectedConditions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllergen = (id: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getDietIcon = (id: string, isSelected: boolean) => {
    const color = isSelected ? '#FFFFFF' : theme.textSecondary;
    switch (id) {
      case 'vegetarian':
        return <Leaf size={18} color={color} />;
      case 'vegan':
        return <Sprout size={18} color={color} />;
      case 'non_vegetarian':
        return <Drumstick size={18} color={color} />;
      default:
        return <Leaf size={18} color={color} />;
    }
  };

  // Helper for current active color
  const activeThemeColor = AVATAR_COLORS.find(c => c.id === avatarColor)?.color || theme.primaryAccent;

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepperContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.stepIndicatorWrapper, { flex: i === 3 ? 0 : 1 }]}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: i === step ? activeThemeColor : i < step ? `${activeThemeColor}88` : theme.backgroundElement,
                  transform: [{ scale: i === step ? 1.25 : 1 }],
                },
              ]}
            />
            {i < 3 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: i < step ? activeThemeColor : theme.backgroundElement,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(200)} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Create Your Profile
            </Text>
            <Text style={[styles.stepSubtitle, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              Enter your name and choose a profile theme color.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                NAME
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: theme.backgroundSelected,
                    backgroundColor: theme.whiteSurface,
                    fontFamily: getFontFamily('regular'),
                    color: theme.darkCharcoal,
                  },
                ]}
                placeholder="Enter name..."
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                maxLength={20}
              />
            </View>

            <View style={styles.avatarSelectionContainer}>
              <Text style={[styles.inputLabel, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                PROFILE THEME COLOR
              </Text>
              <View style={styles.avatarColorGrid}>
                {AVATAR_COLORS.map((c) => {
                  const isSelected = avatarColor === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.8}
                      onPress={() => setAvatarColor(c.id)}
                      style={[
                        styles.avatarColorItem,
                        {
                          backgroundColor: c.color,
                          borderColor: isSelected ? theme.darkCharcoal : 'transparent',
                          borderWidth: isSelected ? 3 : 0,
                        },
                      ]}
                    >
                      {isSelected && (
                        <Check size={20} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.avatarColorName, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
                Selected: {AVATAR_COLORS.find((c) => c.id === avatarColor)?.name}
              </Text>
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(200)} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Dietary Preferences
            </Text>
            <Text style={[styles.stepSubtitle, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              Select the diet you follow.
            </Text>

            <ScrollView contentContainerStyle={styles.optionsList} showsVerticalScrollIndicator={false}>
              {DIETARY_OPTIONS.map((opt) => {
                const isSelected = selectedDiet.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.9}
                    onPress={() => toggleDiet(opt.id)}
                    style={[
                      styles.optionCard,
                      styles.glassSurface,
                      {
                        backgroundColor: isSelected ? `${activeThemeColor}12` : theme.whiteSurface,
                        borderColor: isSelected ? activeThemeColor : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                    <View style={styles.optionHeader}>
                      <View style={[styles.conditionIconWrapper, { backgroundColor: isSelected ? activeThemeColor : theme.backgroundElement }]}>
                        {getDietIcon(opt.id, isSelected)}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.optionLabel, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                          {opt.label}
                        </Text>
                        <Text style={[styles.optionDesc, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
                          {opt.description}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: isSelected ? activeThemeColor : theme.textSecondary,
                            backgroundColor: isSelected ? activeThemeColor : 'transparent',
                          },
                        ]}
                      >
                        {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(200)} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Medical Conditions
            </Text>
            <Text style={[styles.stepSubtitle, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              Specify any conditions to trigger smart safety guidelines.
            </Text>

            <ScrollView contentContainerStyle={styles.optionsList} showsVerticalScrollIndicator={false}>
              {CONDITION_OPTIONS.map((opt) => {
                const isSelected = selectedConditions.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.9}
                    onPress={() => toggleCondition(opt.id)}
                    style={[
                      styles.optionCard,
                      styles.glassSurface,
                      {
                        backgroundColor: isSelected ? `${activeThemeColor}12` : theme.whiteSurface,
                        borderColor: isSelected ? activeThemeColor : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                    <View style={styles.optionHeader}>
                      <View style={[styles.conditionIconWrapper, { backgroundColor: isSelected ? activeThemeColor : theme.backgroundElement }]}>
                        <Shield size={18} color={isSelected ? '#FFFFFF' : theme.textSecondary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.optionLabel, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                          {opt.label}
                        </Text>
                        <Text style={[styles.optionDesc, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
                          {opt.description}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: isSelected ? activeThemeColor : theme.textSecondary,
                            backgroundColor: isSelected ? activeThemeColor : 'transparent',
                          },
                        ]}
                      >
                        {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View entering={FadeInRight.duration(300)} exiting={FadeOutLeft.duration(200)} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Food Allergens
            </Text>
            <Text style={[styles.stepSubtitle, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              Flag ingredients that will trigger strict DANGER warnings.
            </Text>

            <ScrollView contentContainerStyle={styles.allergenGrid} showsVerticalScrollIndicator={false}>
              {ALLERGEN_OPTIONS.map((opt) => {
                const isSelected = selectedAllergens.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    onPress={() => toggleAllergen(opt.id)}
                    style={[
                      styles.allergenBadge,
                      styles.glassSurface,
                      {
                        backgroundColor: isSelected ? '#FDEDEC' : theme.whiteSurface,
                        borderColor: isSelected ? '#E74C3C' : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                    {isSelected ? (
                      <AlertCircle size={16} color="#C0392B" style={{ marginRight: 6 }} />
                    ) : (
                      <Heart size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
                    )}
                    <Text
                      style={[
                        styles.allergenText,
                        {
                          fontFamily: getFontFamily('bold'),
                          color: isSelected ? '#C0392B' : theme.darkCharcoal,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgMint }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={[styles.backButton, styles.glassSurface, { backgroundColor: theme.whiteSurface }]}>
            <ArrowLeft size={20} color={theme.darkCharcoal} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
            Setup Health Profile
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Stepper */}
        {renderStepIndicator()}

        {/* Dynamic Step Content */}
        <View style={styles.contentContainer}>
          {renderStepContent()}
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[
              styles.secondaryButton,
              {
                borderColor: activeThemeColor,
              },
            ]}
          >
            <Text style={[styles.secondaryButtonText, { fontFamily: getFontFamily('bold'), color: activeThemeColor }]}>
              {step === 0 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.primaryButton,
              {
                backgroundColor: activeThemeColor,
                shadowColor: activeThemeColor,
              },
            ]}
          >
            <Text style={[styles.primaryButtonText, { fontFamily: getFontFamily('bold') }]}>
              {step === 3 ? 'Save Profile' : 'Next'}
            </Text>
            {step < 3 && <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    marginVertical: 16,
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    height: 3,
    flex: 1,
    marginHorizontal: -4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  textInput: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  avatarSelectionContainer: {
    marginBottom: 24,
  },
  avatarColorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  avatarColorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarColorName: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  optionsList: {
    gap: 12,
    paddingBottom: 24,
  },
  optionCard: {
    borderRadius: 20,
    padding: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  conditionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allergenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  allergenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: '45%',
    flexGrow: 1,
  },
  allergenText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
  },
  glassSurface: {
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});
