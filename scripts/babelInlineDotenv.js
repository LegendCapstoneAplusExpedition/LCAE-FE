const fs = require('fs');
const path = require('path');

function parseDotenv(contents) {
  return contents.split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return env;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return env;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;

    return env;
  }, {});
}

function loadDotenv() {
  const envPath = path.resolve(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return parseDotenv(fs.readFileSync(envPath, 'utf8'));
}

const dotenvEnv = loadDotenv();

module.exports = function babelInlineDotenv({ types: t }) {
  return {
    name: 'babel-inline-dotenv',
    visitor: {
      MemberExpression(memberPath) {
        const { node } = memberPath;

        if (
          !t.isMemberExpression(node.object) ||
          !t.isIdentifier(node.object.object, { name: 'process' }) ||
          !t.isIdentifier(node.object.property, { name: 'env' }) ||
          !t.isIdentifier(node.property)
        ) {
          return;
        }

        const value = process.env[node.property.name] ?? dotenvEnv[node.property.name];

        memberPath.replaceWith(
          value === undefined ? t.identifier('undefined') : t.stringLiteral(value),
        );
      },
    },
  };
};
