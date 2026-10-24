import baseConfig from '../../eslint.config.mjs';

// El e2e levanta AppModule real con Prisma simulado, por eso importa codigo de apps/api
// (alias `api/*`) y de las libs. Solo este proyecto recibe la excepcion de limites de modulos.
export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^api/.*$', '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['scope:contracts', 'scope:domain'],
            },
          ],
        },
      ],
    },
  },
];
