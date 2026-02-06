export const COLORS = {
    primary: '#FF69B4', // Hot Pink
    primaryLight: '#FFB6C1', // Light Pink
    secondary: '#9370DB', // Medium Purple
    accent: '#F1C043', // Soft Gold
    background: '#FFF5EE', // Seashell
    card: '#FFFFFF',
    text: '#2D2D2D',
    textLight: '#757575',
    border: '#F8F1F1',
    success: '#4CAF50',
    error: '#FF5252',
    warning: '#FFC107',
    shadow: 'rgba(0,0,0,0.1)',
    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const SHADOWS = {
    sm: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    xl: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
};
