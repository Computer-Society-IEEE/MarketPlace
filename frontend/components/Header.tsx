import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import IconButton from '@/components/IconButton';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Palette, Radius, Type } from '../constants/theme';
import { MenuLateral } from './MenuLateral';

type Props={
  //opcional
  title?: string;
  showBack?:boolean;
};

export default function Header({title, showBack=true }: Props) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  return (
    <View style={styles.header}>
      <IconButton icon="menu" label="Abrir menú" onPress={() => setMenuAbierto(true)} />

      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}

      {showBack && (
        <IconButton icon="arrow-back" label="Volver" onPress={() => router.back()} />
      )}

      <MenuLateral visible={menuAbierto} onClose={() => setMenuAbierto(false)} />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.lima,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...Type.title3,
    color: Palette.ink,
    flex: 1,
  },
});