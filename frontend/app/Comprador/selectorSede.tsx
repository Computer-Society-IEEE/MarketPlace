// app/Comprador/selectorSede.tsx
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { styles } from '../../constants/Styles';
import { BRAND, SPACING, RADIUS, TEXT } from '../../constants/plantilla';
import Header from '../../components/Header';
import {ActionButton} from '../../components/ActionButton';

const sedes = [
  { id: 1, nombre: 'Sede 1' },
  { id: 2, nombre: 'Sede 2' },
  { id: 3, nombre: 'Sede 3' },
  { id: 4, nombre: 'Sede 4' },
];

export default function SelectorSede() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="selector de sede" />

      {/* Botones de sede */}
      <View style={localStyles.lista}>
        {sedes.map((sede) => (
          <ActionButton
                key={sede.id}
                label={sede.nombre}
                icon="location"
                onPress={() => router.push('/Comprador/hubcomprador')}
            />
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
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: BRAND.light,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  botonTexto: {
    color: TEXT.onBrand,
    fontSize: 16,
    fontWeight: '600',
  },
});