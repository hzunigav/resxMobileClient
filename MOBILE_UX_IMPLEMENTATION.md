# Mobile UX Implementation Plan

**Project:** ResXperience Ionic Mobile App
**Status:** 🚧 In Progress - Phases 1-4 Complete
**Last Updated:** December 25, 2025
**Languages:** English & Spanish

---

## 🎯 Objective

Transform the ionic4j mobile app to implement the optimal MVP customer experience with a streamlined "Scan & Chat" workflow:

1. **Unified Auth Screen** - Single login/register interface with auto-login
2. **Home/Scanner** - Primary QR code scanning interface
3. **Service Chat** - Combined chat + menu ordering interface

---

## 📊 Current State

### ✅ Strengths
- NgModule-based Ionic 8 + Angular 18 architecture
- Complete cart → order-confirmation → order-status flow
- JWT authentication with interceptors configured
- Tailwind CSS with ResXperience design system configured
- Capacitor plugins installed (camera, network, push-notifications)
- Network status monitoring and push notifications integrated
- Entity services for Service, Order, MenuItem, ChatMessage ready

### ✅ Completed (Phases 1-4)
- ✅ Unified auth screen with login/register toggle and auto-login
- ✅ QR code scanning with jsQR + Capacitor Camera
- ✅ Service chat interface with message polling
- ✅ Menu modal component with category filtering
- ✅ Service status persistence with Capacitor Preferences
- ✅ Updated routing (auth, home, service/:id)
- ✅ Simplified tab navigation (Home, Orders, Account)
- ✅ AUTH and HOME translation keys (EN/ES)
- ✅ ResXperience design system applied to new pages

### 🔄 Remaining Tasks
- Add SERVICE_CHAT and MENU translation keys
- Implement cart persistence with Capacitor Preferences
- Fix hardcoded SERVICE_ID in order-confirmation page
- Apply design system to existing pages (cart, order-status, account)
- Backend endpoint coordination (active service, chat polling)

---

## 🏗️ Implementation Phases

### Phase 1: Foundation & Routing Setup ✅ COMPLETE

**Status:** ✅ **COMPLETED**

**Goals:**
- ✅ Update main routing with new screens
- ✅ Fix auth guard redirect
- ✅ Simplify tab navigation structure

**Implementation Notes:**
- Updated `app-routing.module.ts` with routes: `/auth`, `/home`, `/service/:id`
- Modified `user-route-access.service.ts:49` to redirect to `/auth` instead of `/accessdenied`
- Updated `tabs.router.module.ts` to show: Home (QR Scanner), Orders, Account
- Updated `tabs.page.html` with new icons: qr-code, receipt, person
- Created separate `service-chat-routing.module.ts` with auth guard

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-1-foundation--routing-setup) Phase 1

---

### Phase 2: Unified Auth Screen ✅ COMPLETE

**Status:** ✅ **COMPLETED**

**Goals:**
- ✅ Create NgModule-based auth page
- ✅ Implement auto-login after signup
- ✅ Add language selector (EN/ES)
- ✅ Apply ResXperience design system

**Implementation Notes:**
- Created complete auth page (5 files: page.ts, page.html, page.scss, module.ts, routing.module.ts)
- Implemented toggle between login/register modes with ion-segment
- Email automatically used as username (no separate username field)
- Auto-login after successful registration using `LoginService.login()`
- Language toggle (EN ↔ ES) with Capacitor Preferences persistence
- Glassmorphism design with ResXperience colors (#10b981 Electric Emerald)
- Added AUTH.* translation keys to en.json and es.json
- Form validation with error handling for existing users and invalid passwords

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-2-unified-auth-screen) Phase 2

---

### Phase 3: QR Scanner Home Screen ✅ COMPLETE

**Status:** ✅ **COMPLETED**

**Goals:**
- ✅ Install QR scanner plugins (Camera + jsQR approach)
- ✅ Create home/scanner page
- ✅ Implement service auto-creation
- ✅ Add active service detection with persistence

**Implementation Notes:**
- Installed `jsqr` package for QR code decoding (ML Kit incompatible with Capacitor 7)
- Created `qr-scanner.service.ts` using @capacitor/camera + jsQR
- Created `service-status.service.ts` with Capacitor Preferences persistence
- Updated home page with QR scanning functionality and UI
- Implemented service auto-creation with backend ServiceService integration
- QR code parsing for format: `resx://table/{tableId}/restaurant/{restaurantId}`
- User greeting with avatar icon
- Large centered scan button with loading state
- Manual code entry fallback dialog
- Active service resume banner (sticky bottom with slideUp animation)
- Network status monitoring with offline indicator
- Added HOME.* translation keys to en.json and es.json
- Mobile-first responsive design with ResXperience colors

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-3-qr-scanner-home-screen) Phase 3

---

### Phase 4: Service Chat Interface ✅ COMPLETE (Core)

**Status:** ✅ **CORE COMPLETE** - Remaining: Translation keys, cart persistence, order-confirmation fix

**Goals:**
- ✅ Create service chat page with timeline
- ✅ Implement chat message polling (with deduplication & retry)
- ✅ Create menu modal component
- 🔄 Update cart persistence (TODO)
- 🔄 Fix hardcoded service ID in order confirmation (TODO)

**Implementation Notes:**
- Created `chat-polling.service.ts` with 5-second polling, deduplication, and retry logic
- Created complete service-chat page (page.ts, page.html, page.scss, module.ts, routing.module.ts)
- Implemented chat timeline with message bubbles (server left, customer right)
- Order cards embedded in chat with status badges
- Message input footer with send button
- Auto-scroll to bottom on new messages
- OnDestroy cleanup (stops polling when leaving page)
- Created `menu-modal` component (component.ts, component.html, component.scss)
- Menu modal with scrollable category tabs
- Menu items grid with images, descriptions, and pricing
- Size selection support with add-to-cart buttons
- Cart integration and footer with item count
- Responsive grid layout (280px minimum per item)

**Remaining Tasks:**
- ⏳ Add SERVICE_CHAT.* and MENU.* translation keys to en.json and es.json
- ⏳ Implement cart persistence using Capacitor Preferences in cart.service.ts
- ⏳ Fix hardcoded SERVICE_ID in order-confirmation.page.ts (use ServiceStatusService)

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-4-service-chat-interface) Phase 4

---

### Phase 5: Internationalization (i18n) - English & Spanish (Weeks 1-3)

**Goals:**
- ✅ Set up translation files (en.json, es.json)
- ✅ Add language persistence
- ✅ Add language selectors to pages
- ✅ Translate all user-facing text

**Files to Modify:**
```
src/assets/i18n/
├── en.json  # English translations
└── es.json  # Spanish translations

src/app/app.component.ts  # Language initialization
```

**Translation Keys:**
- `AUTH.*` - Auth screen labels
- `HOME.*` - Home/scanner screen
- `SERVICE_CHAT.*` - Chat interface
- `MENU.*` - Menu modal
- `ORDER_STATUS.*` - Order statuses
- `QR_SCANNER.*` - Scanner messages
- `ERRORS.*` - Error messages

**Language Persistence:**
- Saved to Capacitor Preferences (`language` key)
- Loaded on app init
- Toggle button in page headers (EN ↔ ES)

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-5-internationalization-i18n---english--spanish) Phase 5

---

### Phase 6: Design System Application (Week 4)

**Goals:**
- ✅ Update Ionic theme variables with ResXperience colors
- ✅ Create reusable component styles
- ✅ Apply design system to all pages

**Files to Modify:**
```
src/theme/variables.scss  # Ionic color variables
src/global.scss          # Reusable classes
```

**Color Palette:**
```scss
--ion-color-primary: #10B981;   // Electric Emerald
--ion-color-secondary: #1E293B; // Midnight Slate
--ion-color-tertiary: #3B82F6;  // System Blue
--ion-color-success: #10B981;   // Electric Emerald
--ion-color-warning: #F59E0B;   // Alert Amber
--ion-color-danger: #EF4444;    // Ember Red
```

**Global Classes:**
- `.glass-card` - Glassmorphism card
- `.btn-primary` - Primary action button
- `.input-field` - Input field styling
- `.badge-*` - Status badges (pending, confirmed, preparing, delivered, rejected)

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-6-design-system-application) Phase 6

---

### Phase 7: Integration & Testing (Week 4)

**Goals:**
- ✅ Update default navigation flow
- ✅ Coordinate backend endpoint implementation
- ✅ Complete comprehensive testing
- ✅ Test on real devices

**Backend Coordination Required:**

**1. Fix ServiceResource.java TODOs:**
- Lines 219, 237, 274: Replace with `SecurityUtils.getCurrentUserProfileId()`

**2. New Endpoints Needed:**
- `GET /api/services/active` - Get current user's active service
- `GET /api/chat-messages?serviceId={id}&since={lastMessageId}` - Poll new messages

**3. Repository Methods:**
- `ServiceRepository.findFirstByCustomerIdAndStatusInOrderByInitiatedAtDesc()`
- `ChatMessageRepository.findByServiceIdAndIdGreaterThanOrderBySentAtAsc()`

**Testing Checklist:**
- [ ] Authentication (register, auto-login, login, toggle modes)
- [ ] QR Scanning (permissions, scan, manual entry, resume banner)
- [ ] Service Chat (messages, polling, timestamps, order cards)
- [ ] Menu & Cart (categories, add to cart, checkout, order)
- [ ] Design System (colors, buttons, badges, offline indicator)
- [ ] i18n (language switching, persistence, all pages)
- [ ] Offline Behavior (disabled actions, indicators)

**Details:** See [docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md#phase-7-integration--testing) Phase 7

---

## 🗂️ Critical Files Reference

### Frontend Files to Create

**Pages (NgModule Pattern):**
1. `src/app/pages/auth/` - Unified login/register (5 files)
2. `src/app/pages/home/` - QR scanner home (5 files)
3. `src/app/pages/service-chat/` - Chat + menu (8 files including modal component)

**Services:**
4. `src/app/services/qr-scanner/qr-scanner.service.ts`
5. `src/app/services/chat/chat-polling.service.ts`
6. `src/app/services/service-status/service-status.service.ts`

### Frontend Files to Modify

1. `src/app/app-routing.module.ts` - Add routes
2. `src/app/services/auth/user-route-access.service.ts` - Line 49 redirect
3. `src/app/pages/order-confirmation/order-confirmation.page.ts` - Lines 27, 90, 108
4. `src/app/services/cart/cart.service.ts` - Add persistence
5. `src/app/app.component.ts` - Init services, load cart, restore service
6. `src/theme/variables.scss` - ResXperience colors
7. `src/global.scss` - Reusable classes
8. `src/app/pages/tabs/tabs-routing.module.ts` - Simplify tabs

### Backend Files to Modify (RESx/)

1. `ServiceResource.java` - Fix TODOs, add `/services/active` endpoint
2. `ServiceService.java` - Add `findActiveByCustomerId()`
3. `ServiceRepository.java` - Add query method
4. `ChatMessageResource.java` - Add polling endpoint
5. `ChatMessageService.java` - Add `findByServiceIdSinceMessageId()`
6. `ChatMessageRepository.java` - Add query method

---

## ⚙️ Key Implementation Principles

### NgModule Architecture (Critical)
- **Do NOT use standalone components** - ionic4j uses NgModule pattern
- Every page needs: `.page.ts`, `.html`, `.scss`, `.module.ts`, `-routing.module.ts`
- Import `IonicModule`, `CommonModule`, `FormsModule` in module
- Use `loadChildren` for lazy loading

### State Persistence Strategy
- **Active Service:** Capacitor Preferences (survives app restart)
- **Cart Items:** Capacitor Preferences (survives app restart)
- **Language:** Capacitor Preferences (survives app restart)
- **JWT Token:** Already persisted by LoginService
- **Chat Messages:** In-memory only (reload from backend)

### QR Scanner Implementation
- **Primary:** @capacitor-mlkit/barcode-scanning (best performance)
- **Fallback:** @capacitor/camera + jsQR (universal compatibility)
- **Format:** `resx://table/{tableId}/restaurant/{restaurantId}`

### Chat Message Polling
- **Interval:** 5 seconds
- **Deduplication:** Set-based message cache by ID
- **Retry:** 3 attempts with 10-second delay
- **Optimistic Update:** Add sent messages to cache immediately

---

## ⚠️ Common Pitfalls to Avoid

1. ❌ Using standalone components instead of NgModule
2. ❌ Forgetting to add guards to protected routes
3. ❌ Not persisting service/cart/language state
4. ❌ Hardcoding service ID instead of using ServiceStatusService
5. ❌ Not handling camera permission denial gracefully
6. ❌ Not implementing message deduplication
7. ❌ Forgetting to stop polling when leaving chat page
8. ❌ Not testing on real devices (QR scanner behavior differs)

---

## ✅ Success Criteria

Implementation is complete when:

1. ✅ Customer can register/login in single unified screen
2. ✅ Customer auto-logged in after signup
3. ✅ Customer lands on QR scanner home screen
4. ✅ Customer can scan QR code to start service
5. ✅ Service auto-creates with table/restaurant assignment
6. ✅ Customer navigates to chat interface after scan
7. ✅ Customer can chat with server (polling works)
8. ✅ Customer can open menu modal from chat
9. ✅ Customer can add items to cart from menu
10. ✅ Customer can checkout and place order
11. ✅ Order appears in chat timeline with status updates
12. ✅ Design system applied consistently
13. ✅ Offline state handled gracefully
14. ✅ Active service resume banner works
15. ✅ Language switching works (EN ↔ ES)

---

## 📚 Documentation

**Master Plan (Full Details):**
[docs/MASTER_PLAN.md](../RESx/docs/MASTER_PLAN.md)

**Project Overview:**
[CLAUDE.md](../RESx/CLAUDE.md)

**Design Guidelines:**
[Design Guidelines.md](../RESx/Design Guidelines.md)

---

## 📅 Timeline

**Estimated:** 3-4 weeks (with backend coordination)

**Week 1:** Foundation, Auth, i18n setup
**Week 2:** QR Scanner, i18n implementation
**Week 3:** Service Chat, Menu, Cart persistence
**Week 4:** Design System, Integration, Testing

---

**Status:** 🚧 In Progress - Phases 1-4 Complete (Core Functionality)
**Progress:** 4/7 Phases Complete (57%)
**Risk Level:** Low (core architecture proven)
**Languages:** English & Spanish
**Last Updated:** December 25, 2025

## 📝 Implementation Summary

**Completed:**
- ✅ Phase 1: Foundation & Routing Setup
- ✅ Phase 2: Unified Auth Screen
- ✅ Phase 3: QR Scanner Home Screen
- ✅ Phase 4: Service Chat Interface (core)

**In Progress:**
- 🔄 Phase 4 Polish: Translation keys, cart persistence, order-confirmation fix
- 🔄 Phase 5: Complete i18n implementation
- 🔄 Phase 6: Design system consistency
- 🔄 Phase 7: Integration & testing

**Next Steps:**
1. Add SERVICE_CHAT and MENU translation keys
2. Implement cart persistence with Capacitor Preferences
3. Fix hardcoded SERVICE_ID in order-confirmation
4. Apply design system to existing pages (cart, order-status, account)
5. Backend coordination for new endpoints
6. Comprehensive testing on real devices
