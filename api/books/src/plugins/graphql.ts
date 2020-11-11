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

const bookFetcher = ctx => ctx.models.Book;

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
    name: "graphql-schema-books",
    schema: {
        typeDefs: gql`
            type BookDeleteResponse {
                data: Boolean
                error: BookError
            }

            type BookCursors {
                next: String
                previous: String
            }

            type BookListMeta {
                cursors: BookCursors
                hasNextPage: Boolean
                hasPreviousPage: Boolean
                totalCount: Int
            }

            type BookError {
                code: String
                message: String
                data: JSON
            }

            type Book {
                id: ID
                title: String
                description: String
                isNice: Boolean
                createdOn: DateTime
            }

            input BookInput {
                id: ID
                title: String!
                description: String
                isNice: Boolean
            }

            input BookListWhere {
                title: String
                isNice: Boolean
            }

            input BookListSort {
                title: Int
                isNice: Boolean
                createdOn: Int
            }

            type BookResponse {
                data: Book
                error: BookError
            }

            type BookListResponse {
                data: [Book]
                meta: BookListMeta
                error: BookError
            }

            type BookQuery {
                getBook(id: ID): BookResponse

                listBooks(
                    where: BookListWhere
                    sort: BookListSort
                    limit: Int
                    after: String
                    before: String
                ): BookListResponse
            }

            type BookMutation {
                createBook(data: BookInput!): BookResponse

                updateBook(id: ID!, data: BookInput!): BookResponse

                deleteBook(id: ID!): BookDeleteResponse
            }

            extend type Query {
                books: BookQuery
            }

            extend type Mutation {
                books: BookMutation
            }
        `,
        resolvers: {
            Query: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                books: emptyResolver
            },
            Mutation: {
                // Needs to be here, otherwise the resolvers below cannot return any result.
                books: emptyResolver
            },
            BookQuery: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                getBook: hasScope("books:get")(resolveGet(bookFetcher)),
                listBooks: hasScope("books:list")(resolveList(bookFetcher))
            },
            BookMutation: {
                // With the generic resolvers, we also rely on the "hasScope" helper function from the
                // "@webiny/api-security" package, in order to define the required security scopes (permissions).
                createBook: hasScope("books:create")(resolveCreate(bookFetcher)),
                updateBook: hasScope("books:update")(resolveUpdate(bookFetcher)),
                deleteBook: hasScope("books:delete")(resolveDelete(bookFetcher))
            }
        }
    }
};

export default plugin;
