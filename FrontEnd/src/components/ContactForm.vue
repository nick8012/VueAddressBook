<script setup lang="ts">
import { ref, watch } from 'vue';
import { createContact, updateContact, type Contact } from '../api/contacts';

const props = defineProps<{ contact?: Contact }>();
const emit = defineEmits(['saved', 'cancel']);

const emptyForm = (): Contact => ({
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
});

const form = ref<Contact>(props.contact ? { ...props.contact } : emptyForm());

watch(() => props.contact, (val) => {
    form.value = val ? { ...val } : emptyForm();
});

async function handleSubmit() {
    if (props.contact?.id) {
        await updateContact(props.contact.id, form.value);
    } else {
        await createContact(form.value);
    }
}

</script>

<style scoped>
.form-container {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-bottom: 1rem;
}
form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
input {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.form-buttons {
    display: flex;
    gap: 0.5rem;
}
button {
    padding: 0.4rem 1rem;
    cursor: pointer;
}
</style>

<template>
    <div class="form-container">
        <h2>{{ contact ? 'Edit Contact' : 'New Contact' }}</h2>
        <form @submit.prevent="handleSubmit">
            <!-- <input v-model="form.firstName" placeholder="ID" required /> -->
            <input v-model="form.firstName" placeholder="First Name" required />
            <input v-model="form.lastName" placeholder="Last Name" required />
            <input v-model="form.email" placeholder="email" />
            <input v-model="form.phone" placeholder="Phone" />
            <input v-model="form.address" placeholder="Address" />
            <input v-model="form.city" placeholder="City" />
            <input v-model="form.state" placeholder="State" />
            <input v-model="form.zip" placeholder="Zip Code" />
            <div class="form-buttons">
                <button type="submit">{{ contact ? 'Update' : 'Add' }}</button>
                <button type="button" @click="$emit('cancel')">Cancel</button>
            </div>
        </form>
    </div>
</template>