import fs from 'fs';
import path from 'path';

console.log('--- AUDITING & VALIDATING TEXTILE DATA ARCHITECTURE ---');

const productsPath = path.resolve('data/textile-products.json');
const categoriesPath = path.resolve('data/textile-chemical-categories.json');

if (!fs.existsSync(productsPath)) {
  console.error(`FATAL: ${productsPath} does not exist!`);
  process.exit(1);
}
if (!fs.existsSync(categoriesPath)) {
  console.error(`FATAL: ${categoriesPath} does not exist!`);
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

let errors = [];
let warnings = [];

// 1. Validate Category References
const categoryIds = new Set(categories.map(c => c.id));
const categorySlugMap = new Map(categories.map(c => [c.id, c.slug]));

if (categoryIds.size !== 13) {
  errors.push(`Expected 13 categories, found ${categoryIds.size}`);
}

// 2. Validate Products
if (!Array.isArray(products) || products.length === 0) {
  errors.push('Product dataset is empty or not an array.');
}

const seenIds = new Set();
const seenSlugs = new Set();
const productIds = new Set(products.map(p => p.id));

products.forEach((p, idx) => {
  const ref = p.id || `Index ${idx}`;

  // Unique ID
  if (!p.id || typeof p.id !== 'string') {
    errors.push(`[${ref}] Missing or invalid 'id' field.`);
  } else if (seenIds.has(p.id)) {
    errors.push(`[${ref}] Duplicate product id detected: ${p.id}`);
  } else {
    seenIds.add(p.id);
  }

  // Unique Slug
  if (!p.slug || typeof p.slug !== 'string') {
    errors.push(`[${ref}] Missing or invalid 'slug' field.`);
  } else if (seenSlugs.has(p.slug)) {
    errors.push(`[${ref}] Duplicate product slug detected: ${p.slug}`);
  } else {
    seenSlugs.add(p.slug);
  }

  // Name
  if (!p.name || typeof p.name !== 'string' || p.name.trim().length < 3) {
    errors.push(`[${ref}] Missing or invalid 'name' field.`);
  }

  // Category ID & Slug
  if (!p.categoryId || !categoryIds.has(p.categoryId)) {
    errors.push(`[${ref}] References invalid categoryId: "${p.categoryId}".`);
  } else {
    const expectedSlug = categorySlugMap.get(p.categoryId);
    if (p.categorySlug !== expectedSlug) {
      errors.push(`[${ref}] categorySlug "${p.categorySlug}" does not match expected "${expectedSlug}" for category ${p.categoryId}.`);
    }
  }

  // Subcategory & Chemical Family
  if (!p.subcategory || typeof p.subcategory !== 'string') {
    errors.push(`[${ref}] Missing 'subcategory' field.`);
  }
  if (!p.chemicalFamily || typeof p.chemicalFamily !== 'string') {
    errors.push(`[${ref}] Missing 'chemicalFamily' field.`);
  }

  // Technical Content
  if (!p.technicalContent || typeof p.technicalContent !== 'object') {
    errors.push(`[${ref}] Missing 'technicalContent' object.`);
  } else {
    ['overview', 'whenUsed', 'whyUsed', 'howItWorks', 'safetyNotes'].forEach(field => {
      if (!p.technicalContent[field] || typeof p.technicalContent[field] !== 'string') {
        errors.push(`[${ref}] Missing technicalContent.${field}`);
      }
    });
    if (!Array.isArray(p.technicalContent.selectionFactors) || p.technicalContent.selectionFactors.length === 0) {
      errors.push(`[${ref}] selectionFactors must be a non-empty array.`);
    }
  }

  // Commercial Integrity (no fake prices or unverified claims)
  if (!p.commercial || typeof p.commercial !== 'object') {
    errors.push(`[${ref}] Missing 'commercial' object.`);
  } else {
    if (p.commercial.price !== null && p.commercial.price !== undefined) {
      warnings.push(`[${ref}] Price is stated as "${p.commercial.price}". Ensure no fabricated prices exist.`);
    }
    if (!p.commercial.enquiryUrl || !p.commercial.enquiryUrl.includes('indiamart.com')) {
      errors.push(`[${ref}] enquiryUrl must point to verified IndiaMART business profile.`);
    }
  }

  // Related Products
  if (!Array.isArray(p.relatedProductIds) || p.relatedProductIds.length === 0) {
    errors.push(`[${ref}] Missing or empty 'relatedProductIds' array.`);
  } else {
    p.relatedProductIds.forEach(relId => {
      if (!productIds.has(relId)) {
        errors.push(`[${ref}] relatedProductId "${relId}" does not exist in master product dataset.`);
      }
    });
  }

  // Stages & Functions
  if (!Array.isArray(p.processStages) || p.processStages.length === 0) {
    errors.push(`[${ref}] Missing 'processStages' array.`);
  }
  if (!Array.isArray(p.functions) || p.functions.length === 0) {
    errors.push(`[${ref}] Missing 'functions' array.`);
  }
  if (!Array.isArray(p.applicableFibres) || p.applicableFibres.length === 0) {
    errors.push(`[${ref}] Missing 'applicableFibres' array.`);
  }
  if (!Array.isArray(p.fabricApplications) || p.fabricApplications.length === 0) {
    errors.push(`[${ref}] Missing 'fabricApplications' array.`);
  }
  if (!Array.isArray(p.machineryApplications) || p.machineryApplications.length === 0) {
    errors.push(`[${ref}] Missing 'machineryApplications' array.`);
  }
  if (p.catalogType !== 'technical-sourcing-guide') {
    errors.push(`[${ref}] catalogType must be "technical-sourcing-guide" (found "${p.catalogType}").`);
  }
  if (!Array.isArray(p.technicalContent.faqs) || p.technicalContent.faqs.length < 2) {
    errors.push(`[${ref}] technicalContent.faqs must contain at least 2 Q&As.`);
  }
});

console.log(`Audited ${products.length} products across ${categories.length} categories.`);

if (warnings.length > 0) {
  console.log(`\n⚠ Warnings (${warnings.length}):`);
  warnings.slice(0, 10).forEach(w => console.log('  - ' + w));
  if (warnings.length > 10) console.log(`  ... and ${warnings.length - 10} more warnings`);
}

if (errors.length > 0) {
  console.error(`\n❌ Validation Failed with ${errors.length} errors:`);
  errors.slice(0, 20).forEach(err => console.error('  - ' + err));
  if (errors.length > 20) console.error(`  ... and ${errors.length - 20} more errors`);
  process.exit(1);
}

console.log('✓ Master Textile Data successfully passed all schema and integrity validations.');
process.exit(0);
