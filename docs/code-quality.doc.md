did# Code Quality Rules Documentation

Ye document batata hai ki project mein code quality kaise maintain hogi - ESLint, Prettier, Commitlint, aur Husky ke through.

---

## 🔄 Overview: Code Quality Flow

```
Developer Code Likhta Hai
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  git add .                                          │
│  git commit -m "feat(auth): add login"              │
│         │                                           │
│         ▼                                           │
│  ┌─────────────────────────────────────────┐        │
│  │  HUSKY PRE-COMMIT HOOK                  │        │
│  │  ─────────────────────────              │        │
│  │  1. lint-staged chalega                 │        │
│  │     ├── ESLint --fix (auto fix errors)  │        │
│  │     └── Prettier --write (format code)  │        │
│  │                                         │        │
│  │  ❌ Fail? → Commit blocked              │        │
│  │  ✅ Pass? → Next step                   │        │
│  └─────────────────────────────────────────┘        │
│         │                                           │
│         ▼                                           │
│  ┌─────────────────────────────────────────┐        │
│  │  HUSKY COMMIT-MSG HOOK                  │        │
│  │  ─────────────────────────              │        │
│  │  Commitlint validate karega:            │        │
│  │  - type(scope): message format          │        │
│  │  - valid type (feat, fix, etc.)         │        │
│  │                                         │        │
│  │  ❌ Fail? → Commit blocked              │        │
│  │  ✅ Pass? → Commit successful           │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
         │
         ▼
   git push origin branch
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  GITHUB ACTIONS (PR pe)                             │
│  ──────────────────────                             │
│  1. Lint check (ESLint)                             │
│  2. Format check (Prettier)                         │
│  3. TypeCheck (tsc --noEmit)                        │
│  4. Tests (jest)                                    │
│  5. Build check                                     │
│                                                     │
│  ❌ Any Fail? → PR merge blocked                    │
│  ✅ All Pass? → PR mergeable                        │
└─────────────────────────────────────────────────────┘
```

---

## 📝 ESLint Rules

ESLint code quality aur potential bugs check karta hai.

### Config Location

```
.eslintrc.js (root)
```

### Active Rules

| Rule                                               | Level | Description                                         |
| -------------------------------------------------- | ----- | --------------------------------------------------- |
| `prettier/prettier`                                | error | Prettier formatting enforce                         |
| `@typescript-eslint/no-unused-vars`                | error | Unused variables not allowed (except `_` prefix)    |
| `@typescript-eslint/explicit-function-return-type` | off   | Return type optional                                |
| `@typescript-eslint/no-explicit-any`               | warn  | `any` type pe warning                               |
| `@typescript-eslint/no-non-null-assertion`         | warn  | `!` assertion pe warning                            |
| `no-console`                                       | warn  | `console.log` pe warning (allow: warn, error, info) |

### Examples

```typescript
// ❌ BAD - Unused variable
const unused = 'hello';

// ✅ GOOD - Prefixed with underscore (allowed)
const _unused = 'hello';

// ❌ BAD - console.log
console.log('debug');

// ✅ GOOD - console.info/warn/error allowed
console.info('Server started');
console.error('Something went wrong');

// ⚠️ WARNING - any type
function process(data: any) {}

// ✅ GOOD - Proper typing
function process(data: UserData) {}
```

### Commands

```bash
# Check errors
npm run lint

# Auto-fix errors
npm run lint:fix

# Specific file
npx eslint path/to/file.ts --fix
```

### Ignored Files/Folders

```
node_modules/
dist/
build/
.turbo/
coverage/
.next/
*.min.js
```

---

## 🎨 Prettier Rules

Prettier code formatting handle karta hai.

### Config Location

```
.prettierrc (root)
```

### Active Rules

| Rule             | Value | Description                                           |
| ---------------- | ----- | ----------------------------------------------------- |
| `semi`           | true  | Semicolon required                                    |
| `singleQuote`    | true  | Single quotes use karo                                |
| `tabWidth`       | 2     | 2 spaces indentation                                  |
| `trailingComma`  | es5   | Trailing comma (ES5 compatible)                       |
| `printWidth`     | 100   | Line max 100 characters                               |
| `bracketSpacing` | true  | Object mein spaces `{ foo: bar }`                     |
| `arrowParens`    | avoid | Single param arrow function mein parens nahi `x => x` |
| `endOfLine`      | lf    | Unix line endings                                     |

### Examples

```typescript
// ❌ BAD - Double quotes
const name = 'John';

// ✅ GOOD - Single quotes
const name = 'John';

// ❌ BAD - No semicolon
const age = 25;

// ✅ GOOD - With semicolon
const age = 25;

// ❌ BAD - Arrow function with unnecessary parens
const double = x => x * 2;

// ✅ GOOD - Arrow function without parens
const double = x => x * 2;

// ❌ BAD - No spacing in objects
const user = { name: 'John', age: 25 };

// ✅ GOOD - Proper spacing
const user = { name: 'John', age: 25 };

// ❌ BAD - Line too long (>100 chars)
const message =
  'This is a very long message that exceeds the maximum line length of one hundred characters and should be split';

// ✅ GOOD - Split into multiple lines
const message =
  'This is a very long message that has been ' + 'split into multiple lines for better readability';
```

### Commands

```bash
# Format all files
npm run format

# Check formatting (don't fix)
npm run format:check

# Format specific file
npx prettier --write path/to/file.ts
```

### Ignored Files/Folders

```
node_modules/
dist/
build/
.turbo/
coverage/
.next/
*.min.js
*.min.css
package-lock.json
```

---

## 📋 Commitlint Rules

Commitlint commit message format validate karta hai.

### Config Location

```
commitlint.config.js (root)
```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Valid Types

| Type       | Description                       | Example                              |
| ---------- | --------------------------------- | ------------------------------------ |
| `feat`     | New feature                       | `feat(auth): add Google login`       |
| `fix`      | Bug fix                           | `fix(voice): handle empty audio`     |
| `docs`     | Documentation                     | `docs(readme): update install steps` |
| `style`    | Formatting (no code change)       | `style(api): fix indentation`        |
| `refactor` | Code restructure (no feature/fix) | `refactor(chat): simplify service`   |
| `test`     | Adding/updating tests             | `test(auth): add JWT unit tests`     |
| `chore`    | Maintenance/tooling               | `chore(deps): update packages`       |
| `perf`     | Performance improvement           | `perf(db): optimize queries`         |
| `ci`       | CI/CD changes                     | `ci(github): add staging deploy`     |
| `build`    | Build system changes              | `build(docker): update Dockerfile`   |
| `revert`   | Revert previous commit            | `revert: feat(auth): add login`      |

### Active Rules

| Rule                | Level | Description              |
| ------------------- | ----- | ------------------------ |
| `type-enum`         | error | Only allowed types above |
| `type-case`         | error | Type must be lowercase   |
| `type-empty`        | error | Type required            |
| `subject-empty`     | error | Description required     |
| `subject-full-stop` | error | No period at end         |
| `header-max-length` | error | Max 100 characters       |

### Examples

```bash
# ❌ BAD - No type
git commit -m "added login feature"

# ❌ BAD - Wrong type
git commit -m "feature(auth): add login"

# ❌ BAD - Uppercase type
git commit -m "FEAT(auth): add login"

# ❌ BAD - Period at end
git commit -m "feat(auth): add login."

# ❌ BAD - No scope (optional but recommended)
git commit -m "feat: add login"

# ❌ BAD - Too long (>100 chars)
git commit -m "feat(auth): add Google OAuth login with refresh token handling and session management for better user experience"

# ✅ GOOD - Correct format
git commit -m "feat(auth): add Google OAuth login"

# ✅ GOOD - With body
git commit -m "feat(auth): add Google OAuth login

Implemented OAuth 2.0 flow with:
- Access token handling
- Refresh token rotation
- Session management"
```

### Project Scopes (Recommended)

```
# Modules
auth, user, voice, chat, message, subscription

# Infrastructure
config, lib, middleware, api, db

# DevOps
ci, docker, deploy

# Others
deps, test, docs
```

---

## 🐶 Husky Hooks

Husky git hooks manage karta hai.

### Hooks Location

```
.husky/
├── pre-commit    → Commit se pehle
└── commit-msg    → Commit message check
```

### Pre-commit Hook

**Kab chalta hai:** `git commit` command ke baad, commit hone se pehle

**Kya karta hai:**

1. `lint-staged` run karta hai
2. Staged files pe ESLint + Prettier chalata hai
3. Auto-fix karta hai changes ko

**Fail hoga agar:**

- ESLint errors jo auto-fix nahi ho sakte
- Code mein critical issues

```bash
# Hook content
npx lint-staged
```

### Commit-msg Hook

**Kab chalta hai:** Commit message enter karne ke baad

**Kya karta hai:**

1. `commitlint` run karta hai
2. Message format validate karta hai

**Fail hoga agar:**

- Wrong type (feat, fix, etc. nahi hai)
- Type uppercase hai
- Description missing hai
- Message 100 chars se zyada hai

```bash
# Hook content
npx --no -- commitlint --edit ${1}
```

---

## 🎯 lint-staged Configuration

lint-staged sirf staged files pe lint/format karta hai (fast!).

### Config Location

```json
// package.json mein
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### Kaise kaam karta hai

```
git add src/auth/login.ts
git commit -m "feat(auth): add login"
         │
         ▼
lint-staged detect karta hai:
- src/auth/login.ts (staged)
         │
         ▼
Sirf is file pe:
1. eslint --fix
2. prettier --write
         │
         ▼
Changes automatically staged
         │
         ▼
Commit proceed
```

---

## 🔧 Troubleshooting

### Issue 1: ESLint error on commit

```bash
# Manual fix karo
npm run lint:fix

# Phir commit karo
git add .
git commit -m "feat(scope): message"
```

### Issue 2: Commitlint error

```bash
# Error: type must be one of [feat, fix, ...]
# Solution: Correct type use karo

git commit -m "feat(auth): add login"  # ✅
```

### Issue 3: Husky not running

```bash
# Reinstall husky
npm run prepare

# Or manually
npx husky install
```

### Issue 4: Prettier conflict with ESLint

```bash
# Both configs mein same rules honi chahiye
# Check .eslintrc.js has "plugin:prettier/recommended"
```

### Issue 5: Skip hooks (emergency only!)

```bash
# ⚠️ Use only in emergency
git commit -m "message" --no-verify

# Better: Fix the issue properly
```

---

## 📊 Quick Reference

### Daily Commands

```bash
# Check lint errors
npm run lint

# Fix lint errors
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format

# TypeCheck
npm run typecheck
```

### Commit Examples

```bash
# Feature
git commit -m "feat(voice): add voice cloning support"

# Bug fix
git commit -m "fix(chat): resolve message ordering issue"

# Refactor
git commit -m "refactor(auth): simplify token validation"

# Chore
git commit -m "chore(deps): update express to v5"

# Docs
git commit -m "docs(api): add endpoint documentation"

# Tests
git commit -m "test(voice): add unit tests for clone service"
```

---

## ✅ Checklist Before Commit

- [ ] Code lint errors fix kiye (`npm run lint:fix`)
- [ ] Code formatted hai (`npm run format`)
- [ ] TypeScript errors nahi hai (`npm run typecheck`)
- [ ] Tests pass ho rahe hai (`npm test`)
- [ ] Commit message format correct hai
- [ ] No `console.log` statements
- [ ] No hardcoded values (use env variables)
- [ ] No `any` types (use proper types)

---

## 📚 Related Documentation

- [Git Workflow](./github.doc.md) - Branch strategy, PR guidelines
- [ESLint Docs](https://eslint.org/docs/rules/)
- [Prettier Docs](https://prettier.io/docs/en/options.html)
- [Commitlint Docs](https://commitlint.js.org/)
- [Husky Docs](https://typicode.github.io/husky/)
