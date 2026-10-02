import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { UserRow } from '../../components/UserRow';
import { SectionTitle } from '../../components/SectionTitle';
import { SPACING, RADIUS, SURFACE, TEXT, AVATAR } from '../../constants/plantilla';

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
          placeholderTextColor={TEXT.muted}
        />
        <Ionicons name="search" size={20} color={TEXT.muted} style={localStyles.searchIcon} />
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
          <UserRow name={p} size={AVATAR.md} style={localStyles.item} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SURFACE.screen,
  },
  titulo: {
    fontSize: 13,
    color: TEXT.muted,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.input,
    borderRadius: RADIUS.pill,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT.primary,
  },
  searchIcon: {
    marginLeft: SPACING.sm,
  },
  item: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
});