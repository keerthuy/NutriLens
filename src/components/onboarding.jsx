import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Heart,
  Dumbbell,
  Check,
  Droplet,
  ArrowRight,
  Shield,
  User,
} from 'lucide-react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '@/hooks/use-theme';

const BORDER_RADIUS = 28;

export default function Onboarding({ onComplete, onLogin }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useMemo(() => new Animated.Value(0), []);
  const scrollViewRef = useRef(null);

  // Load Outfit Google Font dynamically
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

  // Floating animations for Screen 1
  const floatAnim1 = useMemo(() => new Animated.Value(0), []);
  const floatAnim2 = useMemo(() => new Animated.Value(0), []);
  const floatAnim3 = useMemo(() => new Animated.Value(0), []);
  const floatAnim4 = useMemo(() => new Animated.Value(0), []);

  // Scanning animations for Screen 2
  const scanLineAnim = useMemo(() => new Animated.Value(0), []);
  const cameraPulseAnim = useMemo(() => new Animated.Value(1), []);

  // Webbed nodes animations for Screen 3
  const badgeScaleAnims = useMemo(
    () => Array.from({ length: 5 }, () => new Animated.Value(0)),
    []
  );

  useEffect(() => {
    const createFloatLoop = (anim, delay, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const floatLoops = [
      createFloatLoop(floatAnim1, 0, 2000),
      createFloatLoop(floatAnim2, 300, 2400),
      createFloatLoop(floatAnim3, 600, 1800),
      createFloatLoop(floatAnim4, 150, 2200),
    ];

    floatLoops.forEach((loop) => loop.start());

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cameraPulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(cameraPulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      floatLoops.forEach((loop) => loop.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPage === 2) {
      Animated.stagger(
        150,
        badgeScaleAnims.map((anim) =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 40,
            friction: 6,
            useNativeDriver: true,
          })
        )
      ).start();
    } else {
      badgeScaleAnims.forEach((anim) => anim.setValue(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (pageIndex !== currentPage) {
      setCurrentPage(pageIndex);
    }
  };

  const navigateToPage = (index) => {
    if (index >= 3) {
      onComplete();
      return;
    }
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentPage(index);
  };

  const renderFooter = () => {
    const isFirstPage = currentPage === 0;

    return (
      <View style={styles.footerContainer}>
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {[0, 1, 2].map((i) => {
            const width = scrollX.interpolate({
              inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.indicatorDot,
                  { width, opacity, backgroundColor: theme.primaryAccent },
                ]}
              />
            );
          })}
        </View>

        {isFirstPage ? (
          <View style={styles.firstPageButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.primaryButton, { backgroundColor: theme.primaryAccent }]}
              onPress={() => navigateToPage(1)}>
              <Text style={[styles.primaryButtonText, { fontFamily: getFontFamily('bold') }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.outlineButton, { borderColor: theme.primaryAccent }]}
              onPress={onLogin}>
              <Text style={[styles.outlineButtonText, { fontFamily: getFontFamily('bold'), color: theme.primaryAccent }]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nextButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.circularNextButton, { backgroundColor: theme.primaryAccent }]}
              onPress={() => navigateToPage(currentPage + 1)}>
              <ArrowRight color="#FFFFFF" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.bgMint }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        style={styles.scrollWrapper}>
        
        {/* SCREEN 1 */}
        <View style={[styles.pageScreen, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
          <View style={[styles.illustrationSection, { backgroundColor: '#FFFFFF' }]}>
            <Image
              source={require('@/assets/images/onboarding_woman.png')}
              style={styles.womanImage}
              resizeMode="cover"
            />
            <Animated.View
              style={[
                styles.floatingBadge,
                styles.badgeHeart,
                styles.glassSurface,
                {
                  transform: [
                    {
                      translateY: floatAnim1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-6, 6],
                      }),
                    },
                  ],
                },
              ]}>
              <Heart size={20} color="#E74C3C" fill="#E74C3C" />
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingBadge,
                styles.badgeMuscle,
                styles.glassSurface,
                {
                  transform: [
                    {
                      translateY: floatAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, -8],
                      }),
                    },
                  ],
                },
              ]}>
              <Dumbbell size={20} color="#E67E22" />
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingBadge,
                styles.badgeCheck,
                styles.glassSurface,
                {
                  transform: [
                    {
                      translateY: floatAnim3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-7, 7],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={[styles.badgeCheckBg, { backgroundColor: theme.primaryAccent }]}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingBadge,
                styles.badgeDroplet,
                styles.glassSurface,
                {
                  transform: [
                    {
                      translateY: floatAnim4.interpolate({
                        inputRange: [0, 1],
                        outputRange: [5, -5],
                      }),
                    },
                  ],
                },
              ]}>
              <Droplet size={20} color="#3498DB" fill="#3498DB" />
            </Animated.View>

            <View style={styles.waveDivider}>
              <Svg height={65} width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 65`} preserveAspectRatio="none">
                <Path
                  d={`M0,20 C${SCREEN_WIDTH * 0.3},40 ${SCREEN_WIDTH * 0.7},0 ${SCREEN_WIDTH},20 L${SCREEN_WIDTH},65 L0,65 Z`}
                  fill={theme.bgMint}
                />
              </Svg>
            </View>
          </View>

          <View style={[styles.textCardContainer, { paddingTop: insets.top + 10 }]}>
            <Text style={[styles.titleText, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Welcome to NutriLens!
            </Text>
            <Text style={[styles.bodyText, { fontFamily: getFontFamily('regular'), color: theme.darkCharcoal }]}>
              {"Take control of your well-being with the power of AI-driven food analysis. Simply scan any meal, ingredient, or barcode to instantly uncover its nutritional breakdown and verify if it's safe for your personal dietary needs, allergies, and health goals."}
            </Text>
          </View>
        </View>

        {/* SCREEN 2 */}
        <View style={[styles.pageScreen, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
          <View style={[styles.illustrationSection, { backgroundColor: '#FFFFFF' }]}>
            <View style={styles.smartphoneFrameContainer}>
              <View style={[styles.smartphoneFrame, styles.glassSurface]}>
                <Image
                  source={require('@/assets/images/onboarding_apple.png')}
                  style={styles.appleImage}
                  resizeMode="contain"
                />

                <Animated.View
                  style={[
                    styles.cameraReticle,
                    {
                      borderColor: theme.primaryAccent,
                      transform: [{ scale: cameraPulseAnim }],
                    },
                  ]}>
                  <View style={[styles.reticleCorner, styles.reticleTopLeft, { borderColor: theme.primaryAccent }]} />
                  <View style={[styles.reticleCorner, styles.reticleTopRight, { borderColor: theme.primaryAccent }]} />
                  <View style={[styles.reticleCorner, styles.reticleBottomLeft, { borderColor: theme.primaryAccent }]} />
                  <View style={[styles.reticleCorner, styles.reticleBottomRight, { borderColor: theme.primaryAccent }]} />

                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        backgroundColor: theme.primaryAccent,
                        transform: [
                          {
                            translateY: scanLineAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 126],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </Animated.View>


              </View>
            </View>

            <View style={styles.waveDivider}>
              <Svg height={65} width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 65`} preserveAspectRatio="none">
                <Path
                  d={`M0,35 C${SCREEN_WIDTH * 0.4},-10 ${SCREEN_WIDTH * 0.6},65 ${SCREEN_WIDTH},20 L${SCREEN_WIDTH},65 L0,65 Z`}
                  fill={theme.bgMint}
                />
              </Svg>
            </View>
          </View>

          <View style={[styles.textCardContainer, { paddingTop: insets.top + 10 }]}>
            <Text style={[styles.titleText, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Smart AI Lens Scan
            </Text>
            <Text style={[styles.bodyText, { fontFamily: getFontFamily('regular'), color: theme.darkCharcoal, letterSpacing: 0.1 }]}>
              Instantly analyze fresh ingredients, packaged foods, or entire meals using our smart AI lens. Simply point your camera to see exact macros, vitamins, and compatibility warnings.
            </Text>
          </View>
        </View>

        {/* SCREEN 3 */}
        <View style={[styles.pageScreen, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
          <View style={[styles.illustrationSection, { backgroundColor: '#FFFFFF', overflow: 'visible' }]}>
            <View style={styles.profileHubContainer}>
              <View style={styles.svgWebWrapper}>
                <Svg height={240} width={300} viewBox="0 0 300 240">
                  <Line x1="150" y1="120" x2="150" y2="35" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                  <Line x1="150" y1="120" x2="55" y2="70" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                  <Line x1="150" y1="120" x2="245" y2="70" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                  <Line x1="150" y1="120" x2="245" y2="135" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                  <Line x1="150" y1="120" x2="65" y2="175" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                  <Line x1="150" y1="120" x2="150" y2="200" stroke="#BDC3C7" strokeWidth="1.5" strokeDasharray="4,4" />
                </Svg>
              </View>

              <View style={[styles.centralAvatarWrapper, styles.glassSurface]}>
                <View style={styles.avatarCircle}>
                  <User size={38} color="#7F8C8D" />
                </View>
                <View style={styles.medicalShieldBadge}>
                  <Shield size={16} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>

              {/* Members/Condition Badges */}
              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosTop,
                  {
                    transform: [{ scale: badgeScaleAnims[0] }],
                    borderColor: '#BDC3C7',
                    backgroundColor: theme.backgroundElement,
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
                  Member 1
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosTopLeft,
                  {
                    transform: [{ scale: badgeScaleAnims[1] }],
                    borderColor: '#2ECC71',
                    backgroundColor: '#E8F8F5',
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: '#27AE60' }]}>
                  Diabetes ✅
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosTopRight,
                  {
                    transform: [{ scale: badgeScaleAnims[2] }],
                    borderColor: '#E74C3C',
                    backgroundColor: '#FDEDEC',
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: '#C0392B' }]}>
                  Peanut Allergy ❌
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosMiddleRight,
                  {
                    transform: [{ scale: badgeScaleAnims[3] }],
                    borderColor: '#2ECC71',
                    backgroundColor: '#E8F8F5',
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: '#27AE60' }]}>
                  Lactose Free ✅
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosBottomLeft,
                  {
                    transform: [{ scale: badgeScaleAnims[2] }],
                    borderColor: '#E74C3C',
                    backgroundColor: '#FDEDEC',
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: '#C0392B' }]}>
                  Peanut Allergy ❌
                </Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.nodeBadge,
                  styles.badgePosBottom,
                  {
                    transform: [{ scale: badgeScaleAnims[4] }],
                    borderColor: '#F1C40F',
                    backgroundColor: '#FEF9E7',
                  },
                ]}>
                <Text style={[styles.nodeBadgeText, { fontFamily: getFontFamily('bold'), color: '#D4AC0D' }]}>
                  High BP Risk ⚠️
                </Text>
              </Animated.View>
            </View>

            <View style={styles.waveDivider}>
              <Svg height={65} width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 65`} preserveAspectRatio="none">
                <Path
                  d={`M0,15 C${SCREEN_WIDTH * 0.4},45 ${SCREEN_WIDTH * 0.6},0 ${SCREEN_WIDTH},35 L${SCREEN_WIDTH},65 L0,65 Z`}
                  fill={theme.bgMint}
                />
              </Svg>
            </View>
          </View>

          <View style={[styles.textCardContainer, { paddingTop: insets.top + 10 }]}>
            <Text style={[styles.titleText, { fontFamily: getFontFamily('bold'), color: theme.darkCharcoal }]}>
              Personal Profiles & Guardrails
            </Text>
            <Text style={[styles.bodyText, { fontFamily: getFontFamily('regular'), color: theme.darkCharcoal }]}>
              Input your dietary preferences, medical conditions, and allergies. NutriLens cross-checks every scan against your unique profile, providing a smart warning label if any item threatens your health goals.
            </Text>
          </View>
        </View>

      </Animated.ScrollView>

      {renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
  },
  pageScreen: {
    flexDirection: 'column',
  },
  illustrationSection: {
    height: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textCardContainer: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 26,
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15.5,
    lineHeight: 22,
    textAlign: 'center',
  },
  waveDivider: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 65,
    zIndex: 10,
  },
  womanImage: {
    width: '100%',
    height: '100%',
    marginTop: 0,
  },
  floatingBadge: {
    position: 'absolute',
    padding: 10,
    borderRadius: 50,
  },
  glassSurface: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  badgeHeart: {
    top: '25%',
    left: '12%',
  },
  badgeMuscle: {
    top: '18%',
    right: '12%',
  },
  badgeCheck: {
    bottom: '30%',
    left: '8%',
  },
  badgeCheckBg: {
    borderRadius: 50,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDroplet: {
    bottom: '25%',
    right: '10%',
  },
  smartphoneFrameContainer: {
    width: 180,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  smartphoneFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(240, 248, 245, 0.6)',
  },
  appleImage: {
    width: 100,
    height: 100,
  },
  cameraReticle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
  },
  reticleTopLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  reticleTopRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  reticleBottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  reticleBottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    width: '100%',
    height: 3,
    position: 'absolute',
    top: 0,
  },
  appleScannerTechNode: {
    position: 'absolute',
    top: 25,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.2)',
  },
  scannerNodeBottomRight: {
    top: 'auto',
    bottom: 25,
    left: 'auto',
    right: 20,
  },
  scannerNodeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  scannerNodeText: {
    fontSize: 10,
  },
  profileHubContainer: {
    width: 300,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 20,
  },
  svgWebWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  centralAvatarWrapper: {
    position: 'absolute',
    zIndex: 10,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicalShieldBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E74C3C',
    padding: 6,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nodeBadge: {
    position: 'absolute',
    zIndex: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nodeBadgeText: {
    fontSize: 11.5,
  },
  badgePosTop: {
    top: 10,
    alignSelf: 'center',
  },
  badgePosTopLeft: {
    top: 50,
    left: 10,
  },
  badgePosTopRight: {
    top: 50,
    right: 10,
  },
  badgePosMiddleRight: {
    top: 115,
    right: 8,
  },
  badgePosBottomLeft: {
    bottom: 45,
    left: 20,
  },
  badgePosBottom: {
    bottom: 15,
    alignSelf: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  indicatorDot: {
    height: 8,
    borderRadius: 4,
  },
  firstPageButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  outlineButton: {
    width: '100%',
    height: 52,
    borderRadius: BORDER_RADIUS,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: 16,
  },
  nextButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  circularNextButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});
