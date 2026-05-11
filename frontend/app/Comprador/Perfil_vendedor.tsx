import { AntDesign } from "@expo/vector-icons";
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
  onBack: () => void;
  onContact?: () => void;
  onRate?: () => void;
};

type Product = {
  id: string;
  name: string;
  price: string;
  cond: string;
  bg: string;
};
type Service = { id: string; name: string; price: string };
type Review = {
  id: string;
  author: string;
  initial: string;
  stars: number;
  date: string;
  comment: string;
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

const Star = ({ filled = true }: { filled?: boolean }) => (
  <AntDesign
    name="star"
    size={10}
    color={filled ? colors.warning : colors.border}
  />
);

const FEATURED: Product[] = [
  {
    id: "1",
    name: "iPhone 12 Restaurado",
    price: "$1.200.000",
    cond: "Usado · Excelente",
    bg: colors.accent,
  },
  {
    id: "2",
    name: "MacBook Air M1",
    price: "$3.500.000",
    cond: "Restaurado",
    bg: colors.primaryLight,
  },
  {
    id: "3",
    name: "AirPods Pro",
    price: "$650.000",
    cond: "Nuevo",
    bg: colors.primary,
  },
];

const ALL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 12",
    price: "$1.200.000",
    cond: "Usado",
    bg: colors.accent,
  },
  {
    id: "2",
    name: "MacBook Air",
    price: "$3.500.000",
    cond: "Restaurado",
    bg: colors.primaryLight,
  },
  {
    id: "3",
    name: "AirPods Pro",
    price: "$650.000",
    cond: "Nuevo",
    bg: colors.primary,
  },
  {
    id: "4",
    name: "iPad Mini 6",
    price: "$1.800.000",
    cond: "Usado",
    bg: colors.border,
  },
];

const SERVICES: Service[] = [
  { id: "1", name: "Reparación de pantallas", price: "Desde $80.000" },
  { id: "2", name: "Mantenimiento preventivo", price: "$50.000" },
  { id: "3", name: "Instalación de software", price: "$30.000" },
];

const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Valentina M.",
    initial: "V",
    stars: 5,
    date: "Hace 3 días",
    comment:
      "Excelente servicio, mi pantalla quedó como nueva. Muy rápido y honesto con los precios. Totalmente recomendado.",
  },
  {
    id: "2",
    author: "Andrés P.",
    initial: "A",
    stars: 4,
    date: "Hace 1 semana",
    comment:
      "Buen vendedor, el producto llegó en perfecto estado y bien empacado. Recomendado 100%.",
  },
];

export default function PerfilVendedor({ onBack, onContact, onRate }: Props) {
  return (
    <View style={shared.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── COVER ── */}
        <View style={styles.cover}>
          <TouchableOpacity style={styles.coverBack} onPress={onBack}>
            <Icon size={14} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.coverBiz}>
            <Icon size={14} color={colors.white} />
            <Text style={styles.coverBizText}>TecnoStudio UD</Text>
          </View>
        </View>

        {/* ── AVATAR + BADGE ── */}
        <View style={styles.sAvRow}>
          <View style={styles.sAv}>
            <Text style={styles.sAvTxt}>CR</Text>
          </View>
          <View style={styles.verBadge}>
            <Icon size={11} color={colors.white} />
            <Text style={styles.verBadgeText}>Vendedor Verificado</Text>
          </View>
        </View>

        {/* ── NOMBRE ── */}
        <View style={styles.sNameSec}>
          <Text style={styles.sName}>Carlos Ramírez</Text>
          <Text style={styles.sCode}>Cód. 20201045823</Text>
        </View>

        {/* ── STATS ── */}
        <View style={shared.card}>
          <View style={styles.sgRow}>
            <View style={styles.sgItem}>
              <View
                style={[styles.sgIco, { backgroundColor: colors.warningBg }]}
              >
                <Icon size={13} color={colors.warning} />
              </View>
              <Text style={styles.sgVal}>4.8</Text>
              <Text style={styles.sgLbl}>Calific.</Text>
            </View>
            <View style={styles.sgDiv} />
            <View style={styles.sgItem}>
              <View
                style={[styles.sgIco, { backgroundColor: colors.accentBg }]}
              >
                <Icon size={13} color={colors.primary} />
              </View>
              <Text style={styles.sgVal}>24</Text>
              <Text style={styles.sgLbl}>Productos</Text>
            </View>
            <View style={styles.sgDiv} />
            <View style={styles.sgItem}>
              <View
                style={[styles.sgIco, { backgroundColor: colors.successBg }]}
              >
                <Icon size={13} color={colors.success} />
              </View>
              <Text style={styles.sgVal}>156</Text>
              <Text style={styles.sgLbl}>Ventas</Text>
            </View>
            <View style={styles.sgDiv} />
            <View style={styles.sgItem}>
              <View style={[styles.sgIco, { backgroundColor: colors.gray }]}>
                <Icon size={13} color="#666" />
              </View>
              <Text style={[styles.sgVal, { fontSize: 9 }]}>Mar 2025</Text>
              <Text style={styles.sgLbl}>Miembro</Text>
            </View>
          </View>
        </View>

        {/* ── INFO EMPRENDIMIENTO ── */}
        <View style={shared.card}>
          <Text style={shared.cardTitle}>Emprendimiento</Text>
          <Text style={styles.descTxt}>
            Venta y reparación de dispositivos electrónicos. Garantía en todos
            nuestros productos y servicios técnicos.
          </Text>
          <View style={shared.sep} />
          <View style={styles.sInfoRow}>
            <View style={styles.sIco}>
              <Icon size={12} color={colors.primary} />
            </View>
            <Text style={styles.sInfoText}>
              Cafetería Central - Segundo piso
            </Text>
          </View>
          <View style={styles.sInfoRow}>
            <View style={styles.sIco}>
              <Icon size={12} color={colors.primary} />
            </View>
            <Text style={styles.sInfoText}>Lunes a Viernes 9am – 6pm</Text>
          </View>
          <View style={styles.sInfoRow}>
            <View style={styles.sIco}>
              <Icon size={12} color={colors.primary} />
            </View>
            <Text style={styles.sInfoText}>WhatsApp: +57 300 123 4567</Text>
          </View>
        </View>

        {/* ── PRODUCTOS DESTACADOS ── */}
        <View style={styles.secHdr}>
          <Icon size={16} color={colors.primary} />
          <Text style={styles.secHdrText}>Productos destacados</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featScroll}
        >
          {FEATURED.map((p) => (
            <View key={p.id} style={styles.featCard}>
              <View style={[styles.featImg, { backgroundColor: p.bg }]}>
                <Icon size={22} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.featBody}>
                <Text style={styles.featName}>{p.name}</Text>
                <Text style={styles.featPrice}>{p.price}</Text>
                <Text style={styles.featCond}>{p.cond}</Text>
                <TouchableOpacity style={styles.featBtn}>
                  <Text style={styles.featBtnText}>Ver producto</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ── SERVICIOS ── */}
        <View style={styles.secHdr}>
          <Icon size={16} color={colors.primary} />
          <Text style={styles.secHdrText}>Servicios ofrecidos</Text>
        </View>
        <View style={[shared.card, { marginBottom: 0 }]}>
          {SERVICES.map((svc, i) => (
            <View key={svc.id}>
              <View style={styles.svcRow}>
                <View style={styles.svcIco}>
                  <Icon size={14} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.svcName}>{svc.name}</Text>
                  <Text style={styles.svcPrice}>{svc.price}</Text>
                </View>
              </View>
              {i < SERVICES.length - 1 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.border,
                    marginVertical: 2,
                  }}
                />
              )}
            </View>
          ))}
        </View>

        {/* ── TODOS LOS PRODUCTOS ── */}
        <View style={[styles.secHdr, { marginTop: 14 }]}>
          <Icon size={16} color={colors.primary} />
          <Text style={styles.secHdrText}>Todos los productos</Text>
        </View>
        <View style={styles.grid2}>
          {ALL_PRODUCTS.map((p) => (
            <View key={p.id} style={styles.gCard}>
              <View style={[styles.gImg, { backgroundColor: p.bg }]}>
                <Icon size={18} color="rgba(255,255,255,0.7)" />
              </View>
              <View style={styles.gBody}>
                <Text style={styles.gName}>{p.name}</Text>
                <Text style={styles.gPrice}>{p.price}</Text>
                <Text style={styles.gCond}>{p.cond}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── RESEÑAS ── */}
        <View style={[styles.secHdr, { marginTop: 14 }]}>
          <Icon size={16} color={colors.primary} />
          <Text style={styles.secHdrText}>Opiniones de compradores</Text>
        </View>
        {REVIEWS.map((rev) => (
          <View key={rev.id} style={styles.revCard}>
            <View style={styles.revHdr}>
              <View style={styles.revAv}>
                <Text style={styles.revAvTxt}>{rev.initial}</Text>
              </View>
              <View>
                <Text style={styles.revAuthor}>{rev.author}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 2,
                  }}
                >
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} filled={s <= rev.stars} />
                    ))}
                  </View>
                  <Text style={styles.revDate}>{rev.date}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.revComment}>{rev.comment}</Text>
          </View>
        ))}

        {/* ── BOTONES FINALES ── */}
        <View style={{ marginTop: 14 }}>
          <TouchableOpacity style={shared.btnPrimary} onPress={onContact}>
            <Icon size={14} color={colors.white} />
            <Text style={shared.btnPrimaryText}>Contactar al vendedor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={shared.btnSecondary} onPress={onRate}>
            <Icon size={14} color={colors.primaryLight} />
            <Text style={shared.btnSecondaryText}>Calificar vendedor</Text>
          </TouchableOpacity>
        </View>

        <Text style={shared.versionText}>Marketplace UD · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 110,
    backgroundColor: colors.primary,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  coverBack: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  coverBiz: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coverBizText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
  sAvRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: -36,
    marginBottom: 6,
  },
  sAv: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  sAvTxt: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.white,
  },
  verBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  verBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.3,
  },
  sNameSec: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  sName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sCode: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  sgRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sgItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  sgIco: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  sgVal: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sgLbl: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sgDiv: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  descTxt: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  sInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  sIco: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentBg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sInfoText: {
    fontSize: 11,
    color: colors.textPrimary,
    flex: 1,
  },
  secHdr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 10,
    marginTop: 14,
    marginBottom: 4,
  },
  secHdrText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  featScroll: {
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    paddingBottom: 8,
  },
  featCard: {
    width: 120,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    flexShrink: 0,
  },
  featImg: {
    height: 66,
    alignItems: "center",
    justifyContent: "center",
  },
  featBody: {
    padding: 8,
  },
  featName: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 14,
  },
  featPrice: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 3,
  },
  featCond: {
    fontSize: 8,
    color: colors.primary,
    backgroundColor: colors.accentBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 3,
  },
  featBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 5,
    alignItems: "center",
    marginTop: 6,
  },
  featBtnText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.white,
  },
  svcRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
  },
  svcIco: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(233,153,156,0.28)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  svcName: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  svcPrice: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "700",
    marginTop: 1,
  },
  grid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 10,
  },
  gCard: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  gImg: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  gBody: {
    padding: 7,
  },
  gName: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  gPrice: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  gCond: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 1,
  },
  revCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 10,
  },
  revHdr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  revAv: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  revAvTxt: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  revAuthor: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  revDate: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  stars: {
    flexDirection: "row",
    gap: 1,
  },
  star: {
    width: 9,
    height: 9,
    backgroundColor: colors.warning,
    borderRadius: 1,
  },
  revComment: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 15,
  },
});
