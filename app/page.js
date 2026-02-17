'use client';

import { useEffect, useMemo, useState } from 'react';
import { createBook, createMember, fetchBooks, fetchMembers } from '../lib/api';

const emptyBook = { title: '', author: '', isbn: '', total_copies: 1 };
const emptyMember = { name: '', email: '', phone: '' };

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookForm, setBookForm] = useState(emptyBook);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hasData = useMemo(() => books.length > 0 || members.length > 0, [books, members]);

  async function loadAll() {
    const [bookData, memberData] = await Promise.all([fetchBooks(), fetchMembers()]);
    setBooks(bookData);
    setMembers(memberData);
  }

  useEffect(() => {
    loadAll().catch((err) => setError(err.message));
  }, []);

  async function handleBookSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createBook({
        ...bookForm,
        total_copies: Number(bookForm.total_copies),
      });
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

  return (
    <main>
      <section className="hero">
        <h1>Neighborhood Library Service</h1>
        <p className="subtitle">Manage books and members from one simple dashboard.</p>
        {error ? <p className="badge warn">{error}</p> : null}
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Add Book</h2>
          <form onSubmit={handleBookSubmit}>
            <input
              required
              placeholder="Title"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            />
            <input
              required
              placeholder="Author"
              value={bookForm.author}
              onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
            />
            <input
              required
              placeholder="ISBN"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
            />
            <input
              required
              type="number"
              min="1"
              placeholder="Total Copies"
              value={bookForm.total_copies}
              onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value })}
            />
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
            <input
              required
              placeholder="Name"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={memberForm.email}
              onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={memberForm.phone}
              onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
            />
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

      {!hasData ? <p className="muted">No data yet. Add books and members to start lending.</p> : null}
    </main>
  );
}
