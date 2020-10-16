import { bookmarkstore } from "./store.js"
import { STORAGEKEY } from "./settings.js"
import { CRUDL } from "./restapi.js"

let data = new Map()
let _initialized = false

const unsubscribe = bookmarkstore.subscribe(changeddata => {
    if (_initialized) {
        let objectified = {}
        data.forEach((value, key) => {
            objectified[key] = value
        })
        let stringified = JSON.stringify(objectified)
        localStorage.setItem(STORAGEKEY, stringified)
        // write to backend
    }
});

if (localStorage.getItem(STORAGEKEY)) {
    // read stored
    for (const [uid, bookmark] of Object.entries(JSON.parse(localStorage.getItem(STORAGEKEY)))) {
        data.set(uid, bookmark)
    }
}

_initialized = true

export function mark(uid, group="default", payload={}) {
    if (!data.get(uid)) {
        bookmarkstore.update(
            function (bm) {
                let record = {
                    'uid': uid,
                    'created': Math.floor((new Date()).getTime() / 1000), // timestamp in seconds
                    'group': group,
                    'payload': payload,
                }
                CRUDL.update(record)
                data.set(uid, record)
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

export function bookmarks(filter) {
    // all bookmarks or filtered by function
    let result = new Map()
    data.forEach((value, key) => {
        if (filter(uid, value)) {
            data.set(key, value)
        }
    })
    return result
}
