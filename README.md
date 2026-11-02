# Humanify — Phase 1 starter (v0.2.0)

Humanify is a privacy-first, local-first document writing project. This is a frontend/document-ingestion starter, not the completed humanizer or detector.

## Included in this starter
- React + Vite application shell.
- Browser-side import of TXT, Markdown, DOCX and text-based PDF.
- Drag-and-drop upload.
- Editable extracted-text draft.
- Live word and character counts.
- TXT export.
- A **text-only comparison preview** showing original extracted text and the current draft side by side.
- No accounts, backend, database or document upload endpoint.

## Not implemented yet
- AI detection or humanization.
- DOCX/PDF export.
- Formatting-preserving DOCX/PDF round-trip.
- Table-aware rewrite, image/layout preservation, OCR, paragraph alignment or diff highlighting.
- Actual AI-powered accept/reject changes.

The comparison preview is intentionally labelled as a prototype. Mammoth currently extracts raw DOCX text; it does not preserve the source document's formatting or images. PDF.js extracts text from text-based PDFs; scanned PDFs need OCR.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Privacy notes
Document parsing happens in the browser. The app has no document upload endpoint, account system or database. Imported text remains in the active page's memory until cleared or the page is closed/refreshed. The starter uses system font fallbacks and does not request remote web fonts. Vite dependencies are downloaded during development.

## Project governance
See `HUMANIFY_PROJECT_SPEC.md` for the approved product scope, architecture, technology stack, phase-by-phase workflow, constraints and change-approval process. Do not change approved scope or architecture without the owner's approval.
