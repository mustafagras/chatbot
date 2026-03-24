import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-plugin-prettier'

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
    plugins: {
      prettier,
    },
    rules: {
      // TypeScript kuralları
      '@typescript-eslint/no-var-requires': 'off', // "require" kullanımına izin ver
      '@typescript-eslint/no-explicit-any': 'warn', // "any" kullanımına izin ver
      '@typescript-eslint/no-unused-expressions': 'off', // "expression" kullanımına izin ver
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Prettier ile Stil kuralları
      'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Prettier ile uyumlu kurallar

      // React Kuralları
      'react/react-in-jsx-scope': 'off', // React 17 ve üstü projelerde gerek yok
      'react/jsx-uses-react': 'off', // React 17 ve üstü projelerde gerek yok
      'react/prop-types': 'off', // TypeScript ile prop-types gereksiz
      'react/jsx-key': 'error', // map'lerde key prop zorunlu
      'react/jsx-no-duplicate-props': 'error', // Tekrarlayan props yasak
      'react/jsx-no-undef': 'error', // Tanımlanmamış componentler yasak
      'react/jsx-pascal-case': 'warn', // Component isimleri PascalCase olmalı
      'react/no-deprecated': 'warn', // Deprecated React API kullanımını uyar
      'react/no-children-prop': 'off', // children prop'u doğrudan kullanmak yerine JSX kullanılması ayarı

      // React Hooks kuralları
      // Not: Next.js configs zaten önerilen hooks kurallarını içerir, ancak tr.store'dan gelen override'lar burada:
      'react-hooks/exhaustive-deps': 'off',

      // Performance ve Best Practice kuralları
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-var': 'error', // var kullanımı yasak
      'prefer-const': 'error', // const kullanımı tercih edilmeli
      'no-useless-return': 'error', // Gereksiz return ifadeleri yasak
      'no-useless-escape': 'error', // Gereksiz kaçış karakterleri yasak
      'no-lone-blocks': 'error', // Bağımsız bloklar yasak
      'no-duplicate-imports': 'error', // Tekrarlayan import yasak
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }], // Fazla boş satırlar engellenir
      'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }], // Yorum satırlarından önce ve sonra boşluk olmalı
      'object-shorthand': 'warn', // Object shorthand syntax tercih et

      // Ek güvenlik ve kod kalitesi kuralları
      eqeqeq: ['error', 'always'], // === ve !== kullanımını zorunlu kıl
      'no-eval': 'error', // eval() kullanımını yasakla
      'no-implied-eval': 'error', // setTimeout/setInterval string parametrelerini yasakla
      'no-new-func': 'error', // new Function() kullanımını yasakla
      'no-return-assign': 'error', // return ifadelerinde atama yasakla
      'no-self-compare': 'error', // Kendini karşılaştıran ifadeleri yasakla
      'no-sequences': 'error', // Virgül operatörünü yasakla
      'no-throw-literal': 'error', // Literal değer throw etmeyi yasakla
      'no-unmodified-loop-condition': 'error', // Değişmeyen döngü koşullarını yakala
      'no-unused-labels': 'error', // Kullanılmayan etiketleri yasakla
      'no-useless-call': 'error', // Gereksiz .call() ve .apply() kullanımını yasakla
      'no-useless-concat': 'error', // Gereksiz string birleştirmelerini yasakla
    },
  },
])

export default eslintConfig
