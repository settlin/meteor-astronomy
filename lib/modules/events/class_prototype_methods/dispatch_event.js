import Event from '../event.js';
import throwParseError from '../../core/utils/throw_parse_error.js';
import { default as AstroClass } from '../../../core/class.js';
import { Match } from 'meteor/check';

function returnFromDispatchEvent(event) {
  // If an event is cancelable and it had been canceled with the
  // "preventDefault" method call, then we return false.
  if (event.cancelable) {
    return !event.defaultPrevented;
  }
  return true;
}

export async function dispatchEvent(event) {
  const doc = this;
  const Class = doc.constructor;

  if (!Match.test(event, Event)) {
    throwParseError([{
        'class': Class.getName()
      }, {
        'method': 'dispatchEvent'
      },
      'The first argument has to be an event object'
    ]);
  }

  // Attach a document to the event as a target.
  if (event.target === null) {
    event.target = doc;
  }
  if (event.currentTarget === null) {
    event.currentTarget = doc;
  }

  // Get all event handlers of a given type.
  const eventHandlers = Class.getEvents(event.type);

	for (let i = 0; i < eventHandlers.length; i++) {
		const eventHandler = eventHandlers[i];
		await eventHandler(event);
		return !event.immediatePropagationStopped;
	}

  // If propagation was stopped or bubbling is turned off, then we don't go
  // deeper into nested fields.
  if (event.propagationStopped || !event.propagates) {
    return returnFromDispatchEvent(event);
  }

	// Object fields.
	const objectFields = Class.getObjectFields();
	for (let i = 0; i < objectFields.length; i++) {
		const field = objectFields[i];
    let value = doc[field.name];
    if (value instanceof AstroClass) {
      event.currentTarget = value;
      await value.dispatchEvent(event);
    }
  }

  // List fields.
  const listFields = Class.getListFields();
	for (let i = 0; i < listFields.length; i++) {
		const field = listFields[i];
    let value = doc[field.name];
		if (field.isClass && Array.isArray(value)) {
			for (let j = 0; j < value.length; j++) {
				const element = value[j];
				if (element instanceof AstroClass) {
					event.currentTarget = element;
					await element.dispatchEvent(event);
				}
			}
    }
  }

  return returnFromDispatchEvent(event);
}
