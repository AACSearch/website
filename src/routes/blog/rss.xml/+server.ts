import type { RequestHandler } from './$types';
import { posts } from '../content';

export const prerender = true;

function encodeText(str: string | null): string {
    if (str === null) return '';

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function encodeUrl(href: string): string {
    return encodeURI(`https://aacsearch.io${href}`);
}

export const GET: RequestHandler = () => {
    const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>AACSearch</title>
    <link>https://aacsearch.io</link>
    <atom:link href="https://aacsearch.io/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>AACSearch is an open-source platform for building applications at any scale, using your preferred programming languages and tools.</description>
    ${posts
        .map(
            (post) => `<item>
        <title>${encodeText(post.title)}</title>
        <pubDate>${post.date.toUTCString()}</pubDate>
        <link>${encodeUrl(post.href)}</link>
        <guid>${encodeUrl(post.href)}</guid>
        <description>${encodeText(post.description)}</description>
    </item>
    `
        )
        .join('')}
  </channel>
</rss>`;

    return new Response(feed, {
        headers: {
            'Content-Type': 'application/rss+xml'
        }
    });
};
