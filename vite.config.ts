import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          fmcgHome: path.resolve(__dirname, 'fmcg/index.html'),
          fmcgAbout: path.resolve(__dirname, 'fmcg/about.html'),
          fmcgBrands: path.resolve(__dirname, 'fmcg/brands.html'),
          fmcgProducts: path.resolve(__dirname, 'fmcg/products.html'),
          fmcgDetails: path.resolve(__dirname, 'fmcg/product-details.html'),
          fmcgContact: path.resolve(__dirname, 'fmcg/contact.html'),
          chemHome: path.resolve(__dirname, 'chemicals/index.html'),
          chemAbout: path.resolve(__dirname, 'chemicals/about.html'),
          chemProducts: path.resolve(__dirname, 'chemicals/products.html'),
          chemTextile: path.resolve(__dirname, 'chemicals/textile-chemicals.html'),
          chemIndustrial: path.resolve(__dirname, 'chemicals/industrial-chemicals.html'),
          chemDetails: path.resolve(__dirname, 'chemicals/product-details.html'),
          chemContact: path.resolve(__dirname, 'chemicals/contact.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
