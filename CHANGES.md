# Portfolio Changes

## Files Updated

- `index.html`
  - Updated the page title to `Andiswa Dlamini | AI Developer & Evaluator`.
  - Replaced the hero placeholder with `Andiswa Dlamini` and capitalized the complete tagline.
  - Standardized the four LinkedIn links to `https://linkedin.com/in/andiswa-dlamini-36652a330/`.
  - Corrected the footer year to 2026 and changed the wording to `All Rights Reserved`.
  - Replaced the SQL skill's C++ icon with a database icon; kept C++ and React listed.
  - Removed the duplicate `Api` skill entry because `API Integration` was already listed under Technical Skills.
  - Corrected the `Monthly revenue.png` path casing and added descriptive image text.
  - Replaced the externally hosted Roman Numeral Calculator thumbnail with a local text placeholder.
  - Added captions to all six project entries. Captions requiring owner review are marked `<!-- OWNER TO CONFIRM -->`.

- `src/script.js`
  - Updated the typewriter hero name to `Andiswa Dlamini`.
  - Loads `about.json` before constructing Neko's prompt, uses formatted JSON in the prompt, and displays a fallback message if loading or the response fails.

- `about.json`
  - Corrected JSON escaping and structure so the existing owner-authored information can be parsed.

- `src/styles.css`
  - Added caption spacing and styling for the local Roman calculator placeholder.

## Owner Review

- Confirm that C++ and React should remain listed.
- Confirm the project captions marked `<!-- OWNER TO CONFIRM -->` in `index.html`.
- The Weather App URL returned 404 when checked.

## Link Destinations Checked

- Resume and View Resume have empty `href` values.
- Roadmap has `href="#"`; its click handler opens a chatbot question.
- FAQ links to the existing `#faq-text` element.

## Validation

- All nine local image references exist and use forward slashes.
- `about.json` parses successfully and was fetched successfully over local HTTP.
