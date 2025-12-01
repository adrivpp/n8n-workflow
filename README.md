# n8n PLM Validation Rules

TypeScript validation system for Product Lifecycle Management (PLM) with n8n workflow integration.

## 📋 Overview

This project provides a type-safe, production-ready validation framework for PLM systems. It's designed to work seamlessly with n8n workflows that automatically generate validation rules and create pull requests.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Tests

```bash
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

### Build

```bash
npm run build            # Compile TypeScript to JavaScript
npm run type-check       # Check types without building
```

### Code Quality

```bash
npm run lint             # Check for linting errors
npm run format           # Format code with Prettier
```

## 📁 Project Structure

```
n8n-workflow/
├── src/
│   ├── types/
│   │   └── index.ts                    # Core type definitions
│   ├── validators/
│   │   └── rules/
│   │       ├── style/                  # Style validation rules
│   │       │   ├── __tests__/
│   │       │   │   └── style-name-immutable-across-seasons.test.ts
│   │       │   ├── style-name-immutable-across-seasons.ts
│   │       │   └── index.ts
│   │       ├── product/                # Product validation rules
│   │       │   └── index.ts
│   │       └── index.ts
│   └── index.ts                        # Main entry point
├── dist/                               # Compiled output (generated)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🎯 Creating a New Validation Rule

### Step 1: Use Your n8n Workflow

Your n8n workflow will generate the validation rule based on your AI prompt. It will output a JSON structure with:

- **pr_metadata**: Title, description, branch name
- **files**: Array of files to create/update
- **summary**: Overview of the generated code

### Step 2: The Workflow Generates Three Files

1. **Validation Function**: `src/validators/rules/{entity}/{rule-name}.ts`
2. **Index Export**: Update to `src/validators/rules/{entity}/index.ts`
3. **Test File**: `src/validators/rules/{entity}/__tests__/{rule-name}.test.ts`

### Step 3: Apply the Generated Code

Copy the generated code from your n8n workflow output and create the files:

```bash
# The workflow provides the exact file paths and content
# Example output structure from n8n:
{
  "files": [
    {
      "path": "src/validators/rules/style/gender-required.ts",
      "content": "... TypeScript code ...",
      "action": "create"
    },
    ...
  ]
}
```

### Step 4: Run Tests

```bash
npm test
```

### Step 5: Create PR

Use the provided PR metadata from the workflow:

```bash
git checkout -b feature/validation-gender-required
git add .
git commit -m "feat: Add validation rule - GenderRequired"
git push origin feature/validation-gender-required
```

## 📝 Example: Generated Validation Rule

Here's what the AI generates (already included as an example):

**File**: `src/validators/rules/style/style-name-immutable-across-seasons.ts`

```typescript
/**
 * Rule: Style name cannot change between seasons
 * Entity: Style
 * Field: name
 * Severity: SOFT
 * When: Update
 */
export function validateStyleNameImmutableAcrossSeasons(
  context: ValidationContext
): ValidationResult {
  // ... validation logic ...
}
```

## 🧪 Testing

Every validation rule includes comprehensive tests:

```typescript
describe('validateStyleNameImmutableAcrossSeasons', () => {
  it('should fail validation when style name changes between seasons', () => {
    // Test implementation
  });

  it('should pass validation when name remains the same', () => {
    // Test implementation
  });
});
```

Run tests with:

```bash
npm test
```

## 📊 Type Definitions

Core types are defined in `src/types/index.ts`:

- **ValidationContext**: Input to validation functions
- **ValidationResult**: Output from validation functions
- **StyleRequest / ProductRequest**: Incoming data structures
- **MasterStyle / MasterProduct**: Historical data structures
- **Severity**: 'HARD' | 'SOFT'

## 🔧 Configuration Files

- **tsconfig.json**: TypeScript compiler configuration with strict mode
- **jest.config.js**: Jest testing framework configuration
- **.eslintrc.json**: ESLint rules for code quality
- **.prettierrc.json**: Code formatting rules

## 🎨 Code Style

This project follows:

- Strict TypeScript with no implicit any
- Prettier for code formatting
- ESLint for code quality
- Comprehensive JSDoc comments
- 80% code coverage minimum

## 🤖 n8n Workflow Integration

Your n8n workflow acts as an AI code generator that:

1. Takes validation rule descriptions
2. Uses the AI prompt to generate type-safe TypeScript code
3. Outputs JSON with file paths and content
4. Provides PR metadata for automation

The workflow ensures:

- ✅ No database calls in validation logic
- ✅ Type-safe code with proper TypeScript
- ✅ Comprehensive test coverage
- ✅ Production-ready code quality

## 📦 Build Output

When you run `npm run build`, the project compiles to the `dist/` directory:

```
dist/
├── index.js
├── index.d.ts
├── types/
└── validators/
```

## 🔍 Example Workflow

1. **Define Rule**: "Gender field is required for all styles"
2. **n8n Generates**: TypeScript validation function + tests
3. **Apply Code**: Create files from workflow output
4. **Run Tests**: `npm test`
5. **Create PR**: Use provided branch name and commit message
6. **Merge**: After review, merge to main

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/)
- [n8n Automation Platform](https://n8n.io/)

## 🤝 Contributing

When adding new validation rules:

1. Use the n8n workflow to generate code
2. Ensure all tests pass
3. Maintain 80%+ code coverage
4. Follow the established patterns
5. Update index exports

## 📄 License

MIT
