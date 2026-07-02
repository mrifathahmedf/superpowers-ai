```markdown
# superpowers-ai Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `superpowers-ai` JavaScript codebase. It covers file naming, import/export styles, commit message habits, and how to write and run tests. Use this as a reference for contributing code that aligns with the project's established practices.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `myUtilityFunction.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { fetchData } from './apiUtils';
    ```

### Export Style
- Use **named exports** for functions, constants, and classes.
  - Example:
    ```javascript
    // In utils.js
    export function processInput(input) { ... }
    export const DEFAULT_TIMEOUT = 5000;
    ```

### Commit Messages
- Commit messages are **freeform** (no enforced prefix or format).
- Average commit message length: ~57 characters.
  - Example:
    ```
    Add support for new data source in fetchData utility
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new functionality.
**Command:** `/add-feature`

1. Create a new file using camelCase naming.
2. Write your feature using relative imports and named exports.
3. Add or update corresponding test files (`*.test.js`).
4. Commit your changes with a clear, concise message.
5. Open a pull request for review.

### Fixing a Bug
**Trigger:** When resolving a reported or discovered bug.
**Command:** `/fix-bug`

1. Locate the relevant file(s) using camelCase naming.
2. Apply the fix, maintaining code style conventions.
3. Update or add test cases in `*.test.js` files to cover the fix.
4. Commit your changes with a descriptive message.
5. Open a pull request referencing the issue if applicable.

### Writing Tests
**Trigger:** When adding or updating tests.
**Command:** `/write-test`

1. Create or update a test file matching `*.test.js`.
2. Write test cases for your feature or bugfix.
3. Use the project's (unknown) test framework conventions.
4. Run the tests to ensure they pass.
5. Commit your test changes.

## Testing Patterns

- Test files are named using the pattern: `*.test.js`
  - Example: `apiUtils.test.js`
- The specific test framework is **unknown**, but tests should be placed alongside or near the code they cover.
- Ensure tests are written for all new features and bug fixes.

## Commands
| Command      | Purpose                                 |
|--------------|-----------------------------------------|
| /add-feature | Start the workflow for adding a feature |
| /fix-bug     | Start the workflow for fixing a bug     |
| /write-test  | Start the workflow for writing tests    |
```
