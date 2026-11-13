import { Platform } from 'react-native';


// Valores tomados del sistema de diseño (Sistema · Color). Cada par texto/fondo cumple AA.
export const Palette = {
  ink: '#1E2A14',        // texto, barras oscuras, chips seleccionados
  lima: '#C6EC6B',       // botón primario, encabezado, pestaña activa
  lima300: '#E1F3B4',    // forma decorativa del acceso
  lima100: '#EAF6CF',    // fondo de selección, íconos y chips claros
  ground: '#F3F4F0',     // fondo de pantalla
  card: '#FDFCF9',       // tarjetas, campos y hojas (decisión del equipo: no se usa blanco puro)
  neutral100: '#ECEEE6', // etiquetas neutras
  line: '#E1E5D8',       // divisores y esqueletos de carga
  border: '#7E8871',     // borde de campos y chips
  textMuted: '#55604A',  // texto secundario
  // El diseño excluye el rojo: el error usa naranja quemado
  danger: '#9A3B00',     // error: texto, ícono y borde
  dangerBg: '#FDEBDD',   // error: fondo
  success: '#2F6B1A',    // éxito: texto e ícono
  successBg: '#E6F4D7',  // éxito: fondo
  warning: '#6B4E00',    // alerta: texto e ícono
  warningBg: '#FFF3C9',  // alerta: fondo
  info: '#1B4F8A',       // información: texto e ícono
  infoBg: '#E6F0FB',     // información: fondo
  // Detalle: solo elementos pequeños
  gold: '#B87A00',       // estrellas
  green600: '#5E7F1E',   // barras e indicadores
  green700: '#3F5A12',   // texto de acento y chips oscuros
};
const light = {
  text: Palette.ink,
  background: Palette.ground,
  tint: Palette.ink,
  icon: Palette.textMuted,
  tabIconDefault: Palette.textMuted,
  tabIconSelected: Palette.ink,
};
export const Colors = { light, dark: light };

export const Spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 14: 56 } as const;
export const Radius = { sm: 8, md: 14, lg: 20, xl: 28, full: 999 } as const;
export const TouchMin = 48;

export const FontFamily = {
  display: 'Archivo_800ExtraBold',
  displaySemi: 'Archivo_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
}as const;
export const Type = {
  display: { fontFamily: FontFamily.display,     fontSize: 30, lineHeight: 36 },
  title1:  { fontFamily: FontFamily.displaySemi, fontSize: 24, lineHeight: 30 },
  title2:  { fontFamily: FontFamily.displaySemi, fontSize: 20, lineHeight: 26 },
  title3:  { fontFamily: FontFamily.displaySemi, fontSize: 17, lineHeight: 22 },
  bodyLg:  { fontFamily: FontFamily.body,        fontSize: 16, lineHeight: 24 },
  body:    { fontFamily: FontFamily.body,        fontSize: 15, lineHeight: 22 },
  bodySm:  { fontFamily: FontFamily.body,        fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: FontFamily.body,        fontSize: 13, lineHeight: 18 },
  label:   { fontFamily: FontFamily.bodyBold,    fontSize: 12, lineHeight: 16 },
  priceLg: { fontFamily: FontFamily.displaySemi, fontSize: 28, lineHeight: 32 },
  priceMd: { fontFamily: FontFamily.displaySemi, fontSize: 18, lineHeight: 22 },
  priceSm: { fontFamily: FontFamily.displaySemi, fontSize: 15, lineHeight: 20 },
} as const;
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
