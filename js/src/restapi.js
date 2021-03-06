// Api.js
import axios from "axios";

let is_anonymous = true
let api_url
let axiosAPI

const bookmarkurl = "@bookmark"
const bookmarksurl = "@bookmarks"

function fetch_ploneinfo() {
    is_anonymous = document.querySelector("body.userrole-authenticated") === null
    api_url = document.getElementsByTagName('body')[0].dataset["portalUrl"]
    axiosAPI = axios.create({
        baseURL : api_url,
        headers: {'Accept': 'application/json'}
    });
}

if (document.readyState !== 'loading') {
    fetch_ploneinfo()
} else {
    document.addEventListener("DOMContentLoaded", fetch_ploneinfo)
}

// implement a method to execute all the request from here.
const apiRequest = (method, url, request, headers) => {
    if (is_anonymous) {
        return Promise.reject(new Error("Anonymous user"))
    }
    //using the axios instance to perform the request that received from each http method
    let requestdata = {
        method: method,
        url: url,
        headers: headers
    }
    if (method == 'get') {
        requestdata.params = request
    } else {
        requestdata.data = request
    }
    return axiosAPI(requestdata).then(res => {
        return Promise.resolve(res.data);
      })
      .catch(err => {
          if (error.response.status != 404) {
            console.error(err)
          }
        return Promise.reject(err)
      });
};

// function to execute the http get request
const get = (url, request) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url, request) =>  apiRequest("delete", url, request);

// function to execute the http post request
const post = (url, request) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url, request) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url, request) =>  apiRequest("patch", url, request);

// the Plone Bookmarks API
// add new bookmark
export const create = (record) => put(bookmarkurl, record).catch(err => {})

// read existing bookmark
export const read = (uid, group) => {
    get(bookmarkurl, {"uid": uid, "group": group})
    .catch(err => {
        // pass
    })
}

// update existing bookmark
export const update = (record) => post(bookmarkurl, record).catch(err => {})


// delete existing bookmark
export const del = (record) => deleteRequest(bookmarkurl, record).catch(err => {})

// list bookmarks
export const list = () => get(bookmarksurl).catch(err => {})

