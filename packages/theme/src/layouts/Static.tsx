import React, { useMemo } from "react";
import { Addons } from "@webiny/app/components";
import { getPlugins } from "@webiny/plugins";
import { PbPageLayoutComponentPlugin } from "@webiny/app-page-builder/types";

const Static = () => {
    const { header: Header, footer: Footer}: any = useMemo(() => {
        const plugins = getPlugins<PbPageLayoutComponentPlugin>("pb-layout-component");
        return plugins.reduce((acc, item) => {
            acc[item.componentType] = item.component;
            return acc;
        }, {});
    }, []);

    return (
        <React.Fragment>
            <Addons />
            <Header />
            <h1>Formulario ejemplo</h1>
            <form>
            <label>
                Producto
            <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
            </form>
            <Footer />
        </React.Fragment>
    );
};

export default Static;
