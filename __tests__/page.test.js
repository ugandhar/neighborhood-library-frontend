import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from '../app/page';
import {
  borrowBook,
  createBook,
  createMember,
  fetchBooks,
  fetchLoans,
  fetchMemberBorrowedBooks,
  fetchMembers,
  returnBook,
  updateBook,
  updateMember,
} from '../lib/api';

jest.mock('../lib/api', () => ({
  fetchBooks: jest.fn(),
  createBook: jest.fn(),
  updateBook: jest.fn(),
  fetchMembers: jest.fn(),
  createMember: jest.fn(),
  updateMember: jest.fn(),
  borrowBook: jest.fn(),
  returnBook: jest.fn(),
  fetchLoans: jest.fn(),
  fetchMemberBorrowedBooks: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  fetchBooks.mockResolvedValue([
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', total_copies: 2, available_copies: 2 },
  ]);
  fetchMembers.mockResolvedValue([
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890' },
  ]);
  fetchLoans.mockResolvedValue([]);

  createBook.mockResolvedValue({ id: 2 });
  createMember.mockResolvedValue({ id: 2 });
  updateBook.mockResolvedValue({ id: 1 });
  updateMember.mockResolvedValue({ id: 1 });
  borrowBook.mockResolvedValue({ id: 10 });
  returnBook.mockResolvedValue({ loan_id: 10 });
  fetchMemberBorrowedBooks.mockResolvedValue([]);
});

test('switches across all tabs', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  expect(await screen.findByRole('heading', { name: 'Add Book' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Members' }));
  expect(await screen.findByRole('heading', { name: 'Add Member' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Circulation' }));
  expect(await screen.findByRole('heading', { name: 'Borrow Book' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Borrowed Books' }));
  expect(await screen.findByRole('heading', { name: 'Member Borrowed Books' })).toBeInTheDocument();
});

test('submits create book form with numeric total copies', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await screen.findByRole('heading', { name: 'Add Book' });

  await user.clear(screen.getByPlaceholderText('Title'));
  await user.type(screen.getByPlaceholderText('Title'), 'Refactoring');
  await user.clear(screen.getByPlaceholderText('Author'));
  await user.type(screen.getByPlaceholderText('Author'), 'Martin Fowler');
  await user.clear(screen.getByPlaceholderText('ISBN'));
  await user.type(screen.getByPlaceholderText('ISBN'), '9780201485677');
  await user.clear(screen.getByPlaceholderText('Total Copies'));
  await user.type(screen.getByPlaceholderText('Total Copies'), '3');

  await user.click(screen.getByRole('button', { name: 'Create Book' }));

  await waitFor(() => {
    expect(createBook).toHaveBeenCalledWith({
      title: 'Refactoring',
      author: 'Martin Fowler',
      isbn: '9780201485677',
      total_copies: 3,
    });
  });
});

test('loads member borrowed books for selected member', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await user.click(await screen.findByRole('button', { name: 'Borrowed Books' }));

  await user.selectOptions(screen.getByRole('combobox'), '1');
  await user.click(screen.getByRole('button', { name: 'Load Borrowed Books' }));

  await waitFor(() => {
    expect(fetchMemberBorrowedBooks).toHaveBeenCalledWith(1);
  });
});
