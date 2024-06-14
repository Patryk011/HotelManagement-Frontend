import { createApp, nextTick } from 'vue';
import router from '@/router';
import Login from '@/components/Login.vue';

describe('Login.vue', () => {
  let app;
  let container;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    app = createApp(Login);
    app.use(router);
    router.push('/login');
    await router.isReady();
    app.mount(container);
  });

  afterEach(() => {
    app.unmount();
    container.remove();
    jest.clearAllMocks();
  });

  it('renders login form', async () => {
    await nextTick();
    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    const usernameInput = container.querySelector('#username');
    const passwordInput = container.querySelector('#password');
    const button = container.querySelector('button[type="submit"]');

    expect(usernameInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
    expect(button).not.toBeNull();
  });

  it('displays error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await nextTick();
    const usernameInput = container.querySelector('#username');
    const passwordInput = container.querySelector('#password');
    const button = container.querySelector('button[type="submit"]');

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'wrongpassword';
    passwordInput.dispatchEvent(new Event('input'));

    button.click();
    await nextTick();
    await nextTick(); 

    const alert = container.querySelector('.alert-danger');
    expect(alert).not.toBeNull();
    expect(alert.textContent).toBe('Incorrect username or password.');
  });

  it('navigates to home on successful login', async () => {
    const userData = { username: 'testuser', role: 'USER' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(userData),
      })
    );

    await nextTick();
    const usernameInput = container.querySelector('#username');
    const passwordInput = container.querySelector('#password');
    const button = container.querySelector('button[type="submit"]');

    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'correctpassword';
    passwordInput.dispatchEvent(new Event('input'));

    button.click();
    await nextTick();
    await nextTick(); 
  })

});

