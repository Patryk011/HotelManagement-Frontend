<template>
  <div class="container">
    <h1 v-if="!showForm && !editForm" class="text-center">Room List</h1>

    <table
      v-if="!showForm && !editForm && !showAvailableRooms"
      class="table table-striped"
    >
      <thead>
        <tr>
          <th>Room ID</th>
          <th>Type</th>
          <th>Room Number</th>
          <th>Vacancy</th>
          <th>Clean</th>
          <th>Price per night</th>
          <th>Hotel ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.id }}</td>
          <td>{{ room.type }}</td>
          <td>{{ room.number }}</td>
          <td>{{ room.free ? "Yes" : "No" }}</td>
          <td>{{ room.clean ? "Yes" : "No" }}</td>

          <td>{{ room.price }}</td>
          <td>{{ room.hotelId }}</td>

          <td>
            <button class="btn btn-primary" @click="toggleCleanStatus(room.id)">
              {{ room.clean ? "Set to dirty" : "Set to Clean" }}
            </button>
            <button class="btn btn-primary" @click="showEditForm(room.id)">
              Edit
            </button>
            <button
              v-if="userRole === 'ADMIN' || 'WORKER'"
              class="btn btn-danger delete"
              @click="deleteRoom(room.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="showAvailableRooms && !editForm && !showForm"
      class="table table-striped"
    >
      <thead>
        <tr>
          <th>Room ID</th>
          <th>Type</th>
          <th>Room Number</th>
          <th>Vacancy</th>
          <th>Clean</th>
          <th>Price per night</th>
          <th>Hotel ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in availableRooms" :key="room.id">
          <td>{{ room.id }}</td>
          <td>{{ room.type }}</td>
          <td>{{ room.number }}</td>
          <td>{{ room.free ? "Yes" : "No" }}</td>
          <td>{{ room.clean ? "Yes" : "No" }}</td>
          <td>{{ room.price }}</td>
          <td>{{ room.hotelId }}</td>
          <td>
            <button class="btn btn-primary" @click="toggleCleanStatus(room.id)">
              {{ room.clean ? "Set to dirty" : "Set to Clean" }}
            </button>
            <button class="btn btn-primary" @click="showEditForm(room.id)">
              Edit
            </button>
            <button class="btn btn-danger delete" @click="deleteRoom(room.id)">
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
      Add Room
    </button>
    <button
      v-if="!showForm && !editForm"
      class="btn btn-primary available"
      @click="toggleAvailableRooms"
    >
      {{ showAvailableRooms ? "Back" : "Show Available Rooms" }}
    </button>

    <form v-if="showForm" @submit.prevent="addRoom" class="room-form">
      <h1 class="text-form">Room Form</h1>
      <div class="form-group">
        <label for="type">Type:</label>
        <input
          type="text"
          class="form-control"
          id="type"
          v-model="newRoom.type"
          required
        />
      </div>
      <div class="form-group">
        <label for="number">Room Number:</label>
        <input
          type="number"
          class="form-control"
          id="number"
          v-model="newRoom.number"
          required
        />
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input
          type="number"
          class="form-control"
          id="price"
          v-model="newRoom.price"
          required
        />
      </div>
      <div class="form-group">
        <label for="hotelId">Hotel ID:</label>
        <input
          type="number"
          class="form-control"
          id="hotelId"
          v-model="newRoom.hotelId"
          required
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary add-room-form">
          Add Room
        </button>
        <button
          type="button"
          class="btn btn-secondary cancel-room-form"
          @click="showForm = false"
        >
          Cancel
        </button>
      </div>
    </form>

    <form v-if="editForm" @submit.prevent="updateRoom" class="room-form">
      <h1 class="text-form">Edit Room</h1>
      <div class="form-group">
        <label for="type">Type:</label>
        <input
          type="text"
          class="form-control"
          id="type"
          v-model="editRoom.type"
        />
      </div>
      <div class="form-group">
        <label for="number">Room Number:</label>
        <input
          type="number"
          class="form-control"
          id="number"
          v-model="editRoom.number"
        />
      </div>
      <div class="form-group">
        <label for="vacancy">Vacancy:</label>
        <select class="form-control" id="vacancy" v-model="editRoom.free">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input
          type="number"
          class="form-control"
          id="price"
          v-model="editRoom.price"
        />
      </div>
      <div class="form-group">
        <label for="hotelId">Hotel ID:</label>
        <input
          type="number"
          class="form-control"
          id="hotelId"
          v-model="editRoom.hotelId"
        />
      </div>
      <div class="edit-button-container">
        <button type="submit" class="btn btn-primary edit-room-form">
          Update Room
        </button>
        <button
          type="button"
          class="btn btn-secondary cancel-room-form"
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
const showAvailableRooms = ref(false);
const errorMessage = ref("");
const showError = ref(false);
let errorTimeout = null;

const rooms = ref([]);
const availableRooms = ref([]);

const newRoom = reactive({
  type: "",
  number: null,
  free: null,
  price: null,
  hotelId: null,
  clean: null,
});

const editRoom = reactive({
  id: null,
  type: "",
  number: null,
  free: null,
  price: null,
  hotelId: null,
  clean: null,
});

const userRole = ref(sessionStorage.getItem("role"));

const clearError = () => {
  clearTimeout(errorTimeout);
  showError.value = false;
};

const addRoom = async () => {
  try {
    const response = await fetch("/api/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoom),
    });

    if (response.ok) {
      const data = await response.json();
      rooms.value.push(data);
      newRoom.type = "";
      newRoom.number = null;
      newRoom.free = null;
      newRoom.price = null;
      newRoom.hotelId = null;
      newRoom.clean = null;
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
    console.error("Error during adding room:", error);
  }
};

const updateRoom = async () => {
  try {
    const response = await fetch(`/api/room/${editRoom.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editRoom),
    });

    if (response.ok) {
      const data = await response.json();
      const index = rooms.value.findIndex((room) => room.id === editRoom.id);
      if (index !== -1) {
        rooms.value.splice(index, 1, data);
      }
      const availableRoomIndex = availableRooms.value.findIndex(
        (room) => room.id === editRoom.id
      );
      if (availableRoomIndex !== -1) {
        availableRooms.value.splice(availableRoomIndex, 1, data);
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
    console.error("Error during updating room:", error);
  }
};

const showEditForm = async (roomId) => {
  try {
    const response = await fetch(`/api/room/${roomId}`);
    const data = await response.json();

    editRoom.id = data.id;
    editRoom.type = data.type;
    editRoom.number = data.number;
    editRoom.free = data.free;
    editRoom.price = data.price;
    editRoom.hotelId = data.hotelId;
    editForm.value = true;
  } catch (error) {
    console.error("Error during showing edit form:", error);
  }
};

const getRooms = async () => {
  try {
    const response = await fetch("/api/room/all");
    const data = await response.json();
    rooms.value = data;
  } catch (error) {
    console.error("Error during fetch data:", error);
  }
};

const getAvailableRooms = async () => {
  try {
    const response = await fetch("/api/room/available");
    const data = await response.json();
    availableRooms.value = data;
  } catch (error) {
    console.error("Error during fetching available rooms:", error);
  }
};

const toggleAvailableRooms = () => {
  showAvailableRooms.value = !showAvailableRooms.value;
  if (showAvailableRooms.value) {
    getAvailableRooms();
  }
};

const toggleCleanStatus = async (roomId) => {
  try {
    const response = await fetch(`/api/room/${roomId}/toggleClean`, {
      method: "PUT",
    });
    if (response.ok) {
      const data = await response.json();
      const index = rooms.value.findIndex((room) => room.id === roomId);
      if (index !== -1) {
        rooms.value[index].clean = data.clean;
      }
      const availableRoomIndex = availableRooms.value.findIndex(
        (room) => room.id === roomId
      );
      if (availableRoomIndex !== -1) {
        availableRooms.value[availableRoomIndex].clean = data.clean;
      }
    } else {
      console.error("Failed to toggle clean status:", response.statusText);
    }
  } catch (error) {
    console.error("Error during toggling clean status:", error);
  }
};

const deleteRoom = async (roomId) => {
  try {
    const response = await fetch(`/api/room/${roomId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      const index = rooms.value.findIndex((room) => room.id === roomId);
      if (index !== -1) {
        rooms.value.splice(index, 1);
      }
      const availableRoomIndex = availableRooms.value.findIndex(
        (room) => room.id === roomId
      );
      if (availableRoomIndex !== -1) {
        availableRooms.value.splice(availableRoomIndex, 1);
      }
    } else {
      console.error("Failed to delete room:", response.statusText);
    }
  } catch (error) {
    console.error("Error during delete room:", error);
  }
};

onMounted(() => {
  getRooms();
  getAvailableRooms();
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

  .room-form {
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

      .add-room-form,
      .edit-room-form,
      .cancel-room-form {
        margin-top: 10px;
      }
    }

    .edit-button-container {
      display: flex;
      justify-content: space-between;
      width: 30%;
      margin-top: 40px;
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
