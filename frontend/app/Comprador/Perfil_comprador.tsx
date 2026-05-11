import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, shared } from "@/components/marketplace_styles";

type Props = {
  onEdit: () => void;
  onVendedor: () => void;
};

const Icon = ({
  size = 14,
  color = colors.primary,
}: {
  size?: number;
  color?: string;
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity: 0.5,
    }}
  />
);

export default function PerfilComprador({ onEdit, onVendedor }: Props) {
  return (
    <View style={shared.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── HEADER ── */}
        <View style={styles.hdrBg} />
        <View style={styles.hdrCnt}>
          <View style={styles.avCircle}>
            <Text style={styles.avTxt}>MG</Text>
            <View style={styles.camBtn}>
              <Icon size={10} color={colors.white} />
            </View>
          </View>
          <Text style={styles.uName}>María González</Text>
          <Text style={styles.uCode}>Cód. 20222020192</Text>
          <View style={styles.roleBadge}>
            <Icon size={9} color={colors.white} />
            <Text style={styles.roleBadgeText}>Comprador</Text>
          </View>
          <Text style={styles.uEmail}>maria@ud.edu.co</Text>
        </View>

        {/* ── ESTADiSTICAS ── */}
        <View style={shared.card}>
          <Text style={shared.cardTitle}>Mis estadísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBlk}>
              <Icon size={18} color={colors.primary} />
              <Text style={styles.statVal}>0</Text>
              <Text style={styles.statLbl}>Compras</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.statBlk}>
              <Icon size={18} color={colors.primary} />
              <Text style={[styles.statVal, { fontSize: 11 }]}>Ene 2026</Text>
              <Text style={styles.statLbl}>Miembro desde</Text>
            </View>
          </View>
        </View>

        {/* ── INFO PERSONAL ── */}
        <View style={shared.card}>
          <Text style={shared.cardTitle}>Información personal</Text>

          <View style={shared.infoRow}>
            <View style={shared.icoWrap}>
              <Icon size={14} color={colors.primary} />
            </View>
            <View>
              <Text style={shared.infoLabel}>Teléfono</Text>
              <Text style={shared.infoValue}>+57 300 000 0000</Text>
            </View>
          </View>
          <View style={shared.sep} />

          <View style={shared.infoRow}>
            <View style={shared.icoWrap}>
              <Icon size={14} color={colors.primary} />
            </View>
            <View>
              <Text style={shared.infoLabel}>Ubicación</Text>
              <Text style={[shared.infoValue, { color: colors.primary }]}>
                Seleccionar ubicación
              </Text>
            </View>
          </View>
          <View style={shared.sep} />

          <View style={shared.infoRow}>
            <View style={shared.icoWrap}>
              <Icon size={14} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={shared.infoLabel}>Biografía</Text>
              <Text style={styles.bioTxt}>
                Estudiante apasionada por la tecnología y el emprendimiento en
                la UD.
              </Text>
            </View>
          </View>
        </View>

        {/* ── ACCIONES ── */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity style={shared.btnPrimary} onPress={onEdit}>
            <Icon size={14} color={colors.white} />
            <Text style={shared.btnPrimaryText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              shared.btnPrimary,
              { backgroundColor: colors.primaryLight },
            ]}
            onPress={onVendedor}
          >
            <Icon size={14} color={colors.white} />
            <Text style={shared.btnPrimaryText}>Convertirse en vendedor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={shared.btnOutline}>
            <Icon size={14} color={colors.textPrimary} />
            <Text style={shared.btnOutlineText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={shared.versionText}>Marketplace UD · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hdrBg: {
    height: 85,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  hdrCnt: {
    alignItems: "center",
    marginTop: -44,
    paddingBottom: 6,
  },
  avCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avTxt: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.white,
  },
  camBtn: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  uName: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  uCode: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },
  roleBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  uEmail: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statBlk: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statVal: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLbl: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: "center",
  },
  statDiv: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  bioTxt: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
});
