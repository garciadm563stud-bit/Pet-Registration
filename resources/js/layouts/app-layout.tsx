// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import type { AppLayoutProps } from '@/types';

// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//     </AppLayoutTemplate>
// );
import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default function AppLayout({
    children,
    breadcrumbs,
    title,
    ...props
}: AppLayoutProps & { title?: string }) {
    const { url } = usePage();

    // ✅ Auto page label (like your screenshot)
    const autoTitle =
        url.startsWith('/pets') ? 'Pet Dashboard'
        : url.startsWith('/owners') ? 'Owner Dashboard'
        : 'Pet Registration';

    // ✅ If page provides title, use it; else use autoTitle
    const finalTitle = title ?? autoTitle;

    // ✅ If no breadcrumbs provided, auto-generate 1 breadcrumb
    const finalBreadcrumbs =
        breadcrumbs ?? [{ title: finalTitle, href: url }];

    return (
        <AppLayoutTemplate breadcrumbs={finalBreadcrumbs} title={finalTitle} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
