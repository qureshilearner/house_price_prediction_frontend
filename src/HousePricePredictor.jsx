import { useState, useRef, useCallback } from "react";

const API = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Syne', sans-serif;
    background: #0a0a0f;
    color: #e8e6f0;
    min-height: 100vh;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }

  .header {
    margin-bottom: 3rem;
    border-left: 3px solid #7c6af7;
    padding-left: 1.25rem;
  }

  .header-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #7c6af7;
    margin-bottom: 0.5rem;
  }

  .header h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #f0eeff;
    line-height: 1.15;
  }

  .header p {
    font-size: 14px;
    color: #8a88a0;
    margin-top: 0.5rem;
    font-weight: 400;
  }

  .upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .drop-zone {
    border: 1.5px dashed #2e2c45;
    border-radius: 12px;
    padding: 2rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #11101a;
    position: relative;
  }

  .drop-zone:hover, .drop-zone.drag-over {
    border-color: #7c6af7;
    background: #141228;
  }

  .drop-zone.filled {
    border-color: #3ecf8e;
    border-style: solid;
    background: #0d1a14;
  }

  .drop-icon {
    width: 36px;
    height: 36px;
    margin: 0 auto 0.75rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: #1e1c30;
  }

  .drop-zone.filled .drop-icon {
    background: #0f2a1e;
  }

  .drop-label {
    font-size: 13px;
    font-weight: 600;
    color: #c8c4e8;
    margin-bottom: 0.25rem;
  }

  .drop-sub {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #5a5870;
  }

  .drop-zone.filled .drop-sub {
    color: #3ecf8e;
  }

  .drop-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .action-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .btn {
    flex: 1;
    padding: 0.85rem 1.5rem;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-primary {
    background: #7c6af7;
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) { background: #6b5ae6; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-secondary {
    background: #1a1828;
    color: #8a88a0;
    border: 1px solid #2e2c45;
  }

  .btn-secondary:hover:not(:disabled) { background: #222036; color: #c8c4e8; }
  .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-csv {
    background: #0d2a1f;
    color: #3ecf8e;
    border: 1px solid #1a4a35;
  }

  .btn-csv:hover:not(:disabled) { background: #112e23; }
  .btn-csv:disabled { opacity: 0.4; cursor: not-allowed; }

  .progress-wrap {
    background: #11101a;
    border: 1px solid #2e2c45;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .progress-label {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #7c6af7;
    margin-bottom: 1rem;
  }

  .progress-steps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 13px;
  }

  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .step.done .step-dot { background: #3ecf8e; }
  .step.active .step-dot { background: #7c6af7; animation: pulse 1s infinite; }
  .step.pending .step-dot { background: #2e2c45; }
  .step.done { color: #5a7a6a; }
  .step.active { color: #c8c4e8; }
  .step.pending { color: #3a3858; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .progress-bar-track {
    height: 3px;
    background: #1e1c30;
    border-radius: 99px;
    margin-top: 1.25rem;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c6af7, #3ecf8e);
    border-radius: 99px;
    transition: width 0.5s ease;
  }

  .error-box {
    background: #1f0f0f;
    border: 1px solid #5a1f1f;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #e06060;
    line-height: 1.6;
  }

  .results {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .stat-card {
    background: #11101a;
    border: 1px solid #2e2c45;
    border-radius: 10px;
    padding: 1rem 1.25rem;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5a5870;
    margin-bottom: 0.4rem;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #f0eeff;
  }

  .stat-value.green { color: #3ecf8e; }

  .cv-section {
    background: #11101a;
    border: 1px solid #2e2c45;
    border-radius: 10px;
    padding: 1.25rem;
  }

  .section-title {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #5a5870;
    margin-bottom: 1rem;
  }

  .cv-rows { display: flex; flex-direction: column; gap: 0.5rem; }

  .cv-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .cv-name {
    font-size: 13px;
    color: #8a88a0;
    width: 90px;
    flex-shrink: 0;
  }

  .cv-bar-track {
    flex: 1;
    height: 4px;
    background: #1e1c30;
    border-radius: 99px;
    overflow: hidden;
  }

  .cv-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: #7c6af7;
    transition: width 0.6s ease;
  }

  .cv-score {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #7c6af7;
    width: 60px;
    text-align: right;
    flex-shrink: 0;
  }

  .table-section {
    background: #11101a;
    border: 1px solid #2e2c45;
    border-radius: 10px;
    overflow: hidden;
  }

  .table-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #1e1c30;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-scroll {
    overflow-x: auto;
    max-height: 340px;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  thead { position: sticky; top: 0; background: #0f0e18; z-index: 1; }

  th {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5a5870;
    padding: 0.75rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid #1e1c30;
  }

  td {
    padding: 0.6rem 1.25rem;
    border-bottom: 1px solid #161524;
    color: #c8c4e8;
    font-family: 'DM Mono', monospace;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #141228; }

  .price-cell { color: #3ecf8e; font-weight: 500; }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 99px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    background: #1a1828;
    color: #7c6af7;
    border: 1px solid #2e2c45;
  }

  .json-section {
    background: #0a0d14;
    border: 1px solid #1e2a3a;
    border-radius: 10px;
    overflow: hidden;
  }

  .json-header {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #1e2a3a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .json-body {
    padding: 1rem 1.25rem;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #5a88b0;
    max-height: 200px;
    overflow-y: auto;
    line-height: 1.7;
    white-space: pre;
    overflow-x: auto;
  }

  .json-key { color: #7c6af7; }
  .json-num { color: #3ecf8e; }
  .json-str { color: #f7c47e; }

  .copy-btn {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #2e2c45;
    background: transparent;
    color: #5a5870;
    cursor: pointer;
    transition: all 0.15s;
  }
  .copy-btn:hover { color: #c8c4e8; border-color: #5a5870; }
  .copy-btn.copied { color: #3ecf8e; border-color: #1a4a35; }
`;

const STEPS = [
  "Reading your CSV files",
  "Preprocessing & feature engineering",
  "Training 5 ML models",
  "Cross-validating (5-fold)",
  "Blending predictions",
  "Finalising results",
];

function fmt(n) {
  return "$" + Math.round(n).toLocaleString();
}

function JsonHighlight({ data }) {
  const str = JSON.stringify({ cv_scores: data.cv_scores, stats: data.stats, sample_predictions: data.predictions.slice(0, 5) }, null, 2);
  const html = str
    .replace(/("[\w_]+")\s*:/g, '<span class="json-key">$1</span>:')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-num">$1</span>')
    .replace(/:\s*"([^"]+)"/g, ': <span class="json-str">"$1"</span>');
  return <div className="json-body" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function HousePricePredictor() {
  const [trainFile, setTrainFile] = useState(null);
  const [testFile, setTestFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState({ train: false, test: false });
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);

  const startSteps = () => {
    setStep(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      if (i < STEPS.length - 1) setStep(i);
      else clearInterval(intervalRef.current);
    }, 3200);
  };

  const stopSteps = () => {
    clearInterval(intervalRef.current);
    setStep(STEPS.length - 1);
  };

  const handlePredict = async () => {
    if (!trainFile || !testFile) return;
    setLoading(true);
    setResult(null);
    setError(null);
    startSteps();

    const form = new FormData();
    form.append("train_file", trainFile);
    form.append("test_file", testFile);

    try {
      const res = await fetch(`${API}/predict`, { method: "POST", body: form });
      const data = await res.json();
      stopSteps();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (e) {
      stopSteps();
      setError(e.message || "Could not connect to the Python backend. Make sure it is running on localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!trainFile || !testFile) return;
    const form = new FormData();
    form.append("train_file", trainFile);
    form.append("test_file", testFile);
    try {
      const res = await fetch(`${API}/predict/csv`, { method: "POST", body: form });
      if (!res.ok) throw new Error("CSV download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "predictions.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const FileZone = ({ label, file, setFile, which }) => (
    <div
      className={`drop-zone ${dragOver[which] ? "drag-over" : ""} ${file ? "filled" : ""}`}
      onDragOver={e => { e.preventDefault(); setDragOver(d => ({ ...d, [which]: true })); }}
      onDragLeave={() => setDragOver(d => ({ ...d, [which]: false }))}
      onDrop={e => {
        e.preventDefault();
        setDragOver(d => ({ ...d, [which]: false }));
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
      }}
    >
      <input className="drop-input" type="file" accept=".csv"
        onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
      <div className="drop-icon">{file ? "✓" : "+"}</div>
      <div className="drop-label">{label}</div>
      <div className="drop-sub">
        {file ? file.name : "drop .csv or click to browse"}
      </div>
    </div>
  );

  const progress = step < 0 ? 0 : Math.round(((step + 1) / STEPS.length) * 100);
  const canRun = trainFile && testFile && !loading;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-label">AI/ML Mini Project</div>
          <h1>House Price Predictor</h1>
          <p>Upload your datasets — 5-model ensemble runs on the backend and returns predictions</p>
        </div>

        <div className="upload-grid">
          <FileZone label="train.csv" file={trainFile} setFile={setTrainFile} which="train" />
          <FileZone label="test.csv" file={testFile} setFile={setTestFile} which="test" />
        </div>

        <div className="action-row">
          <button className="btn btn-primary" onClick={handlePredict} disabled={!canRun}>
            {loading ? "Running…" : "▶  Run Prediction"}
          </button>
          <button className="btn btn-csv" onClick={handleDownloadCSV} disabled={!canRun && !result}>
            ↓  Download CSV
          </button>
          <button className="btn btn-secondary"
            onClick={() => { setTrainFile(null); setTestFile(null); setResult(null); setError(null); setStep(-1); }}
            disabled={loading}>
            Reset
          </button>
        </div>

        {loading && (
          <div className="progress-wrap">
            <div className="progress-label">▸ running pipeline — {progress}%</div>
            <div className="progress-steps">
              {STEPS.map((s, i) => (
                <div key={i} className={`step ${i < step ? "done" : i === step ? "active" : "pending"}`}>
                  <div className="step-dot" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: progress + "%" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="error-box">
            ✗ Error: {error}
          </div>
        )}

        {result && (
          <div className="results">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Predictions</div>
                <div className="stat-value green">{result.total_predictions.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Mean Price</div>
                <div className="stat-value">{fmt(result.stats.mean)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Price Range</div>
                <div className="stat-value" style={{ fontSize: 14, paddingTop: 4 }}>
                  {fmt(result.stats.min)} – {fmt(result.stats.max)}
                </div>
              </div>
            </div>

            <div className="cv-section">
              <div className="section-title">Cross-validation RMSLE — 5 models</div>
              <div className="cv-rows">
                {Object.entries(result.cv_scores).map(([name, score]) => {
                  const maxScore = Math.max(...Object.values(result.cv_scores));
                  const pct = (1 - score / maxScore) * 70 + 10;
                  return (
                    <div className="cv-row" key={name}>
                      <div className="cv-name">{name}</div>
                      <div className="cv-bar-track">
                        <div className="cv-bar-fill" style={{ width: pct + "%" }} />
                      </div>
                      <div className="cv-score">{score.toFixed(5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="table-section">
              <div className="table-header">
                <div className="section-title" style={{ margin: 0 }}>Predictions</div>
                <span className="badge">{result.predictions.length} rows</span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Id</th>
                      <th>Predicted SalePrice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.predictions.map((row, i) => (
                      <tr key={row.Id}>
                        <td style={{ color: "#3a3858" }}>{i + 1}</td>
                        <td>{row.Id}</td>
                        <td className="price-cell">{fmt(row.SalePrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="json-section">
              <div className="json-header">
                <div className="section-title" style={{ margin: 0 }}>JSON Response (preview)</div>
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                  {copied ? "copied!" : "copy full JSON"}
                </button>
              </div>
              <JsonHighlight data={result} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
