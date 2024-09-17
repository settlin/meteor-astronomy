import Event from "../../events/event.js";

async function triggerAfterSave(args) {
  const {
    doc,
    stopOnFirstError,
    fields,
    simulation,
    forceUpdate,
    trusted,
    oldDoc
  } = args;
  // Trigger the "afterSave" event handlers.
  await doc.dispatchEvent(
    new Event("afterSave", {
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

export default triggerAfterSave;
