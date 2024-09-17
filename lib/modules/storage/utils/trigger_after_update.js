import Event from "../../events/event.js";

async function triggerAfterUpdate(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "afterUpdate" event handlers.
  await doc.dispatchEvent(
    new Event("afterUpdate", {
      propagates: true,
      doc,
      stopOnFirstError,
      fields,
      simulation,
      forceUpdate,
      trusted,
      oldDoc
    })
  );
}

export default triggerAfterUpdate;
