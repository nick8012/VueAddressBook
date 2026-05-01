<script setup lang="ts">
import { ref, watch } from 'vue';
import { contactSchema, type ContactInput } from '@vue-address-book/shared';
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
const errors = ref<Partial<Record<keyof ContactInput, string>>>({})
const formError = ref('');

watch(() => props.contact, (val) => {
    form.value = val ? { ...val } : emptyForm();
    displayPhone.value = val?.phone ? formatPhone(val.phone) : '';
    errors.value = {};
    formError.value = '';
});

async function handleSubmit() {
    errors.value = {};
    formError.value = '';

    

    form.value.phone = form.value.phone?.replace(/-/g, ''); //remove existing hyphens
    const result = contactSchema.safeParse(form.value);

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

            // Skip address fields here - validateAddressFields handles them
        const addressFields = ['address', 'city', 'state', 'zip'];

        // Map field errors
        for (const [key, msgs] of Object.entries(fieldErrors)) {
            if (addressFields.includes(key)) continue;
            errors.value[key as keyof ContactInput] = msgs?.[0];
        }

        // Show form-level errors (cross field)
        if (!form.value.email && !form.value.phone) {
            formError.value = 'Either an email or phone number is required';
        }
        
    }

    validateAddressFields();

    // Only stop submission if there are actual errors
    const hasErrors = Object.values(errors.value).some(e => e) || formError.value;
    if (hasErrors) return;

    try {
        if (props.contact?.id) {
            await updateContact(props.contact.id, result.data);
        } else {
            await createContact(result.data);
        }
        emit('saved');
    } catch (e) {
        formError.value = 'Something went wrong. Please try again.';
    }
}

// Separate display value for the formatted phone
const displayPhone = ref(
    props.contact?.phone ? formatPhone(props.contact.phone) : ''
);

// Format phone for display
function formatPhone(digits: string) {
    const d = digits.replace(/\D/g, '');
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

// Block any non-numeric key before it hits the input
function preventNonNumeric(e: KeyboardEvent) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    }
}

// Format as they type and keep raw digits in form.value.phone
function handlePhoneInput() {
    const digits = displayPhone.value.replace(/\D/g, '').slice(0, 10);
    displayPhone.value = formatPhone(digits);
    form.value.phone = digits;
}

function validateField(field: keyof ContactInput) {
    const result = contactSchema.safeParse(form.value);
    if(!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        errors.value[field] = fieldErrors[field]?.[0];
    } else {
        errors.value[field] = undefined;
    }
}

function validateEmailAndPhoneFields() {
    if(form.value.email || form.value.phone) {
        formError.value = '';
    }

    validateField('email');
    validateField('phone');
}

function validateAddressFields() {
    const address = form.value.address;
    const city = form.value.city;
    const state = form.value.state;
    const zip = form.value.zip;
    const group = [address, city, state, zip];
    const anyFilled = group.some(f => f && f.length > 0);
    // const allFilled = group.every(f => f && f.length > 0);

    // Nothing filled — clear all errors and exit
    if (!anyFilled) {
        errors.value.address = undefined;
        errors.value.city = undefined;
        errors.value.state = undefined;
        errors.value.zip = undefined;
        return;
    }

    // flag the empty ones as Required
    errors.value.address = !address ? 'Required' : undefined;
    errors.value.city = !city ? 'Required' : undefined;
    errors.value.state = !state ? 'Required' : undefined;
    errors.value.zip = !zip ? '5 Digit Zip Required' : undefined;


    // Always run Zod to check individual field format rules
    const result = contactSchema.safeParse(form.value);
    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        if (fieldErrors.address && address) errors.value.address = fieldErrors.address[0];
        if (fieldErrors.city && city) errors.value.city = fieldErrors.city[0];
        if (fieldErrors.state && state) errors.value.state = fieldErrors.state[0];
        if (fieldErrors.zip && zip) errors.value.zip = fieldErrors.zip[0];
    }
}

</script>

<template>
    <div class="form-container">
        <h2>{{ contact ? 'Edit Contact' : 'New Contact' }}</h2>

        <div v-if="formError" class="error-banner">{{ formError }}</div>

        <form @submit.prevent="handleSubmit">
            <!-- <input v-model="form.firstName" placeholder="ID" required /> -->
            <div class="field">
                <input v-model="form.firstName" placeholder="First Name *" @blur="validateField('firstName')" @input="validateField('firstName')"/>
                <span class="error" v-if="errors.firstName">{{ errors.firstName }}</span>
            </div>
            <div class="field">
                <input v-model="form.lastName" placeholder="Last Name *" @blur="validateField('lastName')" @input="validateField('lastName')"/>
                <span class="error" v-if="errors.lastName">{{ errors.lastName }}</span>
            </div>
            <div class="field">
                <input v-model="form.email" placeholder="email" @blur="validateField('email'); validateEmailAndPhoneFields()" @input="validateField('email'); validateEmailAndPhoneFields()" />
                <span class="error" v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div class="field">
                <!-- <input v-model="form.phone" placeholder="Phone" /> -->
                <input v-model="displayPhone"
                placeholder="   -   -    "
                @input="handlePhoneInput(); validateField('phone'); validateEmailAndPhoneFields()"
                @keydown="preventNonNumeric"
                @blur="validateField('phone'); validateEmailAndPhoneFields()"
                maxlength="12" />
                <span class="error" v-if="errors.phone">{{ errors.phone }}</span>
            </div>

            <fieldset>
                <legend>Address Fields</legend>
                <div class="field">
                    <input v-model="form.address" placeholder="Address" :class="{ invalid: errors.address }" @input="errors.address = undefined"/>
                    <span class="error" v-if="errors.address">{{ errors.address }}</span>
                </div>
                <div class="field">
                    <input v-model="form.city" placeholder="City" :class="{ invalid: errors.city }" @input="errors.city = undefined"/>
                    <span class="error" v-if="errors.city">{{ errors.city }}</span>
                </div>
                <div class="field">
                    <input v-model="form.state" placeholder="State" :class="{ invalid: errors.state }" @input="errors.state = undefined" maxlength="2"/>
                    <span class="error" v-if="errors.state">{{ errors.state }}</span>
                </div>
                <div class="field">
                    <input v-model="form.zip" placeholder="Zip Code" :class="{ invalid: errors.zip }" @input="errors.zip = undefined" maxlength="5"/>
                    <span class="error" v-if="errors.zip">{{ errors.zip }}</span>
                </div>
            </fieldset>
            
            <div class="form-buttons">
                <button type="submit">{{ contact ? 'Update' : 'Add' }}</button>
                <button type="button" @click="$emit('cancel')">Cancel</button>
            </div>
        </form>
    </div>
</template>

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
.field {
    display: flex;
    flex-direction: column;
    /* gap: 0.2rem; */
}
fieldset {
    text-align: left;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 1rem;
    margin: 0.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
legend {
    padding: 0 0.5rem;
    font-weight: 600;
    color: #555;
}
input {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
input.invalid {
  border-color: var(--color-error);
  background-color: var(--color-error-bg);
  color: black;
}
input.invalid:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  color: black;
}
.error {
    color: red;
    font-size: 0.8rem;
}
.error-banner {
    background: #fee;
    border: 1px solid red;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    color: red;
    font-size: 0.9rem;
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