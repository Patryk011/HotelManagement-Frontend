<template>
  <div class="container">
    <h1 v-if="!showForm && !editForm" class="text-center">Reservation List</h1>

    <table v-if="!showForm && !editForm" class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer Email</th>
          <th>Room ID</th>
          <th>Hotel ID</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Status</th>
          <th>Actions</th>
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
          <td>
            <button
              class="btn btn-primary"
              @click="showEditForm(reservation.id)"
            >
              Edit
            </button>
            <button
              v-if="userRole === 'ADMIN' || 'WORKER'"
              class="btn btn-danger cancel"
              @click="cancelReservation(reservation.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="!showForm && !editForm"
      class="btn btn-primary"
      @click="showForm = true"
    >
      Create Reservation
    </button>

    <form
      v-if="showForm"
      @submit.prevent="createReservation"
      class="reservation-form"
    >
      <h1 class="text-form">Reservation Form</h1>
      <div class="form-group">
        <label for="customerEmail">Customer Email:</label>
        <input
          type="text"
          class="form-control"
          id="customerEmail"
          v-model="newReservation.customerEmail"
          required
        />
      </div>
      <div class="form-group">
        <label for="roomId">Room ID:</label>
        <input
          type="number"
          class="form-control"
          id="roomId"
          v-model="newReservation.roomId"
          required
        />
      </div>
      <div class="form-group">
        <label for="hotelId">Hotel ID:</label>
        <input
          type="number"
          class="form-control"
          id="hotelId"
          v-model="newReservation.hotelId"
          required
        />
      </div>
      <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input
          type="date"
          class="form-control"
          id="startDate"
          v-model="newReservation.startDate"
          required
        />
      </div>
      <div class="form-group">
        <label for="endDate">End Date:</label>
        <input
          type="date"
          class="form-control"
          id="endDate"
          v-model="newReservation.endDate"
          required
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary add-reservation-form">
          Add Reservation
        </button>
        <button
          type="button"
          class="btn btn-secondary cancel-reservation-form"
          @click="showForm = false"
        >
          Cancel
        </button>
      </div>
    </form>

    <form
      v-if="editForm"
      @submit.prevent="updateReservation"
      class="reservation-form"
    >
      <h1 class="text-form">Edit Reservation</h1>
      <div class="form-group">
        <label for="customerEmail">Customer Email:</label>
        <input
          type="text"
          class="form-control"
          id="customerEmail"
          v-model="editReservation.customerEmail"
        />
      </div>
      <div class="form-group">
        <label for="roomId">Room ID:</label>
        <input
          type="number"
          class="form-control"
          id="roomId"
          v-model="editReservation.roomId"
        />
      </div>
      <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input
          type="date"
          class="form-control"
          id="startDate"
          v-model="editReservation.startDate"
        />
      </div>
      <div class="form-group">
        <label for="endDate">End Date:</label>
        <input
          type="date"
          class="form-control"
          id="endDate"
          v-model="editReservation.endDate"
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary edit-reservation-form">
          Update Reservation
        </button>
        <button
          type="button"
          class="btn btn-secondary cancel-reservation-form"
          @click="editForm = false"
        >
          Cancel
        </button>
      </div>
    </form>
    <div v-if="showError" class="alert alert-danger">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const showForm = ref(false);
const editForm = ref(false);
const reservations = ref([]);
const errorMessage = ref("");
const showError = ref(false);
let errorTimeout = null;

const newReservation = reactive({
  customerEmail: "",
  roomId: null,
  hotelId: null,
  startDate: null,
  endDate: null,
  status: "",
});

const editReservation = reactive({
  id: null,
  customerEmail: "",
  roomId: null,
  hotelId: null,
  startDate: null,
  endDate: null,
  status: "",
});

const userRole = ref(sessionStorage.getItem("role"));

const clearError = () => {
  clearTimeout(errorTimeout);
  showError.value = false;
};

const createReservation = async () => {
  try {
    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReservation),
    });

    if (response.ok) {
      const data = await response.json();
      reservations.value.push(data);
      newReservation.customerEmail = "";
      newReservation.roomId = null;
      newReservation.hotelId = null;
      newReservation.startDate = null;
      newReservation.endDate = null;
      newReservation.status = "";
      showForm.value = false;
    } else {
      const errorData = await response.text();
      errorMessage.value = errorData;
      showError.value = true;

      errorTimeout = setTimeout(() => {
        clearError();
      }, 3500);
    }
  } catch (error) {
    console.error("Error during adding reservation:", error);
  }
};

const updateReservation = async () => {
  try {
    const response = await fetch(`/api/reservation/${editReservation.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editReservation),
    });

    if (response.ok) {
      const data = await response.json();
      const index = reservations.value.findIndex(
        (reservation) => reservation.id === editReservation.id
      );
      if (index !== -1) {
        reservations.value.splice(index, 1, data);
      }
      editForm.value = false;
    } else {
      const errorData = await response.text();
      errorMessage.value = errorData;
      showError.value = true;

      errorTimeout = setTimeout(() => {
        clearError();
      }, 3500);
    }
  } catch (error) {
    console.error("Error during updating reservation:", error);
  }
};

const showEditForm = async (reservationId) => {
  try {
    const response = await fetch(`/api/reservation/${reservationId}`);
    const data = await response.json();

    editReservation.id = data.id;
    editReservation.customerEmail = data.customerEmail;
    editReservation.roomId = data.roomId;
    editReservation.hotelId = data.hotelId;
    editReservation.startDate = data.startDate;
    editReservation.endDate = data.endDate;
    editReservation.status = data.status;
    editForm.value = true;
  } catch (error) {
    console.error("Error during showing edit form:", error);
  }
};

const cancelReservation = async (reservationId) => {
  try {
    const response = await fetch(`/api/reservation/${reservationId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const index = reservations.value.findIndex(
        (reservation) => reservation.id === reservationId
      );
      if (index !== -1) {
        reservations.value.splice(index, 1);
      }
    } else {
      console.error("Failed to cancel reservation:", response.statusText);
    }
  } catch (error) {
    console.error("Error during canceling reservation:", error);
  }
};

const getAllReservations = async () => {
  try {
    const response = await fetch("/api/reservation/all");
    const data = await response.json();
    reservations.value = data;
  } catch (error) {
    console.error("Error during fetching reservations:", error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  getAllReservations();
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

    &.btn-primary {
      background: linear-gradient(to right, #3498db, #2980b9);

      &.available {
        margin-left: 10px;
      }

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

  .reservation-form {
    margin-top: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      width: 100%;

      label {
        margin-top: 20px;
        margin-bottom: 5px;
        font-size: 14px;
        color: #333;
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
      width: 25%;

      .add-reservation-form,
      .edit-reservation-form,
      .cancel-reservation-form {
        margin-top: 20px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
      }
    }
  }

  .cancel {
    margin-left: 10px;
  }
}

.alert-danger {
  margin-top: 10px;
}
</style>
