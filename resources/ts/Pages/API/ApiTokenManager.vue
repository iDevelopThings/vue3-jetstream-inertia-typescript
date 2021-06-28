<template>
    <div>
        <!-- Generate API Token -->
        <FormSection @submitted="createApiToken">
            <template #title>
                Create API Token
            </template>

            <template #description>
                API tokens allow third-party services to authenticate with our application on your behalf.
            </template>

            <template #form>
                <!-- Token Name -->
                <div class="col-span-6 sm:col-span-4">
                    <Label for="name" value="Name" />
                    <Input id="name" type="text" class="mt-1 block w-full" v-model="createApiTokenForm.name" autofocus />
                    <InputError :message="createApiTokenForm.errors.name" class="mt-2" />
                </div>

                <!-- Token Permissions -->
                <div class="col-span-6" v-if="availablePermissions.length > 0">
                    <Label for="permissions" value="Permissions" />

                    <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="permission in availablePermissions" :key="permission">
                            <label class="flex items-center">
                                <Checkbox :value="permission" v-model:checked="createApiTokenForm.permissions" />
                                <span class="ml-2 text-sm text-gray-600">{{ permission }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </template>

            <template #actions>
                <ActionMessage :on="createApiTokenForm.recentlySuccessful" class="mr-3">
                    Created.
                </ActionMessage>

                <Button :class="{ 'opacity-25': createApiTokenForm.processing }" :disabled="createApiTokenForm.processing">
                    Create
                </Button>
            </template>
        </FormSection>

        <div v-if="tokens.length > 0">
            <SectionBorder />

            <!-- Manage API Tokens -->
            <div class="mt-10 sm:mt-0">
                <ActionSection>
                    <template #title>
                        Manage API Tokens
                    </template>

                    <template #description>
                        You may delete any of your existing tokens if they are no longer needed.
                    </template>

                    <!-- API Token List -->
                    <template #content>
                        <div class="space-y-6">
                            <div class="flex items-center justify-between" v-for="token in tokens" :key="token.id">
                                <div>
                                    {{ token.name }}
                                </div>

                                <div class="flex items-center">
                                    <div class="text-sm text-gray-400" v-if="token.last_used_ago">
                                        Last used {{ token.last_used_ago }}
                                    </div>

                                    <button class="cursor-pointer ml-6 text-sm text-gray-400 underline"
                                            @click="manageApiTokenPermissions(token)"
                                            v-if="availablePermissions.length > 0"
                                    >
                                        Permissions
                                    </button>

                                    <button class="cursor-pointer ml-6 text-sm text-red-500" @click="confirmApiTokenDeletion(token)">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </ActionSection>
            </div>
        </div>

        <!-- Token Value Modal -->
        <DialogModal :show="displayingToken" @close="displayingToken = false">
            <template #title>
                API Token
            </template>

            <template #content>
                <div>
                    Please copy your new API token. For your security, it won't be shown again.
                </div>

                <div class="mt-4 bg-gray-100 px-4 py-2 rounded font-mono text-sm text-gray-500" v-if="$page.props.jetstream.flash.token">
                    {{ $page.props.jetstream.flash.token }}
                </div>
            </template>

            <template #footer>
                <SecondaryButton @click="displayingToken = false">
                    Close
                </SecondaryButton>
            </template>
        </DialogModal>

        <!-- API Token Permissions Modal -->
        <DialogModal :show="managingPermissionsFor" @close="managingPermissionsFor = null">
            <template #title>
                API Token Permissions
            </template>

            <template #content>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="permission in availablePermissions" :key="permission">
                        <label class="flex items-center">
                            <Checkbox :value="permission" v-model:checked="updateApiTokenForm.permissions" />
                            <span class="ml-2 text-sm text-gray-600">{{ permission }}</span>
                        </label>
                    </div>
                </div>
            </template>

            <template #footer>
                <SecondaryButton @click="managingPermissionsFor = null">
                    Cancel
                </SecondaryButton>

                <Button class="ml-2" @click="updateApiToken" :class="{ 'opacity-25': updateApiTokenForm.processing }" :disabled="updateApiTokenForm.processing">
                    Save
                </Button>
            </template>
        </DialogModal>

        <!-- Delete Token Confirmation Modal -->
        <ConfirmationModal :show="apiTokenBeingDeleted" @close="apiTokenBeingDeleted = null">
            <template #title>
                Delete API Token
            </template>

            <template #content>
                Are you sure you would like to delete this API token?
            </template>

            <template #footer>
                <SecondaryButton @click="apiTokenBeingDeleted = null">
                    Cancel
                </SecondaryButton>

                <DangerButton class="ml-2" @click="deleteApiToken" :class="{ 'opacity-25': deleteApiTokenForm.processing }" :disabled="deleteApiTokenForm.processing">
                    Delete
                </DangerButton>
            </template>
        </ConfirmationModal>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import DangerButton from "@/Jetstream/Elements/Button/DangerButton.vue";
import SecondaryButton from "@/Jetstream/Elements/Button/SecondaryButton.vue";
import Checkbox from "@/Jetstream/Elements/Checkbox.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import Label from "@/Jetstream/Elements/Label.vue";
import ActionMessage from "@/Jetstream/Elements/Section/ActionMessage.vue";
import ActionSection from "@/Jetstream/Elements/Section/ActionSection.vue";
import FormSection from "@/Jetstream/Elements/Section/FormSection.vue";
import SectionBorder from "@/Jetstream/Elements/Section/SectionBorder.vue";
import ConfirmationModal from "@/Jetstream/Modal/ConfirmationModal.vue";
import DialogModal from "@/Jetstream/Modal/DialogModal.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";

export default defineComponent({
    name : "ApiTokenManager",

    components : {
        DangerButton,
        ConfirmationModal,
        SecondaryButton,
        DialogModal,
        ActionSection,
        SectionBorder,
        Button,
        ActionMessage,
        Checkbox,
        InputError,
        Input,
        Label,
        FormSection,
    },

    props : [
        "tokens",
        "availablePermissions",
        "defaultPermissions",
    ],

    data() {
        return {
            createApiTokenForm : this.$inertia.form({
                name        : "",
                permissions : this.defaultPermissions,
            }),

            updateApiTokenForm : this.$inertia.form({
                permissions : []
            }),

            deleteApiTokenForm : this.$inertia.form(),

            displayingToken        : false,
            managingPermissionsFor : null,
            apiTokenBeingDeleted   : null,
        };
    },

    methods : {
        createApiToken() {
            this.createApiTokenForm.post(route("api-tokens.store"), {
                preserveScroll : true,
                onSuccess      : () => {
                    this.displayingToken = true;
                    this.createApiTokenForm.reset();
                }
            });
        },

        manageApiTokenPermissions(token) {
            this.updateApiTokenForm.permissions = token.abilities;

            this.managingPermissionsFor = token;
        },

        updateApiToken() {
            this.updateApiTokenForm.put(route("api-tokens.update", this.managingPermissionsFor), {
                preserveScroll : true,
                preserveState  : true,
                onSuccess      : () => (this.managingPermissionsFor = null),
            });
        },

        confirmApiTokenDeletion(token) {
            this.apiTokenBeingDeleted = token;
        },

        deleteApiToken() {
            this.deleteApiTokenForm.delete(route("api-tokens.destroy", this.apiTokenBeingDeleted), {
                preserveScroll : true,
                preserveState  : true,
                onSuccess      : () => (this.apiTokenBeingDeleted = null),
            });
        },
    },
});
</script>
