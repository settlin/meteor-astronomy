import Event from "../../events/event.js";
import {Meteor} from 'meteor/meteor';

async function triggerBeforeRemove(args) {
  const { doc, simulation, trusted } = args;
  // Trigger the "beforeRemove" event handlers.
  if (
    !await doc.dispatchEvent(
      new Event("beforeRemove", {
        cancelable: true,
        propagates: true,
        doc,
        simulation,
        trusted
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeRemove"
    });
  }
}

export default triggerBeforeRemove;
