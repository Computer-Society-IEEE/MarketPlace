import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { UserRow } from '../../components/UserRow';
import { SectionTitle } from '../../components/SectionTitle';
import { Palette, Radius, Spacing, Type, TouchMin} from '@/constants/theme';

const AVATAR_MD = 40;

const productos = ['User', 'User', 'User', 'User', 'User', 'User'];

export default function Buscar() {
  return (
    <ScrollView style={localStyles.container}>
      {/* Header */}
      <Header />

      {/* Título */}
      <Text style={localStyles.titulo}>lista de productos</Text>

      {/* Barra de búsqueda */}
      <View style={localStyles.searchContainer}>
        <TextInput
          style={localStyles.searchInput}
          placeholder='buscar "hojas examen"'
          placeholderTextColor={Palette.textMuted}
        />
        <Ionicons name="search" size={20} color={Palette.textMuted} style={localStyles.searchIcon} />
      </View>

      {/* Lista */}
      <SectionTitle>productos destacados</SectionTitle>
      {productos.map((p, i) => (
        <TouchableOpacity
          key={i}
          onPress={() =>
            router.push({
              pathname: '/Comprador/detalleProducto',
              params: { usuario: p, producto: 'Nombre del producto' },
            })
          }
        >
          <UserRow name={p} size={AVATAR_MD} style={localStyles.item} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.ground,
  },
  titulo: {
    fontSize: 13,
    color: Palette.textMuted,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.full,
    minHeight: TouchMin,
    marginHorizontal: Spacing[6],
    marginVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  searchInput: {
    ...Type.bodySm,
    flex: 1,
    paddingVertical: Spacing[2],
    color: Palette.ink,
  },
  searchIcon: {
    marginLeft: Spacing[2]
  },
  item: {
    paddingHorizontal: 	Spacing[6],
    paddingVertical: Spacing[4],
  },
});