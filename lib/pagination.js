/**
 * Parses `page`/`limit` query params safely.
 *
 * Without this, a request like `?page=0` or `?limit=-5` produces a negative
 * `skip` value, which Mongoose rejects with a runtime error instead of a
 * clean 400 — and an unbounded `limit` lets a caller request the entire
 * collection in one query. This clamps both to sane ranges.
 */
export function parsePagination(searchParams, { defaultLimit = 10, maxLimit = 100 } = {}) {
  let page = parseInt(searchParams.get("page") || "1", 10);
  let limit = parseInt(searchParams.get("limit") || String(defaultLimit), 10);

  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  return { page, limit, skip: (page - 1) * limit };
}
