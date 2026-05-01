<script setup lang="ts">
import ContactForm from './ContactForm.vue';
import { ref, onMounted } from 'vue';
import { getContacts, deleteContact, type Contact } from '../api/contacts';

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

async function handleDelete(contact: Contact) {
  if (!contact.id) return;
  await deleteContact(contact.id);
  await loadContacts();
}

function formatPhone(phone?: string) {
    if(!phone) return '';
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
}

onMounted(loadContacts);
</script>

<template>
    <div class="list-container">
        <div class="list-header">
            <h1><span><img src="../assets/vue.svg" alt="The iconic Vue 'V' icon." /></span>ue Address Book</h1>
            <button v-if="!showForm" @click="openCreate">+ Add Contact</button>
        </div>

        <ContactForm v-if="showForm" :contact="editingContact" @saved="onSaved" @cancel="closeForm"/>

        <div v-if="contacts.length === 0 && !showForm">
            <p>No Contacts yet!  Please Add One!</p>
        </div>

        <!-- <ContactCard v-for="contact in contacts" :key="contact.id" :contact="contact" @edit="openEdit" @deleted="loadContacts"/> -->
        <div v-else-if="!showForm" class="table-wrapper">
            <table>
            <thead>
                <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contact in contacts" :key="contact.id">
                <td data-label="First Name">{{ contact.firstName }}</td>
                <td data-label="Last Name">{{ contact.lastName }}</td>
                <td data-label="Email">{{ contact.email }}</td>
                <td data-label="Phone">{{ formatPhone(contact.phone) }}</td>
                <td data-label="Address">{{ contact.address }}</td>
                <td data-label="City">{{ contact.city }}</td>
                <td data-label="State">{{ contact.state }}</td>
                <td data-label="Zip">{{ contact.zip }}</td>
                <td class="actions">
                    <button class="Edit" @click="openEdit(contact)">Edit</button>
                    <button class="Delete" @click="handleDelete(contact)">Delete</button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>

.list-container {
    margin: 1rem auto;
    /* padding: 0 1rem; */
}
.list-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 1rem;
}
.table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
}
table {
  table-layout: auto;
  width: 100%;
  border-collapse: collapse;
}
th, td {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: small;
  white-space: nowrap;
  text-align: left;
  border: 1px solid #ddd;
}
th {
  background-color: #f5f5f5;
  color: rgb(17, 24, 59);
  text-align: center;
  font-weight: 900;
}
tr:hover {
  background-color: #fafafa;
  /* color: black; */
}
.actions {
    margin: 2px;
}
button {
    margin: 0 2px;
    padding: 2px;
    cursor: pointer;
}
.Edit {
    background-color: green;
}
.Delete {
    background-color: red;
}
/* Mobile */
@media (max-width: 600px) {
    thead {
        display: none;
    }

    tr {
        display: block;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
    }

    tr:hover {
        background-color: transparent;
        /* color: white; */
        /* font-weight: 600; */
    }

    td {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        padding: 0;
        border-bottom: 1px solid var(--color-border);
        font-size: 0.9rem;
        overflow: hidden;
    }

    
    td::before {
        content: attr(data-label);
        font-weight: 600;
        /* color: var(--color-text-muted);
        background-color: #819baa; */

        background-color: #f5f5f5;
        color: rgb(17, 24, 59);
        padding: .2rem 1rem;
        min-width: 75px;
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        margin: 0px;
        font-weight: bold;
        color: #1a1919;
    }
    td > * {
        /* padding: 0.6rem, 1rem; */
        display: flex;
        align-items: center;
    }
    td.actions {
        display: grid;
        justify-content: center;
        
        grid-template-columns: 25% 1fr 1fr 25%;
        gap: 2px;
        grid-auto-flow: column;
        justify-content: center;
        padding-top: 8px;
        border: none;
    }

    td.actions button {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: none;
    }

    td:last-child::before {
        background-color: transparent;
    }
}
</style>

