// app/(tabs)/historial.tsx
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../constants/Styles';
import { BRAND, SPACING, RADIUS, TEXT, SURFACE } from '../../constants/plantilla';
import Header from '../../components/Header';
import { UserRow } from '../../components/UserRow';

const historial = [
  { nombre: 'User', descripcion: 'Descripcion del producto' },
  { nombre: 'User', descripcion: 'Descripcion del producto' },
  { nombre: 'User', descripcion: 'Descripcion del producto' },
];

export default function Historial() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="historial" />

      {/* Lista de productos */}
      <View style={localStyles.lista}>
        {historial.map((item, i) => (
          <View key={i} style={localStyles.card}>
            {/* Botón eliminar */}
            <TouchableOpacity style={localStyles.deleteBtn}>
              <Ionicons name="close-circle" size={24} color={BRAND.main} />
            </TouchableOpacity>

            {/* Fila usuario */}
            <UserRow name={item.nombre} />

            {/* Descripción */}
            <View style={localStyles.descripcionBox}>
              <Text style={localStyles.descripcionTexto}>{item.descripcion}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  lista: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    backgroundColor: SURFACE.card,
    borderRadius: RADIUS.lg,
    padding:  SPACING.md,
    gap: 10,
    position: 'relative',
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  descripcionBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descripcionTexto: {
    fontSize: 14,
    color: TEXT.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});