# n8n Workflow Guide

## Using the AI Agent to Generate Validation Rules

This guide explains how to use your n8n workflow to generate validation rules.

## Workflow Input

Your workflow expects a natural language description of the validation rule. Here are some examples:

### Example 1: Field Immutability

```
Style name cannot change between seasons
```

### Example 2: Required Field

```
Gender field is required for all styles
```

### Example 3: Format Validation

```
Product code must follow the pattern: {style_code}-{color_code}
```

### Example 4: Conditional Logic

```
If sales_availability is 'limited', then drop_out_date must be provided
```

### Example 5: Date Comparison

```
Drop out date must be after original launch date
```

## Workflow Output

The workflow returns JSON in this format:

```json
{
  "pr_metadata": {
    "title": "feat: Add validation rule - GenderRequired",
    "description": "Gender field is required for all styles\n\nThis PR adds validation for gender on Style entity.\n\nValidation Logic:\n- Ensures gender field is not empty or null\n\nSeverity: HARD",
    "branch": "feature/validation-gender-required",
    "base": "main"
  },
  "files": [
    {
      "path": "src/validators/rules/style/gender-required.ts",
      "content": "... complete TypeScript code ...",
      "action": "create"
    },
    {
      "path": "src/validators/rules/style/index.ts",
      "content": "export { validateGenderRequired } from './gender-required';\n",
      "action": "update"
    },
    {
      "path": "src/validators/rules/style/__tests__/gender-required.test.ts",
      "content": "... complete test file ...",
      "action": "create"
    }
  ],
  "summary": "Generated TypeScript validation function for gender required rule. Includes main validator, index export, and test file with 3 test cases."
}
```

## Applying the Generated Code

### Option 1: Manual (Recommended for learning)

```bash
# 1. Create new branch
git checkout -b feature/validation-gender-required

# 2. Create the validation file
# Copy content from files[0].content
cat > src/validators/rules/style/gender-required.ts << 'EOF'
... paste content here ...
EOF

# 3. Update the index file
# Copy content from files[1].content and append to existing file
cat >> src/validators/rules/style/index.ts << 'EOF'
... paste export statement ...
EOF

# 4. Create the test file
# Copy content from files[2].content
cat > src/validators/rules/style/__tests__/gender-required.test.ts << 'EOF'
... paste content here ...
EOF

# 5. Run tests
npm test

# 6. Commit and push
git add .
git commit -m "feat: Add validation rule - GenderRequired"
git push origin feature/validation-gender-required
```

### Option 2: Automated Script

Create a script to apply the workflow output:

```bash
#!/bin/bash
# apply-validation.sh

# Read JSON from workflow
WORKFLOW_OUTPUT='... paste workflow JSON ...'

# Extract branch name
BRANCH=$(echo $WORKFLOW_OUTPUT | jq -r '.pr_metadata.branch')

# Create branch
git checkout -b $BRANCH

# Process each file
echo $WORKFLOW_OUTPUT | jq -c '.files[]' | while read file; do
  PATH=$(echo $file | jq -r '.path')
  CONTENT=$(echo $file | jq -r '.content')
  ACTION=$(echo $file | jq -r '.action')

  if [ "$ACTION" == "create" ]; then
    # Create directory if needed
    mkdir -p $(dirname $PATH)
    # Write file
    echo "$CONTENT" > $PATH
  elif [ "$ACTION" == "update" ]; then
    # Append to existing file
    echo "$CONTENT" >> $PATH
  fi
done

# Run tests
npm test

# If tests pass, commit
if [ $? -eq 0 ]; then
  git add .
  TITLE=$(echo $WORKFLOW_OUTPUT | jq -r '.pr_metadata.title')
  git commit -m "$TITLE"
  git push origin $BRANCH
  echo "✅ Validation rule applied successfully!"
else
  echo "❌ Tests failed. Please review the generated code."
fi
```

## What the AI Agent Generates

### 1. Validation Function

A complete TypeScript function with:

- ✅ JSDoc documentation
- ✅ Type-safe implementation
- ✅ Proper error messages
- ✅ Debugging context
- ✅ Null/undefined handling

### 2. Test File

Comprehensive tests including:

- ✅ Invalid scenarios (should fail)
- ✅ Valid scenarios (should pass)
- ✅ Edge cases (new creation, null values)
- ✅ Multiple test cases covering all paths

### 3. Index Export

Proper module export for the new validation function.

## Validation Rule Patterns

The AI understands these common patterns:

### 1. **Immutability Rules**

- "Field X cannot change"
- "Field X is immutable after creation"
- "Field X cannot change between seasons"

### 2. **Required Fields**

- "Field X is required"
- "Field X must not be empty"
- "Field X is mandatory"

### 3. **Format Validation**

- "Field X must match pattern Y"
- "Field X must be a valid email"
- "Field X must be alphanumeric"

### 4. **Conditional Logic**

- "If X then Y is required"
- "When X is true, Y must be provided"
- "Field X is required only when Y equals Z"

### 5. **Cross-Field Validation**

- "Field X must be before Field Y"
- "Field X must match Field Y"
- "Field X and Y cannot both be empty"

### 6. **Cross-Season Rules**

- "Field X cannot change between seasons"
- "When season changes, Field X must remain the same"

## Tips for Writing Good Rule Descriptions

### ✅ Good Examples

```
"Style name cannot change between seasons"
"Product code must be unique"
"Gender is required for all styles"
"Drop out date must be after launch date"
```

### ❌ Bad Examples

```
"Validate the name"  // Too vague
"Check if it's okay"  // No specific rule
"Make sure things work"  // No context
```

### Best Practices

1. **Be Specific**: Clearly state what field and what condition
2. **Include Entity**: Mention if it's for Style or Product
3. **State the Rule**: Use clear language (required, cannot change, must match)
4. **Provide Context**: If there are conditions, state them clearly

## Troubleshooting

### Issue: Generated code has compilation errors

**Solution**: The AI prompt ensures type-safe code. If errors occur:

1. Check that all type imports are correct
2. Verify the entity type (Style vs Product)
3. Ensure field names match your type definitions

### Issue: Tests are failing

**Solution**:

1. Review the test cases generated
2. Verify that the examples in your prompt were correct
3. Check if the validation logic matches the rule description

### Issue: Rule is too complex

**Solution**: Break it down into multiple simpler rules:

- Instead of: "Gender is required and must be Male or Female and cannot change"
- Use: Three separate rules:
  1. "Gender is required"
  2. "Gender must be Male or Female"
  3. "Gender cannot change"

## Advanced: Providing Examples

For better results, provide examples in your prompt:

```
Rule: Product sales availability must be either 'full' or 'limited'

Valid Examples:
- sales_availability: 'full'
- sales_availability: 'limited'

Invalid Examples:
- sales_availability: 'partial'
- sales_availability: null
- sales_availability: ''
```

The AI will use these to generate better test cases.

## Next Steps

1. ✅ Set up your n8n workflow with the AI prompt
2. ✅ Test with the example rule provided
3. ✅ Create your first custom validation rule
4. ✅ Review generated code and tests
5. ✅ Create PR and merge

Happy validating! 🚀
