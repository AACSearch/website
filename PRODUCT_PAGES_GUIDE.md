# AACSearch Product Pages Implementation Guide

## Overview

This guide documents the creation of 5 new AACSearch product pages (products 6-10). Two complete examples are provided with full implementations, plus templates for the remaining three products.

## Project Structure

All product pages follow this directory structure:

```
src/routes/products/[product-name]/
├── +page.svelte                          # Main product page
└── (components)/
    ├── Hero.svelte                       # Hero section with title, description, CTA
    ├── features/
    │   └── Features.svelte               # 6-8 feature cards in grid
    └── UseCases.svelte                   # 3 use case scenarios
```

## Completed Products

### 1. Merchandising (Product 6)
**Path:** `/tmp/website/src/routes/products/merchandising/`

**Title:** "Merchandising"
**Description:** "Control search results with synonyms, overrides, and curation"

**Features (8):**
1. Multi-way Synonyms - Bidirectional synonym groups
2. One-way Synonyms - Asymmetric relationship control
3. Result Overrides - Exact rules for specific queries
4. Pinning - Featured product placement
5. Exclusions - Hide unwanted results
6. Dynamic Rules - Variable-based rules
7. Filter-based Overrides - Combine filters with rules
8. Sorting Control - Fine-tune result ordering

**Use Cases (3):**
1. E-commerce Optimization - Boost sales, hide stock-outs
2. Content Publishing - Control content discovery
3. Customer Support - Help desk article prioritization

**Key Files:**
- `/tmp/website/src/routes/products/merchandising/+page.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/Hero.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/features/Features.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/UseCases.svelte`

---

### 2. Enterprise (Product 10)
**Path:** `/tmp/website/src/routes/products/enterprise/`

**Title:** "Enterprise"
**Description:** "Security, compliance, and enterprise-grade features"

**Features (8):**
1. GDPR Compliance - Automatic data deletion and anonymization
2. Role-Based Access Control - Fine-grained permission control
3. Audit Logging - Complete action trail with metadata
4. Multi-Tenancy - Complete data isolation between tenants
5. Encryption at Rest - AES-256-GCM encryption
6. SSO Integration - SAML 2.0, OAuth 2.0, OpenID Connect
7. Custom Integrations - Webhooks and API access
8. Priority Support - 24/7 support with SLA guarantees

**Use Cases (3):**
1. Financial Services - SOC 2, PCI-DSS compliance
2. Healthcare - HIPAA compliance with PHI handling
3. Enterprise SaaS - Multi-tenant search platform

**Key Files:**
- `/tmp/website/src/routes/products/enterprise/+page.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/Hero.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/features/Features.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/UseCases.svelte`

---

## Templates for Remaining Products

### 3. Multi-Search (Product 7)
**Path:** `/tmp/website/src/routes/products/multi-search/`

**Title:** "Multi-Search"
**Description:** "Federated search across multiple collections"

**Features (6-8):**
1. Federated Search - Query multiple collections simultaneously
2. Cross-Collection Ranking - Unified relevance scoring
3. Collection Weighting - Control result distribution per collection
4. Parallel Execution - Fast concurrent searches
5. Unified Filtering - Apply filters across collections
6. Result Merging - Intelligent result combination
7. Performance Optimization - Cached results for common patterns
8. Custom Aggregation - Combine and rank results by custom logic

**Use Cases (3):**
1. Multi-Catalog Commerce - Search products + content + reviews
2. Knowledge Management - Search docs + KB + forums
3. Digital Asset Management - Search images + videos + documents

**Documentation Section:** Section 1 - Search capabilities (full-text, vector, NL, RAG, image, geo)

---

### 4. Advanced-Search (Product 8)
**Path:** `/tmp/website/src/routes/products/advanced-search/`

**Title:** "Advanced Search"
**Description:** "Geo, image, and vector search capabilities"

**Features (6-8):**
1. Vector Search - Semantic similarity search
2. Image Search (CLIP) - Text-to-image and image-to-image
3. Geo Search - Radius, polygon, and bounding box queries
4. Hybrid Search - Combined text and vector search
5. Natural Language Search - Parse complex queries
6. Conversational Search (RAG) - Dialogue-based search with context
7. Custom Embeddings - Support for multiple embedding models
8. Streaming Responses - Real-time conversational results

**Use Cases (3):**
1. Visual Commerce - Product search by image description
2. Location-Based Services - Find nearby stores/services
3. AI-Powered Assistant - Conversational product discovery

**Documentation Sections:**
- Section 1.2 - Semantic and Vector Search
- Section 1.3 - Natural Language Search
- Section 1.4 - Conversational Search (RAG)
- Section 1.5 - Image Search (CLIP)
- Section 1.6 - Geo Search

---

### 5. Developer-Tools (Product 9)
**Path:** `/tmp/website/src/routes/products/developer-tools/`

**Title:** "Developer Tools"
**Description:** "APIs, SDKs, webhooks, and collection builder"

**Features (6-8):**
1. REST API - Complete API for search operations
2. SDKs - JavaScript, Python, PHP, Go, Ruby
3. Webhooks - Event-driven integrations
4. Collection Builder - UI for schema design
5. API Keys & Scoping - Granular access control
6. Rate Limiting - Protection and quota management
7. Scheduled Jobs - 10 automation tasks
8. Integration Templates - Pre-built connectors

**Use Cases (3):**
1. Custom Integration - Connect proprietary systems
2. Real-time Sync - Event-driven data updates
3. Automation Platform - Scheduled tasks and workflows

**Documentation Sections:**
- Section 6 - API and Security
- Section 8 - Automation and Tasks

---

## Component Template Structure

### Hero Component Template

```svelte
<div class="py-40 web-u-sep-block-end">
    <div class="container">
        <div class="text-center">
            <h1 class="text-headline-1 text-primary mb-8">[TITLE]</h1>
            <p class="text-main-body text-secondary max-w-3xl mx-auto mb-16">
                [DESCRIPTION - 2-3 sentences]
            </p>
            <div class="flex gap-4 justify-center flex-wrap">
                <a href="#features" class="web-button is-primary">Explore Features</a>
                <a href="/docs/products/[product-name]" class="web-button is-secondary">Read Docs</a>
            </div>
        </div>
        <div class="mt-16 rounded-lg overflow-hidden border border-greyscale-700">
            <img
                src="/images/products/[product-name]-hero.png"
                alt="[Product Name] dashboard"
                class="w-full h-auto"
                loading="lazy"
            />
        </div>
    </div>
</div>
```

### Features Component Template

Each feature card includes:
- Icon (emoji or image)
- Feature title (2-4 words)
- Description (1-2 sentences)

Structure:
```svelte
<div class="bg-white rounded-lg p-8 border border-greyscale-200 hover:border-primary transition">
    <div class="flex items-center gap-4 mb-6">
        <span class="text-3xl">[EMOJI]</span>
        <h3 class="text-main-body text-primary font-semibold">[Feature Title]</h3>
    </div>
    <p class="text-sub-body text-secondary">
        [Feature description with practical benefit]
    </p>
</div>
```

### Use Cases Component Template

Each use case includes:
- Icon (emoji)
- Title (2-3 words)
- Brief description (1-2 sentences)
- 4 bullet points with key capabilities

Structure:
```svelte
<div class="bg-greyscale-100 rounded-lg p-8">
    <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">[EMOJI]</span>
        <h3 class="text-main-body text-primary font-semibold">[Use Case Title]</h3>
    </div>
    <p class="text-sub-body text-secondary mb-6">
        [Use case description]
    </p>
    <ul class="text-label text-secondary space-y-2">
        <li>✓ [Capability 1]</li>
        <li>✓ [Capability 2]</li>
        <li>✓ [Capability 3]</li>
        <li>✓ [Capability 4]</li>
    </ul>
</div>
```

### Main Page Template (+page.svelte)

```svelte
<script>
    import Main from '$lib/layouts/Main.svelte';
    import { DEFAULT_HOST } from '$lib/utils/metadata';
    import { TITLE_SUFFIX } from '$routes/titles';

    import { PreFooter, FooterNav, MainFooter } from '$lib/components';
    import Hero from './(components)/Hero.svelte';
    import Testimonials from '$lib/components/product-pages/testimonials.svelte';
    import Features from './(components)/features/Features.svelte';
    import UseCases from './(components)/UseCases.svelte';
    import Pricing from '$routes/(marketing)/(components)/pricing.svelte';

    const title = '[Product Name]' + TITLE_SUFFIX;
    const description = '[Description from requirements]';
    const ogImage = DEFAULT_HOST + '/images/open-graph/website.png';
</script>

<svelte:head>
    <!-- SEO tags as shown in examples -->
</svelte:head>

<Main>
    <div class="overflow-hidden">
        <Hero />
        <div>
            <Features />
            <div class="bg-greyscale-50">
                <UseCases />
                <!-- Code Example Section -->
                <section class="web-u-sep-block-start py-20">
                    <div class="container">
                        <h3 class="text-headline-3 text-primary text-center mb-16">Code Example</h3>
                        <div class="max-w-4xl mx-auto bg-greyscale-900 rounded-lg p-8 overflow-x-auto">
                            <pre class="text-label text-greyscale-300"><code>[Code example from docs]</code></pre>
                        </div>
                    </div>
                </section>
                <Testimonials />
            </div>
        </div>
        <!-- Related Products Section -->
        <section class="web-u-sep-block-start -mt-8 py-40">
            <div class="container">
                <h4 class="text-label text-primary text-center">Related Products</h4>
                <!-- Link to 3 related products -->
            </div>
        </section>
        <div class="border-smooth relative border-t">
            <Pricing class="mt-0" />
            <div class="container">
                <FooterNav />
                <MainFooter />
            </div>
        </div>
    </div>
</Main>
```

---

## Related Products Links

Each product should link to 3 related products:

### Merchandising links to:
- Multi-Search
- Advanced-Search
- Developer-Tools

### Multi-Search links to:
- Merchandising
- Advanced-Search
- Developer-Tools

### Advanced-Search links to:
- Multi-Search
- Merchandising
- Developer-Tools

### Developer-Tools links to:
- Enterprise
- Multi-Search
- Advanced-Search

### Enterprise links to:
- Developer-Tools
- Multi-Search
- Advanced-Search

---

## SEO Metadata

Each page includes:

1. **Title Tag:** `[Product Name] | AACSearch`
2. **Meta Description:** Product description (150 chars)
3. **Keywords:** Relevant search terms (5-8)
4. **OG Tags:**
   - og:title
   - og:description
   - og:image (1200x630px)
   - og:image:width
   - og:image:height
5. **Twitter Tags:**
   - twitter:title
   - twitter:description
   - twitter:card (summary_large_image)
   - twitter:image
6. **Canonical:** Self-referential canonical tag

---

## Code Examples

Each product page includes a code example section extracted from the documentation:

### Merchandising
- Multi-way synonyms API call
- Override creation with filters

### Multi-Search
- Federated search across collections
- Result ranking configuration

### Advanced-Search
- Vector search with embeddings
- Geo search with radius filter
- Conversational search example

### Developer-Tools
- API key creation and scoping
- Webhook configuration
- Scheduled job setup

### Enterprise
- GDPR deletion workflow
- RBAC role definitions
- Audit logging example

---

## Implementation Steps

1. Create directory structure:
   ```bash
   mkdir -p src/routes/products/[product-name]/(components)/features
   ```

2. Create component files:
   - `Hero.svelte` - Hero section
   - `features/Features.svelte` - Feature grid (6-8 items)
   - `UseCases.svelte` - Use case cards (3 items)

3. Create main page:
   - `+page.svelte` - Main layout with all sections

4. Add SVG/image assets:
   - `static/images/products/[product-name]-hero.png` - Hero image (1200x630px)

5. Update navigation/routing if needed

6. Test responsive design on mobile/tablet/desktop

---

## File Locations

**Completed Products:**
- `/tmp/website/src/routes/products/merchandising/+page.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/Hero.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/features/Features.svelte`
- `/tmp/website/src/routes/products/merchandising/(components)/UseCases.svelte`

- `/tmp/website/src/routes/products/enterprise/+page.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/Hero.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/features/Features.svelte`
- `/tmp/website/src/routes/products/enterprise/(components)/UseCases.svelte`

**To Create:**
- `/tmp/website/src/routes/products/multi-search/` (3 components + main page)
- `/tmp/website/src/routes/products/advanced-search/` (3 components + main page)
- `/tmp/website/src/routes/products/developer-tools/` (3 components + main page)

---

## CSS Classes Reference

**Typography:**
- `text-headline-1` - Largest heading
- `text-headline-2` - Subheading
- `text-headline-3` - Section heading
- `text-main-body` - Body text
- `text-sub-body` - Smaller body text
- `text-label` - Label/caption text

**Colors:**
- `text-primary` - Main color
- `text-secondary` - Secondary color
- `bg-greyscale-50` - Light background
- `bg-greyscale-100` - Slightly darker
- `bg-greyscale-900` - Code block background

**Layout:**
- `container` - Max-width container with padding
- `web-u-sep-block` - Separator block
- `web-u-sep-block-start` - Top separator
- `web-u-sep-block-end` - Bottom separator
- `web-button` - Button component
- `web-button.is-primary` - Primary button
- `web-button.is-secondary` - Secondary button

**Components:**
- `web-card` - Card component
- `web-icon-arrow-right` - Arrow icon

---

## Notes

- All links use relative paths (e.g., `/products/multi-search`)
- Use `loading="lazy"` on images for performance
- Related products use emoji or icon images
- Code examples are extracted from `/docs/en/01-introduction/02-features.md`
- Testimonials and Pricing components are shared from parent routes
- All content is in English

