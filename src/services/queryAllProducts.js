import { gql } from "@apollo/client";
import { Client } from "./apolloClientService";

export default async function queryAllProducts(){
    const response = await Client.query({
        query: gql`
        query{
          category{
          name
          products{
            id
            attributes{
              id
              name
              type
              items{
                displayValue
                id
                value
              }
            }
            inStock
            prices{
              currency{
                label
                symbol
              } 
              amount
            }
            name
            brand
            description
            gallery
            category
          }
        }}
      `
    })
    return response
}