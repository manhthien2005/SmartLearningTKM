export const i18nConfig = {
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localeDetection: true,
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];










