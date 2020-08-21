var collectivebookmarks = (function (exports) {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const bookmarks = writable({});

    const STORAGEKEY = "collective.bookmarks";

    let bookmarks_value;
    let _initialized = false;

    const unsubscribe = bookmarks.subscribe(value => {
        bookmarks_value = value;
        if (_initialized) {
            localStorage.setItem(STORAGEKEY, JSON.stringify(value));
        }
    });

    // initialize from localStorage
    if (localStorage.getItem(STORAGEKEY)) {
        // read stored
        bookmarks.update(function (b) {
            return JSON.parse(localStorage.getItem(STORAGEKEY))
        });
    }
    _initialized = true;

    function mark(uid, group="default") {
        if (!bookmarks_value[group]) {
            bookmarks_value[group] = [];
        }
        if (!bookmarks_value[group].includes(uid)) {
            bookmarks.update(
                function (b) {
                    b[group].push(uid);
                    return b
                }
            );
        }
    }

    function unmark(uid) {
        for (const [group, bookmarklist] of Object.entries(bookmarks_value)) {
            if (bookmarklist.includes(uid)) {
                bookmarks.update(
                    function (b) {
                        b[group] = bookmarklist.filter(item => item !== uid);
                        return b
                    }
                );
            }
        }
    }

    function marked(uid) {
        for (const [group, bookmarklist] of Object.entries(bookmarks_value)) {
            if (bookmarklist.includes(uid)) {
                return true
            }
        }
        return false
    }

    /* src/Bookmark.svelte generated by Svelte v3.24.1 */

    function create_else_block(ctx) {
    	let html_tag;
    	let html_anchor;

    	return {
    		c() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m(target, anchor) {
    			html_tag.m(/*textunmarked*/ ctx[1], target, anchor);
    			insert(target, html_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*textunmarked*/ 2) html_tag.p(/*textunmarked*/ ctx[1]);
    		},
    		d(detaching) {
    			if (detaching) detach(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};
    }

    // (26:4) {#if is_marked}
    function create_if_block(ctx) {
    	let html_tag;
    	let html_anchor;

    	return {
    		c() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m(target, anchor) {
    			html_tag.m(/*textmarked*/ ctx[0], target, anchor);
    			insert(target, html_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*textmarked*/ 1) html_tag.p(/*textmarked*/ ctx[0]);
    		},
    		d(detaching) {
    			if (detaching) detach(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};
    }

    function create_fragment(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*is_marked*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			span = element("span");
    			if_block.c();
    			attr(span, "class", "collectivebookmarks marker svelte-ll4xj3");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			if_block.m(span, null);

    			if (!mounted) {
    				dispose = listen(span, "click", /*toggle*/ ctx[3]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(span);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { uid } = $$props;
    	let { textmarked } = $$props;
    	let { textunmarked } = $$props;
    	let is_marked = marked(uid);

    	function toggle() {
    		if (marked(uid)) {
    			unmark(uid);
    		} else {
    			mark(uid);
    		}

    		$$invalidate(2, is_marked = marked(uid));
    	}

    	$$self.$$set = $$props => {
    		if ("uid" in $$props) $$invalidate(4, uid = $$props.uid);
    		if ("textmarked" in $$props) $$invalidate(0, textmarked = $$props.textmarked);
    		if ("textunmarked" in $$props) $$invalidate(1, textunmarked = $$props.textunmarked);
    	};

    	return [textmarked, textunmarked, is_marked, toggle, uid];
    }

    class Bookmark extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { uid: 4, textmarked: 0, textunmarked: 1 });
    	}
    }

    function bindOnElement(element, uid, textmarked="&#9733;", textunmarked="&#9734;") {
        const bookmark = new Bookmark({
            target: element,
            props: {
                'uid': uid,
                'textmarked': textmarked,
                'textunmarked': textunmarked,
            }
        });
    }

    function bindByClass(markerClass, uidkey) {
        for (const element of document.getElementsByClassName(markerClass)) {
            bindOnElement(element, element.dataset[uidkey]);
        }
    }

    exports.bindByClass = bindByClass;
    exports.bindOnElement = bindOnElement;

    return exports;

}({}));
//# sourceMappingURL=collective.bookmarks.js.map
