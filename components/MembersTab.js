export default function MembersTab({
  members,
  loading,
  memberForm,
  setMemberForm,
  handleMemberSubmit,
  editingMemberId,
  editingMemberForm,
  setEditingMemberForm,
  saveMemberEdit,
  startMemberEdit,
  cancelMemberEdit,
}) {
  return (
    <section className="grid">
      <div className="panel">
        <h2>Add Member</h2>
        <form onSubmit={handleMemberSubmit}>
          <input required placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
          <input placeholder="Phone" value={memberForm.phone} onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })} />
          <button disabled={loading} type="submit">Create Member</button>
        </form>
      </div>

      <div className="panel">
        <h2>Members</h2>
        <div className="list">
          {members.map((member) => (
            <article className="item" key={member.id}>
              {editingMemberId === member.id ? (
                <form onSubmit={saveMemberEdit}>
                  <input required value={editingMemberForm.name} onChange={(e) => setEditingMemberForm({ ...editingMemberForm, name: e.target.value })} />
                  <input required type="email" value={editingMemberForm.email} onChange={(e) => setEditingMemberForm({ ...editingMemberForm, email: e.target.value })} />
                  <input value={editingMemberForm.phone} onChange={(e) => setEditingMemberForm({ ...editingMemberForm, phone: e.target.value })} />
                  <button disabled={loading} type="submit">Save</button>
                  <button disabled={loading} type="button" onClick={cancelMemberEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  <strong>{member.name}</strong>
                  <div className="muted">{member.email}</div>
                  <div className="muted">{member.phone || 'No phone on file'}</div>
                  <div className="actionsRow">
                    <button disabled={loading} type="button" onClick={() => startMemberEdit(member)}>Edit Member</button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
