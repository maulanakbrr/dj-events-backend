'use strict';

/**
 *  event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // Create event with linked user
  async create(ctx) {
    const {id} = ctx.state.user; //ctx.state.user contains the current authenticated user
    const response = await super.create(ctx);
    const updatedResponse = await strapi.entityService
      .update('api::event.event', response.data.id, {data: {user: id}})
    return updatedResponse;
  },

  // Update 
  async update(ctx) {
    var { id } = ctx.state.user
    var [event] = await strapi.entityService
        .findMany('api::event.event', {
            filters: {
                id: ctx.request.params.id,
                user: id
            }
        })
    if (event) {
        const response = await super.update(ctx);
        return response;
    } else {
        return ctx.unauthorized();
    }
  },

  // Delete event with linked user
  async delete(ctx) {
      var { id } = ctx.state.user
      var [event] = await strapi.entityService
          .findMany('api::event.event', {
              filters: {
                  id: ctx.request.params.id,
                  user: id
              }
          })
      if (event) {
          const response = await super.delete(ctx);
          return response;
      } else {
          return ctx.unauthorized();
      }
  },
  
  // Get logged in users
  async me(ctx) {
    console.log('CTX: ', ctx.state)
    const user = ctx.state.user;
 
    if (!user) {
      return ctx.badRequest(null, [
        { message: "No authorization header was found" },
      ]);
    }
 
    const data = await strapi.db.query("api::event.event").findMany({
      where: {
        user: { id: user.id },
      },
      populate: { user: true, image: true },
    });
    if (!data) {
      return ctx.notFound();
    }
 
    const res = await this.sanitizeOutput(data, ctx);
    return res;
  },
}));

