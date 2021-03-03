export function mustBeString (arg, messagePrefix = 'Argument') {
    if (typeof arg !== 'string') {
        throw new Error(`${messagePrefix} must be a string.`)
    }
}

export function mustBeArray (arg, messagePrefix = 'Argument') {
    if (!Array.isArray(arg)) {
        throw new Error(`${messagePrefix} must be an array.`)
    }
}

export function mustBeObject (arg, messagePrefix = 'Argument') {
    if (typeof arg !== 'object' || Array.isArray(arg)) {
        throw new Error(`${messagePrefix} must be an object.`)
    }
}

export function mustBeStringOrArray (arg, messagePrefix = 'Argument') {
    let isString = true
    try {
        mustBeString(arg)
    } catch (err) {
        isString = false
    }
    if (isString) { return }
    try {
        mustBeArray(arg)
    } catch (err) {
        throw new Error(`${messagePrefix} must be an array or a string.`)
    }
}

export function mustNotBeBlank (arg, messagePrefix = 'Argument') {
    let isNotBlank = false
    if (typeof arg === 'string') {
        isNotBlank = arg.trim().length > 0
    } else if (Array.isArray(arg)) {
        isNotBlank = arg.length > 0
    } else if (typeof arg === 'object') {
        isNotBlank = Object.keys(arg).length > 0
    } else {
        isNotBlank = !!arg
    }
    if (!isNotBlank) {
        throw new Error(`${messagePrefix} cannot be blank.`)
    }
}

export function validateName (member = '', collection = [], type = 'App') {
    let messagePrefix = `${type} name`
    mustBeString(member.name, messagePrefix)
    let sameNameMembers = collection.filter((m) => {
        return m.name === member.name
    })
    if (sameNameMembers.length > 1) {
        throw new Error(`${messagePrefix} ${member.name} is conflicted!`)
    }
}
