import ApolloClient, { Operation } from "apollo-boost";

const client = new ApolloClient({
  clientState: {
    defaults: {
      auth: {
        __typename: "Auth",
       isLoggedIn: Boolean(localStorage.getItem("jwt")) 
      }
    },
    resolvers: {
      Mutation: {
        logUserIn: (_,{token},{cache}) => {
          localStorage.setItem("jwt",token);
          cache.writeData({
            data: {
              auth: {
                __typename: "Auth",
                isLoggedIn: true
              }
            }
          })
        },
        logUserOut: (_,__,{cache}) => {
          localStorage.removeItem("jwt");
          cache.writeData({
            data: {
              __typename: "Auth",
              isLoggedIn: false
            }
          });
          return null;
        }
      }
    }
  },
  request: async(operatioin: Operation) => {
    operatioin.setContext({
      headers:{
        "X-JWT" : localStorage.getItem("jwt") || ""
      }
    });
  },
  uri:"http://localhost:4000/graphql"
});

export default client;