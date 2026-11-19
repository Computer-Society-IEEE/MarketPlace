import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBottomNavInset } from '@/components/ui/BottomNav';
import { FilterChip } from '@/components/ui/FilterChip';
import { Palette, Spacing, Type } from '@/constants/theme';
import { EncabezadoAdmin } from '@/features/admin/components/EncabezadoAdmin';
import { FilaUsuario } from '@/features/admin/components/FilaUsuario';
import { TOTAL_USUARIOS, useUsuarios, verificarUsuario } from '@/features/admin/store/usuarios';

type Filtro = 'todos' | 'porVerificar' | 'vendedores';

/** Usuarios: lista con filtro y verificación del correo institucional. */
export default function Usuarios() {
  const navInset = useBottomNavInset();
  const usuarios = useUsuarios();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const porVerificar = usuarios.filter((u) => !u.verificado).length;
  const visibles = usuarios.filter((u) =>
    filtro === 'porVerificar' ? !u.verificado : filtro === 'vendedores' ? u.rol === 'Vendedor' : true,
  );

  return (
    <ScrollView style={s.pantalla} contentContainerStyle={{ paddingBottom: navInset }} showsVerticalScrollIndicator={false}>
      <EncabezadoAdmin title="Usuarios" />
      <View style={s.contenido}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtros}>
          <FilterChip label="Todos" selected={filtro === 'todos'} onPress={() => setFiltro('todos')} />
          <FilterChip label={`Por verificar · ${porVerificar}`} selected={filtro === 'porVerificar'} onPress={() => setFiltro('porVerificar')} />
          <FilterChip label="Vendedores" selected={filtro === 'vendedores'} onPress={() => setFiltro('vendedores')} />
        </ScrollView>

        {visibles.map((u) => (
          <FilaUsuario key={u.id} usuario={u} onVerificar={() => verificarUsuario(u.id)} />
        ))}
        {visibles.length === 0 && <Text style={s.nota}>No hay usuarios en este filtro.</Text>}

        <Text style={s.nota}>
          {`Se muestran ${visibles.length} de ${TOTAL_USUARIOS.toLocaleString('es-CO')} usuarios. Verificar confirma que el correo institucional respondió.`}
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Palette.ground },
  contenido: { padding: Spacing[5], gap: Spacing[3] },
  filtros: { gap: Spacing[2], paddingBottom: Spacing[1] },
  nota: { ...Type.caption, color: Palette.textMuted },
});
