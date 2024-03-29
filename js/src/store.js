import { writable } from "svelte/store";
import { STORAGEKEY } from "./settings.js"
import { create, list, del } from "./restapi.js";

const store = writable(new Map())

store.add = (uid, group, payload) => {
  store.update(storage => {
    let record = {
      'uid': uid,
      'created': Math.floor((new Date()).getTime() / 1000), // timestamp in seconds
      'group': group,
      'payload': payload,
    }
    storage.set(uid+group, record)
    create(record)
    let event = new
    Event('collective.bookmarks.added.bookmark')
    document.dispatchEvent(event)
    return storage
  })
}
store.delete = (uid, group) => {
  store.update(storage => {
    del(storage.get(uid+group))
    storage.delete(uid+group)
    let event = new
    Event('collective.bookmarks.removed.bookmark')
    document.dispatchEvent(event)
    return storage
  })
}

// init from localstorage
if (localStorage.getItem(STORAGEKEY)) {
  // read stored
  console.log('Object.entries(JSON.parse(localStorage.getItem(STORAGEKEY)))', Object.entries(JSON.parse(localStorage.getItem(STORAGEKEY))));
  for (const [key, bookmark] of Object.entries(JSON.parse(localStorage.getItem(STORAGEKEY)))) {
    store.update(storage => {
      storage.set(key, bookmark)
      return storage
    })
  }
}
// INIT from restapi
document.addEventListener("DOMContentLoaded", () => {
  list()
  .then(datalist => {
    datalist.forEach((serverdata) => {
      store.update(storage => {
        const key = serverdata['uid']+serverdata['group']
        const localdata = storage.get(key)
        if (!localdata || (localdata['created'] < serverdata['created'])) {
          let record = {
            'uid': serverdata['uid'],
            'created': serverdata['created'],
            'group': serverdata['group'],
            'payload': serverdata['payload'],
          }
          storage.set(key, record)
        }
        return storage
      })
    })
  })
  .catch(err => {})
})

const unsubscribe_localstorage = store.subscribe(storage => {
  // write changes to localstorage
  let objectified = {}
  storage.forEach((value, key) => {
    objectified[key] = value
  })
  let stringified = JSON.stringify(objectified)
  localStorage.setItem(STORAGEKEY, stringified)
});

export default store
