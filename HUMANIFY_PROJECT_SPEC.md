# HUMANIFY — MASTER PROJECT SPECIFICATION

**Document version:** 1.1
**Project status:** Phase 1 complete; Phase 2 non-code setup in progress; Phase 2 design baseline approved
**Project name:** Humanify  
**Budget constraint:** ₹0 for development and operation; all tools, models, libraries and deployment choices must have a usable free option  
**Product direction:** Personal-first, then public web application  
**Governance:** The project owner must approve every change to scope, features, architecture, stack or roadmap before implementation.

---

## 1. Project overview

Humanify is a privacy-first, browser-oriented document analysis and rewriting application. It is intended to let a user import a Word document or PDF, analyse its text, humanize selected or all eligible text, inspect the rewritten result, run AI-likelihood analysis on the humanized output, compare original and revised documents side by side, and export a revised document in the same format as the source.

The initial problem being addressed is the difficulty of finding a free service with a sufficient word allowance to analyse and rewrite a complete academic or other long-form document. Humanify should avoid artificial product-level word caps by processing large documents in chunks. Real device, browser, model-context and free-hosting limits still apply and must be communicated honestly.

Humanify must not claim that AI detectors can reliably establish authorship or that a rewrite will evade a detector. Detection output must be described as an estimate based on measurable text characteristics, with uncertainty and false-positive limitations clearly explained.

## 2. Product principles and non-negotiable constraints

1. **Zero-cost requirement:** Do not introduce paid APIs, paid model endpoints, paid subscriptions, paid hosting dependencies or services that require payment for the intended basic workflow. Free tiers may have quotas; disclose those limits. Never silently add a paid dependency.
2. **No user accounts:** The approved initial product has no sign-up, login or account requirement.
3. **No document storage on Humanify servers:** Documents and extracted content should be processed locally in the browser/device wherever technically feasible. No database is planned for document contents.
4. **No artificial word limit:** Process large documents in chunks. Do not describe this as literally unlimited; device memory, model context, browser performance and file complexity impose practical constraints.
5. **Same-format export:** DOCX input should produce DOCX output; PDF input should produce PDF output. TXT/MD may be supported as convenience formats, but same-format DOCX/PDF export is a core requirement.
6. **Document fidelity:** Preserve original images, tables, layout, styles, font family, font size, font colour, emphasis, alignment, headers, footers, page numbering, hyperlinks, citations and other supported structure. If exact fidelity is impossible for a document feature, report it rather than silently dropping it.
7. **Tables are content:** Text in table cells must be eligible for humanization and detection. Table structure, merged cells, borders, widths and styling must be preserved where supported.
8. **Images are not rewritten:** Preserve original images and graphics. Do not OCR or rewrite text embedded in images by default; OCR can be a separately approved feature/option if needed.
9. **Comparison is a core feature:** Users can compare original and humanized documents side by side, with paragraph alignment and change highlighting planned beyond the initial text-only prototype.
10. **Owner approval:** The assistant/developer must not unilaterally change project scope, add features, remove features, change the approved stack, replace a model, add a service, or alter the roadmap. Propose the change with rationale, costs, trade-offs and wait for explicit approval.

## 3. Core user workflow

1. User opens Humanify; no account is required.
2. User imports a DOCX or PDF (TXT/MD may also be accepted) or pastes text.
3. Humanify inspects the file type and extracts a structured representation of text and document elements.
4. User chooses which content to process: whole document, selected sections, paragraphs or table cells.
5. User sets humanization controls: tone, vocabulary/formality, sentence structure and other approved controls.
6. Humanify processes text in bounded chunks while preserving ordering and mapping every output chunk to its source location.
7. Humanify inserts revised text into a document model without discarding source formatting and non-text assets.
8. User opens **Compare Documents**. Original document is displayed on the left and humanized document on the right. The full target is document-aware comparison, not merely two unconnected text boxes.
9. Comparison aligns corresponding paragraphs/blocks, highlights additions, deletions and rewritten passages, and allows the user to accept/reject individual paragraph changes. Original and revised tables should be represented as tables. Images and layout should remain visible in document previews where feasible.
10. User runs the AI detector on the actual humanized output. Results include document-level and passage-level estimates, with clear uncertainty and limitations.
11. User can revise selected passages, rerun analysis, and compare again.
12. User exports the result in the same format as the original: DOCX → DOCX; PDF → PDF.
13. Temporary document data is cleared when the user clears the workspace or closes the session. No server-side document retention is intended.

## 4. Functional requirements

### 4.1 Import and parsing
- Accept `.docx`, `.pdf`, `.txt`, `.md` initially.
- Validate extension, MIME type and file size defensively; do not trust extension alone.
- Show file name, import status, errors and extracted word/character counts.
- DOCX parser must understand paragraphs, runs, tables, cells, headers, footers, hyperlinks, styles, relationships, images and supported OOXML structures.
- PDF parser must extract text with page/block/position metadata where possible; detect text-based vs scanned/image-only pages.
- Support mixed PDFs containing both selectable text and scanned pages if OCR is later approved/implemented.
- Maintain stable source IDs/anchors for each paragraph, run, table, cell and page/block so generated text can be mapped back into the source.
- Preserve reading order and avoid concatenating adjacent text without required spaces or paragraph boundaries.

### 4.2 Humanizer
- Advanced user controls for tone, vocabulary and sentence structure.
- Preserve meaning, claims, names, numbers, equations, citations, references, quotations, URLs and technical terminology unless the user explicitly asks otherwise.
- Do not invent facts, citations or sources.
- Process paragraph- or block-sized chunks with context overlap where needed; preserve original sequence and block mapping.
- Handle table cell text, captions, footnotes and other eligible text blocks.
- Allow whole-document and selected-paragraph processing.
- Show failures and allow retry of an individual chunk without losing completed work.
- Maintain original text and revised text separately for comparison and rollback.
- Humanization is for clarity, naturalness and style. Do not promise detector bypass or guaranteed human authorship classification.

### 4.3 AI detector
- Analyse the humanized document output (not only the original input) on explicit user action and/or after humanization if the user chooses that workflow.
- Provide document-level and paragraph-level estimates and visual highlights.
- State that the score is a model estimate, not a factual percentage of text written by AI.
- Include a minimum text threshold and abstain/low-confidence state for short or unsuitable samples.
- Evaluate false positives across formal writing, technical writing, non-native English, edited text and different domains.
- Calibrate outputs on held-out data; document dataset provenance and licensing.
- Never present an unvalidated classifier as a reliable detector.
- Allow re-analysis after edits; make clear when a score is stale.

### 4.4 Compare Documents
- Provide a visible **Compare Documents** button after a source document is loaded and a revised draft exists.
- Target view: original DOCX/PDF on the left, humanized version on the right.
- Align corresponding paragraphs/blocks using stable source IDs first, then fallback text/structure matching if needed.
- Highlight inserted, removed and modified text. Distinguish formatting-only differences from text differences where practical.
- Preserve and show tables, images, headings and page structure in both panes as the comparison implementation matures.
- Support accept/reject for individual paragraph changes and accept/reject all.
- Keep the source version immutable; rejected changes restore the original block text.
- Synchronize scroll positions where technically practical.
- On narrow screens, provide a usable stacked or switchable view.
- Phase 1 only contains a clearly labelled **text-only prototype**: original extracted text and current draft shown side by side. It is not the final DOCX visual comparison.

### 4.5 Export
- DOCX source → DOCX output. Update only intended text nodes while preserving styles, relationships, images and package parts.
- PDF source → PDF output. Preserve embedded images and page content; replace text or reconstruct affected text regions while maintaining layout as closely as possible.
- TXT/MD exports may be offered as secondary convenience options.
- Validate output by reopening/parsing it and checking page count, paragraphs, tables, relationships and assets where possible.
- Provide a clear warning/report if exact layout fidelity cannot be maintained (for example, rewritten text no longer fits the original PDF text box).
- Never claim full fidelity without automated and manual validation.

### 4.6 Privacy and security
- No accounts and no database in the approved initial design.
- No upload endpoint for document contents in the intended production architecture.
- Local browser processing is the default. Any optional external model call or network transfer would require owner approval and clear user consent; it is not currently approved.
- Avoid analytics that collect document content. Do not log raw text, filenames or extracted passages.
- Clear object URLs and temporary buffers when no longer needed.
- Document the use of CDN/font/model downloads. Prefer self-hosted/static assets where practical to minimize third-party requests.
- Treat uploaded files as untrusted input; validate archive entries and guard against malformed or oversized documents.

## 5. Approved technology stack (proposed baseline)

All items below have free/open-source use options. Before implementation, verify current license terms, model licenses, commercial-use restrictions, hosting terms and free-tier quotas. A free library does not mean every model or hosted inference service is free.

### Frontend and application
- **JavaScript (ES modules):** primary implementation language for the browser application.
- **React:** UI components and state management.
- **Vite:** development server and production bundler.
- **CSS:** application styling; current starter uses custom CSS. Tailwind CSS is an optional implementation choice, not a mandatory migration.
- **PWA support:** installable/offline application shell may be added after core functionality is stable; service worker must not cache sensitive document contents by default.

### Document processing
- **Mammoth.js:** initial DOCX text extraction prototype only; not sufficient for formatting-preserving round-trip.
- **JSZip:** inspect and manipulate DOCX ZIP package contents.
- **OOXML / WordprocessingML:** direct DOCX package manipulation; preserve styles, runs, relationships, tables, images and package parts.
- **PDF.js:** PDF parsing, text extraction and page rendering.
- **pdf-lib:** investigate PDF editing/assembly and export capabilities; verify whether its text replacement/layout capabilities meet requirements before adopting it as the sole PDF solution.
- **Tesseract.js:** possible browser OCR option for scanned PDFs, subject to performance and accuracy testing.
- **DOCX validation tools:** unzip/package inspection and XML validation during development; select only free tools.

### Local AI / machine learning
- **Transformers.js:** candidate for running supported transformer models in browser using ONNX Runtime Web.
- **ONNX Runtime Web:** browser inference runtime; test WebGPU and WASM fallback.
- **WebLLM:** candidate browser-side LLM runtime for supported models; evaluate model size, memory use, browser compatibility and licensing.
- **Hugging Face Hub:** discover open models and datasets; use only models/datasets with licenses compatible with the intended use.
- **Ollama:** optional local developer experimentation on a user's own computer; not a required public production server.
- **Python + PyTorch / scikit-learn:** optional offline research/training/evaluation environment for detector experiments; no paid cloud notebooks or hosted APIs.
- **Quantization:** investigate 4-bit/8-bit model variants to reduce RAM and browser memory usage. Quantization may affect quality and must be evaluated.

### Testing and quality
- **Vitest:** unit tests for parsing, chunk mapping, text processing and utility logic.
- **Playwright:** browser end-to-end tests, if compatible with free local/CI use.
- **GitHub Actions:** optional CI using free included quotas; monitor limits.
- **Manual regression corpus:** synthetic/sample DOCX/PDF files with known formatting, tables, images, hyperlinks, headers/footers and long text.
- **Detector evaluation:** held-out, properly licensed datasets; precision, recall, false-positive rate, calibration and subgroup/domain analysis.

### Hosting and collaboration
- **Git + GitHub:** source control and issue tracking; GitHub Free is sufficient for a public or private personal repository subject to current plan limits.
- **Vercel Hobby:** candidate static frontend hosting; verify current eligibility and usage terms. Static hosting only; no assumption of free persistent backend inference.
- **GitHub Pages:** alternative for static hosting if app routing/build requirements fit.
- **No Supabase/database is planned** because there are no accounts or server-side document storage in the approved initial scope.
- **No mandatory backend:** keep production architecture browser-first. A local Python research service may be used during development only if approved/needed.

### Hardware constraints
The project owner has previously reported a Windows development PC with 8 GB RAM. Keep the development environment lightweight. Do not assume that large LLMs can run locally on this machine. Benchmark small quantized models and browser inference; document minimum recommended hardware and fallback behaviour. A browser-local model may still download hundreds of MB or more, so model delivery and caching must be transparent and optional.

## 6. Cost policy

- No paid API keys (OpenAI, Anthropic, Google, etc.) in the approved architecture.
- No paid hosted inference.
- No paid database or authentication provider.
- No paid deployment requirement.
- No premium library dependency required for the core workflow.
- Free-tier services can change quotas or terms; verify at implementation time.
- If a feature cannot be delivered reliably for ₹0, explain the limitation and present free alternatives. Do not silently relax the zero-cost requirement.
- The user accepts practical usage constraints imposed by their own device/browser and free-tier providers, but does not want arbitrary product word limits.

## 7. Detailed phase-by-phase workflow

### Phase 1 — Project foundation and frontend/document-ingestion starter (current)
**Goal:** Establish the repository, frontend shell and local document import flow.

Tasks:
1. Create GitHub repository and initialize Git.
2. Establish README, project specification and change-approval policy.
3. Set up React + Vite project and responsive UI.
4. Add drag-and-drop and browse-to-upload.
5. Import TXT/MD, DOCX and text-based PDF locally.
6. Show editable extracted text, word count and character count.
7. Add TXT export for development convenience.
8. Add the text-only Original vs Draft comparison prototype and a Compare Documents button.
9. Add clear/reset and readable import/error states.
10. Verify no document content is sent to a backend.
11. Test `npm install`, `npm run dev` and `npm run build`.

Current starter status: React/Vite shell, Mammoth raw DOCX text extraction, PDF.js text extraction, TXT/MD import, editable text, TXT export and text-only comparison prototype are included. Formatting preservation and same-format DOCX/PDF export are not implemented.

Acceptance criteria:
- App runs locally on supported Node version.
- TXT/MD, text-based PDF and DOCX text import work on sample files.
- Text can be edited and exported as TXT.
- Compare button shows original and current draft side by side.
- UI clearly communicates that comparison is text-only and AI functions are not active.
- Production build succeeds.

### Phase 2 — Document model and DOCX round-trip fidelity
**Goal:** Build a structured DOCX pipeline before implementing rewriting.

Tasks:
1. Inspect DOCX package structure (ZIP entries, XML parts, relationships).
2. Build an internal document model for sections, paragraphs, runs, tables, rows, cells, hyperlinks, headers, footers, footnotes/endnotes where feasible, drawings and embedded assets.
3. Assign stable IDs/source anchors to text blocks and preserve run-level formatting metadata.
4. Extract paragraph and table text without losing reading order.
5. Implement safe text-node replacement while preserving run properties and package relationships.
6. Handle text split across runs and avoid breaking fields, bookmarks, hyperlinks, tracked changes or special XML constructs.
7. Preserve images, styles, numbering, section settings, page layout and headers/footers.
8. Create a DOCX regression corpus with varied formatting and complex tables.
9. Round-trip unchanged document and compare package/assets/rendered output.
10. Add export validation and user-facing warnings for unsupported structures.

Acceptance criteria:
- A no-op import/export round-trip preserves all supported content and assets.
- Text in paragraphs and tables can be replaced while retaining formatting as designed.
- Images and relationships remain intact.
- Unsupported content is detected and reported, not silently discarded.

### Phase 3 — PDF parsing, OCR assessment and PDF round-trip
**Goal:** Support text-based and, if feasible within free/local constraints, scanned PDFs while retaining layout.

Tasks:
1. Use PDF.js to extract text with page and positional metadata.
2. Identify scanned pages and mixed-content PDFs.
3. Evaluate free local OCR options such as Tesseract.js on supported browsers/devices.
4. Model PDF text blocks, fonts, colours, bounding boxes and reading order.
5. Evaluate PDF editing strategies: overlay/replacement, page reconstruction or conversion through an intermediate format.
6. Preserve embedded images, vector graphics, links, page dimensions and metadata where possible.
7. Handle overflow/reflow when rewritten text no longer fits original bounds.
8. Build test PDFs with columns, tables, footers, images, different fonts and scanned pages.
9. Validate exported PDFs visually and structurally.

Acceptance criteria:
- Text-based PDF extraction works with reading order sufficiently reliable for supported layouts.
- Scanned-page handling is explicit; OCR limitations are disclosed.
- Export does not silently clip or omit rewritten text.
- Fidelity limitations are documented per supported PDF class.

### Phase 4 — Humanization engine and advanced controls
**Goal:** Implement local/free rewriting with chunking and document mapping.

Tasks:
1. Define quality criteria and non-goals (preserve meaning, no invented facts, no detector-evasion guarantee).
2. Benchmark candidate open models and runtimes (Transformers.js, ONNX Runtime Web, WebLLM; optional Ollama for local development).
3. Verify model license, download size, memory requirements, browser support and quantization availability.
4. Benchmark on the project owner's 8 GB RAM PC and representative lower-end hardware.
5. Design chunking with paragraph boundaries, context overlap, ordering and retry.
6. Add controls for tone, vocabulary/formality and sentence structure.
7. Preserve names, numbers, technical terms, citations, quotations, equations and URLs.
8. Humanize body paragraphs, headings only if appropriate, table cells and approved text-bearing blocks.
9. Maintain original/revised block mapping for compare and undo.
10. Add progress, cancellation, per-chunk error and retry UI.
11. Test long documents and memory pressure.

Acceptance criteria:
- Rewriting runs without a paid API.
- Chunk order and source mapping remain stable.
- Users can select controls and process a full supported document in chunks.
- No source block is silently lost.
- Humanized output can be inserted into the structured document model and exported through the fidelity pipeline.

### Phase 5 — AI detector research, implementation and evaluation
**Goal:** Build an evidence-based detector that provides cautious estimates rather than false certainty.

Tasks:
1. Survey open-source detector models, research papers and datasets.
2. Verify dataset/model licenses and provenance.
3. Define labels, domains, languages, sample lengths and evaluation splits.
4. Avoid train/test leakage and evaluate on held-out sources/models.
5. Establish baseline classifiers and linguistic/statistical features.
6. Compare candidate pretrained classifiers with a custom classifier approach.
7. Measure precision, recall, false-positive rate, false-negative rate and calibration.
8. Specifically test formal academic writing, technical writing, non-native English, edited human writing and AI-assisted human writing.
9. Define abstention/low-confidence behaviour for short or out-of-domain text.
10. Run inference locally in browser/device where feasible.
11. Provide document-level and paragraph-level analysis of the humanized output.
12. Clearly label results as model estimates, not verified authorship percentages.
13. Add regression tests and record model/version/dataset details.

Acceptance criteria:
- Detector has documented evaluation results and known limitations.
- Results include confidence/uncertainty and abstention where appropriate.
- UI does not state that a score is the true percentage of AI-written text.
- No paid endpoint is required.

### Phase 6 — Full document comparison and export integration
**Goal:** Deliver the complete comparison workflow and same-format export.

Tasks:
1. Replace text-only prototype with document-aware side-by-side rendering.
2. Render original and revised DOCX/PDF representations in separate panes.
3. Align paragraphs, tables, cells and other blocks using stable IDs and fallback matching.
4. Highlight additions, deletions and rewrites; optionally distinguish formatting changes.
5. Add accept/reject for individual paragraph/block changes and accept/reject all.
6. Preserve immutable original source and maintain undo/redo history.
7. Synchronize scrolling where practical and support narrow-screen layout.
8. Integrate AI detector result view and stale-result invalidation after edits.
9. Export DOCX→DOCX and PDF→PDF using the fidelity-preserving engines.
10. Reopen exported files and run structural/visual validation.
11. Test documents with tables, images, headers/footers, footnotes, citations, mixed fonts and long text.

Acceptance criteria:
- User can compare original and revised documents side by side.
- Paragraph changes can be individually accepted/rejected.
- Tables and images remain represented and preserved.
- Exported format matches source format.
- Export validation catches unsupported or degraded layouts and reports them.

### Phase 7 — Quality, privacy, performance and public deployment
**Goal:** Prepare a stable public version without recurring costs.

Tasks:
1. Add unit and browser tests for import, editing, comparison, detection, rewriting and export.
2. Perform privacy review: network requests, console logs, local storage, caches, telemetry and temporary files.
3. Ensure document text is not cached by service worker or sent to analytics.
4. Add secure file validation and malformed archive/PDF tests.
5. Optimize chunking, memory use, model loading and cancellation.
6. Provide clear device/model compatibility information.
7. Add graceful fallback when WebGPU/model execution is unavailable.
8. Verify current free hosting terms and deploy static app (Vercel Hobby or GitHub Pages candidate).
9. Add public README, license decision, contribution guidance and issue templates if approved.
10. Add versioning and release checklist.
11. Monitor only non-sensitive operational metrics if needed and approved.

Acceptance criteria:
- Core workflow functions on tested browsers/devices without paid services.
- Privacy claims match actual network behaviour.
- Free hosting limits and local compute requirements are documented.
- Public release does not require user accounts or server-side document storage.

## 8. Comparison interaction specification

The primary action is labelled **Compare Documents**. It becomes available once an original source and a revised draft exist.

Desktop target:
- Left pane: Original document.
- Right pane: Humanized document.
- Matching blocks vertically aligned where possible.
- Inline highlights for changed text.
- Table structures retained in both panes.
- Images and page structure displayed in context.
- Per-block controls: Accept change / Reject change.

Mobile target:
- Stacked or toggleable Original and Humanized panes; do not force unreadably narrow columns.

Behaviour:
- Accept keeps revised text.
- Reject restores original text for the selected block.
- Original source remains immutable.
- A new humanization pass creates a new draft revision or updates the selected draft block with a recoverable history entry.
- Detector results become stale when analysed text changes and must be rerun.

## 9. Known risks and constraints

- AI detection is probabilistic and can misclassify human writing as AI-like or vice versa.
- Rewriting may alter meaning, citations or technical precision; preservation checks and user review are necessary.
- DOCX run-level formatting and complex OOXML constructs make safe text replacement non-trivial.
- PDF is a fixed-layout format; longer rewritten text can cause overflow and exact layout preservation cannot be guaranteed for all PDFs.
- Browser-local LLMs can be large, slow or incompatible with devices without WebGPU; 8 GB RAM is a meaningful constraint.
- Free hosting and free model distribution/inference quotas can change.
- Open-source code does not guarantee that every model or dataset is free for every use; verify each license.
- “No artificial word limit” means chunking without a product-imposed cap, not unlimited hardware capacity.

## 10. Current repository state (Phase 1 v0.2.0)

Files:
- `index.html`
- `package.json`
- `src/main.jsx`
- `src/App.jsx`
- `src/styles.css`
- `README.md`
- `HUMANIFY_PROJECT_SPEC.md`

Implemented:
- React + Vite shell.
- Local TXT/MD/DOCX/text-based PDF import.
- DOCX raw-text extraction via Mammoth.
- PDF text extraction via PDF.js.
- Editable text, word and character counts.
- TXT export.
- Text-only original/draft comparison preview.

Not implemented:
- AI detector.
- AI humanizer.
- DOCX formatting-preserving parser/exporter.
- PDF layout-preserving rewrite/export.
- OCR.
- Full document visual comparison, paragraph alignment, change highlighting or accept/reject.
- Same-format DOCX/PDF export.

## 11. GitHub repository setup

Recommended repository name: `humanify`.

Suggested initial settings:
- Create a new GitHub repository under the owner's account.
- Choose Public if the owner wants open-source collaboration; choose Private if they want to keep development private initially. This choice is for the owner to make.
- Do not initialize with a second README/license/gitignore if uploading this existing starter with its own README.
- Keep API keys and private credentials out of the repository. The current starter should not require any API keys.
- Commit the project specification and README so future contributors/ChatGPT sessions have the same source of truth.

Initial Git commands from the extracted project folder:
```bash
git init
git add .
git commit -m "Initial Humanify Phase 1 starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/humanify.git
git push -u origin main
```
Replace `YOUR-USERNAME` with the actual GitHub username and use the repository URL shown by GitHub. If Git reports that a remote already exists, inspect `git remote -v` before changing it.

Suggested future branch pattern:
- `main`: stable working version.
- `feature/docx-parser`: approved feature work.
- `feature/pdf-pipeline`: approved feature work.
- `fix/<short-description>`: bug fixes.

Do not commit uploaded user documents, generated private documents, model cache files, `.env` files, API keys, `node_modules/` or build output unless a specific reason is approved. Add/maintain `.gitignore` accordingly.

## 12. Change-control protocol (mandatory)

Before implementing any change that affects product scope, features, architecture, technology stack, model selection, data handling, privacy, deployment, cost, phase order or acceptance criteria:

1. Describe the proposed change.
2. Explain why it may be needed.
3. State what existing approved decision it changes or extends.
4. Explain cost implications (must remain ₹0 unless owner explicitly changes the budget constraint).
5. Explain technical risks and alternatives.
6. Ask the project owner for approval.
7. Wait for explicit approval before editing implementation or this specification.

Bug fixes that preserve approved behaviour may be implemented, but disclose them. Do not treat an assistant suggestion or an implementation convenience as user approval. New feature ideas raised by the owner should be added to a proposed-changes section first and incorporated into the approved roadmap only after the owner confirms.

## 13. Future feature backlog

This section is intentionally a holding area. Future ideas should be proposed here with status `Proposed` and must not be implemented until approved. Do not assume any feature not listed in the approved requirements is authorized.

| Feature | Status | Owner approval |
|---|---|---|
| New ideas to be added by owner | Proposed only | Required before implementation |

---

**Source of truth:** This file is the current master specification for Humanify. When a new ChatGPT Project is created, upload this file and the current source ZIP/repository. At the beginning of future work, check this specification and repository state before proposing or making changes.

## 14. Phase 2 addendum — DOCX document model and round-trip fidelity

**Status:** Approved by project owner on 2026-11-02.
**Applies to:** Phase 2 only. This addendum clarifies and extends the Phase 2 requirements above; it does not authorize implementation of later phases or change the approved zero-cost, browser-first product principles.

### 14.1 Objective

Build a structured, browser-side DOCX processing pipeline that can inspect DOCX packages, parse supported document structures into an internal model, maintain stable source references, safely replace eligible text while retaining formatting and relationships, preserve unsupported or non-editable structures, and validate exported DOCX packages.

### 14.2 Approved technology decisions

- Retain React 19 and Vite 6.
- Use JSZip 3.10.2 to inspect and manipulate DOCX ZIP packages.
- Use browser-native `DOMParser` and `XMLSerializer` for XML parsing and serialization.
- Use Vitest 4.1.12 for browser-independent unit tests.
- Use a real browser for validation of native XML APIs, JSZip and browser-side DOCX processing.
- Do not add jsdom, happy-dom or another DOM emulation dependency at this stage.
- Do not add further dependencies without justification and owner approval where required by the change-control protocol.
- Keep processing client-side; do not introduce a backend or paid service.

The dependency versions above record the Phase 2 setup selection. The package manifest and lockfile remain the executable record of installed versions.

### 14.3 Proposed module boundaries

The implementation should remain modular and separate document processing from React UI concerns. The approved logical responsibilities are:

- `src/document/index.js`: narrow public API for UI integration.
- `src/document/model/documentModel.js` and `documentTypes.js`: canonical document model and type definitions.
- `src/document/parser/docxPackageReader.js`: open the DOCX package with JSZip and inventory package entries without rewriting them.
- `src/document/parser/xmlParser.js`: native XML parsing/serialization and parser-error handling; no OOXML business logic.
- `src/document/parser/relationshipParser.js`: parse relationship parts, relationship IDs, types, targets and target modes.
- `src/document/parser/documentParser.js`: map package parts into the internal model.
- `src/document/editor/textReplacement.js`: safe run-aware text replacement and refusal of unsafe edits.
- `src/document/writer/docxPackageWriter.js`: update only necessary package parts and retain untouched entries and binary assets.
- `src/document/validation/packageValidator.js`: validate ZIP integrity, required parts, XML, relationships, references and assets.
- `src/document/validation/preservationReport.js`: classify structures and report limitations.
- `src/document/utils/sourceAnchors.js`: deterministic source anchors based on package part and structural location.
- `src/document/utils/textNodes.js`: WordprocessingML text traversal utilities.

This is a logical responsibility map; filenames may be refined during implementation if the responsibilities and architecture remain consistent. Any material architectural change still requires approval.

### 14.4 Internal document model

The model should represent, as applicable, documents, sections, paragraphs, runs, tables, rows, cells, hyperlinks, headers, footers, footnotes, endnotes, drawings, images/assets, styles, numbering and relationships.

Stable model IDs and source anchors are distinct. Source anchors identify the originating package part and structural location. The source DOCX must not be modified merely to insert identifiers.

### 14.5 Run-level replacement policy

The approved strategy is **first-run inheritance**:

1. Identify the exact runs and text span affected by a replacement.
2. Newly inserted text inherits the formatting of the first replaced run.
3. Preserve unaffected surrounding runs wherever possible.
4. Retain hyperlink and package relationships when safe.
5. Handle whitespace and Unicode deliberately; do not silently normalize or drop content.
6. Refuse a replacement when the affected range cannot be mapped safely or would damage a protected structure.

### 14.6 OOXML compatibility classifications

Every encountered structure must be assigned one of three handling classes:

1. **Fully supported:** parse, preserve and safely edit.
2. **Preservation-only:** retain without editing and report the limitation.
3. **Unsupported:** detect and warn; prevent unsafe processing or export when integrity cannot be guaranteed.

The following initial policy is approved:

| Structure | Classification | Handling |
|---|---|---|
| Ordinary paragraphs and runs | Fully supported | Parse text and supported formatting; allow safe replacement. |
| Tables, rows and cells | Fully supported | Parse and edit eligible cell text; preserve supported table structures and merges. |
| Supported run formatting | Fully supported | Preserve supported bold, italic, underline, font, size, colour and related properties. |
| Internal and external hyperlinks | Fully supported | Preserve anchors/targets and relationships; allow safe displayed-text edits. External destinations must not be fetched. |
| Headers and footers | Fully supported | Parse and edit ordinary eligible text; preserve relationships and section associations. |
| Footnotes and endnotes | Fully supported | Parse, preserve stable IDs and formatting, support safe text replacement, and validate references and relationships. |
| Images and drawings | Preservation-only | Retain assets, markup and relationships; do not edit image contents. |
| Floating images and text wrapping | Preservation-only | Retain positioning and layout markup without attempting to modify it. |
| Bookmarks | Preservation-only | Preserve boundaries and IDs; avoid replacements that could invalidate ranges. |
| Simple and complex fields, including TOC and page-number fields | Preservation-only | Preserve field instructions and displayed results; do not rewrite field instructions or calculated results. |
| Tracked insertions, deletions and formatting revisions | Preservation-only | Preserve unresolved revision markup and content; do not edit text within unresolved revisions. |
| Content controls | Preservation-only | Preserve control boundaries, properties and contained content; do not edit internal text or control structure. |
| Comments and comment references | Preservation-only | Preserve content, IDs and anchors; do not edit comments. |
| Section properties and page layout | Preservation-only | Preserve dimensions, margins, orientation, columns and section boundaries. |
| Embedded OLE objects and other embedded content | Preservation-only | Retain package assets and relationships without interpreting or modifying embedded content. |
| Unknown XML elements and extensions | Preservation-only by default | Preserve unchanged. If safe preservation cannot be established for an operation, treat that operation as unsupported. |
| Malformed XML or broken required relationships | Unsupported | Reject unsafe processing/export rather than silently repairing or discarding content. |

A preservation-only element must remain genuinely untouched. Extracting its text and rebuilding it is not sufficient. A document containing preservation-only structures should remain exportable when those structures can be retained safely. The presence of an unknown element does not automatically invalidate an otherwise safe edit to an unrelated part; assess whether the required package-part modification could damage it.

### 14.7 Export safety rules

Export must be blocked when there is a concrete integrity or preservation risk, including:

- Missing or malformed required DOCX package components.
- Required relationships targeting missing package parts.
- A replacement that would invalidate a bookmark, field, revision or other protected structure.
- Inability to retain a preservation-only structure safely after the requested modification.
- Failure of generated-package validation.

Do not block export solely because a document contains preservation-only structures if they can be retained safely. Report detected limitations to the user.

### 14.8 Package preservation and serialization

- Preserve untouched package entries wherever possible.
- Retain images and other binary assets.
- Preserve relationship IDs and targets unless a deliberate, validated change requires otherwise.
- Avoid rewriting unrelated XML parts.
- XML serialization may normalize markup; byte-for-byte identity is not guaranteed. The target is structural and visual preservation.
- Validate the generated DOCX before presenting it as a successful export.

### 14.9 Testing strategy and synthetic fixtures

Testing has three layers:

1. **Vitest/Node:** browser-independent model logic, source anchors, replacement rules and validation logic.
2. **Real browser:** native `DOMParser`, `XMLSerializer`, JSZip and end-to-end browser-side DOCX processing.
3. **Word-compatible rendering:** inspect no-op and edited round-trips in Microsoft Word or LibreOffice.

Use synthetic DOCX fixtures only in the repository. Do not commit personal, academic or otherwise private user documents. Fixtures should cover basic paragraphs, multiple runs, formatting, whitespace, Unicode, long text, tables (including supported merges and nested tables), hyperlinks, images, headers/footers, numbering, sections, footnotes/endnotes, fields, bookmarks, tracked changes, content controls, comments, malformed XML, missing relationships, unknown package entries and large documents. Record fixture provenance or generation steps so failures are reproducible.

Vitest is configured as the unit-test runner. The test command may report no tests until actual test files are added; that is not a passing test suite. Browser validation remains necessary because the Node test environment does not provide the native browser XML APIs used by the application.

### 14.10 Phase 2 development sequence

1. Inspect DOCX ZIP package entries, XML parts and relationships.
2. Build the internal document model.
3. Parse supported document structures and preserve reading order.
4. Implement stable source anchors.
5. Implement safe run-aware text replacement.
6. Implement conservative handling and reporting for complex OOXML.
7. Preserve package parts, relationships, styles, numbering, layout and assets.
8. Build the synthetic DOCX regression corpus.
9. Test no-op and edited round-trips, including rendering inspection.
10. Validate exported packages and report unsupported structures.

No PDF pipeline, OCR, humanization engine, AI detector or full document comparison implementation is authorized by this Phase 2 addendum. Those remain in their existing roadmap phases.

### 14.11 Phase 2 acceptance criteria

Phase 2 is not complete until:

- DOCX packages can be imported into the structured model.
- Paragraph and table text can be safely edited.
- Newly inserted text follows first-run inheritance while unaffected runs are retained where possible.
- No-op import/export preserves supported content and assets.
- Images and relationships remain intact.
- Footnotes and endnotes are parsed, preserved and safely editable with stable IDs and validated references.
- Unsupported and preservation-only structures are detected and reported.
- Unsafe edits and exports are refused.
- Generated packages pass structural validation.
- No-op and edited documents are inspected in a Word-compatible renderer.
- The production build passes.

A successful build alone is insufficient to declare Phase 2 complete.

### 14.12 Repository and cost constraints

- Keep `main` as the stable branch and use `feature/docx-model` for Phase 2 work.
- Keep the browser-first, no-backend architecture and ₹0 operating-cost objective.
- Do not upload document content to external processing services.
- Do not commit real user documents or private document content.
- Keep Phase 2 work within the approved roadmap and use the mandatory change-control protocol for material deviations.