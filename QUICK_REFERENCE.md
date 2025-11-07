# Quick Reference - AACSearch Product Pages (6-10)

## Complete Product Pages (Ready to Deploy)

### Product 6: Merchandising
- **Path**: `/tmp/website/src/routes/products/merchandising/`
- **Files**: 4 (main page + 3 components)
- **Status**: COMPLETE
- **URL**: `/products/merchandising`
- **Hero Image**: `/images/products/merchandising-hero.png` (needs to be created)

### Product 10: Enterprise
- **Path**: `/tmp/website/src/routes/products/enterprise/`
- **Files**: 4 (main page + 3 components)
- **Status**: COMPLETE
- **URL**: `/products/enterprise`
- **Hero Image**: `/images/products/enterprise-hero.png` (needs to be created)

---

## Product Templates Available (Copy-Paste Ready)

### Product 7: Multi-Search
- **File**: `/tmp/website/REMAINING_PRODUCTS_TEMPLATES.md` (Lines 1-250)
- **Files to Create**: 4
- **Directory**: `/tmp/website/src/routes/products/multi-search/`
- **Hero Image**: `/images/products/multi-search-hero.png`

### Product 8: Advanced-Search
- **File**: `/tmp/website/REMAINING_PRODUCTS_TEMPLATES.md` (Lines 251-500)
- **Files to Create**: 4
- **Directory**: `/tmp/website/src/routes/products/advanced-search/`
- **Hero Image**: `/images/products/advanced-search-hero.png`

### Product 9: Developer-Tools
- **File**: `/tmp/website/REMAINING_PRODUCTS_TEMPLATES.md` (Lines 501-750)
- **Files to Create**: 4
- **Directory**: `/tmp/website/src/routes/products/developer-tools/`
- **Hero Image**: `/images/products/developer-tools-hero.png`

---

## File Structure for Each Product

```
src/routes/products/[product-name]/
├── +page.svelte
└── (components)/
    ├── Hero.svelte
    ├── features/
    │   └── Features.svelte
    └── UseCases.svelte
```

---

## Key Features by Product

| Product | Main Features | Use Cases |
|---------|--------------|-----------|
| **Merchandising** | Synonyms, Overrides, Pinning, Exclusions, Dynamic Rules | E-commerce, Content, Support |
| **Multi-Search** | Federated Search, Collection Weighting, Unified Ranking | Multi-catalog, Knowledge, Assets |
| **Advanced-Search** | Vector, Image, Geo, NLP, Conversational, Hybrid | Visual, Location, AI Assistant |
| **Developer-Tools** | APIs, SDKs, Webhooks, Collection Builder, Jobs | Custom Integration, Real-time Sync, Automation |
| **Enterprise** | GDPR, RBAC, Audit, Multi-tenancy, Encryption, SSO | Finance, Healthcare, SaaS |

---

## Estimated Implementation Times

- **Copy Template Files**: 5 minutes per product (15 min total for 3 products)
- **Adjust Product Names/Content**: 10 minutes per product (30 min total)
- **Create Hero Images**: 15-30 minutes (5 images)
- **Testing**: 20-30 minutes
- **Total**: 80-110 minutes

---

## Common CSS Classes

**Typography:**
- `text-headline-1` - Main heading
- `text-headline-2` - Section heading
- `text-headline-3` - Subsection heading
- `text-main-body` - Body text
- `text-sub-body` - Small text
- `text-label` - Labels/captions

**Colors:**
- `text-primary` - Main color
- `text-secondary` - Secondary color
- `bg-greyscale-50` - Light background
- `bg-greyscale-100` - Medium-light background
- `bg-greyscale-900` - Dark background (code blocks)

**Layout:**
- `container` - Max-width container
- `web-u-sep-block` - Section separator
- `web-u-sep-block-start` - Top separator
- `web-u-sep-block-end` - Bottom separator
- `web-card` - Card component
- `web-button is-primary` - Primary button
- `web-button is-secondary` - Secondary button

---

## Component Template Reference

### Hero Component
```svelte
<div class="py-40 web-u-sep-block-end">
  <h1 class="text-headline-1">[Title]</h1>
  <p class="text-main-body text-secondary">[Description]</p>
  <img src="/images/products/[name]-hero.png" alt="[Alt text]" />
</div>
```

### Feature Card
```svelte
<div class="bg-white rounded-lg p-8 border border-greyscale-200">
  <div class="flex items-center gap-4 mb-6">
    <span class="text-3xl">[EMOJI]</span>
    <h3 class="text-main-body text-primary font-semibold">[Title]</h3>
  </div>
  <p class="text-sub-body text-secondary">[Description]</p>
</div>
```

### Use Case Card
```svelte
<div class="bg-greyscale-100 rounded-lg p-8">
  <h3 class="text-main-body text-primary">[Title]</h3>
  <p class="text-sub-body text-secondary">[Description]</p>
  <ul class="text-label text-secondary space-y-2">
    <li>✓ [Benefit 1]</li>
    <li>✓ [Benefit 2]</li>
    <li>✓ [Benefit 3]</li>
    <li>✓ [Benefit 4]</li>
  </ul>
</div>
```

---

## SEO Metadata for Each Page

Every product page includes:
- `<title>` - Product name + TITLE_SUFFIX
- `<meta name="description">` - Product description
- `<meta name="keywords">` - Relevant search terms
- `<meta property="og:*">` - OpenGraph tags
- `<meta name="twitter:*">` - Twitter card tags
- `<link rel="canonical">` - Self-referential canonical tag

Example:
```svelte
const title = 'Merchandising' + TITLE_SUFFIX;
const description = 'Control search results with synonyms, overrides, and curation...';
const ogImage = DEFAULT_HOST + '/images/open-graph/website.png';
```

---

## Related Products Cross-Link Pattern

All products link to 3 related products (not themselves):

**Network Structure:**
```
Merchandising ──┬──> Multi-Search
                ├──> Advanced-Search
                └──> Developer-Tools

Multi-Search ───┬──> Merchandising
                ├──> Advanced-Search
                └──> Developer-Tools

Advanced-Search─┬──> Multi-Search
                ├──> Merchandising
                └──> Developer-Tools

Developer-Tools─┬──> Enterprise
                ├──> Multi-Search
                └──> Advanced-Search

Enterprise ─────┬──> Developer-Tools
                ├──> Multi-Search
                └──> Advanced-Search
```

---

## Shared Components Used

All pages use these pre-existing components:
- `import Main from '$lib/layouts/Main.svelte'`
- `import Testimonials from '$lib/components/product-pages/testimonials.svelte'`
- `import Pricing from '$routes/(marketing)/(components)/pricing.svelte'`
- `import { PreFooter, FooterNav, MainFooter } from '$lib/components'`

---

## Documentation Files Provided

1. **PRODUCT_PAGES_GUIDE.md** (15KB)
   - Complete overview of all 5 products
   - Architecture and patterns
   - Implementation guide
   - File locations and structure

2. **REMAINING_PRODUCTS_TEMPLATES.md** (51KB)
   - Complete copy-paste templates
   - Full source code for 3 remaining products
   - Ready to implement immediately

3. **IMPLEMENTATION_SUMMARY.txt** (10KB)
   - Project status and completion percentage
   - File locations and checklist
   - Next steps and timeline estimates

4. **QUICK_REFERENCE.md** (this file)
   - Quick lookup for all information
   - Key features and timings
   - Code snippets and patterns

---

## Next Steps Checklist

- [ ] Review REMAINING_PRODUCTS_TEMPLATES.md
- [ ] Create /src/routes/products/multi-search/ (4 files)
- [ ] Create /src/routes/products/advanced-search/ (4 files)
- [ ] Create /src/routes/products/developer-tools/ (4 files)
- [ ] Create hero images (5x 1200×630px)
- [ ] Test all product pages for responsiveness
- [ ] Verify cross-product links work correctly
- [ ] Check SEO metadata on all pages
- [ ] Test on mobile, tablet, desktop
- [ ] Build and deploy

---

## File Locations Summary

**Completed & Ready to Deploy:**
- ✓ `/tmp/website/src/routes/products/merchandising/+page.svelte`
- ✓ `/tmp/website/src/routes/products/merchandising/(components)/Hero.svelte`
- ✓ `/tmp/website/src/routes/products/merchandising/(components)/features/Features.svelte`
- ✓ `/tmp/website/src/routes/products/merchandising/(components)/UseCases.svelte`
- ✓ `/tmp/website/src/routes/products/enterprise/+page.svelte`
- ✓ `/tmp/website/src/routes/products/enterprise/(components)/Hero.svelte`
- ✓ `/tmp/website/src/routes/products/enterprise/(components)/features/Features.svelte`
- ✓ `/tmp/website/src/routes/products/enterprise/(components)/UseCases.svelte`

**Documentation:**
- ✓ `/tmp/website/PRODUCT_PAGES_GUIDE.md`
- ✓ `/tmp/website/REMAINING_PRODUCTS_TEMPLATES.md`
- ✓ `/tmp/website/IMPLEMENTATION_SUMMARY.txt`
- ✓ `/tmp/website/QUICK_REFERENCE.md`

**To Be Created:**
- `/tmp/website/src/routes/products/multi-search/` (4 files)
- `/tmp/website/src/routes/products/advanced-search/` (4 files)
- `/tmp/website/src/routes/products/developer-tools/` (4 files)
- `/tmp/website/static/images/products/` (5 hero images)

---

## Support

All templates and code are production-ready. For specific details:
- Component structure: See PRODUCT_PAGES_GUIDE.md
- Complete source code: See REMAINING_PRODUCTS_TEMPLATES.md
- Implementation timeline: See IMPLEMENTATION_SUMMARY.txt
