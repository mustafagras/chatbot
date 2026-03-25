import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

import eslintConfigPrettier from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'scripts/**',
    'next-env.d.ts',
    'dist',
    'src/assets/**',
    '**/*-env.d.ts',
    '**/tr.ts',
  ]),
  {
    rules: {
      // TypeScript kuralları
      '@typescript-eslint/no-var-requires': 'off', // "require" kullanımına izin ver
      '@typescript-eslint/no-explicit-any': 'warn', // "any" kullanımına izin ver
      '@typescript-eslint/no-unused-expressions': 'off', // "expression" kullanımına izin ver
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // React / Next.js Framework Best Practices
      'react-hooks/exhaustive-deps': 'off', // Defined out by project requirement

      // Core JavaScript Best Practices
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prefer-const': 'error', // const kullanımı tercih edilmeli
      'no-var': 'error', // var kullanımı yasak
      'object-shorthand': 'warn', // Object shorthand syntax tercih et
      eqeqeq: ['error', 'always'], // === ve !== kullanımını zorunlu kıl

      // Security / Safety
      'no-eval': 'error', // eval() kullanımını yasakla
      'no-implied-eval': 'error', // setTimeout/setInterval string parametrelerini yasakla
      'no-new-func': 'error', // new Function() kullanımını yasakla
      'no-return-assign': 'error', // return ifadelerinde atama yasakla
      'no-useless-return': 'error', // Gereksiz return ifadelerini yasakla
      'no-self-compare': 'error', // Kendini karşılaştıran ifadeleri yasakla
      'no-unmodified-loop-condition': 'error', // Değişmeyen döngü koşullarını yakala
      'no-unused-labels': 'error', // Kullanılmayan etiketleri yasakla
      'no-useless-call': 'error', // Gereksiz .call() ve .apply() kullanımını yasakla
      'no-useless-concat': 'error', // Gereksiz string birleştirmelerini yasakla
    },
  },
])

export default eslintConfig
