<template>
  <div class="guest-details-card">
    <h3 class="card-title">GUEST DETAILS</h3>
    <div class="details-content">
      <p><strong>Name:</strong> {{ name }}</p>
      <p><strong>Email Address:</strong> {{ email }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
</script>

<style scoped>
.guest-details-card {
  background-color: var(--light-gray);
  padding: 1.5rem;
  flex-grow: 1;
}
.card-title {
  font-family: var(--font-serif),serif;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.details-content p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}
</style>
