import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, shared } from "@/components/marketplace_styles";

type Props = {
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
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

const LOCATIONS = [
  "Biblioteca Central",
  "Parqueadero Norte",
  "Cafetería Principal",
  "Facultad de Ingeniería",
];

export default function EditarPerfil({ onBack, onSave, onCancel }: Props) {
  const [nombre, setNombre] = useState("María González");
  const [telefono, setTelefono] = useState("300 000 0000");
  const [bio, setBio] = useState(
    "Estudiante apasionada por la tecnología y el emprendimiento.",
  );
  const [selectedLocation, setSelectedLocation] = useState(
    "Facultad de Ingeniería",
  );

  return (
    <View style={shared.screen}>
      {/* ── TOP ── */}
      <View style={shared.topBar}>
        <TouchableOpacity style={shared.backBtn} onPress={onBack}>
          <Icon size={14} color={colors.primary} />
        </TouchableOpacity>
        <Text style={shared.topBarTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── FOTO ── */}
        <View style={styles.photoSec}>
          <TouchableOpacity style={styles.av2}>
            <Text style={styles.avTxt}>MG</Text>
            <View style={styles.camOv}>
              <Icon size={12} color={colors.white} />
              <Text style={styles.camOvText}>Cambiar</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.phHint}>Toca para cambiar tu foto</Text>
        </View>

        {/* ── DATOS ── */}
        <View style={[shared.card, { marginTop: 4 }]}>
          <View style={styles.fLbl}>
            <Icon size={14} color={colors.textSecondary} />
            <Text style={styles.fLblText}>Nombre completo</Text>
          </View>
          <TextInput
            style={styles.fInput}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre completo"
            placeholderTextColor={colors.textSecondary}
          />
          <View style={styles.fSep} />

          <View style={styles.fLbl}>
            <Icon size={14} color={colors.textSecondary} />
            <Text style={styles.fLblText}>Teléfono</Text>
          </View>
          <TextInput
            style={styles.fInput}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            placeholder="Número de teléfono"
            placeholderTextColor={colors.textSecondary}
          />
          <View style={styles.fSep} />

          <View style={styles.fLbl}>
            <Icon size={14} color={colors.textSecondary} />
            <Text style={styles.fLblText}>Biografía</Text>
          </View>
          <TextInput
            style={[styles.fInput, styles.fInputMulti]}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            maxLength={300}
            placeholder="Escribe una breve descripción"
            placeholderTextColor={colors.textSecondary}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length} / 300</Text>
        </View>

        {/* ── UBICACION ── */}
        <View style={shared.card}>
          <View style={styles.fLbl}>
            <Icon size={14} color={colors.textSecondary} />
            <Text style={styles.fLblText}>Ubicación en el campus</Text>
          </View>
          <Text style={styles.selHint}>Selecciona dónde te encuentras</Text>

          {LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc;
            return (
              <TouchableOpacity
                key={loc}
                style={[styles.radioRow, isSelected && styles.radioRowSelected]}
                onPress={() => setSelectedLocation(loc)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.rOuter, isSelected && styles.rOuterSelected]}
                >
                  {isSelected && <View style={styles.rInner} />}
                </View>
                <Text style={[styles.rLbl, isSelected && styles.rLblSelected]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── ACCIONES ── */}
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity style={shared.btnPrimary} onPress={onSave}>
            <Icon size={14} color={colors.white} />
            <Text style={shared.btnPrimaryText}>Guardar Cambios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={shared.btnSecondary} onPress={onCancel}>
            <Icon size={14} color={colors.primaryLight} />
            <Text style={shared.btnSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  photoSec: {
    alignItems: "center",
    paddingVertical: 14,
    paddingBottom: 10,
  },
  av2: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avTxt: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.white,
  },
  camOv: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: "rgba(0,0,0,0.42)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  camOvText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: "600",
  },
  phHint: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 5,
  },
  fLbl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  fLblText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  fInput: {
    width: "100%",
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.textPrimary,
  },
  fInputMulti: {
    minHeight: 52,
  },
  fSep: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 11,
  },
  charCount: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 3,
  },
  selHint: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 3,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },
  radioRowSelected: {
    backgroundColor: colors.accentBgLight,
    borderColor: colors.accent,
  },
  rOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rOuterSelected: {
    borderColor: colors.primary,
  },
  rInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  rLbl: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  rLblSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
});
