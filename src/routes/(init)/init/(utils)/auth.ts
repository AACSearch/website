import { type AACSearchUser } from '$lib/utils/console';
import { PUBLIC_AACSEARCH_ENDPOINT, PUBLIC_AACSEARCH_PROJECT_INIT_ID } from '$env/static/public';
import { Client, OAuthProvider, Account } from 'node-aacsearch';
import type { RequestEvent } from '../$types';

export const cookieKey = `init_session_${PUBLIC_AACSEARCH_PROJECT_INIT_ID}`;

export interface GithubUser {
    login: string;
    name: string;
    email: string;
    avatar_url?: string;
}

export type User = {
    github: GithubUser | null;
    aacsearch: AACSearchUser | null;
};

export const loginGithub = async (url: RequestEvent['url']) => {
    const client = new Client();
    client.setEndpoint(PUBLIC_AACSEARCH_ENDPOINT).setProject(PUBLIC_AACSEARCH_PROJECT_INIT_ID);

    const githubInit = {
        account: new Account(client)
    };

    const redirectUrl = await githubInit.account.createOAuth2Token(
        OAuthProvider.Github,
        `${url.origin}/init/tickets/validate-session?success=1`,
        `${url.origin}/init/tickets/validate-session?error=1`,
        ['read:user']
    );

    return redirectUrl;
};
