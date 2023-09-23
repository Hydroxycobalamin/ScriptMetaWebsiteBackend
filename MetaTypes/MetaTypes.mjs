const multiLineFields = {
    "description": { multiline: true },
    "usage": { multiline: true },
    "events": { multiline: true },
    "example": { multiline: true },
    "switch": { multiline: true },
    "context": { multiline: true }
};

const validMetaObjects = [
    "task",
    "script",
    "procedure",
    "information",
    "event"
]

const eventFields = {
    requiredFields: ["events", "triggers"],
    optionalFields: ["warning", "group", "switch", "location", "player", "example", "script", "context", "cancellable"]
}

const scriptFields = {
    requiredFields: ["name", "description", "source"],
    optionalFields: ["warning", "group", "download"]
  };

const taskFields = {
    requiredFields: ["name", "input", "description", "source"],
    optionalFields: ["warning", "group", "script", "usage"]
  };

const procedureFields = {
    requiredFields: ["attribute", "returns", "description", "source"],
    optionalFields: ["warning", "group", "script", "example"]
};

const informationFields = {
    requiredFields: ["name", "description", "source"],
    optionalFields: ["warning", "group"]
};

const metaFields = {
    task: taskFields,
    script: scriptFields,
    information: informationFields,
    procedure: procedureFields,
    event: eventFields
}

export { multiLineFields, metaFields, validMetaObjects }