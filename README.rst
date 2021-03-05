.. This README is meant for consumption by humans and pypi. Pypi can render rst files so please do not use Sphinx features.
   If you want to learn more about writing documentation, please check out: http://docs.plone.org/about/documentation_styleguide.html
   This text does not appear on pypi or github. It is a comment.

====================
collective.bookmarks
====================


Bookmarks (aka favorites, wishlists) for Plone Classic.

The Plone pendent is `collective/volto-bookmarks <https://github.com/collective/volto-bookmarks>`_

Features
--------

- Stores bookmarks of
    - anonymous users in local storage.
    - authenticated users in user properties as JSON

- REST-API backend
- SvelteJS based frontend

Data Format
-----------

- list of bookmarks

- a bookmark is a JSON serializable (dict-like) with keys:
    - ``uid``: UID of content item
    - ``created``: date in ISO (like in plone.restapi)
    - ``group``: group name or empty string for *global* group
    - ``owner``: unique owner identifier (str)
    - ``queryparams``: String: Identifies bookmark together with uid, owner and group
    - ``payload``: arbitary dict with custom key-value data (optional)

RESTAPI
-------

Reads/stores into user-property as ``application/json``.

Endpoints:

``@bookmark`` - single bookmark
    - ``GET`` param uid-... (single)
    - ``POST`` creates new bookmark, body is JSON of one bookmark
    - ``PUT`` overrides bookmark, body is JSON of one bookmark
    - ``DELETE`` removes bookmark, body is JSON, list with exact one uid as string

``@bookmarks`` - list of bookmarks
    - ``GET`` by uids param ``?uid=...&uid=...``
    - ``GET`` by group params ``?group=...``
    - ``DELETE`` body is JSON, list of uids


Frontend
--------

Check ``@@bookmarks_sample`` for example usage
  - ``<bookmark-element>`` Bookmark action-button (enable/disable)
  - ``<bookmark-sum>`` Count of Bookmarks as possible personal action entry
  - ``<bookmark-list>`` List of Bookmarks of the user


Administration of catalog
-------------------------

Install Souper Plone add-on in controlpanel.


Installation
------------

Install collective.bookmarks by adding it to your buildout::

    [buildout]

    ...

    eggs =
        collective.bookmarks


and then running ``bin/buildout``


Contribute
----------

- Issue Tracker: https://github.com/collective/collective.bookmarks/issues
- Source Code: https://github.com/collective/collective.bookmarks


Support
-------

We'd be happy to see many forks and pull-requests to make this addon even better.

Maintainers are Jens Klein, Peter Holzer and the BlueDynamics Alliance developer team.
We appreciate any contribution and if a release is needed to be done on pypi, please just contact one of us.

We also offer commercial support if any training, coaching, integration or adaptions are needed.

License
-------

The project is licensed under the GPLv2.
