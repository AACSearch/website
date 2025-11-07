import { AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID, NODE_ENV } from '$env/static/private';
import { Query, ID, type Models } from 'aacsearch';
import type { User } from './auth';
import { createInitServerClient } from './aacsearch';
import { redirect } from '@sveltejs/kit';

type SendToUserListArgs = {
    name: string;
    email: string;
    userId: string;
};

const sendToUserList = async ({ name, email, userId }: SendToUserListArgs) => {
    try {
        await fetch('https://growth.aacsearch.io/v1/mailinglists/init-3.0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                name,
                userId
            })
        });
    } catch (e) {
        console.error('Error sending to user list', e);
    }
};

export const getTicketByUser = async (user: User) => {
    const { databases } = createInitServerClient();
    const githubLogin = user.github?.login;

    if (!githubLogin) return null;

    const githubAccount = await databases.listDocuments(AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID, [
        Query.equal('gh_user', githubLogin)
    ]);

    const githubDoc = githubAccount?.documents[0] as unknown as TicketDoc;

    if (!githubDoc) return null;

    return githubDoc;
};

export const createNewTicket = async (user: User) => {
    const { databases } = createInitServerClient();
    const githubLogin = user.github?.login;
    const githubEmail = user.github?.email;
    const githubName = user.github?.name;
    const githubAvatar = user.github?.avatar_url;

    const aacsearchId = user.aacsearch?.$id;
    const aacsearchEmail = user.aacsearch?.email;
    const aacsearchName = user.aacsearch?.name;

    if (!githubLogin) return;
    const githubTicket = await databases.listDocuments(AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID, [
        Query.equal('gh_user', githubLogin)
    ]);

    const getFirstName = (fullName?: string) => fullName?.split(' ')[0] ?? undefined;
    const firstName = getFirstName(aacsearchName) ?? getFirstName(githubName);

    if (!githubTicket?.total) {
        // Send request details to user list for growth in production if a ticket doens't exist
        if (NODE_ENV === 'production' && githubEmail && aacsearchId) {
            await sendToUserList({
                name: aacsearchName ?? githubName ?? githubEmail,
                email: aacsearchEmail ?? githubEmail,
                userId: aacsearchId ?? ''
            });
        }

        const countQuery = await databases.listDocuments(AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID);

        await databases.createDocument(AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID, ID.unique(), {
            aw_email: aacsearchEmail,
            gh_user: githubLogin,
            avatar_url: githubAvatar,
            id: countQuery.total + 1,
            name: firstName,
            title: ''
        });
    }

    redirect(307, '/init/tickets/customize');
};

export const getTicketDocByUsername = async (username: string) => {
    const { databases } = createInitServerClient();
    const tickets = await databases.listDocuments(AACSEARCH_DB_INIT_ID, AACSEARCH_COL_INIT_ID, [
        Query.equal('gh_user', username)
    ]);

    return tickets.documents[0] as unknown as TicketDoc;
};

export type TicketData = Pick<Models.Document, '$id'> & {
    name: string;
    title?: string;
    gh_user: string;
    aw_email?: string;
    avatar_url?: string;
    id: number;
    contributions?: number[];
    sticker?: number | null;
};

export type TicketDoc = Omit<TicketData, 'contributions'>;
