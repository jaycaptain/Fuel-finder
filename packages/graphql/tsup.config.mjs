import graphqlLoaderPluginPkg from '@luckycatfactory/esbuild-graphql-loader';
import { execa } from 'execa';
import { getPort } from 'get-port';
import { defineConfig } from 'tsup';

const graphqlLoaderPlugin = graphqlLoaderPluginPkg.default;

export default defineConfig((options) => ({
  outDir: 'dist',
  splitting: true,
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: false,
  esbuildPlugins: [graphqlLoaderPlugin()],
  entry: { index: 'src/bin.ts' },
  async onSuccess() {
    const port = await getPort({ port: 4444 });
    const cmd = execa('node', ['./dist/index.js'], {
      stdio: 'inherit',
      cleanup: true,
      env: {
        SERVER_PORT: port,
        WATCH: Boolean(options.watch),
      },
    });

    return () => {
      cmd.kill('SIGTERM');
    };
  },
}));
