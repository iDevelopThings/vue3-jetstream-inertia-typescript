<template>
    <AuthenticationCard>
        <template #logo>
            <AuthenticationCardLogo />
        </template>

        <ValidationErrors class="mb-4" />

        <form @submit.prevent="submit">
            <div>
                <Label for="name" value="Name" />
                <Input id="name" type="text" class="mt-1 block w-full" v-model="form.name" required autofocus autocomplete="name" />
            </div>

            <div class="mt-4">
                <Label for="email" value="Email" />
                <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required />
            </div>

            <div class="mt-4">
                <Label for="password" value="Password" />
                <Input id="password" type="password" class="mt-1 block w-full" v-model="form.password" required autocomplete="new-password" />
            </div>

            <div class="mt-4">
                <Label for="password_confirmation" value="Confirm Password" />
                <Input id="password_confirmation" type="password" class="mt-1 block w-full" v-model="form.password_confirmation" required autocomplete="new-password" />
            </div>

            <div class="mt-4" v-if="$page.props.jetstream.hasTermsAndPrivacyPolicyFeature">
                <Label for="terms">
                    <div class="flex items-center">
                        <Checkbox name="terms" id="terms" v-model:checked="form.terms" />

                        <div class="ml-2">
                            I agree to the <a target="_blank" :href="route('terms.show')" class="underline text-sm text-gray-600 hover:text-gray-900">Terms of Service</a> and <a target="_blank"
                                                                                                                                                                                  :href="route('policy.show')"
                                                                                                                                                                                  class="underline text-sm text-gray-600 hover:text-gray-900">Privacy
                                                                                                                                                                                                                                              Policy</a>
                        </div>
                    </div>
                </Label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <inertia-link :href="route('login')" class="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </inertia-link>

                <Button class="ml-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                    Register
                </Button>
            </div>
        </form>
    </AuthenticationCard>
</template>

<script lang="ts">


import {defineComponent} from "vue";
import AuthenticationCard from "@/Jetstream/Authentication/AuthenticationCard.vue";
import AuthenticationCardLogo from "@/Jetstream/Authentication/AuthenticationCardLogo.vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import Checkbox from "@/Jetstream/Elements/Checkbox.vue";
import Label from "@/Jetstream/Elements/Label.vue";
import ValidationErrors from "@/Jetstream/Validation/ValidationErrors.vue";


export default defineComponent({
    components : {
        AuthenticationCard,
        AuthenticationCardLogo,
        Button,
        Input,
        Checkbox,
        Label,
        ValidationErrors
    },

    data() {
        return {
            form : this.$inertia.form({
                name                  : "",
                email                 : "",
                password              : "",
                password_confirmation : "",
                terms                 : false,
            })
        };
    },

    methods : {
        submit() {
            this.form.post(this.route("register"), {
                onFinish : () => this.form.reset("password", "password_confirmation"),
            });
        }
    }
});
</script>
