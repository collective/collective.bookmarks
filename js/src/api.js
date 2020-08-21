import { bookmarks } from "./store.js"
import { STORAGEKEY, ANONUSER } from "./settings.js"

let bookmarks_value
let userid = ANONUSER
let _initialized = false

const unsubscribe = bookmarks.subscribe(value => {
    bookmarks_value = value;
    if (_initialized) {
        localStorage.setItem(STORAGEKEY, JSON.stringify(value));
        if (userid != ANONUSER) {
            // write to backend
        }
    }
});

// initialize from localStorage
if (localStorage.getItem(STORAGEKEY)) {
    // read stored
    bookmarks.update(function (b) {
        return JSON.parse(localStorage.getItem(STORAGEKEY))
    })
}
if (userid != ANONUSER) {
    // TODO -> API request to backend
    // merge backend and frontend bookmarks!
}
_initialized = true

export function mark(uid, group="default") {
    if (!bookmarks_value[group]) {
        bookmarks_value[group] = []
    }
    if (!bookmarks_value[group].includes(uid)) {
        bookmarks.update(
            function (b) {
                b[group].push(uid)
                return b
            }
        )
    }
}

export function unmark(uid) {
    for (const [group, bookmarklist] of Object.entries(bookmarks_value)) {
        if (bookmarklist.includes(uid)) {
            bookmarks.update(
                function (b) {
                    b[group] = bookmarklist.filter(item => item !== uid)
                    return b
                }
            )
        }
    }
}

export function marked(uid) {
    for (const [group, bookmarklist] of Object.entries(bookmarks_value)) {
        if (bookmarklist.includes(uid)) {
            return true
        }
    }
    return false
}
