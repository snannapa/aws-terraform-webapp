const { execFileSync } = require('node:child_process');

const input = JSON.parse(require('node:fs').readFileSync(0, 'utf8'));
const command = input.tool_input?.command ?? input.toolInput?.command ?? '';

if (!/\bgit\s+push\b/.test(command)) {
  process.exit(0);
}

const documentationPattern = /(^|\/)(README(?:\.[^/]+)?|CHANGELOG(?:\.[^/]+)?|CONTRIBUTING(?:\.[^/]+)?|docs\/|[^/]+\.md)$/i;
let committedFiles;

try {
  committedFiles = execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], {
    encoding: 'utf8'
  }).trim().split('\n').filter(Boolean);
} catch (error) {
  process.stdout.write(JSON.stringify({
    systemMessage: `Could not inspect the latest commit before push: ${error.message}`
  }));
  process.exit(2);
}

if (committedFiles.some((file) => documentationPattern.test(file))) {
  process.exit(0);
}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Push blocked: update documentation and commit it before pushing.'
  }
}));