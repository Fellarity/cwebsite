import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'nl'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default getRequestConfig(async (params: any) => {
  const requestLocale = await params.requestLocale;
  const locale = requestLocale || 'en';
  
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
