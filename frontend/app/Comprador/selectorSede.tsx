import { Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';

type Sede = {
  id: number;
  nombre: string;
  subtitulo: string;
  etiquetaClara: string;
  etiquetaOscura: string;
};

const SEDES: Sede[] = [
  { id: 1, nombre: 'Ingeniería', subtitulo: 'Chapinero · Calle 40', etiquetaClara: 'Tiendas', etiquetaOscura: 'Tu sede' },
  { id: 2, nombre: 'Macarena', subtitulo: 'Santa Fe · La Macarena', etiquetaClara: 'Tiendas', etiquetaOscura: '' },
  { id: 3, nombre: 'ASAB', subtitulo: 'Puente Aranda · Calle 13', etiquetaClara: 'Tiendas', etiquetaOscura: '' },
  { id: 4, nombre: 'Aduanilla de Paiba', subtitulo: 'Centro · Carrera 13', etiquetaClara: 'Tiendas', etiquetaOscura: '' },
];

function BotonCircular({
  icono,
  label,
  onPress,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={s.circulo}>
      <Ionicons name={icono} size={22} color={Palette.ink} />
    </Pressable>
  );
}

function TarjetaSede({ sede, onPress }: { sede: Sede; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${sede.nombre}. ${sede.subtitulo}`}
      style={({ pressed }) => [s.tarjeta, pressed && s.tarjetaPresionada]}
    >
      {/* Imagen cuadrada redondeada */}
      <View style={s.imagen}>
        <Ionicons name="image-outline" size={28} color={Palette.textMuted} />
      </View>

      {/* Textos */}
      <View style={s.textos}>
        <Text style={s.nombre} numberOfLines={1}>{sede.nombre}</Text>
        <Text style={s.subtituloTarjeta} numberOfLines={1}>{sede.subtitulo}</Text>

        <View style={s.etiquetas}>
          <View style={[s.etiqueta, s.etiquetaClara]}>
            <Text style={[s.etiquetaTexto, { color: Palette.ink }]}>{sede.etiquetaClara}</Text>
          </View>
          <View style={[s.etiqueta, s.etiquetaOscura]}>
            <Text style={[s.etiquetaTexto, { color: Palette.lima }]}>{sede.etiquetaOscura}</Text>
          </View>
        </View>
      </View>

      {/* Flecha: 1/5 del ancho, centrada de arriba hacia abajo */}
      <View style={s.zonaFlecha}>
        <Ionicons name="chevron-forward" size={24} color={Palette.ink} />
      </View>
    </Pressable>
  );
}

export default function SelectorSede() {
  const insets = useSafeAreaInsets();

  const elegirSede = (id: number) => {
    // TODO: guardar la sede elegida (id) antes de navegar
    router.push('/Comprador/hubcomprador' as any);
  };

  return (
    <ScrollView
      style={s.pantalla}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing[6] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[s.cabecera, { paddingTop: insets.top + Spacing[4] }]}>

        <View style={s.filaBotones}>
          <BotonCircular icono="arrow-back" label="Volver" onPress={() => router.back()} />
          <Text style={s.titulo} numberOfLines={1}>Tiendas físicas</Text>
          <BotonCircular
            icono="search"
            label="Buscar"
            onPress={() => {
              // TODO: abrir búsqueda de tiendas
            }}
          />
        </View>

        <Text style={s.subtitulo}>Elige una sede para ver sus tiendas.</Text>
      </View>

      {/* Lista de sedes */}
      <View style={s.lista}>
        {SEDES.map((sede) => (
          <TarjetaSede key={sede.id} sede={sede} onPress={() => elegirSede(sede.id)} />
        ))}
      </View>
    </ScrollView>
  );
}

const IMAGEN = 76;

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
    // Encabezado
  cabecera: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[4],
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  filaBotones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  titulo: { ...Type.title1, color: Palette.ink, flex: 1, textAlign: 'center' },
  subtitulo: { ...Type.bodySm, color: Palette.textMuted, textAlign: 'center' },
  // Lista
  lista: { marginHorizontal: Spacing[5], gap: Spacing[3] },

  // Tarjeta
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.line,
    paddingVertical: Spacing[3],
    paddingLeft: Spacing[3],
    gap: Spacing[3],
  },
  tarjetaPresionada: { opacity: 0.7 },

  circulo: {
  width: TouchMin,
  height: TouchMin,
  borderRadius: Radius.full,
  backgroundColor: Palette.card,
  borderWidth: 1,
  borderColor: Palette.line,
  alignItems: 'center',
  justifyContent: 'center',
  },

  imagen: {
    width: IMAGEN,
    height: IMAGEN,
    borderRadius: Radius.md,
    backgroundColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textos: { flex: 1, gap: Spacing[1] },
  nombre: { ...Type.title3, color: Palette.ink },
  subtituloTarjeta: { ...Type.caption, color: Palette.textMuted },

  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginTop: Spacing[1] },
  etiqueta: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  etiquetaClara: { backgroundColor: Palette.lima },
  etiquetaOscura: { backgroundColor: Palette.green700 },
  etiquetaTexto: { ...Type.label },
  zonaFlecha: {
    width: '20%',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: Spacing[1],
  },
});