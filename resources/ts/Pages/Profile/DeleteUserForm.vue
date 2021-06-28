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

<script lang="ts">

import {defineComponent} from "vue";
import ActionSection from "@/Jetstream/Elements/Section/ActionSection.vue";
import DangerButton from "@/Jetstream/Elements/Button/DangerButton.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";
import SecondaryButton from "@/Jetstream/Elements/Button/SecondaryButton.vue";
import DialogModal from "@/Jetstream/Modal/DialogModal.vue";

export default defineComponent({
    name : "DeleteUserForm",

    components : {
        ActionSection,
        DangerButton,
        DialogModal,
        Input,
        InputError,
        SecondaryButton,
    },

    data() {
        return {
            confirmingUserDeletion : false,

            form : this.$inertia.form({
                password : "",
            })
        };
    },

    methods : {
        confirmUserDeletion() {
            this.confirmingUserDeletion = true;

            setTimeout(() => this.$refs.password.focus(), 250);
        },

        deleteUser() {
            this.form.delete(route("current-user.destroy"), {
                preserveScroll : true,
                onSuccess      : () => this.closeModal(),
                onError        : () => this.$refs.password.focus(),
                onFinish       : () => this.form.reset(),
            });
        },

        closeModal() {
            this.confirmingUserDeletion = false;

            this.form.reset();
        },
    },
});
</script>
