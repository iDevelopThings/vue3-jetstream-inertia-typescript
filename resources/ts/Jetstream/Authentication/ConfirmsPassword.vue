<template>
    <span>
        <span @click="startConfirmingPassword">
            <slot />
        </span>

        <DialogModal :show="confirmingPassword" @close="closeModal">
            <template #title>
                {{ title }}
            </template>

            <template #content>
                {{ content }}

                <div class="mt-4">
                    <Input type="password" class="mt-1 block w-3/4" placeholder="Password"
                           ref="password"
                           v-model="form.password"
                           @keyup.enter="confirmPassword" />

                    <InputError :message="form.error" class="mt-2" />
                </div>
            </template>

            <template #footer>
                <SecondaryButton @click="closeModal">
                    Cancel
                </SecondaryButton>

                <Button class="ml-2" @click="confirmPassword" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    {{ button }}
                </Button>
            </template>
        </DialogModal>
    </span>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import SecondaryButton from "@/Jetstream/Elements/Button/SecondaryButton.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import DialogModal from "@/Jetstream/Modal/DialogModal.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";
import axios from "axios";

export default defineComponent({
    name : "ConfirmsPassword",

    emits : ["confirmed"],

    props : {
        title   : {
            default : "Confirm Password",
        },
        content : {
            default : "For your security, please confirm your password to continue.",
        },
        button  : {
            default : "Confirm",
        }
    },

    components : {
        DialogModal,
        Button,
        SecondaryButton,
        InputError,
        Input,
    },

    data() {
        return {
            confirmingPassword : false,
            form               : {
                password : "",
                error    : "",
            },
        };
    },

    methods : {
        startConfirmingPassword() {
            axios.get(route("password.confirmation")).then(response => {
                if (response.data.confirmed) {
                    this.$emit("confirmed");
                } else {
                    this.confirmingPassword = true;

                    setTimeout(() => this.$refs.password.focus(), 250);
                }
            });
        },

        confirmPassword() {
            this.form.processing = true;

            axios.post(route("password.confirm"), {
                password : this.form.password,
            }).then(() => {
                this.form.processing = false;
                this.closeModal();
                this.$nextTick(() => this.$emit("confirmed"));
            }).catch(error => {
                this.form.processing = false;
                this.form.error      = error.response.data.errors.password[0];
                this.$refs.password.focus();
            });
        },

        closeModal() {
            this.confirmingPassword = false;
            this.form.password      = "";
            this.form.error         = "";
        },
    }
});
</script>
