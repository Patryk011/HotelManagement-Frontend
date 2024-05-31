<template>
  <main id="home-page" class="home">
    <header>
      <h1>Home</h1>
    </header>
  </main>
</template>

<script setup></script>
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
  cursor: pointer;

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
