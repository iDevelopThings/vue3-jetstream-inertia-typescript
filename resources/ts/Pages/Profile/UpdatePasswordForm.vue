<template>
    <FormSection @submitted="updatePassword">
        <template #title>
            Update Password
        </template>

        <template #description>
            Ensure your account is using a long, random password to stay secure.
        </template>

        <template #form>
            <div class="col-span-6 sm:col-span-4">
                <Label for="current_password" value="Current Password" />
                <Input id="current_password" type="password" class="mt-1 block w-full" v-model="form.current_password" ref="current_password" autocomplete="current-password" />
                <InputError :message="form.errors.current_password" class="mt-2" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <Label for="password" value="New Password" />
                <Input id="password" type="password" class="mt-1 block w-full" v-model="form.password" ref="password" autocomplete="new-password" />
                <InputError :message="form.errors.password" class="mt-2" />
            </div>

            <div class="col-span-6 sm:col-span-4">
                <Label for="password_confirmation" value="Confirm Password" />
                <Input id="password_confirmation" type="password" class="mt-1 block w-full" v-model="form.password_confirmation" autocomplete="new-password" />
                <InputError :message="form.errors.password_confirmation" class="mt-2" />
            </div>
        </template>

        <template #actions>
            <ActionMessage :on="form.recentlySuccessful" class="mr-3">
                Saved.
            </ActionMessage>

            <Button :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                Save
            </Button>
        </template>
    </FormSection>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import ActionMessage from "@/Jetstream/Elements/Section/ActionMessage.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";
import FormSection from "@/Jetstream/Elements/Section/FormSection.vue";
import Label from "@/Jetstream/Elements/Label.vue";
import Input from "@/Jetstream/Elements/Input.vue";

export default defineComponent({
    name : "UpdatePasswordForm",

    components : {
        Button,
        ActionMessage,
        InputError,
        FormSection,
        Label,
        Input,
    },

    data() {
        return {
            form : this.$inertia.form({
                current_password      : "",
                password              : "",
                password_confirmation : "",
            }),
        };
    },

    methods : {
        updatePassword() {
            this.form.put(route("user-password.update"), {
                errorBag       : "updatePassword",
                preserveScroll : true,
                onSuccess      : () => this.form.reset(),
                onError        : () => {
                    if (this.form.errors.password) {
                        this.form.reset("password", "password_confirmation");
                        this.$refs.password.focus();
                    }

                    if (this.form.errors.current_password) {
                        this.form.reset("current_password");
                        this.$refs.current_password.focus();
                    }
                }
            });
        },
    },
});
</script>
