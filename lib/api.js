const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.detail) {
        message = body.detail;
      }
    } catch (_) {
      // Keep generic fallback.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchBooks() {
  return request('/books');
}

export function createBook(payload) {
  return request('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchMembers() {
  return request('/members');
}

export function createMember(payload) {
  return request('/members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function borrowBook(payload) {
  return request('/loans/borrow', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function returnBook(loanId) {
  return request(`/loans/${loanId}/return`, {
    method: 'POST',
  });
}

export function fetchLoans(activeOnly = true) {
  return request(`/loans?active_only=${activeOnly}`);
}

export function fetchMemberBorrowedBooks(memberId) {
  return request(`/members/${memberId}/borrowed-books?active_only=true`);
}
