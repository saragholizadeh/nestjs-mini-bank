export const SWAGGER_UI_SITE_TITLE = 'Mini Bank API Atlas';

export const SWAGGER_UI_FAVICON =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop stop-color=%22%2306b6d4%22/%3E%3Cstop offset=%221%22 stop-color=%22%23f59e0b%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect rx=%2216%22 width=%2264%22 height=%2264%22 fill=%22url(%23g)%22/%3E%3Cpath d=%22M20 18h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Zm4 8h16m-16 8h10%22 stroke=%22white%22 stroke-width=%224%22 stroke-linecap=%22round%22/%3E%3C/svg%3E';

export const SWAGGER_CUSTOM_CSS = `
html {
  background:
    radial-gradient(circle at top left, rgba(6, 182, 212, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 26%),
    linear-gradient(180deg, #08111f 0%, #0b1320 48%, #060b14 100%);
}

body {
  margin: 0;
  background: transparent;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.swagger-ui {
  color: #e5eef8;
}

.swagger-ui .topbar {
  background: rgba(8, 17, 31, 0.82);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  backdrop-filter: blur(18px);
}

.swagger-ui .topbar-wrapper {
  padding: 10px 18px;
}

.swagger-ui .topbar .link {
  display: flex;
  align-items: center;
}

.swagger-ui .topbar .download-url-wrapper {
  display: none;
}

.swagger-ui .info {
  margin: 28px 0 18px;
  padding: 28px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 15, 28, 0.72));
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
}

.swagger-ui .info .title {
  color: #f8fafc;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.swagger-ui .info .description,
.swagger-ui .info p,
.swagger-ui .info a {
  color: #cbd5e1;
}

.swagger-ui .scheme-container {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 22px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}

.swagger-ui .opblock {
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.swagger-ui .opblock.opblock-post {
  background: linear-gradient(135deg, rgba(17, 94, 89, 0.18), rgba(15, 23, 42, 0.92));
}

.swagger-ui .opblock.opblock-post .opblock-summary-method {
  background: #14b8a6;
}

.swagger-ui .opblock.opblock-post .opblock-summary-path {
  color: #e2e8f0;
}

.swagger-ui .btn {
  border-radius: 12px;
  box-shadow: none;
}

.swagger-ui .btn.authorize {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  border-color: transparent;
  color: #0f172a;
  font-weight: 700;
}

.swagger-ui .btn.execute {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
  border-color: transparent;
  color: #08111f;
  font-weight: 700;
}

.swagger-ui .btn.try-out__btn {
  border-color: rgba(148, 163, 184, 0.3);
  color: #dbeafe;
}

.swagger-ui table thead tr td,
.swagger-ui table thead tr th {
  color: #e2e8f0;
}

.swagger-ui .parameter__name,
.swagger-ui .response-col_status,
.swagger-ui .response-col_description,
.swagger-ui .parameter__type,
.swagger-ui .parameter__in {
  color: #cbd5e1;
}

.swagger-ui .model-box,
.swagger-ui .models,
.swagger-ui .renderedMarkdown {
  color: #cbd5e1;
}

.swagger-ui section.models {
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.swagger-ui .opblock-description-wrapper,
.swagger-ui .response-col_description__inner,
.swagger-ui .parameter__description {
  color: #cbd5e1;
}

.swagger-ui .highlight-code {
  border-radius: 14px;
}

.swagger-ui .info .title small pre {
  background: rgba(15, 23, 42, 0.58);
  color: #f8fafc;
}

.swagger-ui .opblock-tag {
  color: #f8fafc;
}

.swagger-ui .markdown code,
.swagger-ui .renderedMarkdown code {
  background: rgba(15, 23, 42, 0.72);
  color: #f9fafb;
}
`;
