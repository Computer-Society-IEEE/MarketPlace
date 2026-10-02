import { useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { router } from 'expo-router';
import { styles } from '../constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { BRAND} from '../constants/plantilla';
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
      
        <View style={styles.colorBlock} />
        
        <View style={styles.leftSlot}>
        {/* Boton menu */}
          <TouchableOpacity onPress={() => setMenuAbierto(true)}>
            <Ionicons name="menu" size={28} color={BRAND.main} />
          </TouchableOpacity>
        </View>
       {/* titulo*/}
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
      {/* Boton retorno */}
      {showBack && (
      <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
        <Ionicons name="return-up-back-outline" size={28} color="black" />
      </TouchableOpacity>
    )}
    <MenuLateral visible={menuAbierto} onClose={() => setMenuAbierto(false)} />
    </View>
  );
}
