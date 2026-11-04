import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { UserRow } from '../../components/UserRow';
import { ActionButton } from '../../components/ActionButton';
import { styles } from '../../constants/Styles';
import { Palette, Radius, Spacing, Type, TouchMin } from '@/constants/theme';

export default function DetalleProducto() {
  // Datos que llegan desde "buscar" (por ahora de ejemplo)
  const { usuario = 'User', producto = 'Nombre del producto' } =
    useLocalSearchParams<{ usuario?: string; producto?: string }>();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="producto" />

      <View style={localStyles.contenedor}>
        <View style={localStyles.card}>
          {/* Usuario (avatar + nombre a la izquierda) */}
          <UserRow name={usuario} />

          {/* Nombre del producto */}
          <Text style={localStyles.nombreProducto}>{producto}</Text>

          {/* Imagen */}
          <View style={localStyles.imagen}>
            <Ionicons name="image-outline" size={48} color={Palette.textMuted} />
          </View>

          {/* Descripción */}
          <View style={localStyles.descripcionBox}>
            <Text style={localStyles.descripcionTexto}>
              Descripcion del producto
            </Text>
          </View>

          {/* Botón */}
          <ActionButton
            label="Estoy interesado"
            variant="primary"
            icon="heart"
            onPress={() => {
              // TODO: aquí va la acción (enviar interés, abrir chat, etc.)
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  contenedor: {
    padding: 	Spacing[6],
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    padding: 	Spacing[4],
    gap: 	Spacing[4],
  },
  nombreProducto: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.ink,
  },
  imagen: {
    height: 200,
    borderRadius: Radius.md,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descripcionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: Radius.sm,
    padding: Spacing[4],
    minHeight: 60,
    justifyContent: 'center',
  },
  descripcionTexto: {
    fontSize: 14,
    color: Palette.textMuted,
  },
});