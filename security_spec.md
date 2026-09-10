# Security Specification: Game Vault Forum (Firestore Access Control)

## 1. Data Invariants
1. **Users & Profile Invariants**: 
   - A user profile must have a valid `uid`, `email`, `displayName`, `username`, and `createdAt`.
   - Modifying high-privilege roles (`admin`, `moderator`) cannot be performed by standard users.
   - User reputation and stats can only be updated within valid ranges.
2. **Contact Us Submissions (`/contact_submissions/{submissionId}`) Invariants**:
   - Must contain valid non-empty `name` (1-100 chars), valid `email` (3-120 chars), valid `category` (1-50 chars), `message` (5-3000 chars), and `status` in `['new', 'read', 'replied', 'archived']`.
   - Single-document target operations (`get`, `create`, `update`, `delete`) must enforce `isValidId(submissionId)`.
   - **PII Isolation**: Submissions contain sensitive contact information (names, emails, inquiries). Read access must be strictly restricted to authenticated administrators (`isAdmin()`) or the authenticated author (`request.auth.uid == resource.data.userId`). Public or unauthorized listing is strictly blocked.
   - Updates and deletions must be restricted strictly to `isAdmin()`.
3. **Email Newsletter Subscribers (`/subscribers/{subscriberId}`) Invariants**:
   - Must contain valid `email` (3-120 chars), `subscribedAt` timestamp, and `status` in `['active', 'unsubscribed']`.
   - Single-document ID must satisfy `isValidId(subscriberId)`.
   - **PII Isolation**: Email lists are high-value targets for spammers. Read access is strictly restricted to `isAdmin()`. Public listing or reading of email addresses is strictly forbidden.
   - Creation is permitted for any user or visitor submitting an email.
   - Updates are restricted to admin or updating status/timestamp for existing subscribers (`affectedKeys().hasOnly(['subscribedAt', 'status', 'source'])`).

## 2. The "Dirty Dozen" Malicious Payloads
1. **Payload 1 (Ghost Field Injection on Contact)**: Injecting `{ isPromoted: true, adminBypass: true }` into contact submissions.
2. **Payload 2 (Massive Buffer Attack on Name)**: Submitting a 50KB name string in Contact Us.
3. **Payload 3 (Empty Message Bypass)**: Submitting `{ message: "" }` or whitespace in Contact Us.
4. **Payload 4 (Massive Message Attack)**: Submitting a 100KB spam payload in Contact Us.
5. **Payload 5 (PII Scraping Attack on Contacts)**: Unauthenticated or non-admin user querying `getDoc` or `getDocs` on `/contact_submissions`.
6. **Payload 6 (Unauthorized Contact Deletion)**: Non-admin trying to delete another user's contact submission.
7. **Payload 7 (Status Escalation on Contact)**: Regular user attempting to update status directly to `replied` or modifying admin review notes.
8. **Payload 8 (PII Scraping on Newsletter Subscribers)**: Attacker trying to list all subscribers from `/subscribers` to harvest marketing emails.
9. **Payload 9 (Subscriber Massive Payload Attack)**: Injecting 200KB payload into `/subscribers/{subId}`.
10. **Payload 10 (Subscriber Email Spoofing / Overwrite)**: Non-admin attempting to change the `email` field of another subscriber in an update operation.
11. **Payload 11 (ID Poisoning Attack)**: Document path containing illegal characters or path traversal junk `../../admin`.
12. **Payload 12 (Unauthorized Role Escalation on Users)**: Non-admin user attempting to write `role: "admin"` to their own `/Users/{userId}` profile.
