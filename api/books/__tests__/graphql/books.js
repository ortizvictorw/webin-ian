// We use these fields in every query / mutation below.
const ERROR_FIELDS = /* GraphQL */ `
    {
        code
        message
        data
    }
`;

// A basic create "Book" mutation.
export const CREATE_BOOK = /* GraphQL */ `
    mutation CreateBook($data: BookInput!) {
        books {
            createBook(data: $data) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}
            }
        }
    }
`;

// A basic list "Books" query.
export const LIST_BOOKS = /* GraphQL */ `
    query ListBooks(
        $where: BookListWhere
        $sort: BookListSort
        $limit: Int
        $after: String
        $before: String
    ) {
        books {
            listBooks(where: $where, sort: $sort, limit: $limit, after: $after, before: $before) {
                data {
                    id
                    title
                    description
                    isNice
                }
                error ${ERROR_FIELDS}

            }
        }
    }
`;
