/**
 * Core type definitions for PLM validation system
 */

// ============================================================================
// Request Types (Incoming data to be validated)
// ============================================================================

export interface StyleRequest {
  style_code: string;
  name: string;
  category: string;
  gender: string;
  size_range: string;
  vertical: string;
  season_code: string;
  origin_country?: string | null;
  product_type?: string | null;
}

export interface ProductRequest {
  code: string;
  style_code: string;
  sales_color_code: string;
  sales_color_name: string;
  sales_availability: string;
  season_code: string;
  drop_out_date?: string | null;
  original_launch_date?: string | null;
}

// ============================================================================
// Master Record Types (Historical/Existing data in system)
// ============================================================================

export interface MasterStyle {
  style_code: string;
  name: string;
  category: string;
  gender: string;
  size_range: string;
  vertical: string;
  season_code: string;
  status: string;
  data: Record<string, any>;
}

export interface MasterProduct {
  code: string;
  style_code: string;
  sales_color_code: string;
  sales_color_name: string;
  sales_availability: string;
  season_code: string;
  status: string;
  data: Record<string, any>;
}

// ============================================================================
// Validation Types
// ============================================================================

export type Severity = 'HARD' | 'SOFT';
export type EntityType = 'Style' | 'Product';

export interface ValidationContext {
  currentRecord: StyleRequest | ProductRequest;
  existingRecord?: MasterStyle | MasterProduct | null;
  severity: Severity;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  severity: Severity;
  context: Record<string, any>;
  ruleName: string;
  fieldName: string;
  oldValue?: string | null;
  newValue?: string | null;
}

// ============================================================================
// Validation Function Type
// ============================================================================

export type ValidationFunction = (
  context: ValidationContext
) => ValidationResult;

// ============================================================================
// n8n Workflow Types (PR Generation)
// ============================================================================

export interface FileOperation {
  path: string;
  content: string;
  action: 'create' | 'update' | 'delete';
}

export interface PRMetadata {
  title: string;
  description: string;
  branch: string;
  base: string;
}

export interface ValidationRuleOutput {
  pr_metadata: PRMetadata;
  files: FileOperation[];
  summary: string;
}

// ============================================================================
// Rule Definition (for documentation/tracking)
// ============================================================================

export interface RuleDefinition {
  ruleName: string;
  entity: EntityType;
  field: string;
  severity: Severity;
  when: 'Creation' | 'Update' | 'Both';
  description: string;
  examples: {
    valid: any[];
    invalid: any[];
  };
}
