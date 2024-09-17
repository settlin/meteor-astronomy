import Event from "../../events/event.js";

async function triggerAfterRemove(args) {
  const { doc, simulation, trusted } = args;
  // Trigger the "afterRemove" event handlers.
  await doc.dispatchEvent(
    new Event("afterRemove", {
      propagates: true,
      doc,
      simulation,
      trusted
    })
  );
}

export default triggerAfterRemove;
