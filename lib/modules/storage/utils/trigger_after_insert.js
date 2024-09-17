import Event from "../../events/event.js";

async function triggerAfterInsert(args) {
  const { doc, stopOnFirstError, fields, simulation, trusted } = args;
  // Trigger the "afterInsert" event handlers.
  await doc.dispatchEvent(
    new Event("afterInsert", {
      propagates: true,
      doc,
      stopOnFirstError,
      fields,
      simulation,
      trusted
    })
  );
}

export default triggerAfterInsert;
