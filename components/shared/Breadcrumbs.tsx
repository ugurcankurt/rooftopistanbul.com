"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const t = useTranslations("Breadcrumbs");

    // Do not show on homepage
    if (pathname === "/") {
        return null;
    }

    const paths = pathname.split("/").filter((path) => path);

    return (
        <div className="container mx-auto px-4 py-4 mt-20">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">{t("home")}</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {paths.map((path, index) => {
                        const href = `/${paths.slice(0, index + 1).join("/")}`;
                        const isLast = index === paths.length - 1;
                        const label = t.has(path) ? t(path as any) : path.charAt(0).toUpperCase() + path.slice(1);

                        return (
                            <React.Fragment key={path}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={href}>{label}</Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
