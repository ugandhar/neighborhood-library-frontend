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

export function fetchBooks(offset = 0, limit = 20) {
  return request(`/books?offset=${offset}&limit=${limit}`);
}

export function createBook(payload) {
  return request('/books', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateBook(bookId, payload) {
  return request(`/books/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function fetchMembers(offset = 0, limit = 20) {
  return request(`/members?offset=${offset}&limit=${limit}`);
}

export function createMember(payload) {
  return request('/members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateMember(memberId, payload) {
  return request(`/members/${memberId}`, {
    method: 'PUT',
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

export function fetchLoans(activeOnly = true, offset = 0, limit = 20) {
  return request(`/loans?active_only=${activeOnly}&offset=${offset}&limit=${limit}`);
}

export function fetchOverdueLoans(memberId = null, offset = 0, limit = 20) {
  const memberFilter = memberId ? `member_id=${memberId}&` : '';
  return request(`/loans/overdue?${memberFilter}offset=${offset}&limit=${limit}`);
}

export function fetchMemberBorrowedBooks(memberId) {
  return request(`/members/${memberId}/borrowed-books?active_only=true`);
}
