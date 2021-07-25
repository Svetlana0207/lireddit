import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import {
  dedupExchange,
  errorExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";

import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
 
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";
import gql from "graphql-tag";
import { isServer } from "./isServer";



export const createUrqlClient=(ssrExchange:any)=>({
    url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as any,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              ()=>({me:null})
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if(result.login.errors){
                  return query
                }else{
                  return{
                    me:result.login.user
                    }
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if(result.register.errors){
                  return query
                }else{
                  return{
                  me:result.register.user
                  }
                }
              }
            );
          },
        },
      },
    }),
    errorExchange({
      onError(error) {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
  })

function pipe(arg0: any, arg1: any) {
  throw new Error("Function not implemented.");
}


function tap(arg0: ({ error }: { error: any; }) => void): any {
  throw new Error("Function not implemented.");
}
