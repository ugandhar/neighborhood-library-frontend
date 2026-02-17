export default function MemberBorrowedTab({
  members,
  memberLoans,
  loading,
  selectedMemberForLoans,
  setSelectedMemberForLoans,
  handleMemberLoanQuery,
}) {
  return (
    <section className="grid">
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
          {memberLoans.length === 0 ? <p className="muted">No borrowed books loaded.</p> : null}
        </div>
      </div>
    </section>
  );
}
