Changelog
=========


1.2 (unreleased)
----------------

- Nothing changed yet.


1.1 (2023-03-06)
----------------

- Return 204 if content is not bookmarked instead of raising NotFound.
  [ksuess]


1.1a1 (2021-03-05)
------------------

- unique identifier changed to (uid, owner, group, queryparams), was before (uid, owner, group). Allows to bookmark searchquery urls.
  [ksuess]
- BREAKING: 'created' in format like plone.restapi does: 
  from plone.restapi.serializer.converters import json_compatible
  [ksuess]
- Convert to custom element
  Various extensions / optimizations
  [jensens]

1.0a1 (unreleased)
------------------

- Initial release.
  [jensens]
