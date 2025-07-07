<template>
  <div class="auth-form-container">
    <div class="auth-header">
      <h2>Welcome</h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ meta }">
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

        <div /> <!-- Empty cell for alignment -->
        <div class="auth-button-wrapper">
            <button type="submit" class="auth-button" :disabled="!meta.valid">LOGIN</button>
        </div>
      </div>

      <div class="form-link">
        <span>No account? </span><router-link to="/register">Register here.</router-link>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { loginUser } from '../services/api';
import PasswordInput from '../components/PasswordInput.vue';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { showToast } = useToast();

const schema = yup.object({
  email: yup.string().required('Email is required').email('Must be a valid email'),
  password: yup.string().required('Password is required'),
});

const handleLogin = async (values) => {
  try {
    await loginUser(values.email, values.password);
    router.push('/dashboard');
  } catch (error) {
    let errorMessage = 'An unknown error occurred.';
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
        default:
            errorMessage = 'Failed to log in. Please try again later.';
            break;
    }
    showToast(errorMessage, 'error');
  }
};
</script>
