'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  borrowBook,
  createBook,
  createMember,
  fetchBooks,
  fetchLoans,
  fetchOverdueLoans,
  fetchMemberBorrowedBooks,
  fetchMembers,
  returnBook,
  updateBook,
  updateMember,
} from '../lib/api';
import BooksTab from '../components/BooksTab';
import CirculationTab from '../components/CirculationTab';
import MemberBorrowedTab from '../components/MemberBorrowedTab';
import MembersTab from '../components/MembersTab';

const emptyBook = { title: '', author: '', isbn: '', total_copies: 1 };
const emptyMember = { name: '', email: '', phone: '' };

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('books');

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [memberLoans, setMemberLoans] = useState([]);
  const [selectedMemberForLoans, setSelectedMemberForLoans] = useState('');

  const [bookForm, setBookForm] = useState(emptyBook);
  const [memberForm, setMemberForm] = useState(emptyMember);
  const [borrowForm, setBorrowForm] = useState({ member_id: '', book_id: '' });

  const [editingBookId, setEditingBookId] = useState(null);
  const [editingBookForm, setEditingBookForm] = useState(emptyBook);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingMemberForm, setEditingMemberForm] = useState(emptyMember);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hasData = useMemo(
    () => books.length > 0 || members.length > 0 || loans.length > 0 || overdueLoans.length > 0,
    [books, members, loans, overdueLoans]
  );

  async function loadAll() {
    const [bookData, memberData, loanData, overdueLoanData] = await Promise.all([
      fetchBooks(),
      fetchMembers(),
      fetchLoans(true),
      fetchOverdueLoans(),
    ]);
    setBooks(bookData);
    setMembers(memberData);
    setLoans(loanData);
    setOverdueLoans(overdueLoanData);
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

  function startBookEdit(book) {
    setEditingBookId(book.id);
    setEditingBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      total_copies: book.total_copies,
    });
  }

  async function saveBookEdit(event) {
    event.preventDefault();
    if (!editingBookId) {
      return;
    }

    setError('');
    setLoading(true);
    try {
      await updateBook(editingBookId, {
        ...editingBookForm,
        total_copies: Number(editingBookForm.total_copies),
      });
      setEditingBookId(null);
      setEditingBookForm(emptyBook);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startMemberEdit(member) {
    setEditingMemberId(member.id);
    setEditingMemberForm({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
    });
  }

  async function saveMemberEdit(event) {
    event.preventDefault();
    if (!editingMemberId) {
      return;
    }

    setError('');
    setLoading(true);
    try {
      await updateMember(editingMemberId, editingMemberForm);
      setEditingMemberId(null);
      setEditingMemberForm(emptyMember);
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
        <p className="subtitle">Manage books, members, borrowing, and returns from one dashboard.</p>
        {error ? <p className="badge warn">{error}</p> : null}
      </section>

      <section className="tabs" aria-label="Library dashboard tabs">
        <button
          className={`tabButton ${activeTab === 'books' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('books')}
        >
          Books
        </button>
        <button
          className={`tabButton ${activeTab === 'members' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`tabButton ${activeTab === 'circulation' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('circulation')}
        >
          Circulation
        </button>
        <button
          className={`tabButton ${activeTab === 'borrowed' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('borrowed')}
        >
          Borrowed Books
        </button>
      </section>

      {activeTab === 'books' ? (
        <BooksTab
          books={books}
          loading={loading}
          bookForm={bookForm}
          setBookForm={setBookForm}
          handleBookSubmit={handleBookSubmit}
          editingBookId={editingBookId}
          editingBookForm={editingBookForm}
          setEditingBookForm={setEditingBookForm}
          saveBookEdit={saveBookEdit}
          startBookEdit={startBookEdit}
          cancelBookEdit={() => setEditingBookId(null)}
        />
      ) : null}

      {activeTab === 'members' ? (
        <MembersTab
          members={members}
          loading={loading}
          memberForm={memberForm}
          setMemberForm={setMemberForm}
          handleMemberSubmit={handleMemberSubmit}
          editingMemberId={editingMemberId}
          editingMemberForm={editingMemberForm}
          setEditingMemberForm={setEditingMemberForm}
          saveMemberEdit={saveMemberEdit}
          startMemberEdit={startMemberEdit}
          cancelMemberEdit={() => setEditingMemberId(null)}
        />
      ) : null}

      {activeTab === 'circulation' ? (
        <CirculationTab
          books={books}
          members={members}
          loans={loans}
          overdueLoans={overdueLoans}
          loading={loading}
          borrowForm={borrowForm}
          setBorrowForm={setBorrowForm}
          handleBorrowSubmit={handleBorrowSubmit}
          handleReturn={handleReturn}
        />
      ) : null}

      {activeTab === 'borrowed' ? (
        <MemberBorrowedTab
          members={members}
          memberLoans={memberLoans}
          loading={loading}
          selectedMemberForLoans={selectedMemberForLoans}
          setSelectedMemberForLoans={setSelectedMemberForLoans}
          handleMemberLoanQuery={handleMemberLoanQuery}
        />
      ) : null}

      {!hasData ? <p className="muted">No data yet. Add books and members to start lending.</p> : null}
    </main>
  );
}
