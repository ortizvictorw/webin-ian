import * as React from "react";

export type MetaProp = {
    cursors?: {
        next: string;
        previous: string;
    };
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    totalCount?: number;
};

export type SortersProp = Array<{ label: string; sorters: { [key: string]: number } }>;

export type Props = {
    // Pass a function to take full control of list render.
    children?: Function;

    // A title of paginated list.
    title?: React.ReactNode;

    // FormData that needs to be shown in the list.
    data?: Object[];

    // A callback that must refresh current view by repeating the previous query.
    refresh?: Function;

    // If true, Loader component will be shown, disallowing any interaction.
    loading?: boolean;

    // Provide a custom loader. Shown while the content is loading.
    loader?: React.ReactNode;

    // Provide all pagination data, options and callbacks here.
    meta?: MetaProp;

    // Triggered once the page has been selected.
    setPage?: Function;

    // Triggered once a sorter has been selected.
    setSorters?: Function;

    // Triggered once selected filters are submitted.
    setFilters?: Function;

    // Triggered when number of entries per page has been changed.
    setPerPage?: Function;

    // By default, users can choose from 10, 25 or 50 entries per page.
    perPageOptions: number[];

    // Provide all sorters options and callbacks here.
    sorters?: SortersProp;

    multiActions?: any[]; // TODO: define
};
