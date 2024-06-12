<template>
  <div class="container">
    <h1 class="text-center">Payment List</h1>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer ID</th>
          <th>Amount</th>
          <th>Paid</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.customerId }}</td>
          <td>{{ payment.amount }}</td>
          <td>{{ payment.paid }}</td>
          <td>{{ payment.status }}</td>
          <td>
            <button
              class="btn btn-primary"
              style="margin-right: 10px"
              :class="payment.paid ? `disabled` : ``"
              @click="openPaymentForm(payment.id, 'creditCard')"
              :disabled="payment.paid"
            >
              Pay with Credit Card
            </button>
            <button
              class="btn btn-primary"
              :class="payment.paid ? `disabled` : ``"
              @click="openPaymentForm(payment.id, 'paypal')"
              :disabled="payment.paid"
            >
              Pay with PayPal
            </button>
            <button
              class="btn btn-warning cancel"
              @click="markPaymentAsUnPaid(payment.id)"
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showCreditCardForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="closePaymentForm">&times;</span>
        <h2>Pay with Credit Card</h2>
        <form @submit.prevent="payWithCreditCard">
          <input
            v-model="creditCardDetails.cardNumber"
            placeholder="Card Number"
            required
          />
          <input
            v-model="creditCardDetails.cardHolderName"
            placeholder="Card Holder Name"
            required
          />
          <input v-model="creditCardDetails.cvv" placeholder="CVV" required />
          <input
            v-model="creditCardDetails.expirationDate"
            placeholder="Expiration Date"
            required
          />
          <button type="submit">Pay</button>
        </form>
      </div>
    </div>

    <div v-if="showPayPalForm" class="modal">
      <div class="modal-content">
        <span class="close" @click="closePaymentForm">&times;</span>
        <h2>Pay with PayPal</h2>
        <form @submit.prevent="payWithPayPal">
          <input v-model="paypalDetails.email" placeholder="Email" required />
          <input
            v-model="paypalDetails.password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Pay</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const payments = ref([]);
const showCreditCardForm = ref(false);
const showPayPalForm = ref(false);
const selectedPaymentId = ref(null);

const creditCardDetails = ref({
  cardNumber: "",
  cardHolderName: "",
  cvv: "",
  expirationDate: "",
});

const paypalDetails = ref({
  email: "",
  password: "",
});

const getAllPayments = async () => {
  try {
    const response = await fetch("/api/payment/all");
    if (response.ok) {
      const data = await response.json();
      payments.value = data;
    } else {
      console.error("Failed to fetch payments:", response.statusText);
    }
  } catch (error) {
    console.error("Error during fetching payments:", error);
  }
};

const markPaymentAsPaid = async (paymentId) => {
  try {
    const response = await fetch(`/api/payment/${paymentId}/markAsPaid`, {
      method: "PUT",
    });
    if (response.ok) {
      const data = await response.json();
      const paymentIndex = payments.value.findIndex(
        (payment) => payment.id === data.id
      );
      if (paymentIndex !== -1) {
        payments.value[paymentIndex] = data;
      }
    } else {
      console.error("Failed to mark payment as paid:", response.statusText);
    }
  } catch (error) {
    console.error("Error during marking payment as paid:", error);
  }
};

const markPaymentAsUnPaid = async (paymentId) => {
  try {
    const response = await fetch(`/api/payment/${paymentId}/markAsUnpaid`, {
      method: "PUT",
    });
    if (response.ok) {
      const data = await response.json();
      const paymentIndex = payments.value.findIndex(
        (payment) => payment.id === data.id
      );
      if (paymentIndex !== -1) {
        payments.value[paymentIndex] = data;
      }
    } else {
      console.error("Failed to mark payment as unpaid:", response.statusText);
    }
  } catch (error) {
    console.error("Error during marking payment as unpaid:", error);
  }
};

const openPaymentForm = (paymentId, method) => {
  selectedPaymentId.value = paymentId;
  if (method === "creditCard") {
    showCreditCardForm.value = true;
  } else if (method === "paypal") {
    showPayPalForm.value = true;
  }
};

const closePaymentForm = () => {
  showCreditCardForm.value = false;
  showPayPalForm.value = false;
  selectedPaymentId.value = null;
};

const payWithCreditCard = async () => {
  try {
    const response = await fetch(
      `/api/payment/${selectedPaymentId.value}/payWithCreditCard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creditCardDetails.value),
      }
    );
    if (response.ok) {
      await markPaymentAsPaid(selectedPaymentId.value);
      closePaymentForm();
    } else {
      console.error(
        "Failed to process credit card payment:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error during credit card payment:", error);
  }
};

const payWithPayPal = async () => {
  try {
    const response = await fetch(
      `/api/payment/${selectedPaymentId.value}/payWithPayPal`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paypalDetails.value),
      }
    );
    if (response.ok) {
      await markPaymentAsPaid(selectedPaymentId.value);
      closePaymentForm();
    } else {
      console.error("Failed to process PayPal payment:", response.statusText);
    }
  } catch (error) {
    console.error("Error during PayPal payment:", error);
  }
};

onMounted(() => {
  getAllPayments();
});
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.text-center {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f0f0f0;
    color: #333;
  }

  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f2f2f2;
  }
}

.btn {
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary {
  background: linear-gradient(to right, #3498db, #2980b9);
}

.btn-primary:hover {
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.btn-warning {
  background: linear-gradient(45deg, #ffd31d, #ff9d00);
}

.btn-warning:hover {
  box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.cancel {
  margin-left: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
