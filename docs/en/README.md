# AACSearch Documentation

**Version**: 1.0
**Last Updated**: November 02, 2025

---

## About the Platform

**AACSearch** is a professional enterprise-level SaaS platform for search management with multi-tenancy support, intelligent search, and complete billing lifecycle.

### Key Features

- **Intelligent Search** — full-text, vector, semantic, image search, and geo-search
- **Multi-tenancy** — complete data isolation between organizations
- **Integrations** — 10+ ready-to-use connectors (WordPress, Shopify, Magento, Ghost, and more)
- **Analytics** — detailed query analytics, conversion tracking, A/B testing
- **Billing** — full Stripe integration, subscription and invoice management
- **API-first** — RESTful API with JWT and API keys
- **Enterprise Security** — encryption, audit, GDPR compliance

---

## Quick Navigation

### 🚀 For Beginners

- [5-minute Quick Start](./02-quickstart/01-getting-started.md)
- [First Collection](./02-quickstart/02-first-collection.md)
- [First Search Query](./02-quickstart/03-first-search.md)

### 👤 For Users

- [Collection Management](./04-user-guide/01-collections/README.md)
- [Search Configuration](./04-user-guide/02-search/README.md)
- [Synonyms and Merchandising](./04-user-guide/03-curation/README.md)
- [Analytics](./04-user-guide/04-analytics/README.md)

### 🔧 For Administrators

- [Organization Management](./03-admin-guide/01-tenant-management.md)
- [Users and Roles](./03-admin-guide/02-users-and-roles.md)
- [Billing and Subscriptions](./03-admin-guide/03-billing.md)
- [Security](./03-admin-guide/05-security.md)

### 💻 For Developers

- [API Reference](./05-api-reference/README.md)
- [Authentication](./05-api-reference/01-authentication.md)
- [Creating Integrations](./06-developer-guide/02-custom-integrations.md)
- [Platform Architecture](./06-developer-guide/01-architecture.md)

---

## Documentation Contents

### 📚 [1. Introduction and Platform Overview](./01-introduction/README.md)

- [1.1 About AACSearch Platform](./01-introduction/01-about.md)
- [1.2 Key Features](./01-introduction/02-features.md)
- [1.3 Architecture and Components](./01-introduction/03-architecture.md)
- [1.4 Technology Stack](./01-introduction/04-tech-stack.md)
- [1.5 Use Cases](./01-introduction/05-use-cases.md)
- [1.6 Comparison with Alternatives](./01-introduction/06-comparison.md)
- [1.7 Terms and Definitions](./01-introduction/07-glossary.md)

### 🚀 [2. Quick Start Guide](./02-quickstart/README.md)

- [2.1 Registration and Account Creation](./02-quickstart/01-getting-started.md)
- [2.2 First Collection in 5 Minutes](./02-quickstart/02-first-collection.md)
- [2.3 First Search Query](./02-quickstart/03-first-search.md)
- [2.4 Website Integration](./02-quickstart/04-website-integration.md)
- [2.5 Code Examples](./02-quickstart/05-code-examples.md)

### 🔧 [3. Administrator Guide](./03-admin-guide/README.md)

#### 3.1 Organization Management
- [Organization Creation and Configuration](./03-admin-guide/01-tenant-management.md)
- [Users and Roles](./03-admin-guide/02-users-and-roles.md)
- [Access Management](./03-admin-guide/02-users-and-roles.md#access-control)

#### 3.2 Billing and Subscriptions
- [Pricing Plans](./03-admin-guide/03-billing.md)
- [Subscription Management](./03-admin-guide/03-billing.md#subscriptions)
- [Invoices and Payments](./03-admin-guide/03-billing.md#invoices)
- [Usage Limits](./03-admin-guide/03-billing.md#usage-limits)

#### 3.3 Security
- [API Keys](./03-admin-guide/04-api-keys.md)
- [Scoped Keys](./03-admin-guide/04-api-keys.md#scoped-keys)
- [Security and Compliance](./03-admin-guide/05-security.md)
- [Audit and Logs](./03-admin-guide/05-security.md#audit)

#### 3.4 Monitoring
- [Metrics and Dashboards](./03-admin-guide/06-monitoring.md)
- [Usage Analytics](./03-admin-guide/06-monitoring.md#analytics)
- [Alerting](./03-admin-guide/06-monitoring.md#alerts)

#### 3.5 Backup
- [Snapshots and Backups](./03-admin-guide/07-backups.md)
- [Data Recovery](./03-admin-guide/07-backups.md#restore)

### 👤 [4. User Guide](./04-user-guide/README.md)

#### 4.1 Collections
- [Creating Collections](./04-user-guide/01-collections/01-creating-collections.md)
- [Schemas and Fields](./04-user-guide/01-collections/02-schemas.md)
- [Field Types](./04-user-guide/01-collections/03-field-types.md)
- [Document Indexing](./04-user-guide/01-collections/04-indexing.md)
- [Bulk Import](./04-user-guide/01-collections/05-bulk-import.md)

#### 4.2 Search
- [Basic Search](./04-user-guide/02-search/01-basic-search.md)
- [Advanced Search](./04-user-guide/02-search/02-advanced-search.md)
- [Filters and Facets](./04-user-guide/02-search/03-filters-facets.md)
- [Sorting](./04-user-guide/02-search/04-sorting.md)
- [Result Highlighting](./04-user-guide/02-search/05-highlighting.md)
- [Search Presets](./04-user-guide/02-search/06-presets.md)

#### 4.3 Results Curation
- [Synonyms](./04-user-guide/03-curation/01-synonyms.md)
- [Merchandising (Overrides)](./04-user-guide/03-curation/02-overrides.md)
- [Stop Words](./04-user-guide/03-curation/03-stopwords.md)
- [Result Pinning](./04-user-guide/03-curation/04-pinning.md)

#### 4.4 Analytics
- [Analytics Overview](./04-user-guide/04-analytics/01-overview.md)
- [Top Queries](./04-user-guide/04-analytics/02-top-queries.md)
- [No-hits Queries](./04-user-guide/04-analytics/03-no-hits.md)
- [Click Tracking](./04-user-guide/04-analytics/04-click-tracking.md)
- [A/B Testing](./04-user-guide/04-analytics/05-ab-testing.md)

#### 4.5 Integrations
- [Integrations Overview](./04-user-guide/05-integrations/README.md)
- [WordPress](./04-user-guide/05-integrations/01-wordpress.md)
- [Shopify](./04-user-guide/05-integrations/02-shopify.md)
- [WooCommerce](./04-user-guide/05-integrations/03-woocommerce.md)
- [Magento](./04-user-guide/05-integrations/04-magento.md)
- [Ghost](./04-user-guide/05-integrations/05-ghost.md)
- [Strapi](./04-user-guide/05-integrations/06-strapi.md)
- [Contentful](./04-user-guide/05-integrations/07-contentful.md)
- [Sanity](./04-user-guide/05-integrations/08-sanity.md)
- [Webflow](./04-user-guide/05-integrations/09-webflow.md)
- [Other Platforms](./04-user-guide/05-integrations/10-other.md)

#### 4.6 Advanced Features
- [Natural Language Search](./04-user-guide/06-advanced/01-nl-search.md)
- [Vector Search](./04-user-guide/06-advanced/02-vector-search.md)
- [Semantic Search](./04-user-guide/06-advanced/03-semantic-search.md)
- [Conversational Search (RAG)](./04-user-guide/06-advanced/04-conversational-search.md)
- [Image Search](./04-user-guide/06-advanced/05-image-search.md)
- [Geo Search](./04-user-guide/06-advanced/06-geo-search.md)
- [Voice Search](./04-user-guide/06-advanced/07-voice-search.md)
- [JOIN Queries](./04-user-guide/06-advanced/08-joins.md)
- [Result Grouping](./04-user-guide/06-advanced/09-grouping.md)
- [Federated Search](./04-user-guide/06-advanced/10-federated-search.md)

### 💻 [5. API Documentation](./05-api-reference/README.md)

#### 5.1 Introduction
- [API Overview](./05-api-reference/01-authentication.md)
- [Authentication](./05-api-reference/01-authentication.md#auth-methods)
- [Rate Limiting](./05-api-reference/01-authentication.md#rate-limits)
- [Error Codes](./05-api-reference/01-authentication.md#errors)

#### 5.2 Search API
- [Basic Search](./05-api-reference/02-search-api.md)
- [Multi-search](./05-api-reference/02-search-api.md#multi-search)
- [Autocomplete](./05-api-reference/02-search-api.md#suggestions)

#### 5.3 Advanced Search API
- [NL Search](./05-api-reference/03-advanced-search.md#nl-search)
- [Vector Search](./05-api-reference/03-advanced-search.md#vector-search)
- [Conversational Search](./05-api-reference/03-advanced-search.md#conversational)
- [Image Search](./05-api-reference/03-advanced-search.md#image-search)
- [Geo Search](./05-api-reference/03-advanced-search.md#geo-search)

#### 5.4 Collections API
- [Collection Management](./05-api-reference/04-collections-api.md)
- [Schemas](./05-api-reference/04-collections-api.md#schemas)
- [Documents](./05-api-reference/04-collections-api.md#documents)

#### 5.5 Curation API
- [Synonyms](./05-api-reference/05-curation-api.md#synonyms)
- [Overrides](./05-api-reference/05-curation-api.md#overrides)
- [Stop Words](./05-api-reference/05-curation-api.md#stopwords)

#### 5.6 Analytics API
- [Analytics Endpoints](./05-api-reference/06-analytics-api.md)
- [Analytics Rules](./05-api-reference/06-analytics-api.md#rules)
- [Top Queries](./05-api-reference/06-analytics-api.md#top-queries)

#### 5.7 Bulk Operations API
- [Bulk Import](./05-api-reference/07-bulk-api.md#import)
- [Bulk Export](./05-api-reference/07-bulk-api.md#export)
- [Bulk Update](./05-api-reference/07-bulk-api.md#update)
- [Bulk Delete](./05-api-reference/07-bulk-api.md#delete)

#### 5.8 Billing API
- [Subscriptions](./05-api-reference/08-billing-api.md#subscriptions)
- [Invoices](./05-api-reference/08-billing-api.md#invoices)
- [Limits](./05-api-reference/08-billing-api.md#limits)

#### 5.9 Admin API
- [Users](./05-api-reference/09-admin-api.md#users)
- [API Keys](./05-api-reference/09-admin-api.md#api-keys)
- [Jobs](./05-api-reference/09-admin-api.md#jobs)

#### 5.10 Webhooks
- [Webhook Configuration](./05-api-reference/10-webhooks.md)
- [Events](./05-api-reference/10-webhooks.md#events)
- [Signature Validation](./05-api-reference/10-webhooks.md#signature)

### 🛠️ [6. Developer Guide](./06-developer-guide/README.md)

- [6.1 Platform Architecture](./06-developer-guide/01-architecture.md)
- [6.2 Creating Custom Integrations](./06-developer-guide/02-custom-integrations.md)
- [6.3 Extending Functionality](./06-developer-guide/03-extending.md)
- [6.4 Code Structure](./06-developer-guide/04-code-structure.md)
- [6.5 Testing](./06-developer-guide/05-testing.md)
- [6.6 Contributing](./06-developer-guide/06-contributing.md)
- [6.7 SDKs and Libraries](./06-developer-guide/07-sdks.md)

### 🚀 [7. Deployment and Production](./07-deployment/README.md)

- [7.1 Infrastructure Requirements](./07-deployment/01-infrastructure.md)
- [7.2 Docker Deployment](./07-deployment/02-docker.md)
- [7.3 Kubernetes Deployment](./07-deployment/03-kubernetes.md)
- [7.4 Environment Configuration](./07-deployment/04-configuration.md)
- [7.5 Scaling](./07-deployment/05-scaling.md)
- [7.6 Production Checklist](./07-deployment/06-production-checklist.md)
- [7.7 Production Monitoring](./07-deployment/07-monitoring.md)
- [7.8 Disaster Recovery](./07-deployment/08-disaster-recovery.md)

### 📋 [8. SaaS Platform Requirements](./08-saas-requirements/README.md)

#### 8.1 Functional Requirements
- [Tenant Management](./08-saas-requirements/01-functional.md#tenants)
- [Billing](./08-saas-requirements/01-functional.md#billing)
- [Search](./08-saas-requirements/01-functional.md#search)
- [Integrations](./08-saas-requirements/01-functional.md#integrations)
- [API](./08-saas-requirements/01-functional.md#api)

#### 8.2 Non-Functional Requirements
- [Performance](./08-saas-requirements/02-non-functional.md#performance)
- [Scalability](./08-saas-requirements/02-non-functional.md#scalability)
- [Availability](./08-saas-requirements/02-non-functional.md#availability)
- [Security](./08-saas-requirements/02-non-functional.md#security)
- [Observability](./08-saas-requirements/02-non-functional.md#observability)

#### 8.3 SLA and Metrics
- [Service Level Agreements](./08-saas-requirements/03-sla.md)
- [Quality Metrics](./08-saas-requirements/03-sla.md#metrics)
- [Uptime Targets](./08-saas-requirements/03-sla.md#uptime)

#### 8.4 Compliance
- [GDPR](./08-saas-requirements/04-compliance.md#gdpr)
- [SOC 2](./08-saas-requirements/04-compliance.md#soc2)
- [ISO 27001](./08-saas-requirements/04-compliance.md#iso)
- [CCPA](./08-saas-requirements/04-compliance.md#ccpa)

#### 8.5 Multi-tenancy
- [Data Isolation](./08-saas-requirements/05-multi-tenancy.md#isolation)
- [Per-tenant Performance](./08-saas-requirements/05-multi-tenancy.md#performance)
- [Customization](./08-saas-requirements/05-multi-tenancy.md#customization)

---

## Appendices

### A. [Integration Examples](./appendix/A-integration-examples.md)
- JavaScript/TypeScript
- Python
- PHP
- Ruby
- Go

### B. [Recipes and Best Practices](./appendix/B-recipes.md)
- Relevance Optimization
- Search Performance
- Analytics Configuration
- API Security

### C. [Troubleshooting](./appendix/C-troubleshooting.md)
- Common Issues
- Diagnostics
- Solutions

### D. [Changelog](./appendix/D-changelog.md)
- Version History
- Breaking Changes
- Migration Guides

### E. [FAQ](./appendix/E-faq.md)
- Frequently Asked Questions
- Answers

---

## Additional Resources

### Videos and Tutorials
- [YouTube Channel](https://youtube.com/aacsearch)
- [Video Course "AACSearch from Scratch"](./tutorials/video-course.md)

### Community
- [GitHub Discussions](https://github.com/aacsearch/platform/discussions)
- [Discord Community](https://discord.gg/aacsearch)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aacsearch)

### Support
- [Technical Support](mailto:support@aacsearch.com)
- [Bug Reports](https://github.com/aacsearch/platform/issues)
- [Feature Requests](https://github.com/aacsearch/platform/discussions/categories/ideas)

---

## How to Use This Documentation

### Search Documentation
Use the documentation site search or grep through markdown files:

```bash
# Search all documentation files
grep -r "synonyms" docs/en/
```

### Navigation
- Each section contains a README.md with section overview
- Use the table of contents at the beginning of each page
- Links between pages for easy navigation

### Code Examples
All code examples can be copied and used:

```javascript
// Example search query
const results = await fetch('https://api.aacsearch.com/search', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  params: {
    q: 'search query',
    collection: 'products'
  }
})
```

### Feedback
Found an error in the documentation? Create an issue or PR:
- [Report an Error](https://github.com/aacsearch/platform/issues/new?template=docs)
- [Suggest an Improvement](https://github.com/aacsearch/platform/pulls)

---

## License

Documentation is distributed under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.

**© 2025 AACSearch. All rights reserved.**

---

**Last Updated**: 11/02/2025
**Documentation Version**: 1.0.0
**Platform Version**: 3.0.0
