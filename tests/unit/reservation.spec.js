import { createApp, nextTick } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import Reservation from '@/components/Reservation.vue';

const routes = [{ path: '/', component: { template: '<div>Home</div>' } }];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const mockReservations = [
  { id: 1, customerEmail: 'john.doe@example.com', roomId: 101, hotelId: 1, startDate: '2024-06-01', endDate: '2024-06-05', status: 'Active' },
  { id: 2, customerEmail: 'jane.smith@example.com', roomId: 102, hotelId: 2, startDate: '2024-06-10', endDate: '2024-06-15', status: 'Cancelled' },
];

global.fetch = jest.fn((url) => {
  if (url.endsWith('/api/reservation/all')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockReservations),
    });
  }
  if (url.includes('/api/reservation/') && !url.includes('all')) {
    const id = parseInt(url.split('/').pop());
    const reservation = mockReservations.find(res => res.id === id);
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(reservation),
    });
  }
  if (url.includes('/markAsUnpaid')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...mockReservations[1], paid: false, status: 'Pending' }),
    });
  }
  return Promise.resolve({ ok: false });
});

describe('Reservation.vue', () => {
  let app;
  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    app = createApp(Reservation);
    app.use(router);
    router.push('/');
    await router.isReady();
    app.mount(container);
  });

  afterEach(() => {
    app.unmount();
    container.remove();
    jest.clearAllMocks();
  });

  it('renders reservation list table', async () => {
    await nextTick();
    const table = container.querySelector('table');
    expect(table).not.toBeNull();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(mockReservations.length);
  });

  it('marks reservation as cancelled', async () => {
    await nextTick();
    const cancelButtons = container.querySelectorAll('button.cancel');
    cancelButtons[1]?.click();
    await nextTick();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[1]?.querySelector('td:nth-child(7)')?.textContent).toBe('Cancelled');
  });
});
