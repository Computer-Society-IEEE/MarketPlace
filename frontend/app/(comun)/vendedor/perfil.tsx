import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamily, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { Chip } from '@/components/ui/Chip';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { FormularioPerfil } from '@/features/cuenta/components/FormularioPerfil';
import { PerfilVendedor, guardarPerfilVendedor, usePerfilVendedor } from '@/features/cuenta/store/perfilVendedor';
import { USUARIO } from '@/features/cuenta/services/usuario';
import { SEDES } from '@/features/sedes/services/sedes';

const OPCIONES_SEDE = SEDES.map((x) => ({ id: x.id, nombre: x.nombre }));
const volverAlPanel = () => {
  if (router.canGoBack()) router.back();
  else router.navigate('/panel' as any);
};

/** Mi perfil como lo ven: vista previa de comprador y edición de la tienda. */
export default function PerfilPropio() {
  const insets = useSafeAreaInsets();
  const perfil = usePerfilVendedor();
  const [guardado, setGuardado] = useState(false);
  const sede = SEDES.find((x) => x.id === perfil.sedeId);

  const guardar = useCallback((nuevo: PerfilVendedor) => {
    guardarPerfilVendedor(nuevo);
    setGuardado(true);
  }, []);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.pantalla}>
        <ScreenHeader title="Mi perfil" onBack={volverAlPanel} />
        <ScrollView
          contentContainerStyle={[s.contenido, { paddingBottom: insets.bottom + Spacing[6] }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.vista}>
            <Chip label="Vista de comprador" icon="eye-outline" />
            <Text accessibilityRole="header" style={s.nombre}>{perfil.nombreTienda}</Text>
            <Text style={s.dueno}>{`Emprendimiento de ${USUARIO.nombre}`}</Text>
            {perfil.descripcion ? <Text style={s.descripcion}>{perfil.descripcion}</Text> : null}
            <View style={s.fila}>
              <Ionicons name="location-outline" size={18} color={Palette.ink} />
              <Text style={s.filaTexto}>{`Entrega en Sede ${sede?.nombre ?? ''}`}</Text>
            </View>
            <View style={s.fila}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Palette.ink} />
              <Text style={s.filaTexto}>Estudiante verificado</Text>
            </View>
          </View>

          {guardado ? (
            <View style={s.aviso} accessibilityLiveRegion="polite">
              <Ionicons name="checkmark-circle" size={20} color={Palette.success} />
              <Text style={s.avisoTexto}>Cambios guardados.</Text>
            </View>
          ) : null}

          <Text style={s.titulo}>Editar mi perfil</Text>
          <FormularioPerfil inicial={perfil} sedes={OPCIONES_SEDE} onGuardar={guardar} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], gap: Spacing[5] },
  vista: { backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[4], gap: Spacing[2], alignItems: 'flex-start' },
  nombre: { ...Type.title1, color: Palette.ink },
  dueno: { ...Type.bodySm, color: Palette.textMuted },
  descripcion: { ...Type.body, color: Palette.ink },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  filaTexto: { ...Type.bodySm, color: Palette.ink },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], backgroundColor: Palette.successBg, borderRadius: Radius.md, padding: Spacing[3] },
  avisoTexto: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.success },
  titulo: { ...Type.title2, color: Palette.ink },
});
