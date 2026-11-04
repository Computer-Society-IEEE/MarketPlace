import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flower } from '@/components/shapes/Flower';
import { Star4 } from '@/components/shapes/Star4';
import { ThemedText } from '@/components/themed-text';
import { Palette, Spacing, Type } from '@/constants/theme';

const INTRO_ROUTE = '/intro';

const SplashTheme = {
  background: Palette.ground, // beige claro
  flower: '#E6F4BF',          // lima pastel
  starDark: Palette.green600, // estrella superior izquierda
  starLime: '#9CC63A',        // estrella inferior derecha (lima oscuro)
  title: Palette.ink,
  subtitle: Palette.textMuted,
  footer: Palette.border,
};

const FLOWER_SIZE = 320;
const STARS_START = 1500; // ms: cuando la flor ya terminó de crecer

// Aparece una vez y luego titila lentamente
function TwinkleStar({
  size,
  color,
  appear,
  delay = 0,
  style,
}: {
  size: number;
  color: string;
  appear: Animated.Value;
  delay?: number;
  style: object;
}) {
  const twinkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(twinkle, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const timer = setTimeout(() => loop.start(), STARS_START + delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, []);

  const twinkleOpacity = twinkle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] });
  const twinkleScale = twinkle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] });

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          opacity: Animated.multiply(appear, twinkleOpacity),
          transform: [{ scale: Animated.multiply(appear, twinkleScale) }],
        },
      ]}
    >
      <Star4 size={size} color={color} />
    </Animated.View>
  );
}

export default function Splash() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const flowerScale = useRef(new Animated.Value(0)).current;
  const starAppear = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // La flor crece UNA vez y se queda así
    Animated.sequence([
      Animated.spring(flowerScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(starAppear, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(footerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace(INTRO_ROUTE as any);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TwinkleStar
        size={34}
        color={SplashTheme.starDark}
        appear={starAppear}
        style={{ top: '14%', left: '12%' }}
      />
      <TwinkleStar
        size={38}
        color={SplashTheme.starLime}
        appear={starAppear}
        delay={900}
        style={{ bottom: '18%', right: '12%' }}
      />

      {/* Flor al fondo + textos encima */}
      <View style={styles.center}>
        <Animated.View style={[styles.flower, { transform: [{ scale: flowerScale }] }]}>
          <Flower size={FLOWER_SIZE} petals={8} color={SplashTheme.flower} />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
          <ThemedText style={styles.title} lightColor={SplashTheme.title}>
            MarketPlace UD
          </ThemedText>
          <ThemedText style={styles.subtitle} lightColor={SplashTheme.subtitle}>
            El mercado de la comunidad de la Universidad Distrital
          </ThemedText>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          { opacity: footerOpacity, bottom: Math.max(insets.bottom, 0) + Spacing[4] },
        ]}
      >
        <ThemedText style={styles.footerText} lightColor={SplashTheme.footer}>
          IEEE Computer Society UD
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SplashTheme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: { position: 'absolute' },
  center: {
    width: FLOWER_SIZE,
    height: FLOWER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flower: { position: 'absolute' },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: Spacing[10],
  },
  title: {
    ...Type.display,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    ...Type.bodySm,
    textAlign: 'center',
    marginTop: Spacing[2],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    ...Type.caption,
    textAlign: 'center',
  },
});