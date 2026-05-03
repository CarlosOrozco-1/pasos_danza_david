# Improve Enseñanza Bíblica Module

This plan aims to fix the broken "Enseñanza Bíblica" module in `app.js` and improve the user experience by implementing the sidebar and detail view layout as defined in the existing CSS styles.

## Background Context
Currently, when clicking the "Enseñanza Bíblica" button, the module fails to render correctly. The `renderEnsenanzas` function in `app.js` has several issues:
1. It tries to assign HTML to a `lista` variable that is undefined.
2. It attempts to read `ensenanzaExpandida.descripcion` which does not exist in the data objects (they use `explicacion`).
3. It only attempts to render a detail view without a sidebar list to navigate between teachings.
4. The CSS file (`styles.css`) contains styles for a split layout (`.ensenanza-layout`, `.ensenanza-sidebar`, `.ensenanza-detail`, etc.) that are currently unused.

## Proposed Changes

### app.js

#### [MODIFY] app.js
We will rewrite the `renderEnsenanzas` and `seleccionarEnsenanza` functions to properly generate the HTML for both the sidebar and the detail view.

- **`renderEnsenanzas()`:**
  - Select the correct container element: `document.getElementById('ensenanza-lista')`.
  - Generate the sidebar HTML iterating over `ensenanzasBiblicas` and `danzasCaidas`.
  - Apply the `.ensenanza-item` and `.active` classes based on the currently selected teaching.
  - Generate the detail view HTML using the selected teaching's properties (`titulo`, `significado`, `raiz`, `explicacion`, `versiculos`).
  - Assemble the sidebar and detail view inside the `.ensenanza-layout` container.
- **Data Object Mapping:**
  - Update property access from `.descripcion` to `.explicacion`.
- **Initialization:**
  - Ensure the first item is selected by default when switching to the module if none is selected.
  - Update `toggleEnsenanza` to use `seleccionarEnsenanza` since the new UI is a sidebar+detail pattern rather than expandable cards (based on CSS `ensenanza-layout`).

## Verification Plan

### Manual Verification
1. Click the "📖 Enseñanza Bíblica" button in the header.
2. Verify that the module loads without console errors.
3. Verify that a sidebar appears with the list of biblical and fallen dances.
4. Verify that clicking an item in the sidebar updates the detail view with the correct information (title, meaning, root, explanation, verses).
5. Verify that the selected item in the sidebar is visually highlighted.
6. Verify responsive behavior (sidebar stacked on mobile, side-by-side on desktop).
