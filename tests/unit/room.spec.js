import { createApp, nextTick } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import Room from '@/components/Room.vue';


const routes = [{ path: '/', component: { template: '<div>Home</div>' } }];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

let mockRooms = [
  { id: 1, type: 'Single', number: 101, free: true, clean: true, price: 100, hotelId: 1 },
  { id: 2, type: 'Double', number: 102, free: false, clean: false, price: 150, hotelId: 1 },
];

global.fetch = jest.fn((url, options) => {
  if (url.endsWith('/api/room/all')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRooms),
    });
  }
  if (url.includes('/api/room/') && !url.includes('all') && !url.includes('available')) {
    const id = parseInt(url.split('/').pop());
    const room = mockRooms.find(r => r.id === id);
    if (options && options.method === 'PUT' && url.includes('toggleClean')) {
      room.clean = !room.clean;
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(room),
    });
  }
  if (url.includes('/api/room/') && options && options.method === 'DELETE') {
    const id = parseInt(url.split('/').pop());
    mockRooms = mockRooms.filter(r => r.id !== id);
    return Promise.resolve({
      ok: true,
    });
  }
  return Promise.resolve({ ok: false });
});

describe('Room.vue', () => {
  let app;
  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    app = createApp(Room);
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

  it('renders room list table', async () => {
    await nextTick();
    const table = container.querySelector('table');
    expect(table).not.toBeNull();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(mockRooms.length);
  });

  it('opens create room form on button click', async () => {
    await nextTick();
    const buttons = container.querySelectorAll('button.btn-primary');
    const addButton = Array.from(buttons).find(button => button.textContent.includes('Add Room'));
    addButton.click();
    await nextTick();
  });

  it('toggles room clean status', async () => {
    await nextTick();
    const toggleButtons = container.querySelectorAll('button.btn-primary');
    const toggleButton = Array.from(toggleButtons).find(button => button.textContent.includes('Set to dirty') || button.textContent.includes('Set to Clean'));
    toggleButton.click();
    await nextTick();
    await nextTick(); 

    const rows = container.querySelectorAll('tbody tr');
    const updatedRoomCleanStatus = mockRooms.find(r => r.id === 1).clean;
    const expectedStatus = updatedRoomCleanStatus ? 'Yes' : 'No';
    expect(rows[0]?.querySelector('td:nth-child(5)')?.textContent).toBe(expectedStatus);
  });

  it('deletes a room', async () => {
    await nextTick();
    const deleteButtons = container.querySelectorAll('button.delete');
    deleteButtons[0]?.click();
    await nextTick();
    await nextTick(); 

  });
});
