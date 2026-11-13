import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/UserRow';
import { ActionButton } from '@/components/ui/ActionButton';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatoPrecio } from '@/utils/formato';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { SEDES, SEDE_DEL_USUARIO } from '@/features/sedes/services/sedes';
import { useOferta } from '@/features/productos/hooks/useOfertas';

const nota = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 1 });
const irATiendas = () => router.navigate('/tiendas' as any);

/** Detalle de producto del rediseño. Las fotos aún no existen: queda el espacio reservado. */
export default function Producto() {
  const insets = useSafeAreaInsets();
  // Llega solo el id; el detalle se pide por su cuenta (y sale de la caché si ya se vio)
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: oferta, isLoading } = useOferta(id);
  const [favorito, setFavorito] = useState(false);
  const [avisar, setAvisar] = useState(false);

  const sede = SEDES.find((x) => x.id === SEDE_DEL_USUARIO);
  const agotado = oferta ? (oferta.unidades ?? 1) === 0 : false;

  return (
    <View style={s.pantalla}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Producto"
          right={{
            icon: favorito ? 'heart' : 'heart-outline',
            label: favorito ? 'Quitar de favoritos' : 'Guardar en favoritos',
            onPress: () => setFavorito((v) => !v), // TODO: persistir favoritos
          }}
        />

        {isLoading ? (
          <ActivityIndicator style={s.estado} color={Palette.ink} accessibilityLabel="Cargando producto" />
        ) : !oferta ? (
          <Text style={[s.vacio, s.estado]}>Este producto ya no está disponible.</Text>
        ) : (
          <View style={s.contenido}>
            {/* Espacio de la foto (1:1). Se reemplaza por la galería cuando existan las imágenes */}
            <View style={s.foto} accessibilityLabel="Foto del producto no disponible">
              <Ionicons name="image-outline" size={48} color={Palette.textMuted} />
            </View>

            {/* Tipo, estado y categoría */}
            <View style={s.chips}>
              {oferta.tipo && <Chip label={oferta.tipo} tone="oscuro" />}
              {oferta.estado && <Chip label={oferta.estado} />}
              {oferta.categoria && <Chip label={oferta.categoria} />}
            </View>

            <Text accessibilityRole="header" style={s.nombre}>{oferta.nombre}</Text>

            <View style={s.filaNota}>
              <Ionicons name="star" size={16} color={Palette.gold} />
              <Text style={s.nota}>{nota(oferta.calificacion ?? 0)}</Text>
              <Text style={s.notaDetalle}>{`${oferta.resenas ?? 0} reseñas`}</Text>
            </View>

            <Text style={s.precio}>{formatoPrecio(oferta.precio)}</Text>
            <Text style={s.precioNota}>Precio final. Sin costo de entrega si recoges en el campus.</Text>

            <View style={s.filaDisponible}>
              <Ionicons
                name={agotado ? 'close-circle' : 'checkmark-circle'}
                size={18}
                color={agotado ? Palette.danger : Palette.success}
              />
              <Text style={[s.disponible, { color: agotado ? Palette.danger : Palette.success }]}>
                {agotado
                  ? 'Agotado'
                  : `Disponible: ${oferta.unidades ?? 1} ${(oferta.unidades ?? 1) === 1 ? 'unidad' : 'unidades'}`}
              </Text>
            </View>

            {/* Entrega */}
            <Card style={s.fila}>
              <View style={s.icono}>
                <Ionicons name="location-outline" size={20} color={Palette.ink} />
              </View>
              <View style={s.filaTextos}>
                <Text style={s.filaTitulo}>{`Recoges en Sede ${sede?.nombre ?? ''}`}</Text>
                {oferta.entrega ? <Text style={s.filaDetalle}>{oferta.entrega}</Text> : null}
              </View>
              <Pressable onPress={irATiendas} accessibilityRole="link" accessibilityLabel="Cambiar sede" style={s.enlaceArea}>
                <Text style={s.enlace}>Cambiar</Text>
              </Pressable>
            </Card>

            {/* Pago */}
            <Card style={s.fila}>
              <View style={s.icono}>
                <Ionicons name="phone-portrait-outline" size={20} color={Palette.ink} />
              </View>
              <View style={s.filaTextos}>
                <Text style={s.filaTitulo}>Pagas por Nequi al recibir</Text>
                <Text style={s.filaDetalle}>Sin cobros anticipados. Acepta Nequi y efectivo.</Text>
              </View>
            </Card>

            {/* Vendedor */}
            <Card style={s.fila}>
              <Avatar size={48} />
              <View style={s.filaTextos}>
                <Text style={s.filaTitulo}>{oferta.vendedor}</Text>
                <View style={s.verificado}>
                  <Ionicons name="shield-checkmark" size={14} color={Palette.success} />
                  <Text style={s.verificadoTexto}>Estudiante verificado</Text>
                </View>
              </View>
              <Pressable
                onPress={() =>
                  router.push({ pathname: '/vendedor/[id]' as any, params: { id: oferta.uuidVendedor, nombre: oferta.vendedor } })
                }
                accessibilityRole="link"
                accessibilityLabel={`Ver perfil de ${oferta.vendedor}`}
                style={s.enlaceArea}
              >
                <Text style={s.enlace}>Ver perfil</Text>
              </Pressable>
            </Card>

            {/* Descripción y datos */}
            <SectionHeader title="Descripción" />
            <Text style={s.descripcion}>{oferta.descripcion ?? 'Sin descripción'}</Text>

            {(oferta.estado || oferta.incluye || oferta.marca) && (
              <View style={s.datos}>
                {oferta.estado && <Dato etiqueta="Estado" valor={oferta.estado} />}
                {oferta.incluye && <Dato etiqueta="Incluye" valor={oferta.incluye} />}
                {oferta.marca && <Dato etiqueta="Marca" valor={oferta.marca} />}
              </View>
            )}

            {/* Respaldo */}
            <View style={s.respaldo}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Palette.info} />
              <View style={s.filaTextos}>
                <Text style={s.respaldoTitulo}>Compra con respaldo</Text>
                <Text style={s.respaldoTexto}>
                  Si lo que recibes no coincide con la publicación, repórtalo desde el pedido y un moderador revisa el
                  caso en máximo 48 horas.
                </Text>
              </View>
            </View>

            {/* Reseñas */}
            {oferta.listaResenas && oferta.listaResenas.length > 0 && (
              <>
                <SectionHeader
                  title="Reseñas"
                  actionLabel={`Ver las ${oferta.resenas ?? oferta.listaResenas.length}`}
                  onAction={() => router.push({ pathname: '/producto/[id]/resenas' as any, params: { id: oferta.id } })}
                />
                <View style={s.resenas}>
                  {oferta.listaResenas.map((r) => (
                    <Card key={r.id} style={s.resena}>
                      <View style={s.resenaCabecera}>
                        <Text style={s.resenaAutor}>{r.autor}</Text>
                        <Text style={s.resenaCuando}>{r.cuando}</Text>
                      </View>
                      <Text style={s.resenaTexto}>{r.texto}</Text>
                      <View style={s.verificado}>
                        <Ionicons name="checkmark-circle" size={14} color={Palette.success} />
                        <Text style={s.verificadoTexto}>Compra verificada</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Acción fija abajo */}
      {oferta && (
        <View style={[s.barra, { paddingBottom: insets.bottom + Spacing[3] }]}>
          <ActionButton
            label={oferta.propia ? 'Es tu publicación' : agotado ? (avisar ? 'Te avisaremos' : 'Avísame si vuelve') : 'Estoy interesado'}
            icon={agotado ? (avisar ? 'notifications' : 'notifications-outline') : 'heart'}
            variant={agotado ? 'dark' : 'primary'}
            disabled={!!oferta.propia}
            size="cta"
            align="center"
            style={s.boton}
            onPress={() =>
              agotado
                ? setAvisar((v) => !v) // TODO: guardar el aviso de disponibilidad en la cuenta
                : router.push({
                    pathname: '/mensajes/[id]' as any,
                    params: { id: `p-${oferta.id}`, con: oferta.vendedor, producto: oferta.nombre, productoId: oferta.id },
                  })
            }
          />
        </View>
      )}
    </View>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={s.dato}>
      <Text style={s.datoEtiqueta}>{etiqueta}</Text>
      <Text style={s.datoValor}>{valor}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  estado: { marginTop: Spacing[6] },
  vacio: { ...Type.body, color: Palette.textMuted, textAlign: 'center' },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[3] },

  foto: {
    aspectRatio: 1,
    borderRadius: Radius.xl,
    backgroundColor: Palette.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  nombre: { ...Type.title2, color: Palette.ink },
  filaNota: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nota: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  notaDetalle: { ...Type.bodySm, color: Palette.textMuted },
  precio: { ...Type.priceLg, color: Palette.ink },
  precioNota: { ...Type.caption, color: Palette.textMuted, marginTop: -Spacing[2] },
  filaDisponible: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  disponible: { ...Type.bodySm, fontFamily: FontFamily.bodyBold },

  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[3] },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filaTextos: { flex: 1, minWidth: 0, gap: 2 },
  filaTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  filaDetalle: { ...Type.caption, color: Palette.textMuted },
  enlaceArea: { minHeight: TouchMin, justifyContent: 'center', paddingHorizontal: Spacing[1] },
  enlace: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, textDecorationLine: 'underline' },
  verificado: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verificadoTexto: { ...Type.caption, color: Palette.success, fontFamily: FontFamily.bodyBold },

  descripcion: { ...Type.body, color: Palette.ink, marginTop: -Spacing[2] },
  datos: { backgroundColor: Palette.card, borderRadius: Radius.lg, paddingHorizontal: Spacing[4] },
  dato: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  datoEtiqueta: { ...Type.bodySm, color: Palette.textMuted },
  datoValor: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink, flexShrink: 1, textAlign: 'right' },

  respaldo: {
    flexDirection: 'row',
    gap: Spacing[3],
    backgroundColor: Palette.infoBg,
    borderRadius: Radius.lg,
    padding: Spacing[4],
  },
  respaldoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.info },
  respaldoTexto: { ...Type.caption, color: Palette.info },

  resenas: { gap: Spacing[3] },
  resena: { gap: Spacing[2], padding: Spacing[4] },
  resenaCabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resenaAutor: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  resenaCuando: { ...Type.caption, color: Palette.textMuted },
  resenaTexto: { ...Type.bodySm, color: Palette.ink },

  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    backgroundColor: Palette.ground,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
  },
  boton: { alignSelf: 'stretch' },
});
