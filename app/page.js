'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  borrowBook,
  createBook,
  createMember,
  fetchBooks,
  fetchLoans,
  fetchMemberBorrowedBooks,
  fetchMembers,
  returnBook,
} from '../lib/api';

const emptyBook = { title: '', author: '', isbn: '', total_copies: 1 };
const emptyMember = { name: '', email: '', phone: '' };

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [memberLoans, setMemberLoans] = useState([]);
  const [selectedMemberForLoans, setSelectedMemberForLoans] = useState('');

  const [bookForm, setBookForm] = useState(emptyBook);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [borrowForm, setBorrowForm] = useState({ member_id: '', book_id: '' });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hasData = useMemo(
    () => books.length > 0 || members.length > 0 || loans.length > 0,
    [books, members, loans]
  );

  async function loadAll() {
    const [bookData, memberData, loanData] = await Promise.all([
      fetchBooks(),
      fetchMembers(),
      fetchLoans(true),
    ]);
    setBooks(bookData);
    setMembers(memberData);
    setLoans(loanData);
  }

  useEffect(() => {
    loadAll().catch((err) => setError(err.message));
  }, []);

  async function handleBookSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createBook({ ...bookForm, total_copies: Number(bookForm.total_copies) });
      setBookForm(emptyBook);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMemberSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createMember(memberForm);
      setMemberForm(emptyMember);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBorrowSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await borrowBook({
        member_id: Number(borrowForm.member_id),
        book_id: Number(borrowForm.book_id),
      });
      setBorrowForm({ member_id: '', book_id: '' });
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReturn(loanId) {
    setError('');
    setLoading(true);
    try {
      await returnBook(loanId);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleMemberLoanQuery(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!selectedMemberForLoans) {
        setMemberLoans([]);
      } else {
        const data = await fetchMemberBorrowedBooks(Number(selectedMemberForLoans));
        setMemberLoans(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <h1>Neighborhood Library Service</h1>
        <p className="subtitle">Manage books, members, borrowing, and returns from one dashboard.</p>
        {error ? <p className="badge warn">{error}</p> : null}
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Add Book</h2>
          <form onSubmit={handleBookSubmit}>
            <input required placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
            <input required placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
            <input required placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />
            <input required type="number" min="1" placeholder="Total Copies" value={bookForm.total_copies} onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value })} />
            <button disabled={loading} type="submit">Create Book</button>
          </form>
          <div className="list">
            {books.map((book) => (
              <article className="item" key={book.id}>
                <strong>{book.title}</strong>
                <div className="muted">{book.author}</div>
                <div className="muted">ISBN: {book.isbn}</div>
                <span className="badge">Available: {book.available_copies}/{book.total_copies}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Add Member</h2>
          <form onSubmit={handleMemberSubmit}>
            <input required placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
            <input required type="email" placeholder="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
            <input placeholder="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
            <button disabled={loading} type="submit">Create Member</button>
          </form>

          <div className="list">
            {members.map((member) => (
              <article className="item" key={member.id}>
                <strong>{member.name}</strong>
                <div className="muted">{member.email}</div>
                <div className="muted">{member.phone || 'No phone on file'}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Borrow Book</h2>
          <form onSubmit={handleBorrowSubmit}>
            <select required value={borrowForm.member_id} onChange={(e) => setBorrowForm({ ...borrowForm, member_id: e.target.value })}>
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <select required value={borrowForm.book_id} onChange={(e) => setBorrowForm({ ...borrowForm, book_id: e.target.value })}>
              <option value="">Select book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title} ({book.available_copies} available)</option>
              ))}
            </select>
            <button disabled={loading} type="submit">Borrow</button>
          </form>

          <h2 style={{ marginTop: 16 }}>Active Loans</h2>
          <div className="list">
            {loans.map((loan) => (
              <article className="item" key={loan.id}>
                <div>Loan #{loan.id}</div>
                <div className="muted">Member ID: {loan.member_id}</div>
                <div className="muted">Book ID: {loan.book_id}</div>
                <div className="muted">Due: {loan.due_date}</div>
                <button disabled={loading} onClick={() => handleReturn(loan.id)} type="button">Return Book</button>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Member Borrowed Books</h2>
          <form onSubmit={handleMemberLoanQuery}>
            <select value={selectedMemberForLoans} onChange={(e) => setSelectedMemberForLoans(e.target.value)}>
              <option value="">Select member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <button disabled={loading} type="submit">Load Borrowed Books</button>
          </form>
          <div className="list">
            {memberLoans.map((loan) => (
              <article className="item" key={loan.loan_id}>
                <strong>{loan.title}</strong>
                <div className="muted">{loan.author}</div>
                <div className="muted">Due: {loan.due_date}</div>
                <span className={`badge ${loan.is_overdue ? 'warn' : ''}`}>{loan.is_overdue ? 'Overdue' : 'On time'}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {!hasData ? <p className="muted">No data yet. Add books and members to start lending.</p> : null}
    </main>
  );
}
