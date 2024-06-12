<template>
  <div v-if="isLoading" class="loader"></div>
  <div v-else class="email-list">
    <h2 class="email-list__title">MailBox</h2>
    <ul class="email-list__items">
      <li
        v-for="email in emails"
        :key="email.id"
        class="email-list__item"
        @click="selectEmail(email.id)"
      >
        <h3 class="email-list__item-title">{{ email.subject }}</h3>
        <p class="email-list__item-from">
          From: {{ extractEmailFromAddress(email.from) }}
        </p>
        <div
          v-if="selectedEmailId === email.id"
          class="email-list__item-details"
        >
          <p class="email-list__item-date">
            Received Date: {{ formatDate(email.receivedDate) }}
          </p>
          <p class="email-list__item-content">{{ email.content }}</p>
        </div>
        <button
          class="email-list__item-delete-button"
          @click.stop="deleteEmail(email.id)"
        >
          X
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emails = ref([]);
const isLoading = ref(false);
const selectedEmailId = ref(null);

const selectEmail = (emailId) => {
  selectedEmailId.value = selectedEmailId.value === emailId ? null : emailId;
};

const fetchEmails = async () => {
  isLoading.value = true;
  try {
    const response = await fetch("/api/email/all");
    const data = await response.json();
    emails.value = data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
  } finally {
    isLoading.value = false;
  }
};

const deleteEmail = async (id) => {
  try {
    const response = await fetch(`/api/email/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      emails.value = emails.value.filter((email) => email.id !== id);
    } else {
      console.error("Błąd podczas usuwania wiadomości:", response.status);
    }
  } catch (error) {
    console.error("Błąd podczas wysyłania żądania:", error);
  }
};

const extractEmailFromAddress = (address) => {
  if (!address) return "Unknown sender";
  const emailRegex = /(?<=<)[^<>]+(?=>)/;
  const match = address.match(emailRegex);
  return match ? match[0] : address;
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

onMounted(fetchEmails);
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap");

.email-list {
  margin: 0 auto;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  background-color: #f4f5f7;
  border-radius: 15px;
  box-shadow: 0px 8px 30px -5px rgba(0, 0, 0, 0.1);
  width: 1200px;
}

.email-list__title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
  color: #2f3542;
}

.email-list__items {
  list-style: none;
  padding: 0;
}

.email-list__item {
  border: 1px solid #e2e6ea;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #ffffff;
  box-shadow: 0px 10px 20px -10px rgba(0, 0, 0, 0.07);
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 15px 30px -10px rgba(0, 0, 0, 0.1);
  }
}

.email-list__item-title {
  text-align: left;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2f3542;
}

.email-list__item-from,
.email-list__item-date {
  font-size: 16px;
  margin-bottom: 5px;
  color: #57606f;
}

.email-list__item-content {
  font-size: 16px;
  color: #57606f;
  word-wrap: break-word;
}

.email-list__item-delete-button {
  color: #000;
  border: none;
  background-color: #ffffff;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 500;
  position: absolute;
  top: 10px;
  right: 10px;
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  margin: 0 auto;
  margin-top: 20%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
