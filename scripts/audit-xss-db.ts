// scripts/audit-xss-db.ts
// Run once to find any existing XSS payloads stored in the DB before the fix.
// Usage: npx tsx scripts/audit-xss-db.ts
//
// Prints every record that contains an HTML tag, javascript: URI, or data: URI
// in user-controlled text fields. These should be manually reviewed and cleaned.

import prisma from "../lib/db";

const DANGEROUS = /<[^>]*>|javascript\s*:|data\s*:/i;

function check(value: string | null | undefined): boolean {
  return !!value && DANGEROUS.test(value);
}

async function main() {
  let found = 0;

  // --- ApiKey labels ---
  const apiKeys = await prisma.apiKey.findMany({
    select: { id: true, userId: true, exchange: true, label: true },
  });
  for (const k of apiKeys) {
    if (check(k.label)) {
      console.warn(`[ApiKey] id=${k.id} userId=${k.userId} exchange=${k.exchange} label=${k.label}`);
      found++;
    }
  }

  // --- DashboardTemplate names ---
  const templates = await prisma.dashboardTemplate.findMany({
    select: { id: true, userId: true, name: true },
  });
  for (const t of templates) {
    if (check(t.name)) {
      console.warn(`[DashboardTemplate] id=${t.id} userId=${t.userId} name=${t.name}`);
      found++;
    }
  }

  // --- User names ---
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true },
  });
  for (const u of users) {
    if (check(u.name)) {
      console.warn(`[User] id=${u.id} email=${u.email} name=${u.name}`);
      found++;
    }
  }

  if (found === 0) {
    console.log("✓ No XSS payloads found in DB.");
  } else {
    console.log(`\n⚠️  Found ${found} suspicious record(s). Review and clean manually.`);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
