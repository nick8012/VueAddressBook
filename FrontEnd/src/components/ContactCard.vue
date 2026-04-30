<script setup lang="ts">
import { deleteContact, type Contact } from '../api/contacts';

const props = defineProps<{ contact: Contact }>();
const emit = defineEmits(['edit', 'deleted']);

async function handleDelete() {
    if(!props.contact.id) return;
    await deleteContact(props.contact.id);
    emit('deleted');
}
</script>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.card-buttons {
  display: flex;
  gap: 0.5rem;
}
button {
  padding: 0.3rem 0.75rem;
  cursor: pointer;
}
</style>

<template>
    <div class="card">
        <div class="card-info">
            <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>
            <span v-if="contact.email">{{ contact.email }}</span>
            <span v-if="contact.phone">{{ contact.phone }}</span>
            <span v-if="contact.address">{{ contact.address }}</span>
            <span v-if="contact.city">{{ contact.city }}</span>
            <span v-if="contact.state">{{ contact.state }}</span>
            <span v-if="contact.zip">{{ contact.zip }}</span>
        </div>
        <div class="card-buttons">
            <button @click="$emit('edit', contact)">Edit</button>
            <button @click="handleDelete">Delete</button>
        </div>
    </div>
</template>