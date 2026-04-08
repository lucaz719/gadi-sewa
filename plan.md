# GadiSewa — Project Evaluation & Nepali Market Readiness Plan

> **Date:** 2026-04-08
> **Project:** GadiSewa — Garage & Vehicle Service Management SaaS
> **Stack:** React 19 + TypeScript (Vite) | Python FastAPI + SQLAlchemy | SQLite
> **Status:** 🟡 Development / Pre-Production — **NOT production-ready**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Feature Inventory](#2-feature-inventory)
3. [Bugs & Issues](#3-bugs--issues)
4. [Security Vulnerabilities](#4-security-vulnerabilities)
5. [Nepali Market Readiness](#5-nepali-market-readiness)
6. [Code Quality Assessment](#6-code-quality-assessment)
7. [Testing Status](#7-testing-status)
8. [Deployment Readiness](#8-deployment-readiness)
9. [Recommended Changes — Action Plan](#9-recommended-changes--action-plan)
10. [Priority Roadmap](#10-priority-roadmap)

---

## 1. Project Overview

GadiSewa is a multi-role SaaS platform for garage/vehicle service management targeting the Nepali market. It has four user roles:

| Role | Portal | Pages |
|------|--------|-------|
| **Garage Owner** | Main dashboard | Dashboard, Jobs, Inventory, POS, Customers, Staff, Financials, Reports, Appointments, Marketing |
| **Admin (Platform)** | `/admin` | Enterprise management, User management, Plans, Vouchers, Revenue, Notifications, Global Catalog |
| **Vendor** | `/vendor` | Products, Orders, Network, POS, Financials, Marketing |
| **Customer** | `/customer` | Vehicles, Book Service, Service History, Fuel Log, Offers, Emergency SOS |

**Total Pages:** ~57 | **API Endpoints:** ~90+ | **Database Tables:** 23

---

## 2. Feature Inventory

### ✅ Implemented Features

#### Core Business
- [x] Job board with Kanban-style status tracking (New → In Progress → QC → Ready → Completed)
- [x] Job creation with AI-powered complaint analysis (Gemini integration)
- [x] Inventory management (CRUD, stock tracking, category filters)
- [x] Point of Sale (POS) with cart, held carts, keypad, checkout modal
- [x] Customer relationship management (CRM) with service reminders
- [x] Staff management with attendance and salary tracking
- [x] Appointment scheduling and booking
- [x] Financial tracking (income/expenses, cash flow, invoices)
- [x] Reports with charts (Recharts library)

#### Platform (Admin)
- [x] Multi-enterprise SaaS architecture (enterprise_id filtering)
- [x] Enterprise registration → approval workflow
- [x] Subscription plan management (Free, Basic, Pro, Enterprise)
- [x] Voucher/discount code system
- [x] Global parts catalog managed by admin
- [x] Activity logging / audit trail
- [x] Platform-wide notifications
- [x] Revenue analytics (MRR, churn rate)
- [x] User management (activate/deactivate, password reset)

#### Marketplace (B2B)
- [x] Vendor product catalog
- [x] Garage → Vendor ordering system
- [x] Order status tracking (New → Processing → Shipped → Delivered)
- [x] Bulk product import (vendor)

#### Gamification
- [x] GadiPoints reward system
- [x] Referral tracking with codes
- [x] Achievement badges
- [x] Loyalty tiers (Bronze → Silver → Gold → Platinum)

#### Customer Portal
- [x] Vehicle gallery with service status
- [x] Service booking
- [x] Service history timeline
- [x] Fuel log tracker
- [x] Emergency SOS page
- [x] Offers & rewards view

#### AI Integration
- [x] Gemini-powered complaint analysis (suggests causes, repair steps, labor estimate)
- [x] AI Assistant floating widget (chat interface)
- [x] AI-generated parts catalog

### ❌ Not Implemented (UI Exists, Backend Missing)
- [ ] Real payment gateway processing (eSewa, Khalti, FonePay — UI dropdown only)
- [ ] Email/SMS notifications
- [ ] Image/file uploads (profile photos, vehicle images, product photos)
- [ ] PDF/CSV report export
- [ ] Real-time updates (WebSocket)
- [ ] Two-factor authentication
- [ ] Full-text search across jobs/products/customers
- [ ] Customer vehicles API (hardcoded in frontend)
- [ ] Fuel log API (hardcoded)
- [ ] Service history API (hardcoded)
- [ ] Marketing campaigns backend
- [ ] Proper invoice PDF generation

---

## 3. Bugs & Issues

### 🔴 Critical Bugs

| # | Bug | Location | Details |
|---|-----|----------|---------|
| B1 | **Password "hashing" is fake** | `backend/api_routes/auth.py` | `verify_password()` checks `f"hashed_{plain}" == stored`. Passwords stored as `hashed_<plaintext>`. Not real hashing. |
| B2 | **Admin token hardcoded** | `backend/api_routes/auth.py` | `ADMIN_ACCESS_TOKEN = "GS-ADMIN-2026"` fallback. Anyone can log in as admin. |
| B3 | **No authorization on routes** | All backend routes | No middleware checks user role. A customer can call `/admin/enterprises` or `/admin/users/{id}/reset-password`. |
| B4 | **Plaintext password returned in API** | `backend/api_routes/admin_ops.py` | `/registrations/{id}/approve` returns `"password": password` in JSON response. |
| B5 | **Enterprise ID defaults to 1** | `backend/api_routes/crm_ops.py` | `enterprise_id: int = 1` — if not provided, queries enterprise 1's data. Multi-tenant data leak. |

### 🟠 High Bugs

| # | Bug | Location | Details |
|---|-----|----------|---------|
| B6 | **Inconsistent currency symbols** | Multiple pages | Mix of `₹` (Indian Rupee), `Rs.`, and `NPR` across UI. Should be consistent `NPR` or `रु`. |
| B7 | **Indian vehicle registration format** | `JobList.tsx`, `CreateJob.tsx`, customer pages | Hardcoded `MH-01-AB-1234` (Maharashtra, India). Nepal uses `BA 1 Pa 1234` format. |
| B8 | **Mock data not synced with backend** | Customer portal pages | `CustomerDashboard.tsx`, `MyVehicles.tsx`, `FuelLog.tsx` use hardcoded arrays instead of API calls. |
| B9 | **CRM follow-up rate is hardcoded** | `backend/api_routes/crm_ops.py` | `followup_rate: 85.5 # Mocked for now` — not calculated from real data. |
| B10 | **No error handling on API failures** | Frontend pages | Dashboard and other pages don't show error states when API calls fail. Can result in blank screens. |

### 🟡 Medium Bugs

| # | Bug | Location | Details |
|---|-----|----------|---------|
| B11 | Missing loading states on some pages | Various | Some pages jump from empty → data without loading indicator. |
| B12 | Dark mode inconsistencies | Various | Some modals/dropdowns don't respect dark mode theme. |
| B13 | POS held cart doesn't persist customer assignment | `POS.tsx` | Customer linked to cart may not be preserved when recalling held cart. |
| B14 | Sidebar navigation doesn't highlight sub-routes | `App.tsx` | Navigating to `/jobs/123` doesn't highlight "Jobs" in sidebar. |
| B15 | Registration form doesn't validate email format | `Registration.tsx` | Client-side email validation missing on registration form. |

---

## 4. Security Vulnerabilities

### 🔴 CRITICAL (Must Fix Before Any Deployment)

| # | Vulnerability | Risk | Location |
|---|--------------|------|----------|
| S1 | **API Key exposed in repo** | API abuse, billing | `backend/.env` → `GEMINI_API_KEY=AIzaSy...` committed to Git |
| S2 | **SSH private keys in repo** | Server takeover | `deployment_keys/id_rsa` — private key committed to GitHub |
| S3 | **SQLite database file in repo** | Data breach | `gadisewa.db` and `backend/gadisewa.db` — all user data exposed |
| S4 | **Fake password hashing** | Account takeover | `hashed_{plaintext}` — anyone with DB access reads all passwords |
| S5 | **No route authorization** | Privilege escalation | Any authenticated user can call any API endpoint regardless of role |
| S6 | **Hardcoded admin token** | Admin impersonation | `GS-ADMIN-2026` default token allows anyone to become admin |
| S7 | **No CSRF protection** | Cross-site forgery | No CSRF tokens on any POST endpoint |

### 🟠 HIGH

| # | Vulnerability | Risk | Location |
|---|--------------|------|----------|
| S8 | No rate limiting | Brute-force login | `/auth/login` has unlimited attempts |
| S9 | No HTTPS enforcement | Data interception | CORS allows `http://` origins |
| S10 | Password returned in API response | Credential exposure | `/registrations/{id}/approve` leaks password |
| S11 | No input length validation | DoS/buffer overflow | String fields accept unlimited length |
| S12 | SQLite for multi-user production | Data corruption | SQLite doesn't handle concurrent writes safely |

### 🟡 MEDIUM

| # | Vulnerability | Risk | Location |
|---|--------------|------|----------|
| S13 | No audit log for sensitive operations | Compliance gap | Password resets, user deactivation not logged completely |
| S14 | JWT secret not configured | Token forgery | No proper JWT secret management visible |
| S15 | No Content Security Policy headers | XSS attacks | Missing CSP, X-Frame-Options headers |

---

## 5. Nepali Market Readiness

### Current Score: **15/100** 🔴

| Requirement | Status | Priority | Details |
|------------|--------|----------|---------|
| **Nepali Language (नेपाली)** | ❌ None | P0 | Entire UI is English-only. No i18n framework. Nepal has ~50% English literacy. Must support Nepali UI. |
| **Bikram Sambat (BS) Calendar** | ❌ None | P0 | All dates use Gregorian. Nepal officially uses BS calendar (e.g., 2083 Baisakh 25). Need date picker + conversion library. |
| **NPR Currency (रु)** | ⚠️ Inconsistent | P0 | Mixed `₹`/`Rs.`/`NPR`. Must standardize to `NPR` or `रु` with Nepali number formatting (1,00,000 not 100,000). |
| **eSewa / Khalti / FonePay** | ⚠️ UI Only | P1 | Payment method dropdown exists but no actual API integration. These are the primary digital payment methods in Nepal. |
| **Vehicle Registration (Nepal)** | ❌ Wrong Format | P1 | Uses Indian format `MH-01-AB-1234`. Nepal format: `BA 1 Pa 1234` or `Bagmati 01-001-Pa 1234`. |
| **Nepal Phone Format** | ⚠️ Partial | P2 | Some places show `98XXXXXXXX` (correct 10-digit) but no validation regex (`^(97|98)\d{8}$`). |
| **Nepal Address Structure** | ❌ None | P2 | Nepal uses Province → District → Municipality → Ward. No structured address fields. |
| **VAT / Tax (PAN/VAT)** | ❌ None | P1 | Nepal requires 13% VAT on services. No tax calculation in POS or invoices. Businesses need PAN/VAT number field. |
| **Nepali Business Registration** | ❌ Generic | P2 | Registration form is generic. Should ask for PAN number, Company Registration Office number, etc. |
| **SMS via Nepal Telecom / Ncell** | ❌ None | P2 | Nepal relies heavily on SMS. Need local SMS gateway (Sparrow SMS, Aakash SMS). |
| **Offline Support** | ❌ None | P1 | Internet unreliable in many parts of Nepal. Need offline-first PWA with sync. |
| **Nepali Fiscal Year** | ❌ None | P1 | Nepal fiscal year: Shrawan 1 to Ashadh end (mid-July to mid-July). Financial reports must align. |

### Key Insight
> The app name "GadiSewa" (गाडी सेवा = Vehicle Service) is Nepali, but the product itself has zero Nepali localization. This is the **single biggest gap** for market readiness.

---

## 6. Code Quality Assessment

| Metric | Score | Notes |
|--------|-------|-------|
| TypeScript type safety | 40% | Heavy use of `any` type. Many props untyped. |
| Error handling | 20% | Most API calls have no try/catch or error UI |
| Component reusability | 15% | Only 6 components. Pages are monolithic (1000+ line files) |
| Code documentation | 10% | No JSDoc, no README for backend API, minimal comments |
| API response consistency | 50% | Mix of Pydantic models and raw dicts in responses |
| Frontend-backend sync | 40% | ~60% of frontend data is hardcoded mock, not from API |
| Accessibility (a11y) | 30% | Basic semantic HTML, no ARIA labels, no keyboard nav |
| Mobile responsiveness | 60% | Tailwind responsive classes used, but tables/modals need work |
| Dark mode support | 80% | Mostly working, some edge case inconsistencies |

---

## 7. Testing Status

| Type | Coverage | Status |
|------|----------|--------|
| **E2E Tests (TestCafe)** | ~12 test files | ✅ Exist but fragile (fixed `wait()` calls) |
| **Unit Tests (Frontend)** | 0% | ❌ None |
| **Unit Tests (Backend)** | 0% | ❌ None |
| **API Integration Tests** | 0% | ❌ None (test files exist but are stubs) |
| **Security Tests** | 0% | ❌ None |
| **Performance Tests** | 0% | ❌ None |
| **CI/CD Pipeline** | N/A | ❌ No GitHub Actions or automated pipeline |

---

## 8. Deployment Readiness

| Requirement | Status | Notes |
|------------|--------|-------|
| Docker/containerization | ❌ | No Dockerfile or docker-compose |
| Environment config (.env.example) | ❌ | Real `.env` committed with secrets |
| Database migrations | ❌ | Using `create_all()`, no Alembic |
| Production database | ❌ | SQLite only, need PostgreSQL |
| Reverse proxy (Nginx) | ❌ | Not configured |
| SSL/HTTPS | ❌ | Not configured |
| Health check endpoint | ❌ | No `/health` route |
| Logging / monitoring | ❌ | No structured logging, no Sentry |
| Backup strategy | ❌ | No database backup automation |
| Domain / DNS | ❌ | Not configured |
| CDN for static assets | ❌ | Not configured |
| CORS for production | ❌ | Only localhost origins allowed |

---

## 9. Recommended Changes — Action Plan

### Phase 1: 🚨 Security Hardening (Week 1-2)

- [ ] **Revoke all exposed secrets** — Rotate Gemini API key, regenerate SSH keys, remove from Git history using `git filter-branch` or BFG
- [ ] **Add `.env` to `.gitignore`** — Create `.env.example` with placeholder values
- [ ] **Remove `deployment_keys/`** — Delete private keys from repo, use GitHub Secrets or Vault
- [ ] **Remove `gadisewa.db`** — Add `*.db` to `.gitignore`
- [ ] **Implement real password hashing** — Use `passlib[bcrypt]` (already in requirements.txt!) to replace `hashed_{plaintext}`
- [ ] **Add role-based authorization middleware** — Create `get_current_user()` dependency that validates JWT and checks role on every route
- [ ] **Generate proper JWT tokens** — Use `python-jose` (already in requirements!) with secure secret key
- [ ] **Remove hardcoded admin token** — Use proper admin user accounts with hashed passwords
- [ ] **Add CSRF protection** — Use FastAPI CSRF middleware
- [ ] **Add rate limiting** — Use `slowapi` or similar on `/auth/login`
- [ ] **Stop returning passwords in API** — Remove password field from approval response

### Phase 2: 🇳🇵 Nepali Market Localization (Week 2-4)

- [ ] **Set up i18n framework** — Use `react-i18next` with `ne` (Nepali) and `en` (English) locales
- [ ] **Translate all UI strings** — Extract ~500 strings, create `ne.json` translation file
- [ ] **Add Bikram Sambat date support** — Use `nepali-date-converter` library for BS↔AD conversion
- [ ] **Standardize currency to NPR** — Replace all `₹`, `Rs.` with `NPR` or `रु`. Use Nepali number format.
- [ ] **Fix vehicle registration format** — Change `MH-01-AB-1234` → `BA 1 Pa 1234` with Nepal-format validation
- [ ] **Add Nepal phone validation** — Regex: `^(97|98)\d{8}$` for mobile numbers
- [ ] **Add VAT/Tax calculation** — 13% VAT on services, PAN number field for businesses
- [ ] **Add Nepal address fields** — Province → District → Municipality → Ward dropdowns
- [ ] **Integrate eSewa payment API** — Real eSewa merchant integration for POS
- [ ] **Integrate Khalti payment API** — Khalti payment gateway for online payments
- [ ] **Add Nepal fiscal year support** — Shrawan-to-Ashadh financial reporting period
- [ ] **Add Nepali font support** — Ensure `Noto Sans Devanagari` or `Mukta` font loaded for Nepali text

### Phase 3: 🐛 Bug Fixes & Data Integration (Week 3-4)

- [ ] **Connect customer vehicles to API** — Create `/customer/vehicles` endpoint and replace hardcoded arrays
- [ ] **Connect fuel log to API** — Create `/customer/fuel-log` endpoint
- [ ] **Connect service history to API** — Create `/customer/service-history` endpoint
- [ ] **Fix CRM follow-up rate** — Calculate from real data instead of hardcoded 85.5
- [ ] **Add error boundaries** — Wrap pages in React error boundaries with retry UI
- [ ] **Add loading states** — Consistent skeleton/spinner on all data-fetching pages
- [ ] **Fix sidebar active state** — Highlight parent route for sub-routes
- [ ] **Add form validation** — Client-side validation on all forms (email, phone, required fields)
- [ ] **Fix currency consistency** — Single source of truth for currency symbol/format

### Phase 4: 🏗 Infrastructure & DevOps (Week 4-5)

- [ ] **Switch to PostgreSQL** — Replace SQLite with PostgreSQL for production
- [ ] **Set up Alembic migrations** — Database schema versioning
- [ ] **Create Dockerfile** — Multi-stage build for frontend + backend
- [ ] **Create docker-compose.yml** — App + PostgreSQL + Redis (for rate limiting)
- [ ] **Set up Nginx reverse proxy** — SSL termination, static file serving
- [ ] **Add health check endpoint** — `GET /health` with DB connectivity check
- [ ] **Set up CI/CD** — GitHub Actions for lint, test, build, deploy
- [ ] **Add structured logging** — Use Python `logging` module with JSON format
- [ ] **Set up error monitoring** — Integrate Sentry for crash reporting
- [ ] **Configure production CORS** — Whitelist actual domain instead of localhost
- [ ] **Set up database backups** — Automated daily PostgreSQL backups

### Phase 5: 🧪 Testing & Quality (Week 5-6)

- [ ] **Add pytest for backend** — Unit tests for all API routes using FastAPI TestClient
- [ ] **Add frontend unit tests** — Vitest + React Testing Library for components
- [ ] **Fix E2E test reliability** — Replace `wait()` with proper TestCafe selectors/assertions
- [ ] **Add API integration tests** — Test full request/response cycle
- [ ] **Add security tests** — Test authorization, input validation, SQL injection
- [ ] **Set up test coverage reports** — Aim for 70%+ backend, 50%+ frontend
- [ ] **Add negative test cases** — Wrong password, invalid input, unauthorized access

### Phase 6: ✨ Feature Completion (Week 6-8)

- [ ] **Real payment processing** — eSewa/Khalti SDK integration with callback handling
- [ ] **SMS notifications** — Sparrow SMS or Aakash SMS API for appointment reminders
- [ ] **Email notifications** — SMTP setup for invoices, order confirmations
- [ ] **PDF invoice generation** — Use `reportlab` or `weasyprint` for invoice PDFs
- [ ] **Image upload** — Vehicle photos, product images, profile pictures (S3 or local storage)
- [ ] **Offline/PWA support** — Service worker for offline data access in areas with poor internet
- [ ] **Search functionality** — Full-text search across jobs, customers, products
- [ ] **Report export** — CSV/PDF export for financial reports
- [ ] **Component library** — Extract reusable Button, Card, Modal, Form components
- [ ] **API documentation** — Auto-generate Swagger/OpenAPI docs from FastAPI

---

## 10. Priority Roadmap

```
Week 1-2: 🚨 SECURITY (Phase 1)
  ├── Remove all secrets from repo
  ├── Implement real password hashing (bcrypt)
  ├── Add role-based access control
  ├── Proper JWT authentication
  └── Rate limiting & CSRF

Week 2-4: 🇳🇵 LOCALIZATION (Phase 2)
  ├── i18n setup (English + Nepali)
  ├── Bikram Sambat date system
  ├── NPR currency standardization
  ├── Nepal vehicle registration format
  ├── VAT/Tax calculation (13%)
  └── Nepal address structure

Week 3-4: 🐛 BUG FIXES (Phase 3)
  ├── Connect all mock data to real APIs
  ├── Error boundaries & loading states
  ├── Form validation
  └── Currency & format consistency

Week 4-5: 🏗 INFRASTRUCTURE (Phase 4)
  ├── PostgreSQL migration
  ├── Docker + Nginx setup
  ├── CI/CD pipeline
  ├── Monitoring & logging
  └── Database backups

Week 5-6: 🧪 TESTING (Phase 5)
  ├── Backend unit tests (pytest)
  ├── Frontend unit tests (vitest)
  ├── Security tests
  └── Coverage reporting

Week 6-8: ✨ FEATURES (Phase 6)
  ├── Real payment integration (eSewa/Khalti)
  ├── SMS/Email notifications
  ├── PDF generation
  ├── Image uploads
  └── Offline PWA support
```

---

## Summary

| Area | Current State | Target State | Gap |
|------|--------------|-------------|-----|
| Security | 🔴 Critical flaws | 🟢 Production hardened | Large |
| Nepali Localization | 🔴 Not started | 🟢 Full Nepali UI + BS dates + NPR | Large |
| Feature Completeness | 🟡 60% UI, 40% API | 🟢 90%+ end-to-end | Medium |
| Code Quality | 🟡 Functional but messy | 🟢 Typed, documented, modular | Medium |
| Testing | 🔴 Near zero coverage | 🟢 70%+ coverage | Large |
| Deployment | 🔴 Not ready | 🟢 Containerized, CI/CD, monitored | Large |

**Bottom Line:** GadiSewa has an ambitious and well-thought-out feature set with solid architectural choices (React + FastAPI). However, it requires **6-8 weeks of focused work** across security, localization, and infrastructure before it can be deployed for real Nepali users. The most urgent priority is **security hardening** (secrets exposure, fake password hashing, missing authorization), followed by **Nepali market localization** (language, calendar, currency, payment gateways).
