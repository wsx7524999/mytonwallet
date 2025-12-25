# Contributing to MyTonWallet

Thank you for your interest in contributing to MyTonWallet! We appreciate your support and welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

Before you begin:
- Check out the [README.md](README.md) for project overview and setup instructions
- Review existing issues and pull requests to avoid duplicates
- Make sure you have the required development environment set up

## Development Setup

### Requirements

- Node.js version ^22.6 || ^24
- npm version ^10.8 || ^11
- Git
- A Unix-like environment (macOS, Linux, or Windows with Git Bash/WSL)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/mytonwallet/mytonwallet.git
cd mytonwallet

# Copy environment file
cp .env.example .env

# Install dependencies
npm ci

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Build for development
npm run build:dev

# Build for staging
npm run build:staging
```

### Testing

```bash
# Run tests
npm test

# Run Playwright tests
npm run test:playwright

# Run linters and type checking
npm run check

# Auto-fix linting issues
npm run check:fix
```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**: Help us squash bugs
2. **Feature Development**: Add new features or enhance existing ones
3. **Documentation**: Improve or add documentation
4. **Code Quality**: Refactor code, improve performance, or add tests
5. **Translations**: Help translate the wallet to other languages
6. **Design**: Improve UI/UX

### Before You Start

1. **Search for existing issues**: Check if someone else is already working on what you want to do
2. **Create an issue**: If your contribution is substantial, create an issue first to discuss it
3. **Fork the repository**: Create your own fork to work on
4. **Create a branch**: Use a descriptive branch name (e.g., `fix/button-alignment`, `feature/multi-sig-support`)

## Coding Standards

### General Guidelines

- Follow the existing code style and patterns
- Write clear, self-documenting code
- Add comments only when necessary to explain complex logic
- Keep functions small and focused
- Use meaningful variable and function names

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules (configured in `eslint.config.mjs`)
- Avoid using `any` type unless absolutely necessary
- Use functional programming patterns where appropriate

### CSS/SCSS

- Follow Stylelint rules (configured in `.stylelintrc.json`)
- Use CSS modules for component-specific styles
- Maintain consistent naming conventions
- Use whole pixel values (enforced by custom Stylelint rule)

### Git Commit Messages

- Use clear and descriptive commit messages
- Start with a verb in present tense (e.g., "Add", "Fix", "Update", "Remove")
- Keep the first line under 72 characters
- Add detailed description if necessary

Example:
```
Add multi-signature wallet support

- Implement multi-sig transaction creation
- Add UI for managing signers
- Update tests to cover multi-sig scenarios
```

## Pull Request Process

1. **Update your fork**: Ensure your fork is up to date with the main repository
   ```bash
   git remote add upstream https://github.com/mytonwallet/mytonwallet.git
   git fetch upstream
   git merge upstream/main
   ```

2. **Make your changes**: Follow the coding standards and best practices

3. **Test your changes**: Run tests and linters before submitting
   ```bash
   npm run check
   npm test
   ```

4. **Commit your changes**: Use clear commit messages

5. **Push to your fork**: Push your branch to your GitHub fork

6. **Create a Pull Request**:
   - Provide a clear title and description
   - Reference any related issues
   - Explain what changes you made and why
   - Add screenshots for UI changes
   - Ensure all CI checks pass

7. **Code Review**: Be responsive to feedback and make requested changes

8. **Merge**: Once approved, a maintainer will merge your PR

### Pull Request Guidelines

- Keep PRs focused on a single concern
- Ensure PRs are not too large (split large changes into smaller PRs)
- Update documentation if you're changing functionality
- Add tests for new features or bug fixes
- Make sure all tests pass and there are no linting errors

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: 
   - Browser/Platform (Web, Extension, Desktop, Mobile)
   - Operating System and version
   - MyTonWallet version
6. **Screenshots**: If applicable
7. **Console Logs**: Any relevant error messages or logs

## Suggesting Enhancements

When suggesting enhancements:

1. **Use a clear title**: Describe the enhancement briefly
2. **Provide detailed description**: Explain the feature and its benefits
3. **Explain use cases**: Describe scenarios where this would be useful
4. **Consider alternatives**: Discuss alternative solutions you've considered
5. **Add mockups**: Include UI mockups if relevant

## Community

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Pull Requests**: Submit PRs for code contributions
- **Discussions**: Use GitHub Discussions for questions and general discussion

## License

By contributing to MyTonWallet, you agree that your contributions will be licensed under the [GPL-3.0-or-later](LICENSE) license.

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## Support the Project

If you like what we do, feel free to support us using this TON wallet: `EQAIsixsrb93f9kDyplo_bK5OdgW5r0WCcIJZdGOUG1B282S`

Thank you for contributing to MyTonWallet! 🚀
