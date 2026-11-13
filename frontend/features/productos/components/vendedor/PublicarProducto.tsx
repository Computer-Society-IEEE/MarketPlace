import { ComponentProps, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { FilterChip } from '@/components/ui/FilterChip';
import { TextField } from '@/components/ui/TextField';
import type { TipoOferta } from '@/utils/catalogo';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import type { Categoria } from '@/utils/catalogo';
import { PUBLICACIONES } from '../../store/publicaciones';

type Icono = ComponentProps<typeof Ionicons>['name'];

const TIPOS: { valor: TipoOferta; icon: Icono; detalle: string }[] = [
  { valor: 'Segunda mano', icon: 'pricetag-outline', detalle: 'Algo que ya no usas' },
  { valor: 'Emprendimiento', icon: 'storefront-outline', detalle: 'Lo que haces o vendes' },
  { valor: 'Servicio', icon: 'school-outline', detalle: 'Tutorías, clases, ayuda' },
];
const CATEGORIAS: Categoria[] = ['Comida', 'Papelería', 'Tecnología'];
const ESTADOS_PRODUCTO = ['Nuevo', 'Como nuevo', 'Buen estado', 'Con detalles'];
const MAX_FOTOS = 4;

type Errores = Partial<Record<'tipo' | 'nombre' | 'categoria' | 'precio' | 'estadoProducto' | 'descripcion' | 'entrega', string>>;

const soloDigitos = (v: string) => v.replace(/\D/g, '');
const conMiles = (v: string) => (v ? Number(v).toLocaleString('es-CO') : '');
// Los datos de contacto se piden dentro de la app: la revisión los rechaza, así que se avisa antes
const TIENE_CONTACTO = /(\+?\d[\s.-]?){7,}|https?:\/\/|www\.|@\w+/i;

type Props = {
  /** Con id abre una publicación propia para editarla o corregirla tras un rechazo. */
  id?: string;
  /** Nombre de la sede de entrega. Lo entrega la ruta: un feature no importa de otro. */
  sedeNombre?: string;
  /** Texto de cuánto tarda la revisión (viene del módulo de moderación). */
  tiempoRevision: string;
};

/**
 * Publicar o editar una publicación. Al enviar queda "En revisión" hasta que moderación la apruebe.
 * La ruta `productos/nuevo` lo abre vacío y `productos/[id]/editar` con la publicación existente.
 */
export function PublicarProducto({ id, sedeNombre, tiempoRevision }: Props) {
  const insets = useSafeAreaInsets();
  const existente = id ? PUBLICACIONES.get().find((p) => p.id === id) : undefined;

  const [tipo, setTipo] = useState<TipoOferta | undefined>(existente?.tipo);
  const [fotos, setFotos] = useState(existente ? 1 : 0);
  const [nombre, setNombre] = useState(existente?.nombre ?? '');
  const [categoria, setCategoria] = useState<Categoria | undefined>(existente?.categoria);
  const [precio, setPrecio] = useState(existente ? String(existente.precio) : '');
  const [unidades, setUnidades] = useState(existente?.unidades ?? 1);
  const [estadoProducto, setEstadoProducto] = useState<string | undefined>(existente?.estadoProducto);
  const [descripcion, setDescripcion] = useState(existente?.descripcion ?? '');
  const [entrega, setEntrega] = useState(existente?.entrega ?? '');
  const [errores, setErrores] = useState<Errores>({});
  const [enviada, setEnviada] = useState(false);

  const esServicio = tipo === 'Servicio';
  const esSegundaMano = tipo === 'Segunda mano';

  const reiniciar = () => {
    setTipo(undefined); setFotos(0); setNombre(''); setCategoria(undefined); setPrecio('');
    setUnidades(1); setEstadoProducto(undefined); setDescripcion(''); setEntrega(''); setErrores({}); setEnviada(false);
  };

  const validar = (): Errores => {
    const e: Errores = {};
    if (!tipo) e.tipo = 'Elige qué vas a publicar.';
    if (nombre.trim().length < 4) e.nombre = 'Ponle un nombre de al menos 4 letras.';
    if (tipo && !esServicio && !categoria) e.categoria = 'Elige una categoría.';
    if (!precio || Number(precio) < 500) e.precio = 'Escribe el precio final, mínimo $500.';
    if (esSegundaMano && !estadoProducto) e.estadoProducto = 'Cuéntanos en qué estado está.';
    if (descripcion.trim().length < 20) e.descripcion = 'Describe lo que ofreces en al menos 20 letras.';
    else if (TIENE_CONTACTO.test(descripcion)) e.descripcion = 'Quita teléfonos, enlaces o redes: los acuerdos se hacen por el chat de la app.';
    if (entrega.trim().length < 5) e.entrega = 'Indica dónde y cuándo entregas, p. ej. "Plazoleta central, 12:00 m. a 2:00 p. m.".';
    return e;
  };

  const enviar = () => {
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    const datos = {
      nombre: nombre.trim(), tipo: tipo!, categoria: esServicio ? ('Servicios' as Categoria) : categoria,
      precio: Number(precio), unidades: esServicio ? 1 : unidades, estadoProducto: esSegundaMano ? estadoProducto : undefined,
      descripcion: descripcion.trim(), entrega: entrega.trim(), estado: 'En revisión' as const, enviada: 'Ahora', motivo: undefined,
    };
    PUBLICACIONES.set((l) =>
      existente ? l.map((p) => (p.id === existente.id ? { ...p, ...datos } : p)) : [{ id: `p${Date.now()}`, ...datos }, ...l]
    );
    setEnviada(true);
  };

  if (enviada) {
    return (
      <View style={s.pantalla}>
        <View style={[s.exito, { paddingTop: insets.top + Spacing[8] }]}>
          <View style={s.exitoIcono}>
            <Ionicons name="checkmark" size={40} color={Palette.ink} />
          </View>
          <Text accessibilityRole="header" style={s.exitoTitulo}>Enviada a revisión</Text>
          <Text style={s.exitoTexto}>
            {`Un moderador la revisa en ${tiempoRevision}. Te avisamos cuando se publique o si necesita cambios.`}
          </Text>
          <ActionButton label="Ver mis publicaciones" size="cta" align="center" onPress={() => router.replace('/productos' as any)} style={s.exitoBoton} />
          {!existente && <ActionButton label="Publicar otra" icon="add" variant="dark" size="cta" align="center" onPress={reiniciar} style={s.exitoBoton} />}
        </View>
      </View>
    );
  }

  const cantidadErrores = Object.keys(errores).length;

  return (
    <KeyboardAvoidingView style={s.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 120 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <ScreenHeader title={existente ? 'Editar publicación' : 'Publicar'} />

        {existente?.estado === 'Rechazada' && existente.motivo ? (
          <View style={s.rechazo}>
            <Ionicons name="alert-circle-outline" size={22} color={Palette.warning} />
            <View style={s.rechazoTextos}>
              <Text style={s.rechazoTitulo}>Moderación pidió cambios</Text>
              <Text style={s.rechazoTexto}>{existente.motivo}</Text>
            </View>
          </View>
        ) : null}

        <View style={s.contenido}>
          {/* Tipo */}
          <View style={s.grupo}>
            <Text style={s.etiqueta}>¿Qué vas a publicar?</Text>
            <View style={s.tipos}>
              {TIPOS.map((t) => {
                const activo = tipo === t.valor;
                return (
                  <Pressable
                    key={t.valor}
                    onPress={() => { setTipo(t.valor); setCategoria(undefined); setEstadoProducto(undefined); }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: activo }}
                    accessibilityLabel={`${t.valor}. ${t.detalle}`}
                    style={[s.tipo, activo && s.tipoOn]}
                  >
                    <Ionicons name={t.icon} size={24} color={activo ? Palette.lima : Palette.ink} />
                    <Text style={[s.tipoTitulo, activo && s.tipoTextoOn]}>{t.valor}</Text>
                    <Text style={[s.tipoDetalle, activo && s.tipoTextoOn]}>{t.detalle}</Text>
                  </Pressable>
                );
              })}
            </View>
            {errores.tipo ? <ErrorCampo texto={errores.tipo} /> : null}
          </View>

          {/* Fotos */}
          <View style={s.grupo}>
            <Text style={s.etiqueta}>Fotos</Text>
            <View style={s.fotos}>
              {Array.from({ length: fotos }).map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setFotos((n) => n - 1)}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar foto ${i + 1}`}
                  style={s.foto}
                >
                  <Ionicons name="image-outline" size={28} color={Palette.green700} />
                  <View style={s.fotoQuitar}>
                    <Ionicons name="close" size={14} color={Palette.lima} />
                  </View>
                </Pressable>
              ))}
              {fotos < MAX_FOTOS && (
                <Pressable
                  onPress={() => setFotos((n) => n + 1)} // TODO: abrir la galería/cámara cuando se instale expo-image-picker
                  accessibilityRole="button"
                  accessibilityLabel="Agregar foto"
                  style={[s.foto, s.fotoAgregar]}
                >
                  <Ionicons name="camera-outline" size={28} color={Palette.ink} />
                  <Text style={s.fotoTexto}>Agregar</Text>
                </Pressable>
              )}
            </View>
            <Text style={s.ayuda}>{`Hasta ${MAX_FOTOS} fotos reales. La primera es la portada.`}</Text>
          </View>

          <TextField label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. Calculadora científica" maxLength={60} error={errores.nombre} />

          {tipo && !esServicio && (
            <View style={s.grupo}>
              <Text style={s.etiqueta}>Categoría</Text>
              <View style={s.chips}>
                {CATEGORIAS.map((c) => (
                  <FilterChip key={c} label={c} selected={categoria === c} onPress={() => setCategoria(c)} />
                ))}
              </View>
              {errores.categoria ? <ErrorCampo texto={errores.categoria} /> : null}
            </View>
          )}

          {esSegundaMano && (
            <View style={s.grupo}>
              <Text style={s.etiqueta}>Estado</Text>
              <View style={s.chips}>
                {ESTADOS_PRODUCTO.map((e) => (
                  <FilterChip key={e} label={e} selected={estadoProducto === e} onPress={() => setEstadoProducto(e)} />
                ))}
              </View>
              {errores.estadoProducto ? <ErrorCampo texto={errores.estadoProducto} /> : null}
            </View>
          )}

          <TextField
            label="Precio final"
            prefijo="$"
            value={conMiles(precio)}
            onChangeText={(v) => setPrecio(soloDigitos(v).slice(0, 8))}
            keyboardType="number-pad"
            placeholder="0"
            ayuda="Sin costo de entrega: recoges en el campus."
            error={errores.precio}
          />

          {tipo && !esServicio && (
            <View style={s.unidades}>
              <Text style={s.etiqueta}>Unidades disponibles</Text>
              <View style={s.stepper}>
                <Pressable onPress={() => setUnidades((n) => Math.max(1, n - 1))} accessibilityRole="button" accessibilityLabel="Una unidad menos" style={s.paso}>
                  <Ionicons name="remove" size={22} color={Palette.ink} />
                </Pressable>
                <Text style={s.cantidad} accessibilityLiveRegion="polite">{unidades}</Text>
                <Pressable onPress={() => setUnidades((n) => Math.min(99, n + 1))} accessibilityRole="button" accessibilityLabel="Una unidad más" style={s.paso}>
                  <Ionicons name="add" size={22} color={Palette.ink} />
                </Pressable>
              </View>
            </View>
          )}

          <TextField
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Qué incluye, cómo está, para qué sirve"
            multiline
            maxLength={300}
            error={errores.descripcion}
          />

          <TextField
            label={`Dónde y cuándo entregas · Sede ${sedeNombre ?? ''}`}
            value={entrega}
            onChangeText={setEntrega}
            placeholder="Plazoleta central, 12:00 m. a 2:00 p. m."
            maxLength={100}
            error={errores.entrega}
          />
        </View>
      </ScrollView>

      <View style={[s.barra, { paddingBottom: insets.bottom + Spacing[3] }]}>
        {cantidadErrores > 0 && (
          <Text style={s.resumenError} accessibilityLiveRegion="polite">
            {`Revisa ${cantidadErrores} ${cantidadErrores === 1 ? 'campo' : 'campos'} antes de enviar.`}
          </Text>
        )}
        <ActionButton label={existente ? 'Reenviar a revisión' : 'Enviar a revisión'} icon="paper-plane-outline" size="cta" align="center" onPress={enviar} style={s.enviar} />
      </View>
    </KeyboardAvoidingView>
  );
}

function ErrorCampo({ texto }: { texto: string }) {
  return (
    <View style={s.errorFila} accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle" size={16} color={Palette.danger} />
      <Text style={s.error}>{texto}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4], gap: Spacing[5] },
  grupo: { gap: Spacing[2] },
  etiqueta: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  ayuda: { ...Type.caption, color: Palette.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  tipos: { flexDirection: 'row', gap: Spacing[2] },
  tipo: { flex: 1, minHeight: 112, gap: 4, padding: Spacing[3], borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Palette.border, backgroundColor: Palette.card },
  tipoOn: { backgroundColor: Palette.ink, borderColor: Palette.ink },
  tipoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  tipoDetalle: { ...Type.caption, color: Palette.textMuted },
  tipoTextoOn: { color: Palette.lima },
  fotos: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  foto: { width: 76, height: 76, borderRadius: Radius.md, backgroundColor: Palette.lima100, alignItems: 'center', justifyContent: 'center' },
  fotoAgregar: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Palette.border, borderStyle: 'dashed' },
  fotoTexto: { ...Type.caption, color: Palette.ink },
  fotoQuitar: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: Palette.ink, alignItems: 'center', justifyContent: 'center' },
  unidades: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  paso: { width: TouchMin, height: TouchMin, borderRadius: TouchMin / 2, backgroundColor: Palette.lima, alignItems: 'center', justifyContent: 'center' },
  cantidad: { ...Type.title3, color: Palette.ink, minWidth: 28, textAlign: 'center' },
  errorFila: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.danger, flex: 1 },
  rechazo: { flexDirection: 'row', gap: Spacing[3], backgroundColor: Palette.warningBg, borderRadius: Radius.lg, marginHorizontal: Spacing[5], marginTop: Spacing[4], padding: Spacing[4] },
  rechazoTextos: { flex: 1, gap: 2 },
  rechazoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.warning },
  rechazoTexto: { ...Type.caption, color: Palette.warning },
  barra: { position: 'absolute', left: 0, right: 0, bottom: 0, gap: Spacing[2], paddingHorizontal: Spacing[5], paddingTop: Spacing[3], backgroundColor: Palette.ground, borderTopWidth: 1, borderTopColor: Palette.line },
  resumenError: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.danger, textAlign: 'center' },
  enviar: { alignSelf: 'stretch' },
  exito: { alignItems: 'center', gap: Spacing[3], paddingHorizontal: Spacing[6] },
  exitoIcono: { width: 80, height: 80, borderRadius: 40, backgroundColor: Palette.lima, alignItems: 'center', justifyContent: 'center' },
  exitoTitulo: { ...Type.title1, color: Palette.ink, textAlign: 'center' },
  exitoTexto: { ...Type.body, color: Palette.textMuted, textAlign: 'center', marginBottom: Spacing[3] },
  exitoBoton: { alignSelf: 'stretch' },
});
