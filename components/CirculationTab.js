import { useState } from 'react';

export default function CirculationTab({
  books,
  members,
  loans,
  allLoans,
  overdueLoans,
  loading,
  borrowForm,
  setBorrowForm,
  handleBorrowSubmit,
  handleReturn,
}) {
  const [loanTab, setLoanTab] = useState('active');

  return (
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

        <section className="tabs panelSubTitle" aria-label="Loan list tabs">
          <button
            className={`tabButton ${loanTab === 'active' ? 'active' : ''}`}
            type="button"
            onClick={() => setLoanTab('active')}
          >
            Active Loans
          </button>
          <button
            className={`tabButton ${loanTab === 'all' ? 'active' : ''}`}
            type="button"
            onClick={() => setLoanTab('all')}
          >
            All Loans
          </button>
          <button
            className={`tabButton ${loanTab === 'overdue' ? 'active' : ''}`}
            type="button"
            onClick={() => setLoanTab('overdue')}
          >
            Overdue Loans
          </button>
        </section>

        {loanTab === 'active' ? (
          <div className="list">
            {loans.map((loan) => (
              <article className="item" key={loan.id}>
                <div>Loan #{loan.id}</div>
                <div className="muted">Member: {loan.member_name || `Member #${loan.member_id}`}</div>
                <div className="muted">Book: {loan.book_title || `Book #${loan.book_id}`}</div>
                <div className="muted">Due: {loan.due_date}</div>
                <button disabled={loading} onClick={() => handleReturn(loan.id)} type="button">Return Book</button>
              </article>
            ))}
            {loans.length === 0 ? <p className="muted">No active loans.</p> : null}
          </div>
        ) : null}

        {loanTab === 'all' ? (
          <div className="list">
            {allLoans.map((loan) => (
              <article className="item" key={`all-${loan.id}`}>
                <div>Loan #{loan.id}</div>
                <div className="muted">Member: {loan.member_name || `Member #${loan.member_id}`}</div>
                <div className="muted">Book: {loan.book_title || `Book #${loan.book_id}`}</div>
                <div className="muted">Due: {loan.due_date}</div>
                <div className="muted">Status: {loan.returned_at ? 'Returned' : 'Active'}</div>
              </article>
            ))}
            {allLoans.length === 0 ? <p className="muted">No loans found.</p> : null}
          </div>
        ) : null}

        {loanTab === 'overdue' ? (
          <div className="list">
            {overdueLoans.map((loan) => (
              <article className="item overdueItem" key={`overdue-${loan.id}`}>
                <div>Loan #{loan.id}</div>
                <div className="muted">Member: {loan.member_name || `Member #${loan.member_id}`}</div>
                <div className="muted">Book: {loan.book_title || `Book #${loan.book_id}`}</div>
                <div className="muted">Due: {loan.due_date}</div>
                <span className="badge warn">Overdue</span>
              </article>
            ))}
            {overdueLoans.length === 0 ? <p className="muted">No overdue loans.</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
