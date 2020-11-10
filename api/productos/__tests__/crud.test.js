import useGqlHandler from "./useGqlHandler";
import { CREATE_PRODUCTO, LIST_PRODUCTOS } from "./graphql/productos";

/**
 * This is a simple test that asserts basic CRUD operations work as expected.
 * Feel free to update this test according to changes you made in the actual code.
 *
 * @see https://docs.webiny.com/docs/api-development/introduction
 */
describe("CRUD Test", () => {
    const { invoke } = useGqlHandler();

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Let's create a couple of productos.
        let [producto1] = await invoke({
            body: {
                query: CREATE_PRODUCTO,
                variables: {
                    data: {
                        title: "Producto 1",
                        description: "This is my 1st producto.",
                        isNice: false
                    }
                }
            }
        });

        let [producto2] = await invoke({
            body: {
                query: CREATE_PRODUCTO,
                variables: {
                    data: { title: "Producto 2", description: "This is my 2nd producto." }
                }
            }
        });

        let [producto3] = await invoke({
            body: {
                query: CREATE_PRODUCTO,
                variables: {
                    data: { title: "Producto 3", isNice: true }
                }
            }
        });

        // 2. Now that we have productos created, let's see if they come up in a basic listProductos query.
        let [productosList] = await invoke({
            body: {
                query: LIST_PRODUCTOS
            }
        });

        expect(productosList).toEqual({
            data: {
                productos: {
                    listProductos: {
                        data: [
                            {
                                id: producto3.data.productos.createProducto.data.id,
                                title: "Producto 3",
                                description: null,
                                isNice: true
                            },
                            {
                                id: producto2.data.productos.createProducto.data.id,
                                title: "Producto 2",
                                description: "This is my 2nd producto.",
                                isNice: true
                            },
                            {
                                id: producto1.data.productos.createProducto.data.id,
                                title: "Producto 1",
                                description: "This is my 1st producto.",
                                isNice: false
                            }
                        ],
                        error: null
                    }
                }
            }
        });
    });

    it("should throw a validation error if title is invalid", async () => {
        // The title field is missing, the error should be thrown from the GraphQL and the resolver won't be executedd.
        let [body] = await invoke({
            body: {
                query: CREATE_PRODUCTO,
                variables: {
                    data: { description: "This is my 1st producto.", isNice: false }
                }
            }
        });

        let [error] = body.errors;
        expect(error.message).toBe(
            'Variable "$data" got invalid value { description: "This is my 1st producto.", isNice: false }; Field title of required type String! was not provided.'
        );

        // Even though the title is provided, it is still too short (because of the validation
        // set on the "Producto" Commodo model).
        [body] = await invoke({
            body: {
                query: CREATE_PRODUCTO,
                variables: {
                    data: { title: "Aa", description: "This is my 1st producto.", isNice: false }
                }
            }
        });

        expect(body).toEqual({
            data: {
                productos: {
                    createProducto: {
                        data: null,
                        error: {
                            code: "VALIDATION_FAILED_INVALID_FIELDS",
                            message: "Validation failed.",
                            data: {
                                invalidFields: {
                                    title: "Value requires at least 3 characters."
                                }
                            }
                        }
                    }
                }
            }
        });
    });
});
