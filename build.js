import esbuild from 'esbuild';
import esbuildPluginVue3 from 'esbuild-plugin-vue3';

async function runBuild() {
  try {
    await esbuild.build({
      entryPoints: ['src/main.js'],
      bundle: true,
      outfile: 'www/bundle.js', // Output langsung ditaro di folder Capacitor
      plugins: [esbuildPluginVue3()],
      define: {
        'process.env.NODE_ENV': '"production"',
        '__VUE_OPTIONS_API__': 'true',
        '__VUE_PROD_DEVTOOLS__': 'false',
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false'
      },
      minify: false,
      sourcemap: false,
      target: ['es2020'],
      platform: 'browser',
      logLevel: 'info',
    });
    console.log('✓ Build Vue + CM6 Berhasil!');
  } catch (err) {
    console.error('✗ Build gagal:', err);
    process.exit(1);
  }
}

runBuild();
