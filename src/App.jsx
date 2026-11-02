import React from "react";
import { useRef, useState } from 'react';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
const ACCEPTED = '.txt,.md,.docx,.pdf';

function countWords(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

async function extractText(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'txt' || extension === 'md') return file.text();
  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  if (extension === 'pdf') {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map(item => 'str' in item ? item.str : '').join(' '));
    }
    return pages.join('\n\n');
  }
  throw new Error('Unsupported file type. Choose TXT, MD, DOCX or a text-based PDF.');
}

function downloadText(value, name) {
  const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [originalText, setOriginalText] = useState('');
  const [draftText, setDraftText] = useState('');
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [dragging, setDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('detector');
  const [isLoading, setIsLoading] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const fileInput = useRef(null);

  async function loadFile(file) {
    if (!file) return;
    setIsLoading(true);
    setStatus('Reading document locally…');
    try {
      const extracted = await extractText(file);
      setOriginalText(extracted);
      setDraftText(extracted);
      setFileName(file.name);
      setCompareOpen(false);
      setStatus(extracted.trim() ? `Imported ${file.name}. Text extraction only in this phase.` : 'No extractable text found. This may be a scanned PDF.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not read this document.');
    } finally {
      setIsLoading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    loadFile(event.dataTransfer.files?.[0]);
  }

  function clearDocument() {
    setOriginalText(''); setDraftText(''); setFileName(''); setStatus(''); setCompareOpen(false);
  }

  const words = countWords(draftText);
  const characters = draftText.length;
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'humanify-document';

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Humanify home"><span className="brand-mark">h</span><span>humanify</span></a>
        <div className="topbar-right"><span className="privacy-pill"><i /> Local-first workspace</span><a className="github-link" href="https://github.com/Hydraa-16/Humanify" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR PRIVATE AI WRITING WORKSPACE</div>
        <h1>Write with clarity.<br /><span>Keep your voice.</span></h1>
        <p className="hero-copy">Analyse and refine your writing in one place. Documents are processed in this browser in this starter version.</p>
      </section>

      <section className="workspace" aria-label="Document workspace">
        <div className="workspace-heading">
          <div><div className="section-kicker">WORKSPACE</div><h2>Start with your document</h2></div>
          <span className="step-label">01 <b>/</b> 07</span>
        </div>

        <div className="tool-tabs" role="tablist" aria-label="Writing tools">
          <button className={activeTab === 'detector' ? 'tool-tab active' : 'tool-tab'} onClick={() => setActiveTab('detector')} role="tab" aria-selected={activeTab === 'detector'}><span>◎</span> AI detector <small>Planned</small></button>
          <button className={activeTab === 'humanizer' ? 'tool-tab active' : 'tool-tab'} onClick={() => setActiveTab('humanizer')} role="tab" aria-selected={activeTab === 'humanizer'}><span>✳</span> Humanizer <small>Planned</small></button>
        </div>

        <div className="editor-card">
          <div className="editor-topline"><div><span className="live-dot" /> DOCUMENT INPUT</div><span className="file-label">{fileName || 'Untitled document'}</span></div>
          <div className="import-area" onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
            <div className={dragging ? 'dropzone dragging' : 'dropzone'}>
              <div className="upload-icon">↑</div>
              <div className="drop-title">Drop your document here</div>
              <div className="drop-subtitle">or <button className="text-button" onClick={() => fileInput.current?.click()}>browse files</button> from your device</div>
              <div className="file-types">PDF · DOCX · TXT · MD</div>
              <input ref={fileInput} type="file" accept={ACCEPTED} hidden onChange={event => loadFile(event.target.files?.[0])} />
            </div>
          </div>
          <div className="divider-label"><span /> DOCUMENT TEXT <span /></div>
          <textarea value={draftText} onChange={event => { setDraftText(event.target.value); setStatus('Draft edited locally.'); }} placeholder="Upload a document or paste your text here…" spellCheck="true" aria-label="Document text" />
          <div className="editor-footer">
            <div className="counts"><span>{words.toLocaleString()} words</span><i /> <span>{characters.toLocaleString()} characters</span></div>
            <div className="editor-actions">
              <button className="clear-button" onClick={clearDocument}>Clear</button>
              <button className="compare-button" disabled={!originalText.trim()} onClick={() => setCompareOpen(value => !value)}>{compareOpen ? 'Close comparison' : 'Compare documents'}</button>
              <button className="download-button" disabled={!draftText.trim()} onClick={() => downloadText(draftText, `${baseName}-draft.txt`)}>Export TXT <span>↓</span></button>
            </div>
          </div>
          {status && <div className="status-message" role="status">{isLoading && <span className="spinner" />}{status}</div>}
        </div>

        {compareOpen && <section className="comparison-panel" aria-label="Original and draft comparison">
          <div className="comparison-heading"><div><div className="section-kicker">COMPARISON PREVIEW</div><h3>Original vs draft</h3></div><span className="prototype-label">TEXT-ONLY PROTOTYPE</span></div>
          <div className="comparison-grid">
            <div className="comparison-column"><div className="comparison-label">ORIGINAL DOCUMENT</div><pre>{originalText || 'No original text loaded.'}</pre></div>
            <div className="comparison-column"><div className="comparison-label">CURRENT DRAFT</div><pre>{draftText || 'No draft text available.'}</pre></div>
          </div>
          <p className="comparison-note">This is an early text-only comparison preview. Paragraph alignment, change highlighting, tables, images and original DOCX/PDF formatting preservation are planned for later phases. No AI rewriting or detection is active yet.</p>
        </section>}

        <div className="next-step">
          <div className="next-icon">✳</div>
          <div><strong>{activeTab === 'detector' ? 'Detection engine is planned' : 'Humanization engine is planned'}</strong><p>{activeTab === 'detector' ? 'The detector will analyse the humanized output and provide carefully qualified estimates.' : 'Advanced tone, vocabulary and sentence-structure controls will be developed after document handling is validated.'}</p></div>
          <span className="lock-icon">⌁</span>
        </div>
      </section>

      <footer className="footer"><span>HUMANIFY © 2026</span><span>BUILT FOR PRIVACY · DESIGNED FOR WRITERS</span></footer>
    </main>
  );
}
