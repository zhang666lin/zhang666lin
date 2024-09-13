module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended', // 由 eslint-plugin-prettier 提供，将 prettier 推荐配置项转换为 eslint 规则
    'plugin:import/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'], // 此处的 ‘prettier’ 由 eslint-config-prettier 提供，关闭 eslint 部分与 prettier 冲突的规则
  rules: {
    eqeqeq: ['error', 'always'],
    'no-else-return': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'import/no-unresolved': 'off', // 防止将使用了别名的路径，误判成路经不存在
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
  },
}
