<template>
  <aside v-if="$route.path !== '/login'" :class="{ 'is-expanded': isExpanded }">
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="toggleMenu">
        <img
          src="../assets/arrow.png"
          width="42"
          height="42"
          class="icon"
          alt="Toggle Menu"
        />
      </button>
    </div>
    <h3>Menu</h3>
    <nav class="menu">
      <router-link to="/" class="button">
        <img
          src="../assets/home.png"
          width="42"
          height="42"
          class="icon"
          alt="Home"
        />
        <span class="text">Home</span>
      </router-link>
      <router-link to="/customers" class="button">
        <img src="../assets/customer.png" width="42" height="42" class="icon" />
        <span class="text">Customers</span>
      </router-link>
      <router-link to="/rooms" class="button">
        <img src="../assets/rooms.png" width="42" height="42" class="icon" />
        <span class="text">Rooms</span>
      </router-link>
      <router-link to="/hotel" class="button">
        <img src="../assets/hotel.png" width="42" height="42" class="icon" />
        <span class="text">Hotel</span>
      </router-link>
      <router-link to="/reservation" class="button">
        <img
          src="../assets/reservation.png"
          width="42"
          height="42"
          class="icon"
        />
        <span class="text">Reservation</span>
      </router-link>
      <router-link to="/payment" class="button">
        <img src="../assets/payment.png" width="42" height="42" class="icon" />
        <span class="text">Payment</span>
      </router-link>
      <router-link to="/send" class="button">
        <img src="../assets/send.png" width="42" height="42" class="icon" />
        <span class="text">Send Email</span>
      </router-link>

      <router-link to="/email" class="button">
        <img src="../assets/email.png" width="42" height="42" class="icon" />
        <span class="text">Email</span>
      </router-link>

      <div class="flex"></div>
      <button class="button logout" @click="logout">
        <img
          src="../assets/logout.png"
          width="42"
          height="42"
          class="icon"
          alt="Logout"
        />
        <span class="text">Logout</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isExpanded = ref(localStorage.getItem("is_expanded") === "true");
const router = useRouter();

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value;
  localStorage.setItem("is_expanded", isExpanded.value);
};

const logout = () => {
  sessionStorage.clear();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
$dark: #343a40;
$light: #f8f9fa;
$grey: #6c757d;
$primary: #007bff;
$dark-alt: #495057;
$danger: #dc3545;
$sidebar-width: 250px;

aside {
  display: flex;
  flex-direction: column;
  background-color: $dark;
  color: $light;
  width: calc(2rem + 32px);
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  transition: width 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
    position: relative;
    top: 0;
    transition: margin-bottom 0.2s ease-in-out;

    .menu-toggle {
      transition: transform 0.2s ease-in-out;

      .icon {
        font-size: 2rem;
        color: $light;
        transition: color 0.2s ease-out, transform 0.2s ease-out;
      }

      &:hover {
        .icon {
          color: $primary;
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: $grey;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .icon {
        font-size: 2rem;
        color: $light;
        transition: color 0.2s ease-in-out;
      }

      .text {
        color: $light;
        transition: color 0.2s ease-in-out;
      }

      &:hover {
        background-color: $dark-alt;

        .icon,
        .text {
          color: $primary;
        }
      }

      &.router-link-exact-active {
        background-color: $dark-alt;
        border-right: 5px solid $primary;

        .icon,
        .text {
          color: $primary;
        }
      }
    }

    .logout {
      background-color: $danger;
      color: white;

      &:hover {
        background-color: darken($danger, 10%);
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    p {
      font-size: 0.875rem;
      color: $grey;
    }
  }

  &.is-expanded {
    width: $sidebar-width;

    .menu-toggle {
      transform: rotate(-180deg);
    }

    h3,
    .button .text {
      opacity: 1;
    }

    .button .icon {
      margin-right: 1rem;
    }

    .footer {
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    position: absolute;
    z-index: 99;
  }
}
</style>
