// const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
// function checkBadRequest(contextBody) {
//   if (_.get(contextBody, "statusCode", 200) !== 200) {
//     const message = _.get(contextBody, "error", "Bad Request");
//     const exception = new Error(message);
//     exception.code = _.get(contextBody, "statusCode", 400);
//     exception.data = contextBody;
//     throw exception;
//   }
// }

module.exports = {
  definition: /* GraphQL */ `
    # type UsersPermissionsRefreshTokenPayload {
    #   jwt: String!
    #   refresh: String
    # }
    # type UsersPermissionsRevokeTokenPayload {
    #   confirmed: Boolean
    # }
    type UsersPermissionsLogoutPayload {
      authorized: Boolean
      message: String
    }
  `,
  mutation: /* GraphQL */ `
#   refreshToken(token: String!, renew: Boolean): UsersPermissionsRefreshTokenPayload!
#   revokeToken(token: String!): UsersPermissionsRevokeTokenPayload!
  logout: UsersPermissionsLogoutPayload!
`,
  resolver: {
    Mutation: {
      logout: {
        description: "logout user",
        resolver: "plugins::users-permissions.auth.logout", // <- resolver is found in Auth.js backend
      },

      //   refreshToken: {
      //     description: "Refresh JWT Token",
      //     resolverOf: "plugins::users-permissions.auth.refreshToken",
      //     resolver: async (obj, options, { context }) => {
      //       context.query = _.toPlainObject(options);
      //       await strapi.plugins[
      //         "users-permissions"
      //       ].controllers.auth.refreshToken(context);
      //       let output = context.body.toJSON
      //         ? context.body.toJSON()
      //         : context.body;
      //       checkBadRequest(output);
      //       return output;
      //     },
      //   },
      //   revokeToken: {
      //     description: "Revoke Refresh Token",
      //     resolverOf: "plugins::users-permissions.auth.revoke",
      //     resolver: async (obj, options, { context }) => {
      //       context.query = _.toPlainObject(options);
      //       await strapi.plugins["users-permissions"].controllers.auth.revoke(
      //         context
      //       );
      //       let output = context.body.toJSON
      //         ? context.body.toJSON()
      //         : context.body;
      //       checkBadRequest(output);
      //       return output;
      //     },
      //   },
    },
  },
};
