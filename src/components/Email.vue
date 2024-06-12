<template>
  <div class="container">
    <h1 class="title">Sending e-mail</h1>
    <form @submit.prevent="sendEmail" class="email-form">
      <label for="to">To:</label>
      <input type="email" id="to" v-model="email.to" required />
      <br />
      <label for="subject">Subject:</label>
      <input type="text" id="subject" v-model="email.subject" required />
      <br />
      <label for="message">Message:</label>
      <textarea
        id="message"
        class="email-message"
        v-model="email.message"
        required
      ></textarea>
      <br />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const email = reactive({
  to: "",
  subject: "",
  message: "",
});

const sendEmail = async () => {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    if (response.ok) {
      console.log("Wiadomość e-mail została wysłana");
      email.to = "";
      email.subject = "";
      email.message = "";
    } else {
      console.error(
        "Błąd podczas wysyłania wiadomości e-mail:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Błąd podczas wysyłania wiadomości e-mail:", error);
  }
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  background-color: #f4f5f7;
  padding-left: 2em;
  width: 80%;
  margin: 0 auto;
}

.title {
  font-size: 2em;
  color: #2f3542;
  margin-bottom: 16px;
  margin-top: 30px;
}

.email-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.07);
  margin-top: 50px;
}

.email-form label {
  font-size: 1em;
  font-weight: 500;
  color: #57606f;
  margin-bottom: 8px;
}

.email-form input,
.email-form textarea {
  font-size: 14px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-bottom: 16px;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.email-form input:focus,
.email-form textarea:focus {
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.15);
  outline: none;
}

.email-form textarea {
  min-height: 150px;
  resize: vertical;
}

.email-form button[type="submit"] {
  align-self: flex-end;
  font-size: 14px;
  padding: 10px 48px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.email-form button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
