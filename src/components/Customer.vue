<template>
  <div class="container">
    <h1
      v-if="!showForm && !reservationTable && !paymentTable"
      class="text-center"
    >
      Customer List
    </h1>
    <h1 v-if="paymentTable" class="text-center">
      Payments {{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }},
      ID: {{ selectedCustomer.id }}
    </h1>
    <h1 v-if="reservationTable" class="text-center">
      Reservations {{ selectedCustomer.firstName }}
      {{ selectedCustomer.lastName }}, ID: {{ selectedCustomer.id }}
    </h1>
    <div
      v-if="!showForm && !reservationTable && !paymentTable"
      class="form-group"
    >
      <label for="filterEmail">Find by Email:</label>
      <input
        type="email"
        class="form-control filter"
        id="filterEmail"
        v-model="filterEmail"
        @input="getCustomers"
        placeholder="Enter email"
      />
    </div>

    <table
      v-if="!showForm && !reservationTable && !paymentTable"
      class="table table-striped"
    >
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Info</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.firstName }}</td>
          <td>{{ customer.lastName }}</td>
          <td>{{ customer.email }}</td>
          <td class="btn-container">
            <button
              class="btn btn-primary"
              @click="showReservations(customer.id)"
            >
              Reservations
            </button>
            <button
              class="btn btn-primary payments"
              @click="showPayments(customer.id)"
            >
              Payments
            </button>
          </td>
          <td class="btn-container">
            <button class="btn btn-primary" @click="editCustomer(customer)">
              Edit
            </button>
            <button
              v-if="userRole === 'ADMIN' || userRole === 'WORKER'"
              class="btn btn-danger"
              @click="deleteCustomer(customer.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      v-if="!showForm && !reservationTable && !paymentTable"
      class="btn btn-primary"
      @click="showForm = true"
      style="margin-top: 15px"
    >
      Add Customer
    </button>

    <form
      v-if="showForm && !isEditing"
      @submit.prevent="addCustomer"
      class="customer-form"
    >
      <h1 class="text-form">Customer form</h1>
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          v-model="newCustomer.firstName"
          required
        />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          v-model="newCustomer.lastName"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="newCustomer.email"
          required
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary add-customer-form">
          Add Customer
        </button>
        <button
          type="button"
          class="btn btn-secondary cancel-customer-form"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>

    <form
      v-if="showForm && isEditing"
      @submit.prevent="saveCustomer"
      class="customer-form"
    >
      <h1 class="text-form">Edit Customer</h1>
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input
          type="text"
          class="form-control"
          id="firstName"
          v-model="editedCustomer.firstName"
          required
        />
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          class="form-control"
          id="lastName"
          v-model="editedCustomer.lastName"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="editedCustomer.email"
          required
        />
      </div>
      <div class="edit-btn-container">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </form>

    <table v-if="paymentTable" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Is Paid</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.amount }}</td>
          <td>{{ payment.status }}</td>
          <td>{{ payment.paid === true ? "Yes" : "No" }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="paymentTable" class="total-cost">
      Unsettled payments: {{ totalCost }}
    </p>
    <button
      v-if="paymentTable"
      class="btn btn-secondary"
      @click="paymentTable = false"
    >
      Back
    </button>

    <table v-if="reservationTable" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer Email</th>
          <th>Room ID</th>
          <th>Hotel ID</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in reservations" :key="reservation.id">
          <td>{{ reservation.id }}</td>
          <td>{{ reservation.customerEmail }}</td>
          <td>{{ reservation.roomId }}</td>
          <td>{{ reservation.hotelId }}</td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
          <td>{{ reservation.status }}</td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="reservationTable"
      class="btn btn-secondary"
      @click="reservationTable = false"
    >
      Back
    </button>
    <div v-if="showError" class="alert alert-danger">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const userRole = ref(sessionStorage.getItem("role"));
const showForm = ref(false);
const reservationTable = ref(false);
const isEditing = ref(false);
const errorMessage = ref("");
const showError = ref(false);
let errorTimeout = null;
const customers = ref([]);
const selectedCustomer = reactive({});
const reservations = ref([]);
const payments = ref([]);
const paymentTable = ref(false);
const totalCost = ref(0);

const newCustomer = reactive({
  firstName: "",
  lastName: "",
  email: "",
});

const editedCustomer = reactive({
  id: "",
  firstName: "",
  lastName: "",
  email: "",
});

const filterEmail = ref("");

const calculateTotalCost = (payments) => {
  let total = 0;
  for (const payment of payments) {
    if (!payment.paid && payment.status !== "Cancelled") {
      total += payment.amount;
    }
  }
  return total;
};

const clearError = () => {
  clearTimeout(errorTimeout);
  showError.value = false;
};

const addCustomer = async () => {
  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });

    if (response.ok) {
      const data = await response.json();
      customers.value.push(data);

      newCustomer.firstName = "";
      newCustomer.lastName = "";
      newCustomer.email = "";
    } else {
      console.error("Failed to add customer:", response.statusText);
    }
  } catch (error) {
    console.error("Error during adding customer:", error);
  }
};

const getCustomerPayments = async (customerId) => {
  try {
    const response = await fetch(`/api/customers/${customerId}/payments`);
    const data = await response.json();

    payments.value = data;
    paymentTable.value = true;

    totalCost.value = calculateTotalCost(data);
  } catch (error) {
    console.error("Error during fetching data:", error);
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`/api/customers/${customerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      customers.value = customers.value.filter(
        (customer) => customer.id !== customerId
      );
    } else {
      console.log(errorMessage.value);
    }
  } catch (error) {
    console.error("Error during deleting customer:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const getCustomers = async () => {
  try {
    let url = "api/customers/all";
    if (filterEmail.value) {
      url =
        "api/customers/filter?email=" + encodeURIComponent(filterEmail.value);
    }
    const response = await fetch(url);
    const data = await response.json();
    customers.value = data;
  } catch (error) {
    console.error("Error during fetching data:", error);
  }
};

const getCustomerReservations = async (customerId) => {
  try {
    const response = await fetch(`/api/customers/${customerId}/reservations`);
    const data = await response.json();
    reservations.value = data;
    reservationTable.value = true;
  } catch (error) {
    console.error("Error during fetching data:", error);
  }
};

const showPayments = (customerId) => {
  const customer = customers.value.find(
    (customer) => customer.id === customerId
  );
  if (customer) {
    selectedCustomer.id = customer.id;
    selectedCustomer.firstName = customer.firstName;
    selectedCustomer.lastName = customer.lastName;
    getCustomerPayments(customerId);
  }
};

const showReservations = (customerId) => {
  const customer = customers.value.find(
    (customer) => customer.id === customerId
  );
  if (customer) {
    selectedCustomer.id = customer.id;
    selectedCustomer.firstName = customer.firstName;
    selectedCustomer.lastName = customer.lastName;
    getCustomerReservations(customerId);
  }
};

const editCustomer = (customer) => {
  isEditing.value = true;
  editedCustomer.id = customer.id;
  editedCustomer.firstName = customer.firstName;
  editedCustomer.lastName = customer.lastName;
  editedCustomer.email = customer.email;
  showForm.value = true;
};

const saveCustomer = async () => {
  try {
    const response = await fetch(`/api/customers/${editedCustomer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedCustomer),
    });

    if (response.ok) {
      const updatedCustomer = await response.json();
      const index = customers.value.findIndex(
        (customer) => customer.id === updatedCustomer.id
      );
      if (index !== -1) {
        customers.value.splice(index, 1, updatedCustomer);
      }
      resetForm();
    } else {
      errorMessage.value = ``;
      showError.value = true;

      errorTimeout = setTimeout(() => {
        clearError();
      }, 3500);
    }
  } catch (error) {
    console.error("Error during updating customer:", error);
  }
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  showForm.value = false;
  isEditing.value = false;
  newCustomer.firstName = "";
  newCustomer.lastName = "";
  newCustomer.email = "";
  editedCustomer.id = "";
  editedCustomer.firstName = "";
  editedCustomer.lastName = "";
  editedCustomer.email = "";
};

onMounted(() => {
  getCustomers();
});
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  .text-center {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 50px;

    td > button {
      margin: 5px;
    }

    td > .btn-container {
      display: flex;

      gap: 5px;
    }

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

    &.btn-primary {
      background: linear-gradient(to right, #3498db, #2980b9);

      &:hover {
        box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
      }
    }

    &.btn-danger {
      background: linear-gradient(45deg, #ed213a, #93291e);

      &:hover {
        box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
      }
    }

    &.btn-secondary {
      background: #bbb;

      &:hover {
        background: #999;
      }
    }
  }

  .customer-form {
    margin-top: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;

      label {
        margin-bottom: 5px;
        font-size: 14px;
        color: #333;

        margin-top: 25px;
      }

      .form-control {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
        transition: border-color 0.2s, box-shadow 0.2s;

        &:focus {
          border-color: #888;
          box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
        }
      }
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      width: 30%;
      margin-top: 20px;

      .add-customer-form,
      .cancel-customer-form {
        margin-top: 10px;
      }
    }
  }

  .delete {
    margin-left: 10px;
  }

  .payments {
    margin-left: 10px;
  }

  .edit-btn-container {
    display: flex;
    justify-content: space-between;
    width: 30%;
    margin-top: 40px;
  }

  .filter {
    margin: 10px 0 0 10px;
    width: 30%;
    border: none;
    padding: 10px;
  }
}

.alert-danger {
  margin-top: 10px;
}

.total-cost {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
