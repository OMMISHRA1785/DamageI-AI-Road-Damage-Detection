
import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const analyzeImage = async () => {
    if (!file) {
      setError("Please select a road image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the AI server. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getHealthClass = (score) => {
    if (score >= 80) return "health-good";
    if (score >= 60) return "health-medium";
    if (score >= 40) return "health-warning";
    return "health-critical";
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">AI</div>

          <div>
            <h2>RoadVision</h2>
            <span>AI Infrastructure</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-item active">
            <span>◈</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>⌁</span>
            Road Analysis
          </div>

          <div className="nav-item">
            <span>◉</span>
            Damage Reports
          </div>

          <div className="nav-item">
            <span>⌖</span>
            Road Locations
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>AI System Online</strong>
              <small>FastAPI connected</small>
            </div>
          </div>

        </div>

      </aside>


      {/* MAIN AREA */}

      <div className="main-area">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <p className="eyebrow">INFRASTRUCTURE INTELLIGENCE</p>

            <h1>Road Analysis Dashboard</h1>

            <p className="subtitle">
              AI-powered road damage detection and maintenance prioritization
            </p>
          </div>

          <div className="top-status">
            <span className="live-dot"></span>
            Live Analysis System
          </div>

        </header>


        <main className="dashboard">


          {/* KPI CARDS */}

          <section className="kpi-grid">

            <div className="kpi-card">

              <div className="kpi-icon blue">
                ◉
              </div>

              <div>
                <span>Detection Engine</span>
                <strong>YOLO</strong>
                <small>Computer Vision</small>
              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon purple">
                ◇
              </div>

              <div>
                <span>Analysis Mode</span>
                <strong>Image</strong>
                <small>Road inspection</small>
              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon green">
                ✓
              </div>

              <div>
                <span>System Status</span>
                <strong>Online</strong>
                <small>API connected</small>
              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon orange">
                ⚡
              </div>

              <div>
                <span>AI Processing</span>
                <strong>Active</strong>
                <small>Ready for analysis</small>
              </div>

            </div>

          </section>


          {/* MAIN ANALYSIS GRID */}

          <section className="analysis-grid">


            {/* UPLOAD PANEL */}

            <div className="panel upload-panel">

              <div className="panel-header">

                <div>
                  <span className="section-label">01 / INPUT</span>

                  <h2>Road Image Analysis</h2>

                  <p>
                    Upload a road image to detect infrastructure damage.
                  </p>
                </div>

                <div className="ai-badge">
                  AI POWERED
                </div>

              </div>


              <label className="upload-zone">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {!preview ? (

                  <div className="upload-placeholder">

                    <div className="upload-icon">
                      ↑
                    </div>

                    <h3>Upload road image</h3>

                    <p>
                      Click to browse or select an image
                    </p>

                    <span>
                      JPG, JPEG or PNG
                    </span>

                  </div>

                ) : (

                  <div className="selected-file">

                    <img
                      src={preview}
                      alt="Selected road"
                    />

                    <div className="file-overlay">
                      <strong>Image ready</strong>
                      <span>Click to change image</span>
                    </div>

                  </div>

                )}

              </label>


              {file && (
                <div className="file-info">

                  <div>
                    <span>Selected file</span>
                    <strong>{file.name}</strong>
                  </div>

                  <span className="file-ready">
                    ✓ Ready
                  </span>

                </div>
              )}


              <button
                className="analyze-button"
                onClick={analyzeImage}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    AI is analyzing...
                  </>
                ) : (
                  <>
                    Analyze Road
                    <span>→</span>
                  </>
                )}

              </button>


              {error && (
                <div className="error-box">
                  ⚠ {error}
                </div>
              )}

            </div>


            {/* INFORMATION PANEL */}

            <div className="panel intelligence-panel">

              <div className="panel-header">

                <div>
                  <span className="section-label">02 / AI ENGINE</span>

                  <h2>Detection Pipeline</h2>

                  <p>
                    From image input to maintenance intelligence.
                  </p>
                </div>

              </div>


              <div className="pipeline">

                <div className="pipeline-step active-step">
                  <span>01</span>
                  <div>
                    <strong>Image Input</strong>
                    <small>Road image uploaded</small>
                  </div>
                </div>

                <div className="pipeline-line"></div>

                <div className="pipeline-step">
                  <span>02</span>
                  <div>
                    <strong>YOLO Detection</strong>
                    <small>Identify road damage</small>
                  </div>
                </div>

                <div className="pipeline-line"></div>

                <div className="pipeline-step">
                  <span>03</span>
                  <div>
                    <strong>Severity Engine</strong>
                    <small>Calculate damage severity</small>
                  </div>
                </div>

                <div className="pipeline-line"></div>

                <div className="pipeline-step">
                  <span>04</span>
                  <div>
                    <strong>Maintenance Priority</strong>
                    <small>Recommend repair priority</small>
                  </div>
                </div>

              </div>


              <div className="model-info">

                <span>MODEL</span>
                <strong>Road Damage Detection</strong>

                <span>CLASSES</span>
                <strong>4 Damage Types</strong>

              </div>

            </div>

          </section>


          {/* RESULTS */}

          {result && (

            <section className="results-section">

              <div className="results-heading">

                <div>
                  <span className="section-label">03 / ANALYSIS RESULT</span>

                  <h2>AI Inspection Report</h2>

                  <p>
                    Automated road condition assessment.
                  </p>
                </div>

                <div className="report-status">
                  ✓ Analysis Complete
                </div>

              </div>


              {/* RESULT STATISTICS */}

              <div className="result-stats">

                <div className="result-stat">

                  <span>Detected Damage</span>

                  <strong>
                    {result.damage_count}
                  </strong>

                  <small>
                    Objects identified
                  </small>

                </div>


                <div className="result-stat health-result">

                  <span>Road Health</span>

                  <strong className={getHealthClass(result.road_health_score)}>
                    {result.road_health_score}
                    <small>/100</small>
                  </strong>

                  <div className="health-bar">
                    <div
                      style={{
                        width: `${result.road_health_score}%`,
                      }}
                    ></div>
                  </div>

                </div>


                <div className="result-stat">

                  <span>Repair Priority</span>

                  <strong
                    className={
                      "priority " +
                      result.repair_priority.toLowerCase()
                    }
                  >
                    {result.repair_priority}
                  </strong>

                  <small>
                    Maintenance recommendation
                  </small>

                </div>

              </div>


              {/* IMAGE + DETAILS */}

              <div className="result-grid">


                {/* AI IMAGE */}

                <div className="result-image-card">

                  <div className="result-card-header">

                    <div>
                      <span className="section-label">
                        COMPUTER VISION
                      </span>

                      <h3>Detection Output</h3>
                    </div>

                    <span className="image-status">
                      AI PROCESSED
                    </span>

                  </div>

                  {result.annotated_image && (
                    <img
                      className="result-image"
                      src={
                        "data:image/jpeg;base64," +
                        result.annotated_image
                      }
                      alt="AI detected road damage"
                    />
                  )}

                </div>


                {/* DAMAGE DETAILS */}

                <div className="damage-panel">

                  <div className="result-card-header">

                    <div>
                      <span className="section-label">
                        DETECTIONS
                      </span>

                      <h3>Damage Details</h3>
                    </div>

                  </div>


                  {result.detections.length === 0 ? (

                    <div className="no-damage">
                      <div>✓</div>
                      <strong>No road damage detected</strong>
                      <span>
                        The AI model did not identify any road damage.
                      </span>
                    </div>

                  ) : (

                    <div className="detections">

                      {result.detections.map((damage, index) => (

                        <div
                          className="damage"
                          key={index}
                        >

                          <div className="damage-top">

                            <div className="damage-number">
                              0{index + 1}
                            </div>

                            <div>
                              <span className="damage-label">
                                DAMAGE TYPE
                              </span>

                              <h4>
                                {damage.class.replaceAll("_", " ")}
                              </h4>
                            </div>

                            <strong
                              className={
                                "severity " +
                                damage.severity.toLowerCase()
                              }
                            >
                              {damage.severity}
                            </strong>

                          </div>


                          <div className="damage-metrics">

                            <div>
                              <span>Confidence</span>

                              <strong>
                                {(damage.confidence * 100).toFixed(1)}%
                              </strong>
                            </div>

                            <div>
                              <span>Area</span>

                              <strong>
                                {damage.damage_area_percentage}%
                              </strong>
                            </div>

                            <div>
                              <span>Severity Score</span>

                              <strong>
                                {damage.severity_score}
                              </strong>
                            </div>

                          </div>


                          <div className="bounding-box">

                            <span>BOUNDING BOX</span>

                            <code>
                              ({damage.bounding_box.x1},{" "}
                              {damage.bounding_box.y1}) → (
                              {damage.bounding_box.x2},{" "}
                              {damage.bounding_box.y2})
                            </code>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              </div>

            </section>

          )}


          {/* EMPTY STATE */}

          {!result && !loading && (

            <section className="empty-dashboard">

              <div className="empty-icon">
                ◇
              </div>

              <div>
                <span className="section-label">
                  READY FOR INSPECTION
                </span>

                <h2>
                  Upload a road image to begin
                </h2>

                <p>
                  The AI system will detect damage, estimate severity,
                  calculate road health and recommend repair priority.
                </p>
              </div>

              <div className="empty-flow">

                <span>IMAGE</span>
                <b>→</b>
                <span>AI DETECTION</span>
                <b>→</b>
                <span>SEVERITY</span>
                <b>→</b>
                <span>PRIORITY</span>

              </div>

            </section>

          )}

        </main>

      </div>

    </div>
  );
}

export default App;

