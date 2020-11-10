// @ts-ignore
import { withFields, withName, string, boolean, pipe,number } from "@webiny/commodo";
import { validation } from "@webiny/validation";

/**
 * A simple "Producto" data model, that consists of a couple of simple fields.
 *
 * @see https://docs.webiny.com/docs/api-development/commodo/introduction
 * @see https://github.com/webiny/commodo/tree/master
 */
export default ({ createBase }) =>
    pipe(
        withName("Producto"),
        withFields(() => ({
            // A simple "string" field, with a couple of validators attached.
            nombre: string({ validation: validation.create("required,minLength:3,maxLength:100") }),
            detalle: string({ validation: validation.create("maxLength:500") }),
            categoria:["remeras","pantalones"],
            precio:number(),
            tags: string({ validation: validation.create("maxLength:500") }),
            destacado: boolean({ value: true }),
            publicado:boolean({ value: true }),




        }))
        
    )(createBase());
