import { useRef, useState } from 'react';
import { FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions, } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ui/themed-text';
import { ActionButton } from '@/components/ui/ActionButton';
import { Chip } from '@/components/ui/Chip';
import { Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

type Slide = { id: string; title: string; subtitle: string; chips?: string[] };

// Sin imágenes por ahora: cada slide reserva el espacio de la ilustración
const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Compra y vende en tu campus',
    subtitle: 'Emprendimientos, artículos de segunda mano y servicios de la comunidad de la Universidad Distrital.',
  },
  {
    id: '2',
    title: 'Recoges en tu sede, sin costo de entrega',
    subtitle: 'Eliges el punto y la hora de entrega. Todo ocurre dentro del campus.',
  },
  {
    id: '3',
    title: 'Pagas por Nequi al recibir',
    subtitle: 'Sin datos de tarjeta ni cobros anticipados. Cada vendedor está verificado con su correo institucional.',
    chips: ['Nequi al recibir', 'Verificados'],
  },
];

export default function Intro() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;
  const isSmall = height < 700;

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goNext = () => {
    const next = Math.min(index + 1, SLIDES.length - 1);
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  };

  // Ajusta estas rutas a las reales de tu proyecto
  const goMarketplace = () => router.replace('/inicio' as any);
  const goLogin = () => router.push('/login');
  const goBack = () => {
    const prev = Math.max(index - 1, 0);
    listRef.current?.scrollToIndex({ index: prev, animated: true });
    setIndex(prev);
  };

  const imageSize = width - Spacing[6] * 2;
  const imageHeight = Math.min(imageSize * 0.8, height * 0.32);

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      {/* Espacio de la ilustración */}
      <View style={[styles.imageBox, { width: imageSize, height: imageHeight }]}>
        {item.chips && (
          <View style={styles.chips}>
            {item.chips.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </View>
        )}
      </View>

      <ThemedText style={[styles.title, isSmall && styles.titleSmall]}>
        {item.title}
      </ThemedText>
      <ThemedText style={styles.subtitle} lightColor={Palette.textMuted}>
        {item.subtitle}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Omitir: espacio fijo arriba para que el contenido no salte en el último slide */}
      <View style={styles.topBar}>
        {!isLast && (
          <Pressable onPress={goLogin} accessibilityRole="link" accessibilityLabel="Omitir" style={styles.omitir}>
            <ThemedText style={styles.link}>Omitir</ThemedText>
          </Pressable>
        )}
      </View>
      <FlatList
        ref={listRef}
        style={styles.list}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      {/* Bloque fijo inferior */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((s, d) => (
            <View key={s.id} style={[styles.dot, d === index && styles.dotActive]} />
          ))}
        </View>

        {isLast ? (
          <ActionButton
            label="Explorar el marketplace"
            icon="storefront-outline"
            size="md"
            onPress={goMarketplace}
            style={styles.button}
          />
        ) : (
          <ActionButton
            label="Siguiente"
            icon="arrow-forward"
            size="md"
            onPress={goNext}
            style={styles.button}
          />
        )}

        {/* Espacio reservado para que el botón no salte entre slides */}
        <View style={styles.linkSlot}>
          {isLast ? (
            <Pressable onPress={goLogin} accessibilityRole="link" hitSlop={8}>
              <ThemedText type="link" style={styles.link}>
                Ya tengo cuenta, ingresar
              </ThemedText>
            </Pressable>
          ) : index > 0 ? (
            <Pressable onPress={goBack} accessibilityRole="link" accessibilityLabel="Atrás" hitSlop={8}>
              <ThemedText style={styles.link}>Atrás</ThemedText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.ground },
  list: { flex: 1 },
  slide: {
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[4],
  },
  imageBox: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.line,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: Spacing[3],
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  topBar: { height: TouchMin, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: Spacing[5] },
  omitir: { minHeight: TouchMin, justifyContent: 'center', paddingHorizontal: Spacing[2] },
  title: {
    ...Type.display,
    textAlign: 'center',
    marginTop: Spacing[5],
    marginBottom: Spacing[2],
  },
  titleSmall: { fontSize: 24, lineHeight: 30 },
  subtitle: { ...Type.bodyLg, textAlign: 'center' },

  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6], // espacio con el borde inferior
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  dot: { width: 8, height: 8, borderRadius: Radius.full, backgroundColor: Palette.line },
  dotActive: { width: 24, backgroundColor: Palette.ink },
  button: { width: '100%' },
  linkSlot: {
    height: TouchMin,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  link: { ...Type.bodyLg, textDecorationLine: 'underline' },
});