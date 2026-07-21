-- Sequences backing human-readable codes (Activity.code, Quotation.code,
-- QuotationProject.code) generated via `SELECT nextval(...)` in the services.
CREATE SEQUENCE IF NOT EXISTS activity_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS quotation_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS project_code_seq START 1;
