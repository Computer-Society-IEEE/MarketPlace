import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { HomeHeader } from '@/features/productos/components/comprador/HomeHeader';
import { NOTIFICACIONES_SIN_LEER } from '@/features/notificaciones/services/notificaciones';
import { MenuLateral } from '@/features/cuenta/components/MenuLateral';
import { SEDES, SEDE_DEL_USUARIO, textoEntrega } from '@/features/sedes/services/sedes';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard } from '@/features/productos/components/comprador/ProductCard';
import { formatoPrecio } from '@/utils/formato';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { BENEFICIOS,
  CATEGORIAS,
  DESTACADOS,
  EMPRENDIMIENTOS,
  RECOMPRAS, } from '@/features/productos/services/destacados';

const entrega = textoEntrega(SEDES.find((x) => x.id === SEDE_DEL_USUARIO));

const irABuscar = () => router.push('/buscar');
const irAPedidos = () => router.navigate('/pedidos' as any);
const irATiendas = () => router.navigate('/tiendas' as any);

/** Inicio del comprador, según el rediseño: encabezado lima, beneficios, banner, categorías y listados. */
export default function Inicio() {
  const navInset = useBottomNavInset();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const abrirMenu = useCallback(() => setMenuAbierto(true), []);
  const cerrarMenu = useCallback(() => setMenuAbierto(false), []);

  const abrirProducto = useCallback((id: string) => {
    router.push({ pathname: '/producto/[id]', params: { id } });
  }, []);

  // Dos columnas: pares de tarjetas para que ambas tengan el mismo ancho
  const filas = [DESTACADOS.slice(0, 2), DESTACADOS.slice(2, 4)];

  return (
    <>
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: navInset }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader sinLeer={NOTIFICACIONES_SIN_LEER} entrega={entrega} onAbrirMenu={abrirMenu} />

      {/* Beneficios */}
      <View style={s.beneficios}>
        {BENEFICIOS.map((b) => (
          <View key={b.label} style={s.beneficio}>
            <View style={s.beneficioIcono}>
              <Ionicons name={b.icon} size={20} color={Palette.ink} />
            </View>
            <Text style={s.beneficioTexto}>{b.label}</Text>
          </View>
        ))}
      </View>

      {/* Banner */}
      <View style={s.banner}>
        <Text style={s.bannerTitulo}>Lo que vende tu campus, en un solo lugar</Text>
        <ActionButton label="Explorar" onPress={irABuscar} size="md" align="center" style={s.bannerBoton} />
        <View style={s.bannerFoto} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Ionicons name="bag-handle-outline" size={44} color={Palette.green700} />
        </View>
      </View>
      <View
        accessibilityRole="image"
        accessibilityLabel="Promoción 2 de 3"
        style={s.puntos}
      >
        <View style={s.punto} />
        <View style={[s.punto, s.puntoActivo]} />
        <View style={s.punto} />
      </View>

      {/* Explora */}
      <View style={s.seccion}>
        <SectionHeader title="Explora" />
        <View style={s.categorias}>
          {CATEGORIAS.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: '/buscar', params: c.params })}
              accessibilityRole="button"
              accessibilityLabel={c.label}
              style={s.categoria}
            >
              <View style={s.categoriaIcono}>
                <Ionicons name={c.icon} size={26} color={Palette.ink} />
              </View>
              <Text style={s.categoriaTexto}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Vuelve a comprar */}
      <View style={s.seccion}>
        <SectionHeader title="Vuelve a comprar" actionLabel="Ver pedidos" onAction={irAPedidos} />
        <View style={s.lista}>
          {RECOMPRAS.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => abrirProducto(r.id)}
              accessibilityRole="button"
              accessibilityLabel={`${r.nombre}, ${r.detalle}, ${formatoPrecio(r.precio)}`}
              style={({ pressed }) => [s.recompra, pressed && s.presionada]}
            >
              <View style={s.recompraFoto}>
                <Ionicons name="bag-outline" size={24} color={Palette.green700} />
              </View>
              <View style={s.recompraTextos}>
                <Text style={s.recompraNombre} numberOfLines={1}>{r.nombre}</Text>
                <Text style={s.recompraDetalle} numberOfLines={1}>{r.detalle}</Text>
              </View>
              <Text style={s.recompraPrecio}>{formatoPrecio(r.precio)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Destacados en tu sede */}
      <View style={s.seccion}>
        <SectionHeader title="Destacados en tu sede" actionLabel="Ver todo" onAction={irABuscar} />
        <View style={s.lista}>
          {filas.map((par, i) => (
            <View key={i} style={s.filaTarjetas}>
              {par.map((p) => (
                <ProductCard key={p.id} producto={p} onPress={abrirProducto} />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Emprendimientos de tu sede */}
      <View style={s.seccion}>
        <SectionHeader title="Emprendimientos de tu sede" />
        <View style={s.emprendimientos}>
          {EMPRENDIMIENTOS.map((e) => (
            <Pressable
              key={e.id}
              onPress={irABuscar}
              accessibilityRole="button"
              accessibilityLabel={`${e.nombre}, calificación ${e.calificacion}`}
              style={s.emprendimiento}
            >
              <View style={s.emprendimientoAvatar}>
                <Ionicons name="storefront-outline" size={28} color={Palette.green700} />
              </View>
              <Text style={s.emprendimientoNombre} numberOfLines={2}>{e.nombre}</Text>
              <View style={s.emprendimientoNota}>
                <Ionicons name="star" size={13} color={Palette.gold} />
                <Text style={s.emprendimientoNotaTexto}>
                  {e.calificacion.toLocaleString('es-CO', { minimumFractionDigits: 1 })}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Tiendas físicas */}
      <View style={s.seccion}>
        <Card style={s.tiendas}>
          <View style={s.tiendasTextos}>
            <Text style={s.tiendasTitulo}>Tiendas físicas</Text>
            <Text style={s.tiendasDetalle}>Encuentra puestos y locales dentro de tu sede.</Text>
          </View>
          <ActionButton
            label="Ver tiendas"
            onPress={irATiendas}
            icon="map-outline"
            size="sm"
            variant="dark"
            align="center"
            style={s.tiendasBoton}
          />
        </Card>
      </View>
    </ScrollView>
    <MenuLateral visible={menuAbierto} onClose={cerrarMenu} />
    </>
  );
}

const FOTO_BANNER = { width: 112, height: 140 };

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.ground },
  presionada: { opacity: 0.85 },

  beneficios: {
    flexDirection: 'row',
    gap: Spacing[2],
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    marginTop: Spacing[3],
    marginHorizontal: Spacing[5],
  },
  beneficio: { flex: 1, alignItems: 'center', gap: 6 },
  beneficioIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficioTexto: { ...Type.label, color: Palette.ink, textAlign: 'center' },

  banner: {
    height: 168,
    marginTop: Spacing[3],
    marginHorizontal: Spacing[5],
    borderRadius: Radius.xl,
    backgroundColor: Palette.ink,
    padding: Spacing[5],
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  bannerTitulo: { ...Type.title3, color: '#FFFFFF', width: 214 },
  bannerBoton: { marginTop: 'auto', height: TouchMin, borderRadius: TouchMin / 2, paddingHorizontal: Spacing[6] },
  bannerFoto: {
    position: 'absolute',
    right: Spacing[4],
    top: 14,
    ...FOTO_BANNER,
    borderRadius: FOTO_BANNER.width / 2,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puntos: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  punto: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.border },
  puntoActivo: { width: 22, backgroundColor: Palette.ink },

  seccion: { marginTop: Spacing[4], marginHorizontal: Spacing[5] },
  lista: { gap: Spacing[3] },

  categorias: { flexDirection: 'row', justifyContent: 'space-between' },
  categoria: { width: 68, alignItems: 'center', gap: 6 },
  categoriaIcono: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriaTexto: { ...Type.caption, fontFamily: FontFamily.bodyMedium, lineHeight: 16, color: Palette.ink, textAlign: 'center' },

  recompra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    minHeight: 72,
  },
  recompraFoto: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recompraTextos: { flex: 1, minWidth: 0 },
  recompraNombre: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  recompraDetalle: { ...Type.caption, color: Palette.textMuted },
  recompraPrecio: { ...Type.priceSm, color: Palette.ink },

  filaTarjetas: { flexDirection: 'row', gap: Spacing[3] },

  emprendimientos: { flexDirection: 'row', justifyContent: 'space-between' },
  emprendimiento: { width: 96, alignItems: 'center', gap: 6 },
  emprendimientoAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emprendimientoNombre: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.ink, textAlign: 'center' },
  emprendimientoNota: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  emprendimientoNotaTexto: { ...Type.caption, color: Palette.textMuted },

  tiendas: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[4] },
  tiendasTextos: { flex: 1, gap: 2 },
  tiendasTitulo: { ...Type.title3, color: Palette.ink },
  tiendasDetalle: { ...Type.caption, color: Palette.textMuted },
  tiendasBoton: { height: TouchMin, borderRadius: TouchMin / 2 },
});
