import { defineConfig } from 'cz-git';

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  rules: {},
  prompt: {
    messages: {
      type: '更改类型：',
      scope: '影响范围：',
      customScope: '自定义影响范围：',
      subject: '简短的变更描述：',
      body: '详细的变更描述：',
      breaking: '破坏性变更：',
      footer: '关联关闭的：',
      confirmCommit: '确认以上提交信息？',
    },
    types: [
      { value: 'feat', name: 'feat: 新功能' },
      { value: 'fix', name: 'fix: 修复缺陷' },
      { value: 'hotfix', name: 'hotfix: 线上紧急修复' },
      { value: 'wip', name: 'wip: 工作中' },
      { value: 'improvement', name: 'improvement: 改进' },
      { value: 'refactor', name: 'refactor: 重构' },
      { value: 'perf', name: 'perf: 性能优化' },
      { value: 'docs', name: 'docs: 文档' },
      { value: 'style', name: 'style: 代码样式' },
      { value: 'test', name: 'test: 测试' },
      { value: 'build', name: 'build: 构建' },
      { value: 'ci', name: 'ci: 持续集成' },
      { value: 'chore', name: 'chore: 其他维护' },
      { value: 'release', name: 'release: 发布' },
      { value: 'deprecate', name: 'deprecate: 废弃' },
      { value: 'revert', name: 'revert: 回退' },
    ],
    scopes: ['root', 'build', 'docs', '@bmcs/core'],
    enableMultipleScopes: true,
    allowBreakingChanges: ['feat', 'fix', 'hotfix'],
  },
});
