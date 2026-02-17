export default function CirculationTab({
  books,
  members,
  loans,
  loading,
  borrowForm,
  setBorrowForm,
  handleBorrowSubmit,
  handleReturn,
}) {
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

        <h2 className="panelSubTitle">Active Loans</h2>
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
          {loans.length === 0 ? <p className="muted">No active loans.</p> : null}
        </div>
      </div>
    </section>
  );
}
