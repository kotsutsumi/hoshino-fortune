// Hoshino Fortune Pink Theme
export const theme = {
  colors: {
    // Primary colors
    primary: '#FF9494',
    primaryLight: '#FFB4B4',
    primaryDark: '#E87878',

    // Secondary (purple accent)
    secondary: '#A855F7',
    secondaryLight: '#C084FC',
    secondaryDark: '#9333EA',

    // Background colors
    background: '#FFF1F2', // pink-50
    backgroundWhite: '#FFFFFF',
    backgroundCard: 'rgba(255, 255, 255, 0.9)',

    // Border colors
    border: '#FBCFE8', // pink-200
    borderLight: '#FCE7F3', // pink-100

    // Text colors
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    textWhite: '#FFFFFF',

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Fortune category colors
    love: '#EC4899',
    work: '#3B82F6',
    relationships: '#8B5CF6',
    money: '#F59E0B',

    // Gradient
    gradientStart: '#FF9494',
    gradientEnd: '#A855F7',
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },

  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Shadows
  shadow: {
    sm: {
      shadowColor: '#FF9494',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#FF9494',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#FF9494',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

// Gradient colors for LinearGradient
export const gradientColors = {
  primary: ['#FF9494', '#A855F7'] as const,
  primaryReverse: ['#A855F7', '#FF9494'] as const,
  soft: ['#FFB4B4', '#C084FC'] as const,
  warm: ['#FF9494', '#F59E0B'] as const,
};

// Category styles
export const categoryStyles = {
  love: {
    color: theme.colors.love,
    emoji: '💕',
    label: '恋愛',
  },
  work: {
    color: theme.colors.work,
    emoji: '💼',
    label: '仕事',
  },
  relationships: {
    color: theme.colors.relationships,
    emoji: '👥',
    label: '人間関係',
  },
  money: {
    color: theme.colors.money,
    emoji: '💰',
    label: '金運',
  },
} as const;

// Tab bar theme
export const tabBarTheme = {
  activeTintColor: theme.colors.primary,
  inactiveTintColor: theme.colors.textLight,
  backgroundColor: theme.colors.backgroundWhite,
  borderTopColor: theme.colors.borderLight,
};

// Header theme
export const headerTheme = {
  backgroundColor: theme.colors.primary,
  tintColor: theme.colors.textWhite,
};
