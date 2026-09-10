/**
 * Firestore Security Rules Test Suite
 * Verifies access control, PII protection, and validation blueprints
 * for contact_submissions, subscribers, users, topics, and comments.
 */

export interface TestPayload {
  name: string;
  collection: string;
  docId: string;
  data: Record<string, any>;
  auth: { uid?: string; email?: string } | null;
  expectedResult: 'ALLOW' | 'DENY';
}

export const DIRTY_DOZEN_TEST_CASES: TestPayload[] = [
  {
    name: "1. Ghost field injection in Contact Submission",
    collection: "contact_submissions",
    docId: "sub_ghost_01",
    data: {
      id: "sub_ghost_01",
      name: "Test User",
      email: "test@example.com",
      category: "editorial",
      message: "Valid length message here",
      createdAt: new Date().toISOString(),
      status: "new",
      ghostField: true
    },
    auth: null,
    expectedResult: "DENY"
  },
  {
    name: "2. Contact Submission with empty message",
    collection: "contact_submissions",
    docId: "sub_empty_msg",
    data: {
      id: "sub_empty_msg",
      name: "Test User",
      email: "test@example.com",
      category: "editorial",
      message: "Hi", // Less than 5 chars
      createdAt: new Date().toISOString(),
      status: "new"
    },
    auth: null,
    expectedResult: "DENY"
  },
  {
    name: "3. Contact Submission with oversized name (Buffer attack)",
    collection: "contact_submissions",
    docId: "sub_buffer_name",
    data: {
      id: "sub_buffer_name",
      name: "A".repeat(150),
      email: "test@example.com",
      category: "editorial",
      message: "Valid length message here",
      createdAt: new Date().toISOString(),
      status: "new"
    },
    auth: null,
    expectedResult: "DENY"
  },
  {
    name: "4. Valid Contact Submission from guest",
    collection: "contact_submissions",
    docId: "sub_valid_01",
    data: {
      id: "sub_valid_01",
      name: "Commander Shepard",
      email: "shepard@normandy.alliance",
      category: "editorial",
      subject: "Report on Sovereign",
      message: "The Reapers are coming and our tactical defenses need an immediate upgrade.",
      createdAt: new Date().toISOString(),
      status: "new"
    },
    auth: null,
    expectedResult: "ALLOW"
  },
  {
    name: "5. Non-admin attempting to read Contact Submissions list",
    collection: "contact_submissions",
    docId: "sub_valid_01",
    data: {},
    auth: { uid: "random_user_123", email: "random@user.com" },
    expectedResult: "DENY"
  },
  {
    name: "6. Admin reading Contact Submissions",
    collection: "contact_submissions",
    docId: "sub_valid_01",
    data: {},
    auth: { uid: "admin_uid", email: "contact@gamevault.forum" },
    expectedResult: "ALLOW"
  },
  {
    name: "7. Valid newsletter subscriber registration",
    collection: "subscribers",
    docId: "gamer_vault_com",
    data: {
      email: "gamer@vault.com",
      subscribedAt: new Date().toISOString(),
      status: "active",
      source: "footer"
    },
    auth: null,
    expectedResult: "ALLOW"
  },
  {
    name: "8. Malicious payload with invalid subscriber status",
    collection: "subscribers",
    docId: "malicious_sub_01",
    data: {
      email: "gamer@vault.com",
      subscribedAt: new Date().toISOString(),
      status: "super_admin_active"
    },
    auth: null,
    expectedResult: "DENY"
  },
  {
    name: "9. Non-admin attempting to harvest subscriber emails",
    collection: "subscribers",
    docId: "gamer_vault_com",
    data: {},
    auth: { uid: "scraper_bot", email: "scraper@bot.com" },
    expectedResult: "DENY"
  },
  {
    name: "10. Admin reading newsletter subscriber",
    collection: "subscribers",
    docId: "gamer_vault_com",
    data: {},
    auth: { uid: "admin_uid", email: "contact@gamevault.forum" },
    expectedResult: "ALLOW"
  },
  {
    name: "11. ID Poisoning attack on Contact Submission path",
    collection: "contact_submissions",
    docId: "../evil/path/injection",
    data: {
      id: "../evil/path/injection",
      name: "Test",
      email: "test@example.com",
      category: "editorial",
      message: "Valid message length",
      createdAt: new Date().toISOString(),
      status: "new"
    },
    auth: null,
    expectedResult: "DENY"
  },
  {
    name: "12. Non-admin attempting to delete subscriber list",
    collection: "subscribers",
    docId: "gamer_vault_com",
    data: {},
    auth: { uid: "random_user", email: "random@user.com" },
    expectedResult: "DENY"
  }
];
