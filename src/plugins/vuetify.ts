import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'century21Gold',
    themes: {
      century21Gold: {
        dark: true,
        colors: {
          background: '#0f0f10',
          surface: '#161617',
          primary: '#c8a24f',
          secondary: '#f4deb3',
          accent: '#a78639',
          error: '#d64545',
          info: '#d4b36d',
          success: '#99a35d',
          warning: '#ddb35d',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
});