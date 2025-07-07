<template>
  <BookingProcessLayout :active-step="3">
    <div class="contact-page-wrapper">
      <div class="contact-form-container">
        <h2 class="form-title">CONTACT INFORMATION</h2>
        <Form
          v-if="initialContactValues"
          @submit="proceedToConfirmation"
          :validation-schema="schema"
          :initial-values="initialContactValues"
          class="contact-form"
        >
          <div class="form-group">
            <label for="title">Title</label>
            <Field name="title" as="select" id="title">
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
            </Field>
            <ErrorMessage name="title" class="error-message" />
          </div>

          <div class="form-group">
            <label for="name">Name</label>
            <Field name="name" type="text" id="name" />
            <ErrorMessage name="name" class="error-message" />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <Field name="email" type="email" id="email" />
            <ErrorMessage name="email" class="error-message" />
          </div>

          <button type="submit" class="proceed-button">PROCEED</button>
        </Form>
        <div v-else class="loading-form">Loading your details...</div>
      </div>

      <BookingSummaryCard
        v-if="roomId && checkIn && checkOut && guests"
        :room-id="roomId"
        :check-in="checkIn"
        :check-out="checkOut"
        :guests="guests"
      />
    </div>
  </BookingProcessLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { auth } from '../firebaseConfig';
import { getUserProfile } from '../services/api';
import BookingProcessLayout from '../layouts/BookingProcessLayout.vue';
import BookingSummaryCard from '../components/BookingSummaryCard.vue';

const route = useRoute();
const router = useRouter();

const initialContactValues = ref(null);

// Extract data from route query
const roomId = computed(() => route.query.roomId);
const checkIn = computed(() => route.query.checkIn);
const checkOut = computed(() => route.query.checkOut);
const guests = computed(() => route.query.guests);

// Validation schema for the form
const schema = yup.object({
  title: yup.string().required('Title is required'),
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Must be a valid email'),
});

onMounted(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        // If user is logged in, try to fetch their profile
        const userProfile = await getUserProfile(currentUser.uid);
        if (userProfile) {
            initialContactValues.value = {
                title: userProfile.title || 'Mr.',
                name: userProfile.name || '',
                email: userProfile.email || currentUser.email,
            };
        } else {
             // If no profile exists, pre-fill with their auth email
            initialContactValues.value = { title: 'Mr.', name: '', email: currentUser.email };
        }
    } else {
        // If user is not logged in, use query params or defaults
        initialContactValues.value = {
            title: route.query.contactTitle || 'Mr.',
            name: route.query.contactName || '',
            email: route.query.contactEmail || '',
        };
    }
});

const proceedToConfirmation = (values) => {
  router.push({
    name: 'Confirmation',
    query: {
      ...route.query,
      contactTitle: values.title,
      contactName: values.name,
      contactEmail: values.email,
    },
  });
};
</script>

<style scoped>
.contact-page-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.contact-form-container {
  flex-grow: 1;
  padding: 1.5rem;
  background-color: var(--light-gray);
}
.form-title {
  font-family: var(--font-serif),serif;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  display: inline-block;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  background-color: white;
  font-size: 1rem;
}
.error-message {
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.proceed-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.2s ease;
}
.proceed-button:hover {
  background-color: var(--primary-color-dark);
}
.loading-form {
    padding: 2rem;
    text-align: center;
    color: #666;
}
@media (max-width: 992px) {
  .contact-page-wrapper {
    flex-direction: column-reverse;
  }
}
</style>
