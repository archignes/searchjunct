# Searchjunct


## Overview

Searchjunct is an application designed to facilitate multi-engine search selection and routing. This tool serves as a speculative or exploratory design prototype, providing a platform for wondering, particularly around user interaction with multiple search engines and finding & supporting better tools and practices.

## Features
- **Multi-Engine Search Selection:** Enables queries through multiple search engines based on user selection.
- **Client-Side Operation:** All functionalities, including search logging (if opted by the user), operate on the client side to support user privacy.
- **(Under Construction) Manual and Automatic Routing:** Users can manually select desired search engines or rely on automatic routing based on weighted preferences.
- **(Under Construction) Search Logging (Optional):** Optional feature allowing users to store their search history locally, within their browser.
- **Default Search Engine Setup:** Supports users to set Searchjunct as their default search engine.

## Roadmap
The following is a high-level roadmap for the development of Searchjunct. Specific features and improvements will be detailed through GitHub issues and milestones.

1. **Phase 1: Initial Development**
   - Setup basic SPA infrastructure.
   - Implement core search routing functionalities.
      - _Not yet started._
   - Integrate initial set of search engines.

2. **Phase 2: Privacy and Storage Features**
   - Develop optional search logging feature, with clear user consent protocols.
      - _Started._
   - Implement user settings page for managing search preferences and data.

3. **Phase 3: Routing Enhancements and Customization**
   - Introduce manual and automatic routing based on user preferences.
   - Expand customization options within the settings page.

4. **Phase 4: Default Search Engine Integration**
   - Develop and document the method for users to set Searchjunct as their default browser search engine.
      - _Supported, need to document._

5. **Phase 5: Feedback and Refinement**
   - Collect user feedback and make necessary adjustments.
   - Enhance UI/UX based on user interactions and suggestions.



## Running Locally

`npm run dev` or `npm run build`

Note: To run without an open terminal window try:

```zsh
searchjunct % pm2 start "npm run dev" --name searchjunct
```

See https://www.npmjs.com/package/pm2 for `pm2 list`, `pm2 stop`, `pm2 restart`, and `pm2 delete`.

### Testing

```
npm run test
```

```
p -m pytest selenium_scripts/test_checks.py
```

OR 

```
p -m pytest selenium_scripts/test_checks.py --html=report.html -n 4
```

## Contributing
Contributions are welcome. Please see the issues on the [GitHub](#) for areas where you can help. For new features or bug reports, create a new issue so we can track and discuss it.

## See also

### Somewhat Similar Projects

- https://github.com/danielsgriffin/qrs
- https://comparethesearchengines.com/
- https://searchaggregate.com/
- https://justsearchportal.com/
    - https://github.com/larspontoppidan/just-search-portal
- https://www.gnod.com/search/
- https://meta.softwarejourney.net/
- https://randsearch.daniel.priv.no/
- https://www.letssearch.org/
- https://searx.github.io/searx/
    - No longer maintained: https://github.com/searx/searx

Note: This is _not_ intended to be a [metasearch engine](https://en.wikipedia.org/wiki/Metasearch_engine) or search aggregator so much as a search router, a guide to exploring new search tools, and a support for diversifying your search sources.

## Change Notes

**2024-03-13**: Significant refactor from plain HTML, Bootstrap CSSs, and JavaScript to NextJS, React, Typescript, and Tailwind CSS. This temporarily removed the search logging and search history features. This is also the first version live online, the prior version was only provided for local setup.

## Contact
For inquiries or collaboration, please contact Daniel Griffin at [danielsgriffin@berkeley.edu](mailto:danielsgriffin@berkeley.edu).