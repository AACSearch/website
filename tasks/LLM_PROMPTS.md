# LLM Prompts for AACSearch Website Migration

Готовые промпты для автоматической генерации маркетингового контента и замены текстов на сайте.

## Как использовать промпты

1. Скопируйте промпт целиком
2. Вставьте в Claude/ChatGPT/другую LLM
3. Модель сгенерирует готовый код для замены
4. Скопируйте результат в нужный файл
5. Проверьте и сделайте commit

---

## 📋 Sprint 1: Content Replacement Prompts

### Prompt 1: Hero Section

```
You are a senior marketing copywriter for an enterprise SaaS platform called AACSearch.

CONTEXT:
AACSearch is a professional enterprise-level SaaS platform for search management with multi-tenancy support, intelligent search, and complete billing lifecycle.

Read this documentation excerpt:
---
{PASTE FROM docs/en/01-introduction/README.md lines 10-50}
---

TASK:
Create a compelling Hero section for the homepage with:
1. A powerful headline (max 8 words) that captures the essence of AACSearch
2. A subtitle (2-3 sentences, max 200 characters) that explains the value proposition
3. 2 CTA button texts that drive action

OUTPUT FORMAT (JSON):
{
  "title": "your headline here",
  "subtitle": "your subtitle here",
  "cta_primary": "primary button text",
  "cta_secondary": "secondary button text"
}

REQUIREMENTS:
- Use power words like "enterprise", "intelligent", "complete"
- Focus on benefits, not features
- Make it scannable and clear
- Avoid jargon
- Target audience: CTOs, Engineering Managers, Product Managers

EXAMPLES OF GOOD HEADLINES:
- "Enterprise Search, Simplified"
- "Intelligent Search for Modern Applications"
- "The Complete Search Platform"

Generate the content now.
```

---

### Prompt 2: Features Section (8 features)

```
You are a product marketing specialist for AACSearch, an enterprise search platform.

CONTEXT:
Read the full feature documentation:
---
{PASTE FROM docs/en/01-introduction/02-features.md - sections 1-10}
---

TASK:
Create compelling marketing copy for 8 key features to display on the homepage.

For EACH feature, provide:
1. Feature Title (3-5 words, catchy)
2. Short Description (1 sentence, max 15 words)
3. Detailed Description (2-3 sentences, max 100 characters)
4. Icon suggestion (from: search, ai, integration, chart, code, shield, zap, database)

OUTPUT FORMAT (JSON array):
[
  {
    "title": "Feature Title",
    "shortDesc": "One sentence description",
    "detailedDesc": "2-3 sentences explaining the benefit and value",
    "icon": "icon-name",
    "highlight": true/false
  }
]

SELECT THESE 8 FEATURES (in order of importance):
1. Intelligent Search (6 types of search)
2. Multi-tenancy (complete data isolation)
3. Ready Integrations (10+ platforms)
4. Search Analytics (tracking and insights)
5. Complete Billing (Stripe integration)
6. API-First (RESTful API)
7. AI-Powered Search (NL, conversational)
8. Enterprise Security (GDPR, compliance)

REQUIREMENTS:
- Use benefit-driven language
- Include specific numbers where possible (6 types, 10+ platforms)
- Make technical features accessible to business audience
- Highlight competitive advantages
- Use active voice

TONE:
- Professional but approachable
- Confident without being arrogant
- Technical accuracy with business clarity

Generate the content now.
```

---

### Prompt 3: Bento Grid - 6 Product Cards

```
You are creating product cards for AACSearch's homepage Bento grid.

CONTEXT:
AACSearch has 10 products total. The Bento grid on homepage will showcase 6 main products.

Read the products documentation:
---
{PASTE FROM docs/en/01-introduction/02-features.md - all 10 sections}
---

TASK:
Create compelling product cards for these 6 products:
1. Search Core
2. AI Search
3. Integrations
4. Analytics
5. Widgets
6. Merchandising

For EACH product card, provide:
1. Product Name (2-3 words)
2. Tagline (3-5 words, catchy one-liner)
3. Description (1 sentence, max 20 words)
4. Key Features (3 bullet points, 3-5 words each)
5. CTA text (2-3 words)

OUTPUT FORMAT (JSON array):
[
  {
    "name": "Product Name",
    "tagline": "Catchy tagline",
    "description": "One sentence value proposition",
    "features": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ],
    "cta": "Learn More",
    "href": "/products/product-slug"
  }
]

REQUIREMENTS:
- Each product must have unique positioning
- Taglines must be memorable and differentiating
- Features should highlight key benefits
- Descriptions must explain WHY this matters
- Use power words: intelligent, complete, instant, powerful

EXAMPLES OF GOOD TAGLINES:
- "Search that understands"
- "Connect everything, instantly"
- "Insights that drive growth"

Generate all 6 product cards now.
```

---

### Prompt 4: Pricing Plans (5 tiers)

```
You are a pricing strategist for AACSearch, an enterprise search SaaS platform.

CONTEXT:
AACSearch needs 5 pricing tiers: Free, Starter, Professional, Business, Enterprise

Read the billing documentation:
---
{PASTE FROM docs/en/03-admin-guide/03-billing.md}
---

TASK:
Create complete pricing plan descriptions for all 5 tiers.

For EACH tier, provide:
1. Plan Name
2. Price (monthly)
3. Tagline (who is this for, 5-8 words)
4. Feature list (6-10 features)
5. Highlight feature (the ONE killer feature)
6. CTA button text

OUTPUT FORMAT (JSON array):
[
  {
    "name": "Plan Name",
    "price": "$0" or "$99",
    "period": "/month" or "/year",
    "tagline": "Perfect for [target audience]",
    "features": [
      "X searches/month",
      "Y collections",
      "Feature 3",
      "Feature 4",
      "Feature 5",
      "Feature 6"
    ],
    "highlightFeature": "The ONE standout feature",
    "cta": "Button text",
    "highlighted": true/false,
    "mostPopular": true/false
  }
]

PRICING STRUCTURE GUIDELINES:
- Free: $0, 10K searches/month, 1 collection, basic features
- Starter: $29/mo, 100K searches, 10 collections, 2 integrations
- Professional: $99/mo, 500K searches, unlimited collections, AI Search limited, 5 integrations (MOST POPULAR)
- Business: $299/mo, 2M searches, unlimited everything, full AI, SLA 99.9%
- Enterprise: Custom, unlimited, enterprise features, SLA 99.99%, on-premise

REQUIREMENTS:
- Use progressive value ladder (each tier clearly better than previous)
- Include both features AND limits
- Make Professional tier most attractive (highlight it)
- Enterprise tier should say "Custom pricing"
- Use specific numbers for credibility
- Feature order: usage limits first, then features, then support

TONE:
- Clear and transparent
- Value-focused
- No hidden surprises

Generate all 5 pricing plans now.
```

---

### Prompt 5: Testimonials (4-6 customer quotes)

```
You are writing realistic customer testimonials for AACSearch.

CONTEXT:
AACSearch is a search platform used by e-commerce companies, content platforms, SaaS applications, and enterprises.

TASK:
Create 6 authentic-sounding customer testimonials that highlight different aspects of the platform.

For EACH testimonial, provide:
1. Customer quote (2-3 sentences, specific and believable)
2. Customer name
3. Job title
4. Company name (realistic but fictional)
5. Industry
6. Key metric/result mentioned

OUTPUT FORMAT (JSON array):
[
  {
    "quote": "The actual testimonial quote here",
    "name": "John Smith",
    "title": "VP of Engineering",
    "company": "ShopFast",
    "industry": "E-commerce",
    "metric": "40% increase in conversion rate",
    "avatar": "/images/testimonials/placeholder-1.jpg"
  }
]

REQUIREMENTS FOR TESTIMONIALS:
1. E-commerce customer - talks about conversion rate improvement
2. Content platform - talks about search relevance and user engagement
3. SaaS company - talks about ease of integration and developer experience
4. Enterprise - talks about security, compliance, and scale
5. Startup - talks about speed to market and cost savings
6. Marketplace - talks about multi-tenant capabilities

MAKE TESTIMONIALS:
- Specific (include actual metrics like "40% increase", "3 weeks to launch")
- Believable (not over-the-top, mention challenges overcome)
- Diverse (different industries, company sizes, use cases)
- Benefit-focused (what they achieved, not just features they used)
- Natural language (how real people talk)

AVOID:
- Generic praise ("great product!")
- Unbelievable claims ("1000% ROI!")
- Feature lists disguised as testimonials
- Corporate speak

Generate 6 realistic testimonials now.
```

---

### Prompt 6: Platform/Technology Section

```
You are creating the "Platforms & Technologies" section for AACSearch website.

CONTEXT:
AACSearch integrates with 10+ e-commerce platforms, CMS systems, and supports all major programming languages.

TASK:
Create marketing copy for the platforms section.

Provide:
1. Section Headline (5-8 words)
2. Section Description (2 sentences)
3. Category headers and lists

OUTPUT FORMAT (JSON):
{
  "headline": "Integrate with the tools you already use",
  "description": "2 sentence description of integration capabilities",
  "categories": [
    {
      "name": "E-commerce Platforms",
      "platforms": ["Shopify", "WooCommerce", "Magento", "PrestaShop", "BigCommerce"]
    },
    {
      "name": "Content Management",
      "platforms": ["WordPress", "Ghost", "Strapi", "Contentful", "Sanity", "Webflow"]
    },
    {
      "name": "Development Frameworks",
      "platforms": ["Next.js", "React", "Vue.js", "Svelte", "Angular"]
    },
    {
      "name": "Programming Languages",
      "platforms": ["JavaScript", "Python", "PHP", "Ruby", "Go", "Java"]
    }
  ]
}

REQUIREMENTS:
- Headline should emphasize ease of integration
- Description should mention "ready-made connectors" and "instant sync"
- Keep it concise and scannable

Generate the content now.
```

---

## 📄 Sprint 2: Product Pages Prompts

### Master Prompt for Product Pages

```
You are a senior product marketing manager at AACSearch writing the product page for [PRODUCT_NAME].

CONTEXT:
AACSearch is an enterprise search platform with 10 products. You're creating the dedicated page for [PRODUCT_NAME].

Read the full documentation for this product:
---
{PASTE the relevant section from docs/en/01-introduction/02-features.md}
---

TASK:
Create complete marketing content for the [PRODUCT_NAME] product page.

Provide the following sections:

1. HERO SECTION:
   - Hero headline (6-10 words, powerful and specific)
   - Hero subtitle (2-3 sentences, value proposition)
   - Primary CTA text
   - Secondary CTA text

2. FEATURES SECTION (6-8 key features):
   For each feature:
   - Feature name (3-5 words)
   - Short description (1 sentence)
   - Icon suggestion

3. BENEFITS SECTION (3-4 benefits):
   For each benefit:
   - Benefit headline (4-6 words)
   - Benefit description (2-3 sentences)
   - Supporting metric or statistic

4. USE CASES SECTION (3 use cases):
   For each use case:
   - Use case title (3-5 words)
   - Scenario description (2-3 sentences)
   - Target audience

5. CODE EXAMPLE:
   - Example title (what this code does)
   - Code snippet with comments (from documentation)
   - Result/output description

6. FAQ SECTION (5 questions):
   - Question (natural language, what users ask)
   - Answer (2-3 sentences, helpful and specific)

7. RELATED PRODUCTS (2-3 products):
   - Product name
   - Why it's related (1 sentence)

OUTPUT FORMAT: JSON with all sections structured

REQUIREMENTS:
- Focus on business outcomes, not just technical features
- Include specific, believable metrics
- Use technical accuracy for developers while accessible for managers
- Highlight competitive advantages
- Make it scannable (short paragraphs, bullet points)
- Every section should answer "Why should I care?"

TONE:
- Confident and authoritative
- Technical but accessible
- Professional with personality
- Specific and concrete (not vague promises)

TARGET AUDIENCE:
- Primary: Engineering Managers, Tech Leads
- Secondary: CTOs, Product Managers, Developers

COMPETITIVE CONTEXT:
Position against: Algolia (expensive), Elasticsearch (complex), Typesense standalone (lacks features)

Generate complete content for [PRODUCT_NAME] now.
```

---

### Individual Product Page Prompts

#### Product 1: Search Core

```
[Use Master Prompt above]

PRODUCT_NAME: Search Core
SLUG: search-core
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 1

SPECIFIC POSITIONING:
- This is the FOUNDATION product
- Enterprise-grade reliability (99.99% uptime)
- Powered by Typesense under the hood
- Main competitor: Elasticsearch (position as "easier") and Algolia (position as "more affordable")

KEY DIFFERENTIATORS:
- Typo tolerance out of the box
- Sub-50ms search response times
- 100+ language support
- Real-time indexing
- No complex tuning required

METRICS TO HIGHLIGHT:
- "<50ms response time"
- "100+ languages"
- "99.99% uptime SLA"
- "Millions of documents"

EXAMPLE USE CASE TITLES:
- "E-commerce Product Search"
- "Documentation Search"
- "Content Discovery"

Generate the complete product page content now.
```

---

#### Product 2: AI Search

```
[Use Master Prompt above]

PRODUCT_NAME: AI Search
SLUG: ai-search
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 2

SPECIFIC POSITIONING:
- This is the PREMIUM/INNOVATIVE product
- AI-powered, next-generation search
- Competes with: Perplexity, OpenAI search integrations
- Position as "ChatGPT for your data"

KEY DIFFERENTIATORS:
- Natural Language Search (ask questions, get answers)
- Conversational Search with RAG (context-aware)
- Voice Search (Whisper integration)
- Image Search (CLIP embeddings)
- Auto-embedding generation

METRICS TO HIGHLIGHT:
- "90% semantic accuracy"
- "10+ language models supported"
- "Real-time context understanding"

INNOVATION LANGUAGE TO USE:
- "Next-generation search"
- "AI-powered understanding"
- "Semantic search"
- "Conversational AI"
- "Context-aware"

EXAMPLE USE CASE TITLES:
- "Customer Support Chatbots"
- "Conversational Product Discovery"
- "Voice-Enabled Search"

Generate the complete product page content now.
```

---

#### Product 3: Integrations

```
[Use Master Prompt above]

PRODUCT_NAME: Integrations
SLUG: integrations
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 3

SPECIFIC POSITIONING:
- This is the TIME-SAVER product
- "Go live in hours, not weeks"
- Pre-built connectors for 10+ platforms
- Zero-code integration

KEY DIFFERENTIATORS:
- 10+ ready-made integrations
- One-click setup
- Auto-sync (real-time or scheduled)
- No coding required for basic setup
- Custom webhooks for advanced use

PLATFORMS TO HIGHLIGHT:
E-commerce: Shopify, WooCommerce, Magento
CMS: WordPress, Ghost, Strapi
Headless CMS: Contentful, Sanity, Webflow

METRICS TO HIGHLIGHT:
- "10+ platforms supported"
- "< 5 minutes setup time"
- "Real-time sync"
- "Millions of products indexed daily"

EXAMPLE USE CASE TITLES:
- "Shopify Store Search"
- "Multi-Platform Product Catalog"
- "Headless CMS Integration"

VALUE PROPOSITION:
"Stop building custom integrations. Start searching."

Generate the complete product page content now.
```

---

#### Product 4: Widgets

```
[Use Master Prompt above]

PRODUCT_NAME: Widgets
SLUG: widgets
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 4

SPECIFIC POSITIONING:
- This is the PLUG-AND-PLAY product
- Beautiful UI out of the box
- Fully customizable
- No design skills required

KEY DIFFERENTIATORS:
- Search Widgets (autocomplete, instant results)
- Chat Widgets (AI-powered assistance)
- White-label support
- Full customization (CSS, branding)
- Embed anywhere (iframe, script, React component)

IMPLEMENTATION OPTIONS:
- Simple: Copy-paste embed code
- Advanced: React/Vue/Svelte components
- Expert: Fully custom with APIs

METRICS TO HIGHLIGHT:
- "< 5 minutes to implement"
- "Fully responsive"
- "Accessibility (WCAG AA compliant)"
- "10+ pre-built themes"

EXAMPLE USE CASE TITLES:
- "E-commerce Search Bar"
- "Documentation Search Widget"
- "AI Chat Support Widget"

DEMO SECTION:
Include interactive widget previews (mention this)

Generate the complete product page content now.
```

---

#### Product 5: Analytics

```
[Use Master Prompt above]

PRODUCT_NAME: Analytics
SLUG: analytics
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 5

SPECIFIC POSITIONING:
- This is the INSIGHTS product
- "Data-driven search optimization"
- Turn search data into business decisions
- Competes with: Google Analytics for search

KEY DIFFERENTIATORS:
- Search-specific analytics (not generic GA)
- Top Queries tracking
- No-hits queries (find gaps)
- Click tracking & conversion attribution
- A/B testing for search
- Performance metrics (latency, p95, p99)

METRICS TO HIGHLIGHT:
- "Real-time dashboards"
- "30+ tracked metrics"
- "A/B test results in 24 hours"
- "ROI tracking"

INSIGHTS TYPES:
- Query Analytics (what people search for)
- Performance Analytics (how fast, how relevant)
- Business Analytics (conversions, revenue impact)

EXAMPLE USE CASE TITLES:
- "Optimize Product Search for Conversions"
- "Find Content Gaps"
- "Improve Search Relevance"

VALUE PROPOSITION:
"Stop guessing what users want. Know for certain."

Generate the complete product page content now.
```

---

#### Product 6: Merchandising

```
[Use Master Prompt above]

PRODUCT_NAME: Merchandising
SLUG: merchandising
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 6

SPECIFIC POSITIONING:
- This is the CONTROL product
- "Take control of your search results"
- Designed for e-commerce merchandisers
- No coding required

KEY DIFFERENTIATORS:
- Synonyms management (multi-way, one-way)
- Query Overrides (pin/hide results)
- Curation Sets (global merchandising rules)
- Stop Words filtering
- Search Presets (saved configurations)

USE CASES FOR MERCHANDISERS:
- Promote seasonal products
- Hide out-of-stock items
- Fix common misspellings
- Boost high-margin products
- A/B test different arrangements

METRICS TO HIGHLIGHT:
- "Unlimited synonym sets"
- "Real-time rule application"
- "No-code interface"
- "Version control & rollback"

EXAMPLE USE CASE TITLES:
- "Seasonal Product Promotion"
- "Query Synonym Management"
- "Search Result Curation"

VALUE PROPOSITION:
"Your search results, your rules. No developer needed."

Generate the complete product page content now.
```

---

#### Product 7: Multi-Search

```
[Use Master Prompt above]

PRODUCT_NAME: Multi-Search
SLUG: multi-search
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 7

SPECIFIC POSITIONING:
- This is the ADVANCED product
- "Search across everything, simultaneously"
- For complex applications with multiple data types
- Technical audience (developers)

KEY DIFFERENTIATORS:
- Federated Search (search multiple collections)
- Union Search (combine results)
- Join Queries (one-to-many relationships)
- Nested Search (hierarchical data)
- Cross-collection filtering

TECHNICAL FEATURES:
- GraphQL-like joins
- Result merging strategies
- Score normalization
- Performance optimization

METRICS TO HIGHLIGHT:
- "Search 10+ collections in one query"
- "Sub-100ms federated search"
- "Automatic result ranking"

EXAMPLE USE CASE TITLES:
- "Marketplace Multi-Vendor Search"
- "University Course + Professor Search"
- "Product + Review + QA Search"

VALUE PROPOSITION:
"One search bar. All your data. Unified results."

Generate the complete product page content now.
```

---

#### Product 8: Advanced Search

```
[Use Master Prompt above]

PRODUCT_NAME: Advanced Search
SLUG: advanced-search
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 8

SPECIFIC POSITIONING:
- This is the SPECIALIZED product
- "Beyond text: geo, images, and more"
- For unique search requirements
- Technical + niche use cases

KEY DIFFERENTIATORS:
- Geo Search (distance, polygon, radius)
- Image Search (CLIP embeddings)
- Vector Distance Bucketing
- Hybrid Search (keyword + semantic)
- Advanced filtering (boolean logic)

SPECIALIZED USE CASES:
- Location-based search (restaurants, stores)
- Visual similarity search (fashion, furniture)
- Complex data filtering

METRICS TO HIGHLIGHT:
- "Geo search with < 10ms latency"
- "Image similarity 95% accuracy"
- "Hybrid search 2x better relevance"

EXAMPLE USE CASE TITLES:
- "Restaurant Finder with Geo Search"
- "Visual Product Search"
- "Real Estate Location Search"

VALUE PROPOSITION:
"Specialized search for specialized needs."

Generate the complete product page content now.
```

---

#### Product 9: Developer Tools

```
[Use Master Prompt above]

PRODUCT_NAME: Developer Tools
SLUG: developer-tools
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 9

SPECIFIC POSITIONING:
- This is the DX (Developer Experience) product
- "Built by developers, for developers"
- API-first platform
- Complete developer toolkit

KEY DIFFERENTIATORS:
- RESTful API (full-featured)
- Scoped Search Keys (security)
- API Keys Management
- Rate Limiting (customizable)
- Webhooks (event-driven)
- SDKs (10+ languages)
- Collection Builder (visual tool)
- Configuration Wizards

DEVELOPER BENEFITS:
- Comprehensive documentation
- Interactive API explorer
- Code examples in every language
- Postman collections
- CLI tools

METRICS TO HIGHLIGHT:
- "10+ official SDKs"
- "99.99% API uptime"
- "< 100ms API response time"
- "Unlimited API calls (on paid plans)"

EXAMPLE USE CASE TITLES:
- "Headless Search Implementation"
- "Custom Integration Build"
- "Secure Multi-Tenant API Access"

VALUE PROPOSITION:
"APIs so good, you'll enjoy the integration."

Generate the complete product page content now.
```

---

#### Product 10: Enterprise

```
[Use Master Prompt above]

PRODUCT_NAME: Enterprise
SLUG: enterprise
DOCUMENTATION: docs/en/01-introduction/02-features.md - Section 10

SPECIFIC POSITIONING:
- This is the ENTERPRISE product
- "Scale, security, and support for the enterprise"
- Fortune 500 ready
- Mission-critical applications

KEY DIFFERENTIATORS:
- Multi-tenant Architecture (complete isolation)
- RBAC (Role-Based Access Control)
- Audit Logs (compliance ready)
- GDPR Compliance
- Data Sanitization
- Automated Backups
- Snapshot Management
- Cluster Health Monitoring
- SLA 99.99%
- Dedicated Support
- On-premise deployment option

ENTERPRISE FEATURES:
- Security: SOC 2, ISO 27001, GDPR
- Compliance: Audit trails, data residency
- Scale: Multi-region, auto-scaling
- Support: 24/7, dedicated engineer, SLA

METRICS TO HIGHLIGHT:
- "99.99% uptime SLA"
- "SOC 2 Type II certified"
- "< 4 hour response time"
- "Unlimited scale"

EXAMPLE USE CASE TITLES:
- "Global E-commerce Platform"
- "Healthcare Search (HIPAA)"
- "Financial Services Search"

VALUE PROPOSITION:
"Enterprise-grade search without enterprise complexity."

SPECIFIC SECTIONS TO ADD:
- Security & Compliance
- Deployment Options (Cloud, On-premise, Hybrid)
- Support & SLA
- Migration Services

Generate the complete product page content now.
```

---

## 📚 Sprint 3: Documentation Prompts

### Prompt for Documentation Overview Page

```
You are writing the overview page for AACSearch documentation.

TASK:
Create a welcoming, well-organized documentation home page.

Provide:
1. Hero Section
   - Headline (5-7 words)
   - Description (2-3 sentences)
   - Quick Start CTA

2. Documentation Sections (8 sections)
   For each section:
   - Section name
   - Description (1 sentence)
   - Icon suggestion
   - Top 3-5 pages in this section

OUTPUT FORMAT (JSON):
{
  "hero": {
    "headline": "Everything you need to build with AACSearch",
    "description": "Complete guides, API references, and tutorials to help you integrate powerful search into your application.",
    "quickStartCta": "5-Minute Quick Start"
  },
  "sections": [...]
}

SECTIONS TO CREATE:
1. Introduction & Overview
2. Quick Start Guides
3. Administrator Guide
4. User Guide
5. API Reference
6. Developer Guide
7. Deployment
8. Troubleshooting & FAQ

TONE:
- Helpful and welcoming
- Clear and organized
- Developer-friendly

Generate the documentation overview now.
```

---

## 🌍 Sprint 5: Internationalization Prompts

### Prompt for RU Translation

```
You are a professional translator specializing in technical/SaaS content.

TASK:
Translate AACSearch website content from English to Russian.

CONTEXT:
AACSearch is an enterprise search platform. Target audience: Russian-speaking developers, CTOs, and product managers.

SOURCE CONTENT (EN):
---
{PASTE English content here}
---

TRANSLATION REQUIREMENTS:
- Maintain professional tone
- Keep technical terms in English where appropriate (API, SaaS, SDK)
- Use formal "вы" for addressing users
- Preserve markdown formatting
- Keep brand name "AACSearch" untranslated
- Translate UI elements (buttons, labels)

OUTPUT FORMAT:
Provide Russian translation maintaining original structure

SPECIFIC GUIDELINES:
- "Search" → "Поиск"
- "Enterprise" → "Корпоративный" or keep "Enterprise"
- "AI Search" → "AI-поиск"
- Button CTAs: Use imperative mood

Translate now.
```

---

### Prompt for DE Translation

```
You are a professional translator specializing in technical/SaaS content.

TASK:
Translate AACSearch website content from English to German.

CONTEXT:
AACSearch is an enterprise search platform. Target audience: German-speaking developers, CTOs, and product managers.

SOURCE CONTENT (EN):
---
{PASTE English content here}
---

TRANSLATION REQUIREMENTS:
- Maintain professional tone
- Keep technical terms in English where appropriate
- Use formal "Sie" for addressing users
- Preserve markdown formatting
- Keep brand name "AACSearch" untranslated
- Follow German capitalization rules

OUTPUT FORMAT:
Provide German translation maintaining original structure

SPECIFIC GUIDELINES:
- "Search" → "Suche"
- "Enterprise" → "Unternehmen" or keep "Enterprise"
- "AI Search" → "KI-Suche"
- Button CTAs: Use infinitive or imperative

Translate now.
```

---

## 🔧 Utility Prompts

### Prompt for Meta Tags & SEO

```
You are an SEO specialist optimizing AACSearch website pages.

TASK:
Generate complete SEO meta tags for the [PAGE_NAME] page.

PAGE CONTENT:
---
{PASTE page hero and first section}
---

Provide:
1. Title tag (50-60 characters, include "AACSearch")
2. Meta description (150-160 characters, compelling CTA)
3. Open Graph title
4. Open Graph description
5. Twitter card description
6. Keywords (10-15 relevant keywords)
7. H1 tag text
8. Canonical URL

OUTPUT FORMAT (JSON):
{
  "title": "Page Title - AACSearch",
  "metaDescription": "Compelling description with CTA",
  "ogTitle": "Open Graph Title",
  "ogDescription": "OG Description",
  "twitterDescription": "Twitter description",
  "keywords": ["keyword1", "keyword2"],
  "h1": "Main H1 heading",
  "canonical": "https://aacsearch.io/page-slug"
}

SEO REQUIREMENTS:
- Include primary keyword in title
- Use power words for click-through
- Include brand name
- Stay within character limits
- Write for humans first, search engines second

Generate SEO meta tags now.
```

---

### Prompt for Code Examples

```
You are a developer advocate creating code examples for AACSearch documentation.

TASK:
Create realistic, well-commented code examples for [FEATURE_NAME].

REQUIREMENTS:
1. Show the simplest possible example first
2. Include error handling
3. Add helpful comments
4. Use realistic variable names
5. Show expected output

Provide examples in:
- JavaScript (fetch)
- Python (requests)
- PHP (curl)
- cURL

OUTPUT FORMAT:
For each language, provide:
- Code block
- Explanation (what it does)
- Expected response

Keep it practical and copy-paste ready.

Generate code examples now.
```

---

## 📊 Testing & Validation Prompts

### Prompt for Content Quality Check

```
You are a content quality reviewer for enterprise SaaS websites.

TASK:
Review this marketing content and provide feedback.

CONTENT TO REVIEW:
---
{PASTE content here}
---

EVALUATE ON:
1. Clarity (1-10): Is it immediately understandable?
2. Value Prop (1-10): Is the benefit clear?
3. Credibility (1-10): Are claims believable?
4. Specificity (1-10): Concrete vs vague?
5. Scannability (1-10): Easy to skim?

Provide:
- Score for each dimension
- Specific improvements
- Rewritten version if score < 7

OUTPUT FORMAT (JSON):
{
  "scores": {...},
  "feedback": "...",
  "improvements": [...],
  "rewritten": "..." (if needed)
}

Review now.
```

---

## 🚀 Master Automation Prompt

### Full Page Generation Prompt

```
You are the lead developer and content creator for AACSearch website migration.

CONTEXT:
You have access to:
- Full documentation in /tmp/website/docs/en/
- Existing component structure in /tmp/website/src/
- Task plans in /tmp/website/tasks/

TASK:
Generate COMPLETE, PRODUCTION-READY content for [SPECIFIC_PAGE].

EXECUTE THESE STEPS:
1. Read the relevant documentation
2. Analyze the target component/page structure
3. Generate marketing content (using prompts above)
4. Format for the specific file (Svelte/JSON/Markdown)
5. Include all required sections
6. Add meta tags and SEO
7. Provide complete file content ready to paste

OUTPUT:
Complete file content that can be directly copied to:
[FILE_PATH]

QUALITY REQUIREMENTS:
- Production-ready (no placeholders)
- SEO optimized
- Accessible (WCAG AA)
- Mobile responsive (content-wise)
- Compelling and professional
- Technically accurate

Generate the complete page now.
```

---

## 📝 How to Use These Prompts

### Step-by-Step Workflow:

1. **Choose the appropriate prompt** for your task
2. **Fill in the bracketed placeholders** [LIKE_THIS] with actual data
3. **Paste relevant documentation** where indicated
4. **Copy entire prompt** to Claude/ChatGPT
5. **Review generated content**
6. **Copy to target file**
7. **Test locally** (`bun run dev`)
8. **Commit** with descriptive message

### Example Usage:

```bash
# 1. Copy Prompt 1 (Hero Section)
# 2. Paste docs/en/01-introduction/README.md content
# 3. Run in Claude
# 4. Copy output
# 5. Paste to src/routes/(marketing)/(components)/hero.svelte
# 6. Test
# 7. Commit
git commit -m "feat: update hero section with AI-generated content"
```

---

**Last Updated**: 2025-11-07
**Total Prompts**: 25+
**Estimated Time Savings**: 80% vs manual writing
