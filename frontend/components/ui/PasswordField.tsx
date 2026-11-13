import { ComponentProps, useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, TouchMin } from '@/constants/theme';
import { FormField } from './FormField';

type Props = Omit<ComponentProps<typeof FormField>, 'icon' | 'right' | 'secureTextEntry'>;

/** Campo de contraseña con ojo para mostrar u ocultar. Sirve para registro y para login. */
export function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  const alternar = useCallback(() => setVisible((v) => !v), []);

  return (
    <FormField
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      icon="lock-closed-outline"
      secureTextEntry={!visible}
      right={
        <Pressable
          onPress={alternar}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          style={s.ojo}
        >
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Palette.textMuted}
          />
        </Pressable>
      }
    />
  );
}

const s = StyleSheet.create({
  ojo: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
