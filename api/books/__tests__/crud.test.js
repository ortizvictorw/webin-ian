import useGqlHandler from "./useGqlHandler";
import { CREATE_BOOK, LIST_BOOKS } from "./graphql/books";

/**
 * This is a simple test that asserts basic CRUD operations work as expected.
 * Feel free to update this test according to changes you made in the actual code.
 *
 * @see https://docs.webiny.com/docs/api-development/introduction
 */
describe("CRUD Test", () => {
    const { invoke } = useGqlHandler();

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Let's create a couple of books.
        let [book1] = await invoke({
            body: {
                query: CREATE_BOOK,
                variables: {
                    data: {
                        title: "Book 1",
                        description: "This is my 1st book.",
                        isNice: false
                    }
                }
            }
        });

        let [book2] = await invoke({
            body: {
                query: CREATE_BOOK,
                variables: {
                    data: { title: "Book 2", description: "This is my 2nd book." }
                }
            }
        });

        let [book3] = await invoke({
            body: {
                query: CREATE_BOOK,
                variables: {
                    data: { title: "Book 3", isNice: true }
                }
            }
        });

        // 2. Now that we have books created, let's see if they come up in a basic listBooks query.
        let [booksList] = await invoke({
            body: {
                query: LIST_BOOKS
            }
        });

        expect(booksList).toEqual({
            data: {
                books: {
                    listBooks: {
                        data: [
                            {
                                id: book3.data.books.createBook.data.id,
                                title: "Book 3",
                                description: null,
                                isNice: true
                            },
                            {
                                id: book2.data.books.createBook.data.id,
                                title: "Book 2",
                                description: "This is my 2nd book.",
                                isNice: true
                            },
                            {
                                id: book1.data.books.createBook.data.id,
                                title: "Book 1",
                                description: "This is my 1st book.",
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
                query: CREATE_BOOK,
                variables: {
                    data: { description: "This is my 1st book.", isNice: false }
                }
            }
        });

        let [error] = body.errors;
        expect(error.message).toBe(
            'Variable "$data" got invalid value { description: "This is my 1st book.", isNice: false }; Field title of required type String! was not provided.'
        );

        // Even though the title is provided, it is still too short (because of the validation
        // set on the "Book" Commodo model).
        [body] = await invoke({
            body: {
                query: CREATE_BOOK,
                variables: {
                    data: { title: "Aa", description: "This is my 1st book.", isNice: false }
                }
            }
        });

        expect(body).toEqual({
            data: {
                books: {
                    createBook: {
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
