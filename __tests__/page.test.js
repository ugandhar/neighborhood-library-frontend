import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from '../app/page';
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
  fetchOverdueLoans: jest.fn(),
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
  fetchLoans.mockImplementation((activeOnly = true) => {
    if (activeOnly) {
      return Promise.resolve([]);
    }
    return Promise.resolve([]);
  });
  fetchOverdueLoans.mockResolvedValue([]);

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

test('displays overdue loans in circulation tab', async () => {
  const user = userEvent.setup();
  fetchOverdueLoans.mockResolvedValueOnce([
    { id: 99, member_id: 1, book_id: 1, member_name: 'Jane Doe', book_title: 'Clean Code', due_date: '2026-02-01' },
  ]);

  render(<HomePage />);
  await user.click(await screen.findByRole('button', { name: 'Circulation' }));

  await user.click(screen.getByRole('button', { name: 'Overdue Loans' }));
  expect(await screen.findByText('Loan #99')).toBeInTheDocument();
  expect(await screen.findByText('Member: Jane Doe')).toBeInTheDocument();
  expect(await screen.findByText('Book: Clean Code')).toBeInTheDocument();
});

test('submits create member form', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await user.click(await screen.findByRole('button', { name: 'Members' }));
  await screen.findByRole('heading', { name: 'Add Member' });

  await user.clear(screen.getByPlaceholderText('Name'));
  await user.type(screen.getByPlaceholderText('Name'), 'John Doe');
  await user.clear(screen.getByPlaceholderText('Email'));
  await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
  await user.clear(screen.getByPlaceholderText('Phone'));
  await user.type(screen.getByPlaceholderText('Phone'), '9876543210');
  await user.click(screen.getByRole('button', { name: 'Create Member' }));

  await waitFor(() => {
    expect(createMember).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
    });
  });
});

test('submits borrow form with numeric ids', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await user.click(await screen.findByRole('button', { name: 'Circulation' }));
  await screen.findByRole('heading', { name: 'Borrow Book' });

  const selects = screen.getAllByRole('combobox');
  await user.selectOptions(selects[0], '1');
  await user.selectOptions(selects[1], '1');
  await user.click(screen.getByRole('button', { name: 'Borrow' }));

  await waitFor(() => {
    expect(borrowBook).toHaveBeenCalledWith({
      member_id: 1,
      book_id: 1,
    });
  });
});

test('returns an active loan when return button clicked', async () => {
  const user = userEvent.setup();
  fetchLoans.mockImplementation((activeOnly = true) => {
    const loan = {
      id: 7,
      member_id: 1,
      book_id: 1,
      member_name: 'Jane Doe',
      book_title: 'Clean Code',
      due_date: '2026-02-25',
      returned_at: null,
    };
    return Promise.resolve(activeOnly ? [loan] : [loan]);
  });

  render(<HomePage />);
  await user.click(await screen.findByRole('button', { name: 'Circulation' }));
  await screen.findByRole('button', { name: 'Return Book' });

  await user.click(screen.getByRole('button', { name: 'Return Book' }));

  await waitFor(() => {
    expect(returnBook).toHaveBeenCalledWith(7);
  });
});

test('displays all loans section in circulation tab', async () => {
  const user = userEvent.setup();
  fetchLoans.mockImplementation((activeOnly = true) => {
    if (activeOnly) {
      return Promise.resolve([]);
    }
    return Promise.resolve([
      {
        id: 22,
        member_id: 1,
        book_id: 1,
        member_name: 'Jane Doe',
        book_title: 'Clean Code',
        due_date: '2026-03-01',
        returned_at: '2026-03-02T10:00:00Z',
      },
    ]);
  });

  render(<HomePage />);
  await user.click(await screen.findByRole('button', { name: 'Circulation' }));

  await user.click(screen.getByRole('button', { name: 'All Loans' }));
  expect(await screen.findByText('Loan #22')).toBeInTheDocument();
  expect(await screen.findByText('Status: Returned')).toBeInTheDocument();
});

test('edits existing book and submits update', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await screen.findByText('Clean Code');
  await user.click(screen.getByRole('button', { name: 'Edit Book' }));

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const editForm = saveButton.closest('form');
  const editScope = within(editForm);

  const textInputs = editScope.getAllByRole('textbox');
  await user.clear(textInputs[0]);
  await user.type(textInputs[0], 'Clean Architecture');
  await user.clear(textInputs[1]);
  await user.type(textInputs[1], 'Robert Martin');
  await user.clear(textInputs[2]);
  await user.type(textInputs[2], '9780134494166');
  await user.clear(editScope.getByRole('spinbutton'));
  await user.type(editScope.getByRole('spinbutton'), '4');

  await user.click(saveButton);

  await waitFor(() => {
    expect(updateBook).toHaveBeenCalledWith(1, {
      title: 'Clean Architecture',
      author: 'Robert Martin',
      isbn: '9780134494166',
      total_copies: 4,
    });
  });
});

test('edits existing member and submits update', async () => {
  const user = userEvent.setup();
  render(<HomePage />);

  await user.click(await screen.findByRole('button', { name: 'Members' }));
  await screen.findByText('Jane Doe');
  await user.click(screen.getByRole('button', { name: 'Edit Member' }));

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const editForm = saveButton.closest('form');
  const editScope = within(editForm);

  const nameInput = editScope.getByDisplayValue('Jane Doe');
  const emailInput = editScope.getByDisplayValue('jane@example.com');
  const phoneInput = editScope.getByDisplayValue('1234567890');

  await user.clear(nameInput);
  await user.type(nameInput, 'Jane Smith');
  await user.clear(emailInput);
  await user.type(emailInput, 'jane.smith@example.com');
  await user.clear(phoneInput);
  await user.type(phoneInput, '1112223333');
  await user.click(saveButton);

  await waitFor(() => {
    expect(updateMember).toHaveBeenCalledWith(1, {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '1112223333',
    });
  });
});
