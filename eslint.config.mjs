// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort'; // ⭐️ 추가됨

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module', // NestJS는 기본적으로 module 시스템을 씁니다 (commonjs -> module 권장)
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort, // ⭐️ 플러그인 등록
    },
    rules: {
      // ⭐️ 1. 캘린더에서 가져온 import 정렬 기능 (가독성 UP)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // ⭐️ 2. "쨍쨍하고 단단한" 서버를 위한 엄격 모드
      '@typescript-eslint/no-explicit-any': 'error', // any 사용 절대 금지 (가장 중요)
      '@typescript-eslint/no-unused-vars': 'error', // 안 쓰는 변수 있으면 에러

      // 3. NestJS 권장 설정을 조금 더 안전하게 튜닝
      '@typescript-eslint/no-floating-promises': 'warn', // 비동기 함수 결과 처리 안 하면 경고
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // 4. 프리티어 줄바꿈 호환성
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  }
);
