"use strict";

const _ = require("lodash");

module.exports = async (ctx, next) => {
  let role;

  if (ctx.state.user) {
    // request is already authenticated in a different way
    return next();
  }

  /* 
  Checks if the ctx.request and ctx.request.header are not undefined values, and then checks that ctx.request.header.authorization is undefined
  If all of the above comes back as true, we then pull the token from the cookie using the ctx.cookies.get() method and assign it to the token variable.
  If the token is not undefined, we modify ctx.request.header.authorization to act as a Bearer Token header to let the rest of the business logic know that we are an authenticated user.
*/

  //This is on every request
  // if (ctx.request && ctx.request.header && !ctx.request.header.authorization) {
  //   const refToken = ctx.cookies.get("refCookie");
  //   if (refToken) {
  //     // console.log(refToken);
  //     try {
  //       // Unpack refresh token
  //       const { tkv, iat, exp, sub } = await strapi.plugins[
  //         "users-permissions"
  //       ].services.jwt.verify(refToken);

  //       // Check if refresh token has expired
  //       if (Date.now() / 1000 > exp)
  //         return ctx.badRequest(null, "Expired refresh token");

  //       // fetch user based on subject
  //       const user = await strapi
  //         .query("user", "users-permissions")
  //         .findOne({ id: sub });

  //       // Check here if user token version is the same as in refresh token
  //       // This will ensure that the refresh token hasn't been made invalid by a password change or similar.
  //       if (tkv !== user.tokenVersion)
  //         return ctx.badRequest(null, "Refresh token is invalid");

  //       // Otherwise we are good to go.

  //       const accessToken = strapi.plugins[
  //         "users-permissions"
  //       ].services.jwt.issue(
  //         { id: user.id },
  //         {
  //           expiresIn: "30s",
  //         }
  //       );

  //       console.log(accessToken);

  //       // send accessToken jwt = accessToken
  //       ctx.request.header.authorization = "Bearer " + accessToken;
  //     } catch (e) {
  //       return ctx.badRequest(null, "Invalid token");
  //     }
  //   }
  // }

  if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
    try {
      // console.log("running line 28 permissions.js");
      // console.log("authorization header is present");
      // console.log(ctx.request.header.authorization);
      const { id } = await strapi.plugins[
        "users-permissions"
      ].services.jwt.getToken(ctx);

      if (id === undefined) {
        throw new Error("Invalid token: Token did not contain required fields");
      }

      // fetch authenticated user
      ctx.state.user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetchAuthenticatedUser(id);
    } catch (err) {
      return handleErrors(ctx, err, "unauthorized");
    }

    // console.log(ctx.state.user);

    if (!ctx.state.user) {
      return handleErrors(ctx, "User Not Found", "unauthorized");
    }

    role = ctx.state.user.role;

    if (role.type === "root") {
      return await next();
    }

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    if (
      _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
      !ctx.state.user.confirmed
    ) {
      return handleErrors(
        ctx,
        "Your account email is not confirmed.",
        "unauthorized"
      );
    }

    if (ctx.state.user.blocked) {
      return handleErrors(
        ctx,
        "Your account has been blocked by the administrator.",
        "unauthorized"
      );
    }
  }

  // Retrieve `public` role.
  if (!role) {
    role = await strapi
      .query("role", "users-permissions")
      .findOne({ type: "public" }, []);
  }

  const route = ctx.request.route;
  const permission = await strapi
    .query("permission", "users-permissions")
    .findOne(
      {
        role: role.id,
        type: route.plugin || "application",
        controller: route.controller,
        action: route.action,
        enabled: true,
      },
      []
    );

  if (!permission) {
    return handleErrors(ctx, undefined, "forbidden");
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins["users-permissions"].config.policies[
      permission.policy
    ](ctx, next);
  }

  // Execute the action.
  await next();
};

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
