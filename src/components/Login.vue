<template>
  <main class="login-container">
    <section class="login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div v-if="showError" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const showError = ref(false);
const errorMessage = ref("");
const username = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Error during login");
    }
    const userData = await response.json();
    sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem("role", userData.role);
    router.push("/");
  } catch (error) {
    showError.value = true;
    errorMessage.value = "Incorrect username or password.";
    console.error("Error", error);
    setTimeout(() => {
      showError.value = false;
      errorMessage.value = "";
    }, 5000);
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  font-family: "Roboto", sans-serif;
}

.login {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 350px;
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-weight: bold;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;

      &:focus {
        border-color: #3498db;
      }
    }
  }

  button {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #2980b9;
    }
  }

  .alert {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 5px;
    text-align: center;
    color: white;
    background-color: #e74c3c;
  }
}
</style>
