<template>
  <main id="Home-page" class="home">
    <h1>Home</h1>
    <div class="statistics">
      <div
        v-if="userRole !== 'CLEANER'"
        class="statistic-box reservation-box"
        @click="goTo('/reservation')"
      >
        <h2>{{ reservationsCount }}</h2>
        <p>Reservations</p>
      </div>
      <div
        v-if="userRole !== 'CLEANER'"
        class="statistic-box customer-box"
        @click="goTo('/customers')"
      >
        <h2>{{ customersCount }}</h2>
        <p>Customers</p>
      </div>
      <div
        v-if="userRole !== 'CLEANER'"
        class="statistic-box hotel-box"
        @click="goTo('/hotel')"
      >
        <h2>{{ hotelsCount }}</h2>
        <p>Hotels</p>
      </div>
      <div class="statistic-box room-box" @click="goTo('/rooms')">
        <h2>{{ roomsCount }}</h2>
        <p>Rooms</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const reservationsCount = ref(0);
const customersCount = ref(0);
const hotelsCount = ref(0);
const roomsCount = ref(0);
const userRole = ref(sessionStorage.getItem("role")); // Retrieve the user role from session storage
const router = useRouter();

const goTo = (route) => {
  router.push(route);
};

onMounted(async () => {
  try {
    const [
      reservationsResponse,
      customersResponse,
      hotelsResponse,
      roomsResponse,
    ] = await Promise.all([
      fetch("/api/reservation/all"),
      fetch("/api/customers/all"),
      fetch("/api/hotel/all"),
      fetch("/api/room/all"),
    ]);

    reservationsCount.value = (await reservationsResponse.json()).length;
    customersCount.value = (await customersResponse.json()).length;
    hotelsCount.value = (await hotelsResponse.json()).length;
    roomsCount.value = (await roomsResponse.json()).length;
  } catch (error) {
    console.error("Failed to fetch counts:", error);
  }
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap");

.home {
  text-align: center;
  font-family: "Roboto", sans-serif;
  padding: 1em;
  color: #333;
}

.statistics {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 90px;
}

.statistic-box {
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    width: 45%;
  }

  @media (min-width: 1024px) {
    width: 23%;
  }

  h2 {
    margin: 0;
    font-size: 2em;
    font-weight: 500;
    color: white;
  }

  p {
    margin: 0;
    font-size: 1em;
    font-weight: 300;
    color: white;
  }
}

.reservation-box {
  background: linear-gradient(135deg, #16a4b8, #16a489);
}

.customer-box {
  background: linear-gradient(135deg, #27a747, #27a782);
}

.hotel-box {
  background: linear-gradient(135deg, #fdc008, #fd9050);
}

.room-box {
  background: linear-gradient(135deg, #dd3544, #dd5868);
}
</style>
