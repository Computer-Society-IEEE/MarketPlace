import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import {
  MAX_DESCRIPCION_REPORTE,
  MAX_FOTOS_REPORTE,
  MOTIVOS_REPORTE,
  RESPUESTA_REPORTE,
  ReporteEnviado,
} from '../services/motivos';

export type ResumenPedido = {
  numero: number;
  vendedor: string;
  titulo: string;
  /** Precio ya formateado. */
  precio: string;
};

type Props = {
  pedido?: ResumenPedido;
  onEnviar: (reporte: Omit<ReporteEnviado, 'pedidoId'>) => void;
  onCancelar: () => void;
};

/** Formulario de "Reportar un problema": motivo (uno), descripción de hasta 500 caracteres y fotos opcionales. */
function FormularioReporteBase({ pedido, onEnviar, onCancelar }: Props) {
  const [motivoId, setMotivoId] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [fotos, setFotos] = useState(0);
  const [error, setError] = useState('');

  const elegir = useCallback((id: string) => {
    setMotivoId(id);
    setError('');
  }, []);

  // TODO: abrir la galería (expo-image-picker) y guardar la foto; por ahora solo se cuenta
  const agregarFoto = useCallback(() => setFotos((n) => Math.min(n + 1, MAX_FOTOS_REPORTE)), []);
  const quitarFoto = useCallback(() => setFotos((n) => Math.max(n - 1, 0)), []);

  const enviar = useCallback(() => {
    if (!motivoId) {
      setError('Elige el motivo del reporte.');
      return;
    }
    onEnviar({ motivoId, descripcion: descripcion.trim(), fotos });
  }, [motivoId, descripcion, fotos, onEnviar]);

  return (
    <View style={s.formulario}>
      {pedido ? (
        <Card style={s.resumen}>
          <Text style={s.resumenTitulo}>{`Pedido n.º ${pedido.numero} · ${pedido.vendedor}`}</Text>
          <Text style={s.resumenDetalle}>{`${pedido.titulo} · ${pedido.precio}`}</Text>
        </Card>
      ) : null}

      <View accessibilityRole="radiogroup" style={s.motivos}>
        {MOTIVOS_REPORTE.map((m) => {
          const activo = m.id === motivoId;
          return (
            <Pressable
              key={m.id}
              onPress={() => elegir(m.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
              accessibilityLabel={`${m.titulo}. ${m.detalle}`}
              style={[s.motivo, activo && s.motivoActivo]}
            >
              <View style={[s.radio, activo && s.radioActivo]}>
                {activo ? <View style={s.radioPunto} /> : null}
              </View>
              <View style={s.motivoTextos}>
                <Text style={s.motivoTitulo}>{m.titulo}</Text>
                <Text style={s.motivoDetalle}>{m.detalle}</Text>
              </View>
            </Pressable>
          );
        })}
        {error ? (
          <View style={s.filaError} accessibilityLiveRegion="polite">
            <Ionicons name="alert-circle" size={16} color={Palette.danger} />
            <Text style={s.error}>{error}</Text>
          </View>
        ) : null}
      </View>

      <TextField
        label="Cuéntanos qué pasó"
        ayuda={`Solo lo lee el equipo de moderación. Respuesta en ${RESPUESTA_REPORTE}.`}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        maxLength={MAX_DESCRIPCION_REPORTE}
      />

      <View style={s.fotos}>
        <Text style={s.fotosTitulo}>Fotos, opcional</Text>
        <View style={s.fotosFila}>
          {Array.from({ length: fotos }, (_, i) => (
            <Pressable
              key={i}
              onPress={quitarFoto}
              accessibilityRole="button"
              accessibilityLabel={`Quitar foto ${i + 1}`}
              style={s.miniatura}
            >
              <Ionicons name="image-outline" size={24} color={Palette.textMuted} />
              <Ionicons name="close-circle" size={18} color={Palette.ink} style={s.quitar} />
            </Pressable>
          ))}
          {fotos < MAX_FOTOS_REPORTE ? (
            <Pressable onPress={agregarFoto} accessibilityRole="button" accessibilityLabel="Agregar foto" style={s.agregar}>
              <Ionicons name="camera-outline" size={22} color={Palette.ink} />
              <Text style={s.agregarTexto}>Agregar foto</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={s.acciones}>
        <ActionButton label="Cancelar" variant="dark" size="cta" align="center" onPress={onCancelar} style={s.accion} />
        <ActionButton label="Enviar reporte" size="cta" align="center" onPress={enviar} style={s.accion} />
      </View>
    </View>
  );
}

export const FormularioReporte = memo(FormularioReporteBase);

const s = StyleSheet.create({
  formulario: { gap: Spacing[5] },
  resumen: { gap: 2 },
  resumenTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  resumenDetalle: { ...Type.caption, color: Palette.textMuted },
  motivos: { gap: Spacing[2] },
  motivo: {
    minHeight: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Palette.card,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    padding: Spacing[4],
  },
  motivoActivo: { borderColor: Palette.ink, backgroundColor: Palette.lima100 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActivo: { borderColor: Palette.ink },
  radioPunto: { width: 10, height: 10, borderRadius: Radius.full, backgroundColor: Palette.ink },
  motivoTextos: { flex: 1, gap: 2 },
  motivoTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  motivoDetalle: { ...Type.caption, color: Palette.textMuted },
  filaError: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  error: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.danger, flex: 1 },
  fotos: { gap: Spacing[2] },
  fotosTitulo: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  fotosFila: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  miniatura: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitar: { position: 'absolute', top: 2, right: 2 },
  agregar: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.border,
  },
  agregarTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  acciones: { flexDirection: 'row', gap: Spacing[3] },
  accion: { flex: 1, justifyContent: 'center' },
});
