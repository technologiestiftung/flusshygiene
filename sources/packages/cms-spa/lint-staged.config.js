module.exports = {
  // '*.ts?(x)': () => 'tslint "./src*/**/*.ts?(x)"',
  // '*.tsx': () => 'tslint',
  '**/*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|mdx|graphql|vue)': [
    'prettier --write',
    'git add',
  ],
};
