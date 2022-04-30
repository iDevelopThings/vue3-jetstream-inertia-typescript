<script lang="ts" setup>
import ActionSection from "@/Jetstream/Elements/Section/ActionSection.vue";
import DangerButton from "@/Jetstream/Elements/Button/DangerButton.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";
import SecondaryButton from "@/Jetstream/Elements/Button/SecondaryButton.vue";
import DialogModal from "@/Jetstream/Modal/DialogModal.vue";
import {ref} from "vue";
import {useForm} from "@inertiajs/inertia-vue3";

const password = ref<HTMLInputElement>();
const confirmingUserDeletion = ref(false);
const form = useForm({password : ""});

function confirmUserDeletion() {
    confirmingUserDeletion.value = true;

    setTimeout(() => password.value.focus(), 250);
}

function deleteUser() {
    form.delete(route("current-user.destroy"), {
        preserveScroll : true,
        onSuccess      : () => closeModal(),
        onError        : () => password.value.focus(),
        onFinish       : () => form.reset(),
    });
}

function closeModal() {
    confirmingUserDeletion.value = false;

    form.reset();
}
</script>


<template>
    <ActionSection>
        <template #title>
            Delete Account
        </template>

        <template #description>
            Permanently delete your account.
        </template>

        <template #content>
            <div class="max-w-xl text-sm text-gray-600">
                Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.
            </div>

            <div class="mt-5">
                <DangerButton @click="confirmUserDeletion">
                    Delete Account
                </DangerButton>
            </div>

            <!-- Delete Account Confirmation Modal -->
            <DialogModal :show="confirmingUserDeletion" @close="closeModal">
                <template #title>
                    Delete Account
                </template>

                <template #content>
                    Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you
                    would like to permanently delete your account.

                    <div class="mt-4">
                        <Input type="password" class="mt-1 block w-3/4" placeholder="Password"
                               ref="password"
                               v-model="form.password"
                               @keyup.enter="deleteUser" />

                        <InputError :message="form.errors.password" class="mt-2" />
                    </div>
                </template>

                <template #footer>
                    <SecondaryButton @click="closeModal">
                        Cancel
                    </SecondaryButton>

                    <DangerButton class="ml-2" @click="deleteUser" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                        Delete Account
                    </DangerButton>
                </template>
            </DialogModal>
        </template>
    </ActionSection>
</template>
