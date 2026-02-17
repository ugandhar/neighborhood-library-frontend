export default function BooksTab({
  books,
  loading,
  bookForm,
  setBookForm,
  handleBookSubmit,
  editingBookId,
  editingBookForm,
  setEditingBookForm,
  saveBookEdit,
  startBookEdit,
  cancelBookEdit,
}) {
  return (
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
      </div>

      <div className="panel">
        <h2>Books</h2>
        <div className="list">
          {books.map((book) => (
            <article className="item" key={book.id}>
              {editingBookId === book.id ? (
                <form onSubmit={saveBookEdit}>
                  <input required value={editingBookForm.title} onChange={(e) => setEditingBookForm({ ...editingBookForm, title: e.target.value })} />
                  <input required value={editingBookForm.author} onChange={(e) => setEditingBookForm({ ...editingBookForm, author: e.target.value })} />
                  <input required value={editingBookForm.isbn} onChange={(e) => setEditingBookForm({ ...editingBookForm, isbn: e.target.value })} />
                  <input required type="number" min="1" value={editingBookForm.total_copies} onChange={(e) => setEditingBookForm({ ...editingBookForm, total_copies: e.target.value })} />
                  <button disabled={loading} type="submit">Save</button>
                  <button disabled={loading} type="button" onClick={cancelBookEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  <strong>{book.title}</strong>
                  <div className="muted">{book.author}</div>
                  <div className="muted">ISBN: {book.isbn}</div>
                  <span className="badge">Available: {book.available_copies}/{book.total_copies}</span>
                  <div className="actionsRow">
                    <button disabled={loading} type="button" onClick={() => startBookEdit(book)}>Edit Book</button>
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
