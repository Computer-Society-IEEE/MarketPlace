import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, Type } from '@/constants/theme';
import { HomeHeader } from '@/features/productos/HomeHeader';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { UserRow } from '@/components/ui/UserRow';
import { SectionTitle } from '@/components/ui/SectionTitle';

const botones = [
  { label: 'Buscar',          icon: 'search', ruta: '/buscar' },
  { label: 'Historial',       icon: 'cart',   ruta: '/pedidos' },
  { label: 'Tiendas físicas', icon: 'map',    ruta: '/tiendas' },
  { label: 'Deseo Vender',    icon: null,     ruta: '/deseo-vender' },
];

const vendedores = ['User', 'User', 'User'];

export default function Inicio() {
  const navInset = useBottomNavInset();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: navInset }}>
      <HomeHeader sinLeer={3} />

      {/* Grid de botones */}
      <View style={styles.grid}>
        {botones.map((btn) => (
          <TouchableOpacity
            key={btn.label}
            style={styles.boton}
            onPress={() => router.push(btn.ruta as any)}
          >
            {btn.icon && <Ionicons name={btn.icon as any} size={36} color={Palette.ink} />}
            <Text style={styles.botonTexto}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vendedores destacados */}
      <SectionTitle>Vendedores destacados</SectionTitle>
      {vendedores.map((v, i) => (
        <UserRow key={i} name={v} style={styles.vendedorRow} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.ground },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
  boton: {
    backgroundColor: Palette.card, borderWidth: 1, borderColor: Palette.line,
    width: '47%', aspectRatio: 1, borderRadius: Radius.lg,
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  botonTexto: { ...Type.bodySm, fontFamily: Type.label.fontFamily, color: Palette.ink, textAlign: 'center' },
  vendedorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
});
