import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ActionButton } from '@/components/ActionButton';
import { Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

type Slide = { id: string; image: ImageSourcePropType; title: string; subtitle: string };

const SLIDES: Slide[] = [
  {
    id: '1',
    image: { uri: 'https://via.placeholder.com/600x600.png?text=Imagen+1' },
    title: 'COMPRA Y VENDE EN TU CAMPUS',
    subtitle:'Emprendimientos, artículos de segunda mano y servicios de la comunidad de la Universidad Distrital.',
  },
  {
    id: '2',
    image: { uri: 'https://via.placeholder.com/600x600.png?text=Imagen+2' },
    title: 'RECOGE EN TU SEDE, SIN COSTO DE ENTREGA',
    subtitle: 'Eliges el punto y la hora de entrega. Todo ocurre dentro del campus',
  },
  {
    id: '3',
    image: { uri: 'https://via.placeholder.com/600x600.png?text=Imagen+3' },
    title: 'Pagas por Nequi al recibir',
    subtitle: 'Sin datos de tarjeta ni cobros anticipados. Cada vendedor está verificado con su correo institucional.',
  },
];

export default function intro() {
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
  const goMarketplace = () => router.replace('/Comprador/hubcomprador' as any);
  const goLogin = () => router.push('/login');

  const imageSize = width - Spacing[6] * 2;
  const imageHeight = Math.min(imageSize * 0.8, height * 0.32);

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.imageBox, { width: imageSize, height: imageHeight }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
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
            label="Explorar marketplace"
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
          {isLast && (
            <Pressable onPress={goLogin} accessibilityRole="link" hitSlop={8}>
              <ThemedText type="link" style={styles.link}>
                Ya tengo cuenta, ingresar
              </ThemedText>
            </Pressable>
          )}
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
  },
  image: { width: '100%', height: '100%' },
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