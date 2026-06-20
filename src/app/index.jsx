import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, ScrollView, Text, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RotateCcw, Shield, User, Camera, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

import Onboarding from '@/components/onboarding';
import { useTheme } from '@/hooks/use-theme';
import { useProfile } from '@/context/ProfileContext';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfile();
  const [onboardingActive, setOnboardingActive] = useState(!profile.isSetUp);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': 'https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Regular.ttf',
    'Outfit-Bold': 'https://github.com/google/fonts/raw/main/ofl/outfit/static/Outfit-Bold.ttf',
  });

  const getFontFamily = (weight) => {
    if (fontsLoaded) {
      return weight === 'bold' ? 'Outfit-Bold' : 'Outfit-Regular';
    }
    return Platform.OS === 'web' ? 'sans-serif' : 'System';
  };

  const AVATAR_COLORS = {
    mint: '#2ECC71',
    teal: '#20B2AA',
    coral: '#E74C3C',
    gold: '#F1C40F',
    purple: '#9B59B6',
  };
  const activeColor = AVATAR_COLORS[profile.avatar] || theme.primaryAccent;

  const activeDiets = profile.dietaryPreferences.map(id => {
    switch (id) {
      case 'vegetarian': return 'Vegetarian ✅';
      case 'vegan': return 'Vegan ✅';
      case 'non_vegetarian': return 'Non-Vegetarian ✅';
      case 'lactose': return 'Lactose Free ✅';
      case 'gluten': return 'Gluten Free ✅';
      case 'keto': return 'Keto Friendly ✅';
      default: return id;
    }
  });

  const activeConditions = profile.conditions.map(id => {
    switch (id) {
      case 'diabetes': return { text: 'Diabetes ✅', color: '#27AE60', bg: '#E8F8F5' };
      case 'bp': return { text: 'High BP Risk ⚠️', color: '#D4AC0D', bg: '#FEF9E7' };
      case 'cholesterol': return { text: 'High Cholesterol ⚠️', color: '#D4AC0D', bg: '#FEF9E7' };
      case 'celiac': return { text: 'Celiac Disease ❌', color: '#C0392B', bg: '#FDEDEC' };
      default: return { text: id, color: theme.primaryAccent, bg: '#E8F8F5' };
    }
  });

  const activeAllergens = profile.allergens.map(id => {
    switch (id) {
      case 'peanuts': return 'Peanuts ❌';
      case 'tree_nuts': return 'Tree Nuts ❌';
      case 'dairy': return 'Dairy ❌';
      case 'eggs': return 'Eggs ❌';
      case 'soy': return 'Soy ❌';
      case 'wheat': return 'Wheat ❌';
      case 'shellfish': return 'Shellfish ❌';
      default: return id;
    }
  });

  // If onboarding is active, render the overlay directly
  if (onboardingActive) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Onboarding
          onComplete={() => {
            setOnboardingActive(false);
            if (!profile.isSetUp) {
              router.push('/ProfileSetupScreen');
            }
          }}
          onLogin={() => {
            if (Platform.OS === 'web') {
              window.alert('Simulation: Navigating to Login Screen');
            } else {
              console.log('Simulation: Navigating to Login Screen');
            }
            setOnboardingActive(false);
            if (!profile.isSetUp) {
              router.push('/ProfileSetupScreen');
            }
          }}
        />
      </View>
    );
  }

  // Completed State: Renders a premium, custom dashboard (skipping home/explore default tabs UI)
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bgMint }]}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              Welcome Back,
            </Text>
            <Text style={[styles.userNameText, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              {profile.name}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/ProfileSetupScreen')}
            style={[styles.avatarCircle, styles.glassSurface, { borderColor: activeColor, borderWidth: 2 }]}
          >
            <User size={24} color={activeColor} />
          </TouchableOpacity>
        </View>

        {/* Scan Status Banner */}
        <View style={[styles.scanStatusCard, styles.glassSurface, { backgroundColor: theme.whiteSurface }]}>
          <View style={styles.scanStatusHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E8F8F5' }]}>
              <CheckCircle2 size={24} color="#27AE60" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.scanStatusTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                Nutritional Integrity Guard
              </Text>
              <Text style={[styles.scanStatusDesc, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
                Profile cross-checks are fully active.
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Bento Cards */}
        <Text style={[styles.sectionTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
          Active Guardrails
        </Text>
        
        <View style={styles.grid}>
          {/* Card 1: Conditions & Diets */}
          <View style={[styles.bentoCard, styles.glassSurface, { backgroundColor: theme.whiteSurface }]}>
            <View style={styles.cardHeader}>
              <Shield size={20} color={activeColor} />
              <Text style={[styles.cardTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                Health & Diets
              </Text>
            </View>
            <View style={styles.tagList}>
              {activeConditions.map((cond, index) => (
                <View key={`cond-${index}`} style={[styles.tag, { borderColor: cond.color, backgroundColor: cond.bg }]}>
                  <Text style={[styles.tagText, { color: cond.color, fontFamily: getFontFamily('bold') }]}>
                    {cond.text}
                  </Text>
                </View>
              ))}
              {activeDiets.map((diet, index) => (
                <View key={`diet-${index}`} style={[styles.tag, { borderColor: theme.primaryAccent, backgroundColor: '#E8F8F5' }]}>
                  <Text style={[styles.tagText, { color: '#27AE60', fontFamily: getFontFamily('bold') }]}>
                    {diet}
                  </Text>
                </View>
              ))}
              {activeConditions.length === 0 && activeDiets.length === 0 && (
                <Text style={{ fontSize: 11, color: theme.textSecondary, fontFamily: getFontFamily('regular'), fontStyle: 'italic' }}>
                  No active health conditions or dietary preferences set.
                </Text>
              )}
            </View>
          </View>

          {/* Card 2: Allergens */}
          <View style={[styles.bentoCard, styles.glassSurface, { backgroundColor: theme.whiteSurface }]}>
            <View style={styles.cardHeader}>
              <Shield size={20} color="#E74C3C" />
              <Text style={[styles.cardTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                Allergens
              </Text>
            </View>
            <View style={styles.tagList}>
              {activeAllergens.map((allergen, index) => (
                <View key={`allergen-${index}`} style={[styles.tag, { borderColor: '#E74C3C', backgroundColor: '#FDEDEC' }]}>
                  <Text style={[styles.tagText, { color: '#C0392B', fontFamily: getFontFamily('bold') }]}>
                    {allergen}
                  </Text>
                </View>
              ))}
              {activeAllergens.length === 0 && (
                <Text style={{ fontSize: 11, color: theme.textSecondary, fontFamily: getFontFamily('regular'), fontStyle: 'italic' }}>
                  No active food allergies flagged.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Recent Apple Scan */}
        <Text style={[styles.sectionTitle, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
          Last Scanned Ingredient
        </Text>

        <View style={[styles.scanHistoryCard, styles.glassSurface, { backgroundColor: theme.whiteSurface }]}>
          <Image
            source={require('@/assets/images/onboarding_apple.png')}
            style={styles.historyAppleImage}
            resizeMode="contain"
          />
          <View style={styles.historyInfo}>
            <Text style={[styles.historyName, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Green Apple 🍏
            </Text>
            <Text style={[styles.historyResult, { fontFamily: getFontFamily('bold'), color: '#27AE60' }]}>
              100% Safe For Your Profile
            </Text>
            <Text style={[styles.historyDetails, { fontFamily: getFontFamily('regular'), color: theme.textSecondary }]}>
              95 kcal · 25g Carbs · 14% Vit C
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.dashboardPrimaryBtn, { backgroundColor: theme.primaryAccent }]}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.alert('Simulation: Activating AI Camera Reticle Scanner');
              } else {
                console.log('Simulation: Activating AI Camera Reticle Scanner');
              }
            }}>
            <Camera size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={[styles.btnText, { fontFamily: getFontFamily('bold') }]}>
              Scan New Meal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.dashboardSecondaryBtn, { borderColor: theme.primaryAccent }]}
            onPress={() => setOnboardingActive(true)}>
            <RotateCcw size={16} color={theme.primaryAccent} style={{ marginRight: 8 }} />
            <Text style={[styles.btnSecondaryText, { color: theme.primaryAccent, fontFamily: getFontFamily('bold') }]}>
              Re-run Onboarding
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
  },
  userNameText: {
    fontSize: 24,
    letterSpacing: -0.5,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
  scanStatusCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 28,
  },
  scanStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanStatusTitle: {
    fontSize: 15,
  },
  scanStatusDesc: {
    fontSize: 12.5,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  bentoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    marginLeft: 8,
  },
  tagList: {
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
  },
  scanHistoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    marginBottom: 32,
  },
  historyAppleImage: {
    width: 50,
    height: 50,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  historyName: {
    fontSize: 15,
  },
  historyResult: {
    fontSize: 12,
    marginTop: 2,
  },
  historyDetails: {
    fontSize: 11,
    marginTop: 2,
  },
  buttonGroup: {
    gap: 12,
  },
  dashboardPrimaryBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  dashboardSecondaryBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
  },
});
