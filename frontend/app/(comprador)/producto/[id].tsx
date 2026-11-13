import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { UserRow } from '@/components/ui/UserRow';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { DescripcionBox } from '@/assets/DescripcionBox';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useOferta } from '@/features/productos/useOfertas';

export default function Producto() {
  const insets = useSafeAreaInsets();
  // Llega solo el id; el detalle se pide por su cuenta (y sale de la caché si ya se vio)
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: oferta, isLoading } = useOferta(id);

  return (
    <ScrollView
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
    >
      <ScreenHeader title="Producto" />

      <View style={s.contenedor}>
        {isLoading ? (
          <ActivityIndicator color={Palette.ink} accessibilityLabel="Cargando producto" />
        ) : !oferta ? (
          <Text style={s.vacio}>Este producto ya no está disponible.</Text>
        ) : (
          <Card>
            <UserRow name={oferta.vendedor} />

            <Text accessibilityRole="header" style={s.nombre}>{oferta.nombre}</Text>

            {/* Aquí va la foto del producto cuando exista */}
            <View style={s.imagen}>
              <Ionicons name="image-outline" size={48} color={Palette.textMuted} />
            </View>

            <DescripcionBox texto={oferta.descripcion ?? 'Sin descripción'} />

            <ActionButton
              label="Estoy interesado"
              variant="primary"
              icon="heart"
              onPress={() => {
                // TODO: aquí va la acción (enviar interés, abrir chat, etc.)
              }}
            />
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenedor: { padding: Spacing[6] },
  nombre: { ...Type.title3, color: Palette.ink },
  imagen: {
    height: 200,
    borderRadius: Radius.md,
    backgroundColor: Palette.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
});
