import { redirect } from '@sveltejs/kit';

export function load() {
    redirect(301, 'https://raw.githubusercontent.com/aacsearch/sdk-for-cli/master/install.sh');
}
