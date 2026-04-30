<script setup lang="ts">
import ContactForm from './ContactForm.vue';
import ContactCard from './ContactCard.vue';
import { ref, onMounted } from 'vue';
import { getContacts, type Contact } from '../api/contacts';

const contacts = ref<Contact[]>([]);
const showForm = ref(false);
const editingContact = ref<Contact | undefined>(undefined);

async function loadContacts() {
    contacts.value = await getContacts();
}

function openCreate() {
    editingContact.value = undefined;
    showForm.value = true;
}

function openEdit(contact: Contact) {
    editingContact.value = contact;
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    editingContact.value = undefined;
}

async function onSaved() {
    closeForm();
    await loadContacts()
}

onMounted(loadContacts);
</script>

<style scoped>
.list-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
}
.list-header {
    /* display: flex; */
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
}
button {
    padding: 0.5rem 1rem;
    cursor: pointer;
}
</style>


<template>
    <div class="list-container">
        <div class="list-header">
            <h1>Vue Address Book</h1>
            <button v-if="!showForm" @click="openCreate">+ Add Contact</button>
        </div>

        <ContactForm v-if="showForm" :contact="editingContact" @saved="onSaved" @cancel="closeForm"/>

        <div v-if="contacts.length === 0 && !showForm">
            <p>No Contacts yet!  Please Add One!</p>
        </div>

        <ContactCard v-for="contact in contacts" :key="contact.id" :contact="contact" @edit="openEdit" @deleted="loadContacts"/>
    </div>
</template>

