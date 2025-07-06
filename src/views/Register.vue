<template>
  <div class="auth-form-container">
    <div class="auth-header">
      <h2>Register</h2>
      <div class="title-separator"></div>
    </div>
    <Form @submit="handleRegister" :validation-schema="schema" v-slot="{ meta }">
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

        <!-- Confirm Password Row -->
        <label for="confirmPassword" class="form-label">Confirm Password*</label>
        <div class="input-wrapper">
          <Field name="confirmPassword" type="password" id="confirmPassword" />
          <ErrorMessage name="confirmPassword" class="error-message" />
        </div>

        <div /> <!-- Empty cell for alignment -->
        <button type="submit" class="auth-button" :disabled="!meta.valid">REGISTER</button>
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

const router = useRouter();

const schema = yup.object({
  userId: yup.string().required('User ID is required'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Your passwords do not match.'),
});

const handleRegister = async (values) => {
  console.log("Registering user:", values);
  // In a real app, you would call your registration API here.
  // We'll simulate a success.
  alert('Registration successful! Redirecting to login...');
  router.push('/login');
};
</script>
