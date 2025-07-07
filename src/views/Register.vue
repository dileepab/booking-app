<template>
  <div class="auth-form-container">
    <div class="auth-header">
      <h2>Register</h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleRegister" :validation-schema="schema" v-slot="{ meta }">
      <div class="form-grid-layout">
        <label for="email" class="form-label">Email*</label>
        <div class="input-wrapper">
          <Field name="email" type="email" id="email" />
          <ErrorMessage name="email" class="error-message" />
        </div>

        <label for="password" class="form-label">Password*</label>
        <div class="input-wrapper">
          <Field name="password" v-slot="{ value, handleChange }">
            <PasswordInput
              id="password"
              name="password"
              :modelValue="value"
              @update:modelValue="handleChange"
            />
          </Field>
          <ErrorMessage name="password" class="error-message" />
        </div>

        <label for="confirmPassword" class="form-label">Confirm Password*</label>
        <div class="input-wrapper">
          <Field name="confirmPassword" v-slot="{ value, handleChange }">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              :modelValue="value"
              @update:modelValue="handleChange"
            />
          </Field>
          <ErrorMessage name="confirmPassword" class="error-message" />
        </div>

        <div /> <!-- Empty cell for alignment -->
        <div class="auth-button-wrapper">
            <button type="submit" class="auth-button" :disabled="!meta.valid">REGISTER</button>
        </div>
      </div>

      <div class="form-link">
        <span>Already have an account? </span><router-link to="/login">Login here.</router-link>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { registerUser } from '../services/api';
import PasswordInput from '../components/PasswordInput.vue';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { showToast } = useToast();

const schema = yup.object({
  email: yup.string().required('Email is required').email('Must be a valid email'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

const handleRegister = async (values) => {
  try {
    await registerUser(values.email, values.password);
    showToast('Registration successful! Please log in.', 'success');
    router.push('/login');
  } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email address is already in use.';
    } else {
      errorMessage = 'Failed to register. Please try again later.';
    }
    showToast(errorMessage, 'error');
  }
};
</script>
