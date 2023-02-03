const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes')

const extendedScopes = ['all', 'ci', 'git', 'build', 'dx']

module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  extends: ['@commitlint/config-conventional', '@commitlint/cz-commitlint'],
  rules: {
    // test
    //':construction_worker: wip'
    //':sparkles: feat'
    //':bug: fix'
    //':package: refactor'
    //':rocket: perf'
    //':wastebasket: revert'
    'header-max-length': [2, 'always', '120'],
    // 'references-empty': [2, 'never'],
    'scope-enum': async (ctx) => [
      2,
      'always',
      [...(await getProjects(ctx, ({ name }) => !name.includes('e2e'))), ...extendedScopes],
    ],
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          wip: {
            description: '💪 Work in progress',
            title: 'WIP',
            emoji: '💪',
          },
          feat: {
            description: '✨ A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '🐛 A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          refactor: {
            description: '📚 Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          ':memo: docs': {
            description:
              'Changes th💎 at do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles',
            emoji: '💎',
          },
          style: {
            description: '📦 A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '🚀 A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '🚨 Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          ':hammer: build': {
            description:
              'Changes th🛠 at affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            title: 'Builds',
            emoji: '🛠',
          },
          ':page_facing_up: ci': {
            description:
              'Changes to⚙️  our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description: 'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
}
