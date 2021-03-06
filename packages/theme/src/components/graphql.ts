import gql from "graphql-tag";

export const getHeaderData = gql`
    query PbGetHeader {
        pageBuilder {
            getSettings {
                data {
                    name
                    logo {
                        src
                    }
                }
            }
        }
    }
`;

export const getBookData = gql`
    query PbGetHeader{
         books{
        listBooks{
          data{
            title
          }
        }
      }
      }
`;

export const getFooterData = gql`
    query PbGetSiteFooter {
        pageBuilder {
            getSettings {
                data {
                    social {
                        facebook
                        instagram
                        twitter
                    }
                    name
                    logo {
                        src
                    }
                }
            }
        }
    }
`;
