import { createApp, nextTick } from 'vue';
import router from '@/router';
import Hotel from '@/components/Hotel.vue';

const mockHotels = [
  { id: 1, name: 'Hotel One', address: '123 Main St' },
  { id: 2, name: 'Hotel Two', address: '456 Elm St' },
];

const mockRooms = [
  { id: 1, type: 'Single', number: 101, free: true, price: 100 },
  { id: 2, type: 'Double', number: 102, free: false, price: 150 },
];

global.fetch = jest.fn((url) => {
  if (url.endsWith('/api/hotel/all')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockHotels),
    });
  } else if (url.includes('/api/hotel/') && url.includes('/rooms')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRooms),
    });
  }
  return Promise.resolve({ ok: false });
});

describe('Hotel.vue', () => {
  let app;
  let container;

  beforeEach(async () => {
    sessionStorage.setItem('role', 'ADMIN');
    container = document.createElement('div');
    document.body.appendChild(container);

    app = createApp(Hotel);
    app.use(router);
    router.push('/hotel');
    await router.isReady();
    app.mount(container);
  });

  afterEach(() => {
    sessionStorage.clear();
    app.unmount();
    container.remove();
    jest.clearAllMocks();
  });

  it('renders hotel list table', async () => {
    await nextTick(); // Wait for initial fetch
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const rows = table.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(mockHotels.length);
  });

  it('renders "Add Hotel" button', async () => {
    await nextTick(); // Wait for DOM update
    const buttons = container.querySelectorAll('button.btn-primary');
    const addButton = Array.from(buttons).find(button => button.textContent.includes('Add Hotel'));
    expect(addButton).not.toBeNull();
  });

  it('opens hotel form on "Add Hotel" click', async () => {
    await nextTick(); // Wait for DOM update
    const buttons = container.querySelectorAll('button.btn-primary');
    const addButton = Array.from(buttons).find(button => button.textContent.includes('Add Hotel'));
    addButton.click();
    await nextTick(); // Wait for DOM update
    const form = container.querySelector('form.hotel-form');
    expect(form).not.toBeNull();
  });




});
