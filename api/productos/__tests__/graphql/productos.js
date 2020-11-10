// We use these fields in every query / mutation below.
const ERROR_FIELDS = /* GraphQL */ `
    {
        code
        message
        data
    }
`;

// A basic create "Producto" mutation.
export const CREATE_PRODUCTO = /* GraphQL */ `
    mutation CreateProducto($data: ProductoInput!) {
        productos {
            createProducto(data: $data) {
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

// A basic list "Productos" query.
export const LIST_PRODUCTOS = /* GraphQL */ `
    query ListProductos(
        $where: ProductoListWhere
        $sort: ProductoListSort
        $limit: Int
        $after: String
        $before: String
    ) {
        productos {
            listProductos(where: $where, sort: $sort, limit: $limit, after: $after, before: $before) {
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
