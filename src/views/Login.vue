<template>
  <div class="auth-form-container">
    <div class="auth-header">
      <h2>Welcome</h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ meta }">
      <div class="form-grid-layout">
        <!-- User ID Row -->
        <label for="userId" class="form-label">User ID*</label>
        <div class="input-wrapper">
          <Field name="userId" type="text" id="userId" />
          <ErrorMessage name="userId" class="error-message" />
        </div>

        <!-- Password Row -->
        <label for="password" class="form-label">Password*</label>
        <div class="input-wrapper">
          <Field name="password" type="password" id="password" />
          <ErrorMessage name="password" class="error-message" />
        </div>

        <!-- Checkbox Row -->
        <div /> <!-- Empty cell for alignment -->
        <div class="field-checkbox">
          <Field name="keepLoggedIn" type="checkbox" id="keepLoggedIn" :value="true" />
          <label for="keepLoggedIn">Keep me logged in</label>
        </div>

        <div /> <!-- Empty cell for alignment -->
        <button type="submit" class="auth-button" :disabled="!meta.valid">LOGIN</button>
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

const router = useRouter();

const schema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().required('Password is required'),
  keepLoggedIn: yup.boolean()
});

const handleLogin = async (values) => {
  try {
    await loginUser(values.userId, values.password);

    if (values.keepLoggedIn) {
      const date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `isLoggedIn=true; expires=${expires}; path=/`;
      sessionStorage.removeItem('isLoggedIn');
    } else {
      sessionStorage.setItem('isLoggedIn', 'true');
      document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Redirect to dashboard and reload to ensure auth state is updated in the header
    router.push('/dashboard').then(() => {
      window.location.reload();
    });

  } catch (error) {
    alert(error.message); // Simple alert for now
  }
};
</script>
