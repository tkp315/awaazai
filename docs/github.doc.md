# Git Workflow Documentation

## Branch Structure

```
main (Production)      → Live app, protected
  │
staging (Testing)      → QA testing, pre-production
  │
dev (Development)      → Integration branch, all features merge here
  │
feature/* / fix/*      → Individual work branches
```

---

## Branch Descriptions

| Branch | Purpose | Deploys To | Protection |
|--------|---------|------------|------------|
| `main` | Production code | Production server | PR required, 1+ approval, CI pass |
| `staging` | Testing/QA | Staging server | PR required, CI pass |
| `dev` | Development integration | Dev server (optional) | PR required |
| `feature/*` | New features | - | None |
| `fix/*` | Bug fixes | - | None |
| `hotfix/*` | Urgent production fixes | - | None |

---

## Branch Naming Convention

```
feature/short-description    → New feature
fix/short-description        → Bug fix
hotfix/short-description     → Urgent production fix
refactor/short-description   → Code refactoring
docs/short-description       → Documentation updates
test/short-description       → Test additions
```

### Examples:
```
feature/voice-cloning
feature/google-auth
fix/token-expiry-issue
fix/audio-upload-crash
hotfix/critical-login-bug
refactor/chat-service
docs/api-documentation
```

---

## Complete Workflow

### 1. Starting New Feature/Fix

```bash
# Step 1: Go to dev and get latest
git checkout dev
git pull origin dev

# Step 2: Create feature branch from dev
git checkout -b feature/your-feature-name

# Step 3: Work on your code
# ... make changes ...

# Step 4: Stage and commit
git add .
git commit -m "feat(scope): your message"

# Step 5: Push to remote
git push origin feature/your-feature-name
```

### 2. Merging Feature → Dev

```bash
# Option A: Via GitHub PR (Recommended)
# 1. Go to GitHub
# 2. Create Pull Request: feature/your-feature → dev
# 3. Request review if needed
# 4. Merge after approval/CI pass

# Option B: Via Command Line
git checkout dev
git pull origin dev
git merge feature/your-feature-name
git push origin dev
```

### 3. Merging Dev → Staging (For Testing)

```bash
# Via GitHub PR (Recommended)
# 1. Create Pull Request: dev → staging
# 2. CI tests must pass
# 3. Merge when ready for QA

# Via Command Line
git checkout staging
git pull origin staging
git merge dev
git push origin staging
```

### 4. Merging Staging → Main (Production Release)

```bash
# ALWAYS via GitHub PR
# 1. Create Pull Request: staging → main
# 2. Requires at least 1 approval
# 3. All CI checks must pass
# 4. Merge when approved
```

### 5. Hotfix (Urgent Production Fix)

```bash
# Step 1: Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Step 2: Fix the issue
# ... make changes ...
git add .
git commit -m "hotfix(scope): fix critical issue"

# Step 3: Push and create PR to main
git push origin hotfix/critical-issue
# Create PR: hotfix/critical-issue → main

# Step 4: After merge to main, backport to staging and dev
git checkout staging
git pull origin staging
git merge main
git push origin staging

git checkout dev
git pull origin dev
git merge staging
git push origin dev
```

---

## Commit Message Format

### Structure
```
type(scope): description

[optional body]

[optional footer]
```

### Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `build` | Build system changes |

### Scopes (for this project)
```
auth, user, voice, chat, message, subscription,
config, lib, middleware, api, db, ci, docker
```

### Examples
```bash
feat(auth): add Google OAuth login
fix(voice): handle empty audio file upload
docs(readme): update installation steps
refactor(chat): restructure message service
test(auth): add unit tests for JWT helper
chore(deps): update dependencies
perf(api): optimize database queries
ci(github): add staging deployment workflow
```

---

## Pull Request Guidelines

### PR Title Format
```
type(scope): brief description
```

### PR Description Template
```markdown
## Summary
Brief description of changes

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No breaking changes

## Screenshots (if UI changes)
[Add screenshots here]

## Related Issues
Closes #issue_number
```

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests added for new features
- [ ] Documentation updated if needed
- [ ] No console.log or debug code
- [ ] No hardcoded values (use env variables)

---

## Branch Protection Rules (GitHub Settings)

### For `main` branch:
- [x] Require pull request before merging
- [x] Require at least 1 approval
- [x] Require status checks to pass (CI)
- [x] Require conversation resolution
- [x] Do not allow bypassing settings
- [x] Restrict who can push (only via PR)

### For `staging` branch:
- [x] Require pull request before merging
- [x] Require status checks to pass (CI)
- [ ] Approvals optional (for faster testing)

### For `dev` branch:
- [x] Require pull request before merging
- [ ] No approval required
- [ ] CI checks recommended

---

## Quick Reference Commands

### Daily Workflow
```bash
# Start of day - sync with remote
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/my-feature

# During development
git add .
git commit -m "feat(scope): message"

# End of day - push work
git push origin feature/my-feature
```

### Sync with Latest Dev
```bash
# If your feature branch is behind dev
git checkout feature/my-feature
git fetch origin
git merge origin/dev
# OR
git rebase origin/dev
```

### Undo Last Commit (not pushed)
```bash
git reset --soft HEAD~1
```

### Discard Local Changes
```bash
# Single file
git checkout -- filename

# All changes
git checkout -- .
```

### View Branch Graph
```bash
git log --oneline --graph --all
```

---

## CI/CD Pipeline Triggers

| Branch | Trigger | Action |
|--------|---------|--------|
| `feature/*` | Push/PR | Run tests, lint |
| `dev` | Push | Run tests, lint, build |
| `staging` | Push | Run tests, deploy to staging |
| `main` | Push | Run tests, deploy to production |

---

## Release Process

### Version Tagging
```bash
# After merging to main
git checkout main
git pull origin main

# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Version Format
```
v{major}.{minor}.{patch}

major: Breaking changes
minor: New features (backward compatible)
patch: Bug fixes
```

---

## Emergency Procedures

### Rollback Production
```bash
# Find previous stable commit
git log --oneline main

# Revert to previous commit
git checkout main
git revert HEAD
git push origin main
```

### Delete Remote Branch
```bash
git push origin --delete feature/old-branch
```

### Recover Deleted Branch
```bash
# Find the commit hash from reflog
git reflog

# Recreate branch
git checkout -b recovered-branch <commit-hash>
```

---

## Team Guidelines

1. **Never push directly to main or staging**
2. **Always pull before starting new work**
3. **Keep commits small and focused**
4. **Write meaningful commit messages**
5. **Delete feature branches after merge**
6. **Resolve conflicts locally before pushing**
7. **Tag releases with version numbers**
8. **Document breaking changes**

---

## Useful Git Aliases (Optional)

Add to `~/.gitconfig`:
```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    lg = log --oneline --graph --all
    undo = reset --soft HEAD~1
    amend = commit --amend --no-edit
```

Usage:
```bash
git co dev      # checkout dev
git br          # list branches
git st          # status
git lg          # pretty log
git undo        # undo last commit
```
