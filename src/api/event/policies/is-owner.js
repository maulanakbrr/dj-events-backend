'use strict';
/**
 * `is-owner` policy.
 */

module.exports = async (policyCtx, config, {strapi}) => {
  // get user id/record to update/delete.
  const {id : userId} = policyCtx.state.user;

  const {id : eventId} = policyCtx.request.params;

  strapi.log.info(`In is-owner policia. ${userId} and ${eventId}`);

  const [event] = await strapi.entityService
      .findMany('api::event.event', {
        filters: {
          id: eventId,
          user: userId
        }
      })

  // we have an event owned by the authenticated user
  if (event) {
    return true;
  }

  // we don't have an event owned by the user.
  return false;

};