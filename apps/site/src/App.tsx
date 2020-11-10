// apps/site/src/App.tsx
import createSite, { SiteAppOptions } from "@webiny/app-template-site";
import "./App.scss";
import { NewComponent } from "my-components";

export default (params: SiteAppOptions = {}) => {
    const plugins = params.plugins || [];
    plugins.push({
        name: "pb-layout-component-header",
        type: "pb-layout-component",
        componentType: "header",
        component: NewComponent
    }
    );
    return createSite({ ...params  /* , plugins */ });
};