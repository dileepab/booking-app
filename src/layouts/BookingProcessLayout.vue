<template>
  <div class="booking-layout-container">
    <div class="progress-bar" :class="{ 'finalized': activeStep === 4 }">
      <div
        class="step"
        :class="{ 'active': activeStep >= 1, 'completed': activeStep > 1, 'clickable': activeStep > 1 }"
        @click="navigateToStep(1)"
      >
        <div class="step-number">1</div>
        <div class="step-label">SEARCH</div>
      </div>
      <div class="connector" :class="{ 'completed': activeStep > 1 }"></div>
      <div
        class="step"
        :class="{ 'active': activeStep >= 2, 'completed': activeStep > 2, 'clickable': activeStep > 2 }"
        @click="navigateToStep(2)"
      >
        <div class="step-number">2</div>
        <div class="step-label">SELECT ROOM</div>
      </div>
      <div class="connector" :class="{ 'completed': activeStep > 2 }"></div>
      <div
        class="step"
        :class="{ 'active': activeStep >= 3, 'completed': activeStep > 3, 'clickable': activeStep > 3 }"
        @click="navigateToStep(3)"
      >
        <div class="step-number">3</div>
        <div class="step-label">CONTACT INFORMATION</div>
      </div>
      <div class="connector" :class="{ 'completed': activeStep > 3 }"></div>
      <div class="step" :class="{ 'active': activeStep >= 4, 'completed': activeStep > 4 }">
        <div class="step-number">4</div>
        <div class="step-label">CONFIRMATION</div>
      </div>
    </div>
    <div class="layout-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  activeStep: {
    type: Number,
    required: true,
    default: 1
  }
});

const router = useRouter();
const route = useRoute();

const stepRoutes = {
  1: 'RoomSearch',
  2: 'RoomSelect',
  3: 'ContactInfo',
};

const navigateToStep = (stepNumber) => {
  // **FIX**: If on the final confirmation step, do not allow navigation back.
  if (props.activeStep === 4) {
    return;
  }

  // Only allow navigation to previous, completed steps.
  if (stepNumber < props.activeStep) {
    const routeName = stepRoutes[stepNumber];
    if (routeName) {
      router.push({
        name: routeName,
        query: route.query, // Preserve all existing query params to maintain state
      });
    }
  }
};
</script>

<style scoped>
.booking-layout-container {
  width: 100%;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: var(--light-gray);
  margin-bottom: 2.5rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #999;
  transition: opacity 0.2s ease;
}

.step.clickable {
  cursor: pointer;
}

.step.clickable:hover {
  opacity: 0.8;
}

/* **FIX**: Disable hover effect and pointer when booking is finalized */
.progress-bar.finalized .step.clickable {
  cursor: default;
}
.progress-bar.finalized .step.clickable:hover {
  opacity: 1;
}


.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.step-label {
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
}

.step.active .step-label {
  color: var(--primary-color);
}

.step.completed .step-number {
  background-color: var(--primary-color);
  color: white;
}

.step.completed .step-label {
  color: var(--primary-color);
}

.connector {
  flex-grow: 1;
  height: 2px;
  background-color: #e0e0e0;
  margin: 0 1rem;
  transition: background-color 0.3s ease;
}

.connector.completed {
  background-color: var(--primary-color);
}

.layout-content {
  padding: 0 2rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .progress-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .connector {
    display: none; /* Hide connectors on mobile */
  }
  .layout-content {
    padding: 0;
  }
}
</style>
