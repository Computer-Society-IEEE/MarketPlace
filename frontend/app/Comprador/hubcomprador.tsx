import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { router } from 'expo-router';
import { TEXT } from '../../constants/plantilla';
import { Ionicons } from '@expo/vector-icons';
import { styles} from '../../constants/Styles';
import Header from '../../components/Header';
import { UserRow } from '../../components/UserRow';
import { SectionTitle } from '../../components/SectionTitle';


const botones = [
  { label: 'Buscar',          icon: 'search', ruta: '/Comprador/BuscarProducto' },
  { label: 'Historial',       icon: 'cart',   ruta: '/Comprador/historialComprador' },
  { label: 'Tiendas físicas', icon: 'map',    ruta: '/Comprador/selectorSede' },
  { label: 'Deseo Vender',    icon: null,     ruta: '/deseo-vender' },
];

const vendedores = ['User', 'User', 'User'];

export default function HubComprador() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}

      <Header showBack={false} />
      {/* Grid de botones */}
      <View style={styles.grid}>
        {botones.map((btn) => (
          <TouchableOpacity
            key={btn.label}
            style={styles.boton}
            onPress={() => router.push(btn.ruta as any)}
          >
            {btn.icon && (
              <Ionicons name={btn.icon as any} size={36} color={TEXT.onBrand} />
            )}
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