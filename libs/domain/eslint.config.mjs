import baseConfig from '../../eslint.config.mjs';

// libs/domain es TS puro: sin frameworks, ORM ni I/O (CLAUDE.md seccion 1)
const PAQUETES_PROHIBIDOS = [
  '@angular/*',
  '@nestjs/*',
  '@prisma/*',
  'dexie',
  'rxjs',
];

export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: PAQUETES_PROHIBIDOS.map((group) => ({
            group: [group],
            message: 'libs/domain solo admite TS puro y suncalc.',
          })),
        },
      ],
    },
  },
];
