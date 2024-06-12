<template>
  <div class="container">
    <h1 v-if="!showForm && !showRoomsTable" class="text-center">Hotel List</h1>
    <h1 v-else-if="showRoomsTable" class="text-center">
      Rooms for {{ selectedHotel.name }} (Hotel-ID: {{ selectedHotel.id }})
    </h1>

    <table v-if="!showForm && !showRoomsTable" class="table table-striped">
      <thead>
        <tr>
          <th>Hotel ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Rooms</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hotel in hotels" :key="hotel.id">
          <td>{{ hotel.id }}</td>
          <td>{{ hotel.name }}</td>
          <td>{{ hotel.address }}</td>
          <td>
            <button class="btn btn-primary" @click="showRooms(hotel.id)">
              Show Rooms
            </button>
          </td>
          <td>
            <button class="btn btn-primary" @click="editHotel(hotel)">
              Edit
            </button>
            <button
              v-if="userRole === 'ADMIN' || 'WORKER'"
              class="btn btn-danger"
              @click="deleteHotel(hotel.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <table v-if="showRoomsTable" class="table table-striped">
      <thead>
        <tr>
          <th>Room ID</th>
          <th>Type</th>
          <th>Room Number</th>
          <th>Vacancy</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.id }}</td>
          <td>{{ room.type }}</td>
          <td>{{ room.number }}</td>
          <td>{{ room.free ? "Yes" : "No" }}</td>
          <td>{{ room.price }}</td>
        </tr>
      </tbody>
    </table>
    <button
      v-if="showRoomsTable"
      class="btn btn-secondary"
      @click="showRoomsTable = false"
    >
      Back
    </button>
    <button
      v-if="!showForm && !showRoomsTable"
      class="btn btn-primary"
      @click="showForm = true"
    >
      Add Hotel
    </button>

    <form
      v-if="showForm && !isEditing"
      @submit.prevent="addHotel"
      class="hotel-form"
    >
      <h1 class="text-form">Add Hotel</h1>
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="newHotel.name"
          required
        />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input
          type="text"
          class="form-control"
          id="address"
          v-model="newHotel.address"
          required
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary">Add Hotel</button>
        <button type="button" class="btn btn-secondary" @click="cancelEdit">
          Cancel
        </button>
      </div>
    </form>

    <form
      v-if="showForm && isEditing"
      @submit.prevent="saveHotel"
      class="hotel-form"
    >
      <h1 class="text-form">Edit Hotel</h1>
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="editedHotel.name"
          required
        />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input
          type="text"
          class="form-control"
          id="address"
          v-model="editedHotel.address"
          required
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" @click="cancelEdit">
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
import { useRouter } from "vue-router";

const userRole = ref(sessionStorage.getItem("role"));
const showForm = ref(false);
const showRoomsTable = ref(false);
const isEditing = ref(false);
const hotels = ref([]);
const rooms = ref([]);
const errorMessage = ref("");
const showError = ref(false);
let errorTimeout = null;
const selectedHotel = reactive({});
const newHotel = reactive({ name: "", address: "" });
const editedHotel = reactive({ id: "", name: "", address: "" });

const router = useRouter();

const clearError = () => {
  clearTimeout(errorTimeout);
  showError.value = false;
};

const addHotel = async () => {
  try {
    const response = await fetch("/api/hotel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHotel),
    });

    if (response.ok) {
      const data = await response.json();
      hotels.value.push(data);
      newHotel.name = "";
      newHotel.address = "";
    } else {
      console.error("Failed to add hotel:", response.statusText);
    }
  } catch (error) {
    console.error("Error during adding hotel:", error);
  }
};

const deleteHotel = async (hotelId) => {
  try {
    const response = await fetch(`/api/hotel/${hotelId}`, { method: "DELETE" });

    if (response.ok) {
      hotels.value = hotels.value.filter((hotel) => hotel.id !== hotelId);
    } else {
      console.error("Failed to delete hotel:", response.statusText);
    }
  } catch (error) {
    console.error("Error during deleting hotel:", error);
  }
};

const getHotels = async () => {
  try {
    const response = await fetch("/api/hotel/all");
    const data = await response.json();
    hotels.value = data;
  } catch (error) {
    console.error("Error during fetch data:", error);
  }
};

const getHotelRooms = async (hotelId) => {
  try {
    const response = await fetch(`/api/hotel/${hotelId}/rooms`);
    const data = await response.json();
    rooms.value = data;
    showRoomsTable.value = true;
  } catch (error) {
    console.error("Error during fetch data:", error);
  }
};

const editHotel = (hotel) => {
  isEditing.value = true;
  editedHotel.id = hotel.id;
  editedHotel.name = hotel.name;
  editedHotel.address = hotel.address;
  showForm.value = true;
};

const saveHotel = async () => {
  try {
    const response = await fetch(`/api/hotel/${editedHotel.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedHotel),
    });

    if (response.ok) {
      const updatedHotel = await response.json();
      const index = hotels.value.findIndex(
        (hotel) => hotel.id === updatedHotel.id
      );
      if (index !== -1) {
        hotels.value.splice(index, 1, updatedHotel);
      }
      resetForm();
    } else {
      const errorData = await response.text();
      errorMessage.value = errorData;
      showError.value = true;

      errorTimeout = setTimeout(() => {
        clearError();
      }, 3500);
    }
  } catch (error) {
    console.error("Error during updating hotel:", error);
  }
};

const cancelEdit = () => {
  resetForm();
};

const resetForm = () => {
  showForm.value = false;
  isEditing.value = false;
  newHotel.name = "";
  newHotel.address = "";
  editedHotel.id = "";
  editedHotel.name = "";
  editedHotel.address = "";
};

const showRooms = (hotelId) => {
  const hotel = hotels.value.find((hotel) => hotel.id === hotelId);
  if (hotel) {
    selectedHotel.id = hotel.id;
    selectedHotel.name = hotel.name;
    getHotelRooms(hotelId);
  }
};

onMounted(() => {
  getHotels();
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
      margin-left: 20px;

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

  .hotel-form {
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

      .add-hotel-form,
      .edit-hotel-form,
      .cancel-hotel-form {
        margin-top: 10px;

        button {
          margin-right: 10px;
        }
      }
    }
  }

  .delete {
    margin-left: 10px;
  }
}

.alert-danger {
  margin-top: 10px;
}
</style>
