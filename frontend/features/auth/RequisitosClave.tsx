import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Spacing, Type } from '@/constants/theme';
import { ReglasClave } from './validacion';

function Requisito({ cumplido, texto }: { cumplido: boolean; texto: string }) {
  // El estado nunca depende solo del color: cambia el ícono y el peso del texto
  return (
    <View
      style={s.fila}
      accessible
      accessibilityLabel={`${texto}: ${cumplido ? 'cumplido' : 'pendiente'}`}
    >
      <Ionicons
        name={cumplido ? 'checkmark-circle-outline' : 'close-circle-outline'}
        size={16}
        color={cumplido ? Palette.success : Palette.textMuted}
      />
      <Text style={[s.texto, cumplido && s.textoCumplido]}>{texto}</Text>
    </View>
  );
}

function RequisitosClaveBase({ reglas }: { reglas: ReglasClave }) {
  return (
    <View style={s.lista}>
      <Requisito cumplido={reglas.largo} texto="Al menos 8 caracteres" />
      <Requisito cumplido={reglas.numero} texto="Un número" />
      <Requisito cumplido={reglas.mayuscula} texto="Una letra mayúscula" />
    </View>
  );
}

export const RequisitosClave = memo(RequisitosClaveBase);

const s = StyleSheet.create({
  lista: { gap: Spacing[1] },
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  texto: { ...Type.caption, color: Palette.textMuted },
  textoCumplido: { fontFamily: FontFamily.bodyBold, color: Palette.success },
});
