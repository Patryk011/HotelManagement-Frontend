
import Customer from '@/components/Customer.vue'; 
import { createApp } from 'vue';

const mockCustomers = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
];

global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockCustomers),
  })
);

describe('Customer.vue', () => {
  let app;
  let container;

  beforeEach(() => {
    sessionStorage.setItem('role', 'ADMIN');
    container = document.createElement('div');
    document.body.appendChild(container);
    app = createApp(Customer);
    app.mount(container);
  });

  afterEach(() => {
    sessionStorage.clear();
    app.unmount();
    container.remove();
    jest.clearAllMocks();
  });

  it('renders customer list table', () => {
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(mockCustomers.length);
  });

});
