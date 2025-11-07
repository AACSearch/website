import { PUBLIC_AACSEARCH_DASHBOARD } from '$env/static/public';
import { getUtmSourceForLink } from '$lib/utils/utm';

export function getAACSearchDashboardUrl(path = ''): string {
    const utmParams = getUtmSourceForLink();
    const url = new URL(path, PUBLIC_AACSEARCH_DASHBOARD);

    if (utmParams) {
        url.search = url.search ? `${url.search}&${utmParams}` : utmParams;
    }

    return url.toString();
}
