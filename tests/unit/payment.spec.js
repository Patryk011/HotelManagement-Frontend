import { createApp, nextTick } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import Payment from '@/components/Payment.vue';


const routes = [{ path: '/', component: { template: '<div>Home</div>' } }];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const mockPayments = [
  { id: 1, customerId: 101, amount: 200, paid: false, status: 'Pending' },
  { id: 2, customerId: 102, amount: 300, paid: true, status: 'Completed' },
];

global.fetch = jest.fn((url) => {
  if (url.endsWith('/api/payment/all')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockPayments),
    });
  }
  if (url.includes('/markAsPaid')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...mockPayments[0], paid: true, status: 'Completed' }),
    });
  }
  if (url.includes('/markAsUnpaid')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...mockPayments[1], paid: false, status: 'Pending' }),
    });
  }
  return Promise.resolve({ ok: false });
});

describe('Payment.vue', () => {
  let app;
  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    app = createApp(Payment);
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

  it('renders payment list table', async () => {
    await nextTick();
    const table = container.querySelector('table');
    expect(table).not.toBeNull();

    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(mockPayments.length);
  });

  it('opens credit card payment form on button click', async () => {
    await nextTick();
    const buttons = container.querySelectorAll('button.btn-primary');
    const creditCardButton = Array.from(buttons).find(button => button.textContent.includes('Pay with Credit Card'));
    creditCardButton.click();
    await nextTick();

    const modal = container.querySelector('.modal-content');
    expect(modal).not.toBeNull();
    expect(modal.querySelector('h2').textContent).toBe('Pay with Credit Card');
  });

  it('opens PayPal payment form on button click', async () => {
    await nextTick();
    const buttons = container.querySelectorAll('button.btn-primary');
    const paypalButton = Array.from(buttons).find(button => button.textContent.includes('Pay with PayPal'));
    paypalButton.click();
    await nextTick();

    const modal = container.querySelector('.modal-content');
    expect(modal).not.toBeNull();
    expect(modal.querySelector('h2').textContent).toBe('Pay with PayPal');
  });

  it('marks payment as paid', async () => {
    await nextTick();
    const buttons = container.querySelectorAll('button.btn-primary');
    const creditCardButton = Array.from(buttons).find(button => button.textContent.includes('Pay with Credit Card'));
    creditCardButton.click();
    await nextTick();
    await nextTick(); 
  });
});
