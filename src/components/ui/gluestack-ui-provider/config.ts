'use client';
import { vars } from 'nativewind';

const ringThemeVars = vars({
  '--color-ring-primary': '26 54 66',
  '--color-ring-secondary': '12 31 39',
  '--color-ring-accent': '182 155 122',
  '--color-ring-background': '248 247 245',
  '--color-ring-surface': '255 255 255',
  '--color-txt-main': '30 35 40',
  '--color-txt-body': '74 82 90',
  '--color-txt-muted': '140 147 154',
  '--color-txt-inverse': '255 255 255',
  '--color-btn-primary': '182 155 122',
  '--color-btn-primary-hover': '160 135 104',
  '--color-btn-disabled': '234 231 225',
  '--color-btn-secondary-border': '26 54 66',
  '--color-ui-border': '230 228 224',
  '--color-status-error': '168 90 84',
  '--color-status-success': '74 107 92',
});

export const config = {
  light: ringThemeVars,
  dark: ringThemeVars,
};
