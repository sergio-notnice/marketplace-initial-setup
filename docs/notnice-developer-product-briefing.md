# Not Nice Developer Product Briefing

_Last updated: 2026-06-29_

This document is a detailed product and technical briefing for a developer taking over or extending the Not Nice creator marketplace platform.

It combines the current repository state with the intended Not Nice product direction. Some parts of the current codebase are already connected to Supabase, while other areas still use mock data and need to be replaced with production-ready database logic.

---

## 1. Product Summary

Not Nice is a creator marketplace that connects brands with content creators.

Brands create campaigns, define content requirements, receive creator applications or offers, select creators, manage collaborations, communicate with creators, handle invoices/payments, and eventually receive content deliverables.

Creators create a profile, browse available campaigns, apply with an individual offer, communicate with brands, deliver content, and receive payouts.

The product is not just a static campaign board. The long-term vision is a platform where campaign creation, creator matching, collaboration management, invoicing, payouts, reporting, and AI-assisted workflows are handled in one central system.

The developer should think of Not Nice as a SaaS marketplace with these core responsibilities:

1. Reliable marketplace infrastructure.
2. Secure role-based access for brands, creators, admins and customer success users.
3. Fast product iteration.
4. Clean data flows between frontend, Supabase, Stripe, Bexio, Brevo, Make.com and future AI tools.
5. Strong technical foundations for AI-first internal and product workflows.

---

## 2. High-Level Product Goal

The platform should help Not Nice build and ship fast without sacrificing security or reliability.

The core product goal is:

> Brands should be able to launch creator campaigns quickly, creators should be able to apply easily, and the Not Nice team should be able to manage the full collaboration lifecycle from campaign creation to payment, content delivery and reporting.

The developer is expected to manage the technical side of this system end to end.

---

## 3. Main User Roles

### 3.1 Creator

A creator is a person who produces content for brands.

Creator capabilities should include:

- Register and log in.
- Complete onboarding.
- Create and edit a creator profile.
- Add profile picture, bio, location, languages, interests, categories, prices, portfolio and content examples.
- Connect social platforms where available.
- Browse available campaigns.
- Filter campaigns by category, platform, language, location, payment, eligibility and relevance.
- View campaign details.
- Apply to campaigns with an individual proposal and price.
- Track submitted applications.
- Communicate with brands through chat.
- Manage active collaborations.
- Upload deliverables.
- Track payments and payout status.
- Manage notification settings.

### 3.2 Brand

A brand is a company or client that creates campaigns and hires creators.

Brand capabilities should include:

- Register and log in.
- Manage company/workspace profile.
- Create and manage products.
- Create and manage campaigns.
- Define campaign briefing, product information, deliverables, target platforms, languages, budget and creator requirements.
- Browse creators.
- Search and filter creators.
- Save creators to a creator pool.
- Add notes and tags to creators.
- Invite creators to campaigns.
- Review applications.
- Select creators.
- Pay by card or invoice depending on setup.
- Communicate with creators.
- Track collaborations.
- View invoices.
- Manage company settings.

### 3.3 Admin

Admin users represent the Not Nice internal team.

Admin capabilities should include:

- Full overview of brands, creators, campaigns, applications, collaborations, payments, invoices and support cases.
- Approve or reject creator profiles.
- Moderate campaign content.
- Support manual corrections in payment, collaboration and invoice flows.
- Manage platform settings.
- Manage user roles.
- Inspect system logs and webhook events.
- Trigger or retry integrations where safe.

### 3.4 Customer Success

Customer Success users are internal Not Nice users focused on platform operations.

Customer Success capabilities should include:

- View campaigns and creator applications.
- Help brands create campaigns.
- Assist creators with onboarding.
- Manage support cases.
- Check campaign/collaboration status.
- Communicate with brands and creators.
- Trigger operational workflows where permitted.

Important: admin and customer success users must not accidentally have unrestricted write permissions in production. Permissions should be explicitly designed and enforced through backend logic and Supabase RLS.

---

## 4. Current Repository Context

### 4.1 Repository

Current relevant repository:

- `sergio-notnice/marketplace-initial-setup`

The package name is currently:

- `creator-marketplace`

The app is currently private in the package configuration and uses version `2.0.0`.

### 4.2 Current Frontend Stack

The current frontend is a React/Vite application.

Core dependencies currently visible in the repository:

- React 18
- React DOM
- TypeScript
- Vite
- React Router DOM
- Supabase JS
- Supabase Auth UI
- Zustand
- TanStack React Query
- React Hook Form
- Zod
- Tailwind CSS
- Tailwind Merge
- Tailwind CSS Animate
- Class Variance Authority
- Lucide React
- Framer Motion
- Date-fns
- Sonner

Current scripts:

- `npm run dev` → local Vite development server.
- `npm run build` → production build.
- `npm run lint` → ESLint.
- `npm run preview` → preview production build.
- `npm run check-deploy` → custom deployment check script.

### 4.3 Backend / Platform Stack

The intended and partially implemented backend stack is:

- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage
- Supabase Edge Functions in Deno
- Stripe / Stripe Connect
- Bexio for invoicing workflows
- Make.com for no-code/low-code operational automations
- Brevo for transactional and notification emails
- Netlify for frontend hosting

The developer should assume that Supabase is the source of truth for marketplace data and that external systems are integrations, not primary storage.

---

## 5. Application Structure and Routing

The current app uses React Router.

### 5.1 Public/Auth Routes

Current public/auth routes:

- `/login`
- `/register`
- `/auth/callback`

### 5.2 Protected Routes

Authenticated users are wrapped through a `PrivateRoute` component. The route checks whether a user is present in the auth store. If no user exists, the user is redirected to `/login`.

### 5.3 Brand Routes

Current brand dashboard routes:

- `/brand/campaigns`
- `/brand/creators`
- `/brand/creators/:id`
- `/brand/pool`
- `/brand/campaign/new`
- `/brand/cooperations`
- `/brand/chat`
- `/brand/invoices`
- `/brand/company`
- `/brand/settings`

### 5.4 Creator Routes

Current creator dashboard routes:

- `/creator/campaigns`
- `/creator/campaigns/:id`
- `/creator/cooperations`
- `/creator/payments`
- `/creator/profile`
- `/creator/:id`
- `/creator/chat`
- `/creator/settings`

### 5.5 Role-Based Routing

The current layout determines brand mode through:

- `user.role === 'brand'`
- or `previewMode === 'brand'`

The current role types are:

- `admin`
- `customer_success`
- `brand`
- `creator`

Developer note: preview mode can be useful in development, but production access control must not rely on frontend mode switches. Backend policies must enforce actual role access.

---

## 6. Authentication and Session Management

### 6.1 Current Auth Setup

Authentication uses Supabase Auth through the Supabase JS client.

Current behavior:

- Supabase client is initialized with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Auth session persistence is enabled.
- Token auto-refresh is enabled.
- Session detection in URL is enabled.
- PKCE flow is enabled.
- Auth token storage key is `sb-auth-token`.
- Cookie options use `sameSite: 'Lax'` and `secure: true`.

### 6.2 Auth Store

Auth state is managed with Zustand.

Current auth store functions:

- `setUser(user)`
- `signIn(email, password)`
- `signUp(email, password, role)`
- `signOut()`
- `resetPassword(email)`

Current behavior:

- On sign-in, Supabase Auth is called.
- After successful auth, the app fetches the matching profile from the `users` table.
- On sign-up, the Supabase user is created and user metadata includes `role` and `name`.
- The code expects the user profile to be created via a database trigger.
- Auth initializes immediately on app startup by reading the current Supabase session.
- Auth state changes are listened to via `supabase.auth.onAuthStateChange`.

### 6.3 Developer Requirements for Auth

The developer should verify and harden:

- The user creation database trigger.
- Role assignment safety.
- Whether users can self-assign protected roles such as `admin` or `customer_success`.
- RLS policies on `users`, `creator_profiles`, `workspaces`, `campaigns`, `messages`, `payments`, `billing_addresses` and all sensitive tables.
- Password reset route consistency. The current reset redirect points to `/reset-password`; that route must exist or be implemented.
- Auth error handling and user-facing messages.
- Session expiration behavior.
- Secure logout behavior.

---

## 7. Workspaces and Company Structure

The current layout includes brand workspace logic.

### 7.1 Current Workspace Logic

For brand users, the layout fetches:

1. Workspaces where the current user is a member via `workspace_members`.
2. Workspaces created by the current user via `workspaces`.
3. Both results are combined and deduplicated by workspace ID.
4. The first workspace is selected by default.

The current UI includes a workspace modal and a selected workspace avatar/logo.

### 7.2 Workspace Creation

Workspace creation currently:

- Fetches the current user/company name from the `users` table.
- Calls the Supabase RPC function `create_workspace` with `workspace_name`.
- Refreshes the workspace list.

### 7.3 Developer Requirements for Workspaces

The developer should ensure:

- Workspaces have a clear ownership and membership model.
- Workspace membership roles are defined, for example owner, admin, member, billing contact.
- Brands can invite other users to a workspace.
- Campaigns, products, billing addresses and invoices are correctly scoped to workspace/company.
- RLS prevents users from accessing other workspaces.
- `create_workspace` RPC validates authenticated user context server-side.
- The selected workspace is stored consistently, ideally in a workspace context/store and optionally persisted.

Recommended tables:

- `workspaces`
- `workspace_members`
- `users`
- `billing_addresses`
- `products`
- `campaigns`
- `invoices` or invoice references

---

## 8. Product and Campaign Creation

The current brand campaign creation screen is implemented as a multi-step UI but still uses mock product data.

### 8.1 Current Product Selection

The current flow starts by asking:

- “Um welches Produkt geht es?”

Brands can either:

- Select an existing product.
- Add a new product.

Current product types:

- `physical`
- `digital`
- `local`

Current product fields in UI:

- Title/name.
- Product description.
- Product image upload UI.
- Pronunciation.
- Product value.
- Product type.

For physical products, the UI communicates that the product is delivered to the creator and can be kept by the creator.

### 8.2 Current Order / Campaign Form

After product selection, the UI allows the brand to configure content.

Current content types:

- `ugc` → finished UGC video.
- `raw` → raw footage for self-editing.

Current language options shown:

- German
- Italian
- Dutch
- English

Current video length options:

- 15 seconds
- 30 seconds
- 60 seconds
- Custom / contact us

Current add-ons:

- Burned-in subtitles.
- Callouts and CTA text overlays.
- Licensed background music.

Other configurable quantities:

- Number of photos.
- Number of creators.

The UI also displays an estimated price recommendation, including net amount and VAT. This is currently only a UI estimate and must be replaced with actual pricing/business logic.

### 8.3 Target Campaign Creation Logic

The final campaign creation flow should support:

#### Product Information

- Product name.
- Product type: physical, digital or local/service/location.
- Product description.
- Product value.
- Product images/files.
- Product delivery information.
- Pronunciation notes.
- Brand/product URLs.
- Product ownership / creator keeps product yes/no.

#### Campaign Briefing

- Campaign title.
- Campaign description.
- Brand/product context.
- Goal of the campaign.
- Target audience.
- Content style.
- Required messages.
- Must-have scenes.
- Do-not-say rules.
- Legal disclaimers.
- Example references.
- CTA.
- Posting requirements.
- Usage rights.
- Deadline.

#### Deliverables

- Video quantity.
- Video duration.
- Aspect ratio.
- Platform: TikTok, Instagram, YouTube, LinkedIn etc.
- UGC, raw material, whitelisting, posting, story, reel, image etc.
- Number of hooks.
- Number of variations.
- Add-ons: subtitles, callouts, music, additional formats.
- Number of creators required.

#### Creator Eligibility

- Creator countries.
- Creator languages.
- Creator categories/interests.
- Creator type.
- Platform connected.
- Minimum profile approval status.
- Onboarding completed.
- Email notification enabled.
- Brand-specific exclusions.

#### Budget / Pricing

- Brand budget.
- Creator offer range.
- Platform service fee.
- VAT handling.
- Currency.
- Invoice/payment method.
- Product value handling.

### 8.4 Developer Requirements for Campaign Creation

The developer should replace the current mock state with real database-backed logic:

- Create and update products in `products`.
- Upload product images/files to Supabase Storage.
- Create campaigns in `campaigns`.
- Attach product to campaign.
- Validate required fields with Zod.
- Store campaign status as draft, pending review, active, paused, completed, cancelled etc.
- Prevent incomplete campaigns from going live.
- Support saving drafts.
- Support admin/customer success review if required.
- Support image/file validation.
- Ensure RLS prevents brands from modifying campaigns they do not own.

---

## 9. Campaign Browsing and Creator Applications

### 9.1 Current Creator Campaign List

The creator campaign list currently fetches active campaigns from Supabase:

- Table: `campaigns`
- Filter: `status = active`
- Ordered by `created_at` descending

The UI supports:

- Search by title, description and brand name.
- Filter by category.
- Filter by platform.
- Display brand logo, title, brand name, platform icons, description, categories, budget range, number of deliverables, deadline and applications count.

### 9.2 Current Campaign Details

The campaign detail page currently uses mock data.

It shows:

- Campaign title.
- Brand name/logo.
- Platforms.
- Campaign description.
- Requirements.
- Deliverables.
- Budget range.
- Deadline.
- Application count.
- Categories.
- Application form with proposal and price.

Current application submission only triggers an alert and navigates back. It does not yet write to the backend.

### 9.3 Target Application Logic

Creators should be able to submit applications/offers to campaigns.

Application fields should include:

- `campaign_id`
- `creator_id`
- `proposal`
- `offer_amount`
- `currency`
- `availability_notes`
- `estimated_delivery_date`
- `content_examples`
- `status`
- `created_at`
- `updated_at`

Recommended statuses:

- `submitted`
- `withdrawn`
- `shortlisted`
- `accepted`
- `rejected`
- `cancelled`

### 9.4 Bidding Logic

The marketplace logic is based on creators applying with their own price/offer.

Known business rule:

- Brand-facing price and creator payout are not always the same.
- A marketplace fee/service fee is applied.
- Example logic previously used: creator offer X, brand pays 115%, creator receives 85%, with platform margin/service fee in between.
- Swiss VAT may apply to brand invoices depending on business setup.

The developer should not hardcode pricing in multiple places. Pricing should be centralized in a pricing service or backend function.

### 9.5 Creator Matching Logic

Creator matching should eventually filter eligible creators based on:

- Creator profile approved.
- Onboarding completed.
- User email notifications enabled.
- Notification setting for campaigns enabled.
- Creator languages.
- Creator country.
- Campaign creator eligibility country IDs.
- Campaign platforms / required social platforms.
- Creator interests/categories.
- Brand/workspace exclusions or favorites.

Relevant tables known from existing context:

- `creator_profiles`
- `users`
- `notification_settings`
- `social_platforms`
- `social_stats`
- `countries`
- `languages`
- `campaigns`

---

## 10. Brand Campaign Management

### 10.1 Current Brand Campaign List

The brand campaign list currently uses mock data.

It supports:

- Campaign cards.
- Search.
- Status filter.
- Stats for total, active, draft and completed campaigns.
- Campaign action menu with edit, duplicate and delete placeholders.
- Find creators CTA.
- View details CTA.

Current statuses shown:

- `active`
- `draft`
- `completed`
- `cancelled`

### 10.2 Target Brand Campaign Logic

Brands should be able to:

- View all campaigns in their current workspace.
- See campaign status and progress.
- See number of applications.
- See selected creators vs required creators.
- Duplicate campaigns.
- Edit draft campaigns.
- Pause or cancel active campaigns depending on rules.
- View campaign details and application list.
- Accept/reject creator applications.
- Start collaborations.
- Continue to payment/invoicing.

### 10.3 Developer Requirements

Replace mock campaign data with Supabase queries scoped by workspace/brand.

Required backend considerations:

- `campaigns.workspace_id` or equivalent.
- RLS policies by workspace membership.
- Avoid exposing applications from other brands.
- Campaign duplication must create a new draft and copy related deliverables/products/settings carefully.
- Delete should likely be soft delete or status change, not hard delete, if invoices/applications exist.
- Admin/customer success may need cross-workspace visibility.

---

## 11. Creator Discovery

### 11.1 Current Creator Search

The brand creator search page currently uses mock creators.

Visible creator card fields:

- Avatar.
- Name.
- Bio.
- Rating.
- Languages.
- Location.
- Interests.
- Base price.
- View profile button.

### 11.2 Current Creator Profile

The creator profile page currently uses mock creator data for profile content but has real Supabase logic for starting conversations.

Visible profile fields:

- Avatar.
- Name.
- Base price.
- Rating.
- Location.
- Bio.
- Languages.
- Add to Pool button.
- Message button.
- Invite to Campaign button.
- Completed projects.
- Portfolio carousel.
- Content examples/videos.

### 11.3 Conversation Creation from Creator Profile

The current `Message` action:

1. Checks whether a conversation exists between brand and creator.
2. If yes, reuses it.
3. If no, creates a new record in `conversations`.
4. Navigates to `/brand/chat` with the selected conversation state.

### 11.4 Target Creator Discovery Logic

Creator discovery should become a real searchable database feature.

Creators should be searchable/filterable by:

- Name.
- Bio.
- Location/country/city.
- Language.
- Interests/categories.
- Platforms.
- Follower count.
- Engagement rate.
- Price range.
- Rating.
- Availability.
- Profile approval status.
- Past collaboration quality.
- Portfolio/media type.

### 11.5 Developer Requirements

- Replace mock creator data with queries joining `creator_profiles`, `users`, `languages`, `countries`, `social_platforms`, `social_stats`, portfolio/media tables and ratings.
- Use pagination or infinite loading for creator lists.
- Avoid fetching all creators client-side.
- Use server-side filters where possible.
- Add indexes for commonly used filters.
- Ensure brands only see approved/searchable creators.
- Ensure private creator data is not exposed unless intended.

---

## 12. Creator Pool

### 12.1 Current Creator Pool

The current creator pool is mock/state-based.

It supports:

- Saved creators list.
- Search in pool.
- Filter by tags.
- Stats: total creators, active campaigns, average engagement.
- Creator notes.
- Custom tags.
- Remove creator from pool.
- Message creator.
- Invite to campaign.
- Expanded view with portfolio, audience stats and past campaigns.

### 12.2 Target Creator Pool Logic

The creator pool should be a brand/workspace-specific CRM-style system.

Recommended features:

- Save creator to workspace pool.
- Remove creator from workspace pool.
- Add internal notes visible only to brand/workspace and internal team where appropriate.
- Add tags.
- Filter/search by tags.
- Track last contacted date.
- Track campaigns involving that creator.
- Invite creator to campaign.
- Open conversation.

### 12.3 Recommended Tables

- `creator_pool_entries`
- `creator_pool_tags`
- `creator_pool_entry_tags`
- `creator_notes`
- `workspace_members`
- `creator_profiles`

### 12.4 Security Notes

Creator notes may contain sensitive brand-side information. They must not be visible to the creator unless explicitly designed that way.

---

## 13. Chat / Messaging

### 13.1 Current Chat Implementation

The current chat implementation is one of the more backend-connected parts of the app.

It uses:

- `conversations`
- `messages`
- Supabase realtime subscription for inserted messages.

Current chat behavior:

- Fetch conversations for current user.
- If current user is a brand, filter conversations by `brand_id`.
- If current user is a creator, filter conversations by `creator_id`.
- Join creator and brand user data.
- Include messages.
- Compute participant based on current role.
- Compute unread count based on unread messages where sender is not current user.
- Fetch messages for selected conversation.
- Mark messages as read for current receiver.
- Insert new messages with `conversation_id`, `sender_id`, `receiver_id`, `content`, `read` and `created_at`.
- Subscribe to new messages for the selected conversation via Supabase realtime.

### 13.2 Current Chat UI

The chat UI includes:

- Conversation list.
- Search conversations.
- All/unread filters, though unread filtering is currently not implemented.
- Chat header.
- Message bubbles.
- Send input.
- Placeholder buttons for emoji, image and attachments.
- Placeholder buttons for phone/video/more actions.

### 13.3 Developer Requirements for Chat

- Validate RLS for conversations and messages.
- Ensure users can only see conversations they participate in.
- Ensure users can only insert messages into conversations they participate in.
- Implement attachment support through Supabase Storage.
- Add upload size/type validation.
- Add message delivery/read state consistency.
- Add pagination for long conversations.
- Avoid fetching all messages in conversation lists; use latest message aggregation or separate query/view.
- Implement unread filter.
- Handle realtime cleanup and duplicate message prevention.
- Consider typing indicators only after core messaging is stable.

---

## 14. Collaborations / Cooperations

The product includes cooperation/collaboration pages for both brands and creators.

Target collaboration flow:

1. Creator applies to campaign.
2. Brand accepts the application.
3. Payment/invoice flow starts.
4. A collaboration record is created.
5. Creator receives confirmation and product/order details.
6. Creator executes content.
7. Creator uploads deliverables.
8. Brand reviews content.
9. Revision flow if needed.
10. Final approval.
11. Creator payout is released or marked for payout.
12. Reporting data is updated.

Recommended statuses:

### Collaboration Status

- `pending_payment`
- `active`
- `product_ordered`
- `product_shipped`
- `product_received`
- `in_production`
- `submitted`
- `revision_requested`
- `approved`
- `completed`
- `cancelled`
- `disputed`

### Deliverable Status

- `not_started`
- `in_progress`
- `uploaded`
- `revision_requested`
- `approved`
- `rejected`

### Product Shipping Status

- `not_required`
- `to_order`
- `ordered`
- `shipped`
- `received`

Developer note: product shipping/order tracking has been discussed as a 3-status model: ordered, shipped, received. For production, keep it simple but model it explicitly.

---

## 15. Payments, Invoices and Payouts

### 15.1 Intended Payment Architecture

The platform uses Stripe and Stripe Connect for marketplace payments and creator payouts. Invoicing workflows are connected to Bexio through Make.com.

Important known constraint:

- Rechnungsstellung/invoicing is not only handled inside Stripe.
- Bexio/Make is part of the invoice workflow and tax ID selection.

### 15.2 Payment Concepts

Core concepts:

- Brand payment.
- Creator payout.
- Platform service fee.
- VAT/tax handling.
- Invoice generation.
- Payment status.
- Payout receipt.

### 15.3 Recommended Payment Tables

- `payments`
- `billing_addresses`
- `campaign_applications`
- `campaign_collaborations`
- `creator_payouts`
- `invoices` or external invoice references
- `stripe_events`
- `webhook_events`

### 15.4 Known Business Logic

The marketplace pricing model can include:

- Creator offer amount.
- Brand-facing amount.
- Platform fee/service fee.
- Creator payout amount.
- VAT on brand invoice where applicable.

Known example logic used previously:

- Creator offer: 100 CHF.
- Brand pays: 115 CHF.
- Creator receives: 85 CHF.
- Swiss VAT may apply to brand invoice.

This must be verified and centralized before production use.

### 15.5 Known Historical Integration Issue

There has previously been a duplicate Make webhook issue around application acceptance/invoicing:

- One frontend flow posted directly to Make.
- A database trigger also posted to Make after updating the application.
- Result: Make received duplicate payloads.

Developer requirement:

- There must be one clear source of truth for each external side effect.
- Webhook side effects should be idempotent.
- Every webhook/event should have a unique idempotency key.
- Retrying should be explicit and safe.

### 15.6 Payment/Invoice Status Recommendations

Recommended payment statuses:

- `pending`
- `requires_action`
- `paid`
- `failed`
- `cancelled`
- `refunded`

Recommended invoice statuses:

- `draft`
- `open`
- `paid`
- `cancelled`
- `overdue`

Recommended payout statuses:

- `not_ready`
- `pending`
- `processing`
- `paid`
- `failed`
- `on_hold`

---

## 16. Notifications and Email

### 16.1 Intended Notification Stack

Known notification/email stack:

- Brevo for email transport/templates.
- Make.com for MVP automations.
- Potential notification orchestration layer in future if multi-channel notifications grow.

### 16.2 Notification Settings

Relevant known table:

- `notification_settings`

Known logic:

- Campaign notification matching should respect `notification_settings.campaigns = true`.
- User-level email notifications must be enabled.

### 16.3 Notification Triggers

Recommended notification events:

- Creator account created.
- Creator profile approved/rejected.
- Brand creates campaign.
- Campaign goes active.
- Matching creator receives campaign invitation/notification.
- Creator applies to campaign.
- Brand receives new application.
- Application accepted/rejected.
- Payment required.
- Payment received.
- Collaboration started.
- Product/order status changed.
- Deliverable uploaded.
- Revision requested.
- Deliverable approved.
- Payout initiated/completed.
- Chat message received.

### 16.4 Developer Requirements

- Do not send emails directly from random frontend components.
- Centralize notification triggers.
- Store notification preferences.
- Respect unsubscribe/settings.
- Use idempotency for external notification events.
- Store notification logs for debugging.
- Avoid leaking private campaign data into emails.

---

## 17. Files, Assets and Storage

The platform needs file handling for:

- Product images.
- Campaign brief attachments.
- Creator portfolio assets.
- Deliverables.
- Invoices/receipts.
- Possibly contracts or legal documents.

Recommended storage:

- Supabase Storage buckets with strict RLS.

Recommended buckets:

- `product-assets`
- `campaign-assets`
- `creator-portfolio`
- `deliverables`
- `invoices`
- `public-assets`

Security requirements:

- Validate MIME types.
- Validate file sizes.
- Use signed URLs for private assets.
- Public assets should be clearly separated from private deliverables/invoices.
- Avoid exposing Airtable/Supabase internal storage URLs permanently if not intended.
- Avoid storing secret file URLs in frontend state without access control.

---

## 18. Database Model Overview

Known or expected tables include:

- `users`
- `creator_profiles`
- `campaigns`
- `campaign_applications`
- `campaign_collaborations`
- `notification_settings`
- `social_platforms`
- `social_stats`
- `countries`
- `languages`
- `payments`
- `billing_addresses`
- `products`
- `workspaces`
- `workspace_members`
- `conversations`
- `messages`

### 18.1 Users

Recommended fields:

- `id`
- `email`
- `role`
- `name`
- `avatar_url`
- `email_notifications_enabled`
- `created_at`
- `updated_at`
- `last_sign_in`

Current frontend type defines user roles:

- `admin`
- `customer_success`
- `brand`
- `creator`

### 18.2 Creator Profiles

Recommended fields:

- `id`
- `user_id`
- `profile_approved`
- `onboarding_completed`
- `bio`
- `location`
- `country_id`
- `city`
- `languages`
- `interests`
- `base_price`
- `portfolio`
- `rating`
- `created_at`
- `updated_at`

Important statuses:

- `init`
- `approved`
- `rejected`
- possibly `pending_review`

### 18.3 Campaigns

Recommended fields:

- `id`
- `workspace_id`
- `brand_id`
- `product_id`
- `title`
- `description`
- `requirements`
- `briefing`
- `categories`
- `platforms`
- `budget_min`
- `budget_max`
- `currency`
- `deadline`
- `status`
- `required_creators`
- `selected_creators`
- `applications_count`
- `creator_eligibility_country_ids`
- `microinfluencer_platform_ids`
- `microinfluencer_types`
- `created_at`
- `updated_at`

### 18.4 Campaign Applications

Recommended fields:

- `id`
- `campaign_id`
- `creator_id`
- `proposal`
- `offer_amount`
- `brand_amount`
- `creator_payout_amount`
- `currency`
- `status`
- `payment_status`
- `created_at`
- `updated_at`

### 18.5 Campaign Collaborations

Recommended fields:

- `id`
- `campaign_id`
- `application_id`
- `brand_id`
- `creator_id`
- `workspace_id`
- `status`
- `shipping_status`
- `deliverable_status`
- `payment_id`
- `created_at`
- `updated_at`

Important: there has previously been a NOT NULL violation around `campaign_id` in `campaign_collaborations`. Ensure every collaboration creation path includes `campaign_id` and is transaction-safe.

### 18.6 Conversations and Messages

Recommended `conversations` fields:

- `id`
- `brand_id`
- `creator_id`
- `campaign_id` optional
- `collaboration_id` optional
- `created_at`
- `updated_at`

Recommended `messages` fields:

- `id`
- `conversation_id`
- `sender_id`
- `receiver_id`
- `content`
- `read`
- `created_at`
- `attachments` optional

---

## 19. Supabase and Backend Requirements

### 19.1 RLS Requirements

Every user-generated or sensitive table must have RLS enabled.

Minimum RLS requirements:

- Users can read their own user profile.
- Brands can read/update their own company/workspace data.
- Workspace members can access only their workspace records.
- Creators can read active campaigns they are eligible for.
- Creators can create applications only for themselves.
- Brands can read applications only for their campaigns.
- Users can read conversations/messages only if they are participants.
- Deliverables are visible only to related brand, creator and permitted internal users.
- Admin/customer success permissions should be explicit, not accidental.

### 19.2 RPC / Edge Function Requirements

Use RPC or Edge Functions for operations that require server-side trust:

- Create workspace.
- Accept application.
- Create collaboration.
- Create Stripe checkout/payment intent.
- Handle Stripe webhook.
- Trigger invoice creation.
- Trigger payout.
- Send transactional notification.
- Generate AI outputs.
- Validate campaign eligibility.

### 19.3 Idempotency

Idempotency is critical for:

- Stripe webhooks.
- Make webhooks.
- Bexio invoice creation.
- Collaboration creation.
- Email sending.
- Payout creation.

Every external event should be recorded with:

- Event source.
- Event type.
- External event ID.
- Related internal entity ID.
- Processing status.
- Error message.
- Created/processed timestamp.

---

## 20. Frontend Engineering Standards

### 20.1 General Standards

- Use TypeScript strictly.
- Avoid `any` unless there is a temporary TODO with reason.
- Prefer typed Supabase query results.
- Keep business logic out of large page components.
- Use services/hooks for data fetching and mutations.
- Keep UI components reusable.
- Use Zod for form validation.
- Use React Query for async server state.
- Use Zustand only for global client state such as auth, UI mode, selected workspace.
- Avoid duplicating pricing/status logic in multiple components.

### 20.2 Suggested Frontend Structure

Recommended structure:

```txt
src/
  components/
    ui/
    layout/
    campaign/
    creator/
    chat/
    forms/
  pages/
    auth/
    brand/
    creator/
    admin/
    customer-success/
  hooks/
  services/
    campaigns.ts
    creators.ts
    applications.ts
    collaborations.ts
    payments.ts
    notifications.ts
    storage.ts
  store/
    authStore.ts
    workspaceStore.ts
  lib/
    supabase.ts
    utils.ts
    validators.ts
  types/
    database.types.ts
    index.ts
```

### 20.3 Data Fetching

Recommended:

- Use React Query for campaign lists, creator lists, applications, collaborations and invoices.
- Use optimistic updates carefully only for low-risk UI actions.
- Use server-side pagination.
- Use explicit loading, empty and error states.
- Do not load large tables fully on the client.

### 20.4 Forms

Recommended:

- React Hook Form + Zod.
- Multi-step form state should be explicit and recoverable.
- Draft autosave can be added later, but data integrity must be prioritized.
- Validation should happen frontend and backend.

---

## 21. AI-First Workflow Development

One of the developer expectations is to develop and optimize AI-first workflows.

This does not mean adding random AI features everywhere. It means identifying repetitive, high-value workflows and turning them into reliable tools.

### 21.1 Internal AI Workflow Ideas

Useful internal tools:

- AI campaign briefing generator.
- AI campaign quality checker.
- AI legal/compliance wording checker.
- AI creator matching assistant.
- AI creator shortlist generator.
- AI message drafting assistant for customer success.
- AI report summary generator.
- AI transcript/subtitle workflow.
- AI support triage assistant.

### 21.2 Product-Facing AI Features

Potential product-facing AI features:

- Brand enters product info → AI suggests campaign briefing.
- Brand selects goals → AI suggests deliverables and creator profile criteria.
- Creator profile → AI suggests best matching campaigns.
- Creator uploads raw info → AI suggests proposal text.
- Collaboration completed → AI creates performance report draft.
- Video content → AI generates subtitles/transcript.

### 21.3 AI Engineering Requirements

- AI outputs must be reviewable, not blindly executed.
- Do not send sensitive data to AI providers unless approved.
- Log AI requests/outputs where useful, but avoid storing sensitive unnecessary data.
- Add prompt/version tracking for repeatable workflows.
- Add guardrails for medical, financial, legal or regulated claims in ad content.
- AI-generated content should be marked as generated/draft internally.
- Long-term: build small internal AI tools before building complex agent systems.

---

## 22. Security Expectations

Security is a core requirement for the developer role.

### 22.1 Key Risks

- Broken role-based access.
- Weak Supabase RLS.
- Users accessing other brands' campaigns or invoices.
- Creators seeing private brand notes.
- Brands seeing private creator information.
- Exposed environment variables or service keys.
- Frontend-only authorization.
- Unsafe file uploads.
- Duplicate payment/webhook side effects.
- XSS through user-generated content.
- SQL injection through unsafe RPC/functions.
- Insecure redirects in auth flows.

### 22.2 Required Practices

- Never expose Supabase service role key in frontend.
- Never commit secrets.
- Validate every file upload.
- Escape/render user-generated content safely.
- Use RLS for every table.
- Use backend functions for trusted operations.
- Keep payment/invoice logic idempotent.
- Review all external webhook payloads.
- Store minimal personal data.
- Follow Swiss/EU data protection expectations where applicable.

### 22.3 Security Review Checklist

Before shipping production features, check:

- Can a creator access another creator's payment data?
- Can a brand access another brand's campaign?
- Can a user self-assign admin role?
- Can a user update someone else's messages?
- Can a user upload executable/unsafe files?
- Can a webhook be replayed to create duplicate invoices/collaborations?
- Are Stripe webhook signatures verified?
- Are Make/Bexio triggers protected or idempotent?
- Are private assets behind signed URLs?
- Are errors leaking sensitive information?

---

## 23. Environment Variables

### 23.1 Frontend Variables

Expected frontend variables:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

Only public keys may be exposed to the frontend.

### 23.2 Backend / Edge Function Variables

Expected backend variables:

```txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BEXIO_API_KEY=
BREVO_API_KEY=
MAKE_WEBHOOK_URL=
```

Do not commit real values.

### 23.3 Secret Handling

- Store secrets in Supabase Edge Function secrets, Netlify environment variables or the relevant provider secret manager.
- Never use `.env` files in commits.
- Rotate secrets if exposed.
- Use different secrets for staging and production.

---

## 24. Deployment and DevOps

### 24.1 Current Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`
- `npm run check-deploy`

### 24.2 Expected Hosting

- Netlify for frontend.
- Supabase for backend/database/storage/functions.

### 24.3 Recommended Environments

- Local development.
- Staging/test environment.
- Production environment.

Known domains/context:

- Main marketing site: `notnice.io`
- App: `app.notnice.io`
- Test/staging Netlify domain has been used previously.

### 24.4 Deployment Requirements

- Do not deploy directly to production without build/lint checks.
- Use GitHub branches and pull requests.
- Keep database migrations version-controlled.
- Test RLS changes before production deployment.
- Keep staging and production Supabase projects separated.
- Maintain rollback plan for frontend and database changes.

---

## 25. Testing Requirements

Current dev dependencies include Vitest, Testing Library and MSW.

Recommended test coverage:

### 25.1 Unit Tests

- Pricing calculations.
- Status transitions.
- Form validation schemas.
- Utility functions.
- Role/permission helpers.

### 25.2 Integration Tests

- Auth flow.
- Campaign creation.
- Creator application submission.
- Brand accepts application.
- Collaboration creation.
- Chat message send/read.
- File upload.

### 25.3 E2E Tests

Recommended core E2E flows:

1. Brand creates campaign.
2. Creator applies.
3. Brand accepts creator.
4. Payment/invoice flow is triggered.
5. Collaboration is created.
6. Creator uploads deliverable.
7. Brand approves deliverable.

### 25.4 Webhook Tests

- Stripe payment succeeded.
- Stripe payment failed.
- Duplicate Stripe event.
- Bexio invoice creation success/failure.
- Make webhook timeout.
- Retry logic.

---

## 26. Known Current Gaps / Developer Priority Areas

### 26.1 Mock Data Replacement

Several important pages still use mock data and need real backend integration:

- Brand campaign list.
- Brand creator discovery.
- Brand creator profile content.
- Brand creator pool.
- Creator campaign detail/application submission.
- Brand campaign creation/product selection.

### 26.2 Type Safety

The Supabase client imports `Database` from `../types/database.types`.

The developer should verify that generated Supabase database types exist and are committed. If missing, generate them from Supabase and keep them updated.

### 26.3 Business Logic Centralization

Pricing, VAT, service fee, payout logic and statuses must be centralized.

Do not duplicate price calculations in UI components.

### 26.4 RLS Audit

Before production use, perform a full RLS audit.

### 26.5 Webhook / Integration Audit

Review all Make, Bexio, Stripe and Supabase trigger flows to prevent duplicate side effects.

### 26.6 Workspace Scoping

Ensure every brand-side object is workspace-scoped.

### 26.7 Admin and Customer Success

Admin/customer success modules are conceptually part of the product but need clear implementation if not already present.

### 26.8 Creator Onboarding and Approval

Creator approval status is important for matching and notification logic. Build this carefully.

### 26.9 File Uploads

Product images, portfolio and deliverables need secure Supabase Storage integration.

---

## 27. Suggested Development Roadmap

### Phase 1: Stabilize Core Foundation

- Verify app builds successfully.
- Add missing generated database types if needed.
- Audit Supabase client config.
- Clean auth flow.
- Confirm user creation trigger.
- Confirm roles cannot be self-escalated.
- Add workspace store/context.
- Add basic RLS tests.

### Phase 2: Replace Mock Data with Real Data

- Brand campaigns from Supabase.
- Creator discovery from Supabase.
- Creator profiles from Supabase.
- Creator pool from Supabase.
- Campaign details from Supabase.
- Application submission to Supabase.

### Phase 3: Build Marketplace Transaction Flow

- Creator application flow.
- Brand application review.
- Accept/reject application.
- Collaboration creation.
- Payment/invoice trigger.
- Creator payout tracking.
- Status transition rules.

### Phase 4: Deliverables and Operations

- File uploads.
- Deliverable review.
- Revision workflow.
- Chat attachments.
- Customer success dashboard.
- Admin moderation.

### Phase 5: AI-First Workflows

- AI campaign briefing assistant.
- AI creator matching assistant.
- AI proposal/help text assistant.
- AI report summary assistant.
- AI transcription/subtitle workflows.

### Phase 6: Reporting and Optimization

- Campaign reporting.
- Creator performance metrics.
- Brand analytics.
- Operational dashboards.
- Event logs.
- Performance improvements.

---

## 28. Definition of Done for New Features

A feature is not done when the UI looks complete. A feature is done when:

- It is connected to real backend data.
- It has loading, error and empty states.
- It has validation.
- It respects roles and RLS.
- It works in staging.
- It has at least basic tests for critical logic.
- It does not introduce duplicate external side effects.
- It has no hardcoded mock data unless explicitly marked as demo.
- It has clear status handling.
- It has minimal documentation for future developers.

---

## 29. Developer Role Expectations

The Not Nice developer should:

- Own the technical development of the platform.
- Maintain and improve the existing marketplace.
- Build new product features end to end.
- Improve platform architecture.
- Keep the product secure.
- Optimize developer workflows.
- Help Not Nice build and ship faster.
- Translate business requirements into scalable technical implementation.
- Create and improve AI-first workflows.
- Document important decisions and flows.

The ideal developer is not only a ticket executor. They should actively identify technical risks, propose better implementation patterns and help create a development environment where the team can move fast without creating fragile systems.

---

## 30. Required Developer Skillset

### Fullstack

- React.
- TypeScript.
- Next.js knowledge is useful, even though current app is Vite.
- Backend/API design.
- SQL.
- Supabase or PostgreSQL.
- Auth and permissions.

### Frontend

- Component architecture.
- React Router.
- Tailwind.
- Form handling.
- State management.
- Data fetching with React Query.
- Responsive UI.

### Backend

- PostgreSQL schema design.
- RLS.
- Supabase Edge Functions.
- Webhooks.
- Stripe/Stripe Connect.
- File storage.
- Transactional workflows.

### Security

- Role-based access.
- API security.
- Webhook verification.
- Secret handling.
- File upload security.
- Privacy/data protection.

### AI / Automation

- Experience building custom AI tools.
- Experience integrating LLM APIs.
- Workflow automation thinking.
- Ability to turn repeated manual tasks into reliable internal tools.

---

## 31. Interview / Evaluation Questions for Developer

Useful questions:

1. Have you built a SaaS or marketplace product before?
2. Have you worked with Supabase, PostgreSQL and RLS?
3. How would you prevent a brand from accessing another brand's campaigns?
4. How would you structure campaign creation and application acceptance?
5. How would you prevent duplicate invoices when a webhook is retried?
6. How would you model creator payouts in Stripe Connect?
7. How would you migrate mock frontend data to production backend data?
8. How would you structure secure file uploads for deliverables?
9. Have you built custom AI tools or AI workflows before?
10. How would you create an AI campaign briefing assistant safely?
11. How do you usually handle deployments, migrations and rollbacks?
12. How would you debug a production issue where a collaboration was created without a valid campaign ID?

---

## 32. Final Technical Principle

The platform should be built around clear ownership, clean data models, secure access control and reliable external integrations.

The developer should always ask:

1. Who owns this data?
2. Who is allowed to read or change it?
3. What is the source of truth?
4. Can this external side effect happen twice?
5. Is the business logic centralized?
6. Can the Not Nice team debug this later?
7. Can we ship this quickly without making the platform fragile?

This is the standard expected for future Not Nice platform development.
