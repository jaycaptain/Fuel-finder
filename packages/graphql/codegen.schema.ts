import type { CodegenConfig } from '@graphql-codegen/cli';
import { config as configDotenv } from 'dotenv';
configDotenv();

const config: CodegenConfig = {
  generates: {
    './src/schemas/fullschema.graphql': {
      schema: 'http://localhost:4444/graphql',
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};
export default config;
