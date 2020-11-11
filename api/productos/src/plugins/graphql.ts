import gql from "graphql-tag";
import { GraphQLSchemaPlugin } from "@webiny/graphql/types";
import { hasScope } from "@webiny/api-security";
import {
    emptyResolver,
    resolveCreate,
    resolveDelete,
    resolveGet,
    resolveList,
    resolveUpdate
} from "@webiny/commodo-graphql";

const productoFetcher = ctx => ctx.models.Producto;

/**
 * As the name itself suggests, the "graphql-schema" plugin enables us to define our service's GraphQL schema.
 * Use the "schema" and "resolvers" properties to define GraphQL types and resolvers, respectively.
 * Resolvers can be made from scratch, but to make it a bit easier, we rely on a couple of built-in generic
 * resolvers, imported from the "@webiny/commodo-graphql" package.
 *
 * @see https://docs.webiny.com/docs/api-development/graphql
 */
const plugin: GraphQLSchemaPlugin = {
    type: "graphql-schema",
    name: "graphql-schema-productos",
    schema: {
        typeDefs: gql`
            type ProductoDeleteResponse {
                data: Boolean
                error: ProductoError
            }

            type ProductoCursors {
                next: String
                previous: String
            }

            type ProductoListMeta {
                cursors: ProductoCursors
                hasNextPage: Boolean
                hasPreviousPage: Boolean
                totalCount: Int
            }

            type ProductoError {
                code: String
                message: String
                data: JSON
            }

            type Producto {
                id: ID
                nombre: String
                detalle: String
                categoria: String
                tags: String
                img:String
                destacado:Boolean
                publicado:Boolean
                createdOn: DateTime
            }

            input ProductoInput {
                
                id: ID
                nombre: String!
                detalle: String
                tags: String
                img:String
                destacado:Boolean
                publicado:Boolean
                categoria: String
                
               
            }

            input ProductoListWhere {
                nombre: String
                categoria: String
                destacado:Boolean
                publicado:Boolean
                

               
            }

            input ProductoListSort {
                nombre: Int
                createdOn: Int
            }

            type ProductoResponse {
                data: Producto
                error: ProductoError
            }

            type ProductoListResponse {
                data: [Producto]
                meta: ProductoListMeta
                error: ProductoError
            }

            type ProductoQuery {
                getProducto(id: ID): ProductoResponse

                listProductos(
                    where: ProductoListWhere
                    sort: ProductoListSort
                    limit: Int
                    after: String
                    before: String
                ): ProductoListResponse
            }

            type ProductoMutation {
                createProducto(data: ProductoInput!): ProductoResponse

                updateProducto(id: ID!, data: ProductoInput!): ProductoResponse

                deleteProducto(id: ID!): ProductoDeleteResponse
            }

            extend type Query {
                productos: ProductoQuery
            }

            extend type Mutation {
                productos: ProductoMutation
            }
        `,
        resolvers: {
            Query: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                productos: emptyResolver
            },
            Mutation: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                productos: emptyResolver
            },
            ProductoQuery: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                getProducto: hasScope("productos:get")(resolveGet(productoFetcher)),
                listProductos: hasScope("productos:list")(resolveList(productoFetcher))
            },
            ProductoMutation: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                createProducto: hasScope("productos:create")(resolveCreate(productoFetcher)),
                updateProducto: hasScope("productos:update")(resolveUpdate(productoFetcher)),
                deleteProducto: hasScope("productos:delete")(resolveDelete(productoFetcher))
            }
        }
    }
};

export default plugin;
