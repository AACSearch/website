import type { AuthorData } from '$routes/blog/content';

export const DEFAULT_HOST = 'https://aacsearch.io';
export const DEFAULT_DESCRIPTION =
    'AACSearch is an open-source platform for building applications at any scale, using your preferred programming languages and tools.';

/**
 * Generates an Open Graph image URL with encoded title and description.
 */
export function buildOpenGraphImage(title: string, description: string): string {
    return `https://og.aacsearch.global/image.png?title=${encodeURIComponent(
        title
    )}&subtitle=${encodeURIComponent(description)}`;
}

/**
 * Returns an inlined JSON-LD script tag without breaking IDE formatting.
 */
export function getInlinedScriptTag(jsonSchema: string): string {
    return `<script type="application/ld+json">${jsonSchema}</` + 'script>';
}

/**
 * Returns the JSON-LD schema for the AACSearch organization.
 */
export function organizationJsonSchema() {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        url: 'https://aacsearch.io',
        sameAs: [
            'https://www.linkedin.com/company/aacsearch',
            'https://github.com/aacsearch/aacsearch',
            'https://www.producthunt.com/products/aacsearch',
            'https://x.com/aacsearch'
        ],
        name: 'AACSearch',
        legalName: 'AACSearch Code Ltd.',
        description:
            'A secure open-source backend server provides the core APIs required to build web and mobile applications. AACSearch provides authentication, database, storage, functions, messaging, and advanced realtime capabilities.',
        logo: 'https://aacsearch.io/assets/logotype/white.png'
    });
}

/**
 * Returns the JSON-LD schema for the AACSearch software application.
 */
export function softwareAppSchema() {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AACSearch',
        applicationCategory: 'Software development',
        featureList: 'Authentication, Database, Storage, Functions, Messaging',
        audience: {
            '@type': 'Audience',
            audienceType: 'Developers'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            bestRating: '5',
            ratingValue: '4.8',
            ratingCount: '74'
        }
    });
}

/**
 * Returns the JSON-LD schema for a blog post.
 */
export function createPostSchema(
    post: { title: string; cover: string; date: string; lastUpdated?: string },
    author?: AuthorData
) {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: [post.cover],
        datePublished: post.date,
        ...(post.lastUpdated && { dateModified: post.lastUpdated }),
        ...(author && {
            author: [
                {
                    '@type': 'Person',
                    url: author.href,
                    name: author.name
                }
            ]
        })
    });
}

/**
 * Returns the JSON-LD schema for breadcrumbs.
 */
export function createBreadcrumbsSchema(articleInfo: {
    title: string;
    category: string;
    url: string;
}): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Blog',
                item: 'https://aacsearch.io/blog'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: articleInfo.category,
                item: `https://aacsearch.io/blog?category=${articleInfo.category}`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: articleInfo.title,
                item: articleInfo.url
            }
        ]
    });
}

/**
 * Returns the JSON-LD schema for faqs.
 */
export function createFaqSchema(
    faqs: Array<{
        question: string;
        answer: string;
    }>
): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    });
}
