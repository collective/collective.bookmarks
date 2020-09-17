import { bookmarks } from "./store.js"
import { STORAGEKEY, ANONUSER } from "./settings.js"

let data = new Map()
let userid = ANONUSER
let _initialized = false

const unsubscribe = bookmarks.subscribe(changeddata => {
    if (_initialized) {
        let objectified = {}
        data.forEach((value, key) => {
            objectified[key] = value
        })
        let stringified = JSON.stringify(objectified)
        localStorage.setItem(STORAGEKEY, stringified)
        if (userid != ANONUSER) {
            // write to backend
        }
    }
});

// initialize from localStorage
if (localStorage.getItem(STORAGEKEY)) {
    // read stored
    for (const [uid, bookmark] of Object.entries(JSON.parse(localStorage.getItem(STORAGEKEY)))) {
        data.set(uid, bookmark)
    }
}
if (userid != ANONUSER) {
    // TODO -> API request to backend
    // merge backend and frontend bookmarks!
}
_initialized = true

export function mark(uid, group="default", payload={}) {
    if (!data.get(uid)) {
        bookmarks.update(
            function (bm) {
                data.set(uid, {
                    'created': Math.floor((new Date()).getTime() / 1000), // timestamp in seconds
                    'group': group,
                    'payload': payload,
                    'owner': userid
                })
                return data
            }
        )
    }
}

export function unmark(uid) {
    if (data.has(uid)) {
        data.delete(uid)
    }
}

export function marked(uid) {
    return data.has(uid)
}

export function info(uid) {
    return {...(data.get(uid))}
}
