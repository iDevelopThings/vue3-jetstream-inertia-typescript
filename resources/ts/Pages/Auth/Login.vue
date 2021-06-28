<template>
    <AuthenticationCard>
        <template #logo>
            <AuthenticationCardLogo />
        </template>

        <ValidationErrors class="mb-4" />

        <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <div>
                <Label for="email" value="Email" />
                <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required autofocus />
            </div>

            <div class="mt-4">
                <Label for="password" value="Password" />
                <Input id="password" type="password" class="mt-1 block w-full" v-model="form.password" required autocomplete="current-password" />
            </div>

            <div class="block mt-4">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span class="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <inertia-link v-if="canResetPassword" :href="route('password.request')" class="underline text-sm text-gray-600 hover:text-gray-900">
                    Forgot your password?
                </inertia-link>

                <Button class="ml-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Log in
                </Button>
            </div>
        </form>
    </AuthenticationCard>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import AuthenticationCard from "./../../Jetstream/Authentication/AuthenticationCard.vue";
import AuthenticationCardLogo from "@/Jetstream/Authentication/AuthenticationCardLogo.vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import ValidationErrors from "@/Jetstream/Validation/ValidationErrors.vue";
import Checkbox from "@/Jetstream/Elements/Checkbox.vue";
import Label from "@/Jetstream/Elements/Label.vue";
import Input from "@/Jetstream/Elements/Input.vue";


export default defineComponent({
    name       : "Login",
    components : {
        AuthenticationCard,
        AuthenticationCardLogo,
        Button,
        Input,
        Checkbox,
        Label,
        ValidationErrors,
    },

    props : {
        canResetPassword : Boolean,
        status           : String
    },

    data() {
        return {
            form : this.$inertia.form({
                email    : "",
                password : "",
                remember : false
            })
        };
    },

    methods : {
        submit() {
            this.form
                .transform(data => ({
                    ...data,
                    remember : this.form.remember ? "on" : ""
                }))
                .post(this.route("login"), {
                    onFinish : () => this.form.reset("password"),
                });
        }
    }
});

</script>
