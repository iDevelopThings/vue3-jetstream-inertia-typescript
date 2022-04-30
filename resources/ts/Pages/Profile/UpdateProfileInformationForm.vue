<script lang="ts" setup>
import {defineComponent, ref} from "vue";
import Button from "@/Jetstream/Elements/Button/Button.vue";
import ActionMessage from "@/Jetstream/Elements/Section/ActionMessage.vue";
import InputError from "@/Jetstream/Validation/InputError.vue";
import SecondaryButton from "@/Jetstream/Elements/Button/SecondaryButton.vue";
import Label from "@/Jetstream/Elements/Label.vue";
import FormSection from "@/Jetstream/Elements/Section/FormSection.vue";
import Input from "@/Jetstream/Elements/Input.vue";
import {useForm} from "@inertiajs/inertia-vue3";
import {Inertia} from "@inertiajs/inertia";

const props = defineProps(["user"]);

const photo = ref<HTMLInputElement>();

const photoPreview = ref(null);
const form         = useForm({
    _method : "PUT",
    name    : props.user.name,
    email   : props.user.email,
    photo   : null,
});

function updateProfileInformation() {
    if (photo.value) {
        form.photo = photo.value.files[0];
    }

    form.post(route("user-profile-information.update"), {
        errorBag       : "updateProfileInformation",
        preserveScroll : true,
        onSuccess      : () => (clearPhotoFileInput()),
    });
}

function selectNewPhoto() {
    photo.value.click();
}

function updatePhotoPreview() {
    const photoFile = photo.value.files[0];

    if (!photoFile) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        photoPreview.value = e.target.result;
    };

    reader.readAsDataURL(photoFile);
}

function deletePhoto() {
    Inertia.delete(route("current-user-photo.destroy"), {
        preserveScroll : true,
        onSuccess      : () => {
            photoPreview.value = null;
            clearPhotoFileInput();
        },
    });
}

function clearPhotoFileInput() {
    if (photo.value?.value) {
        photo.value.value = null;
    }
}

</script>


<template>
    <FormSection @submitted="updateProfileInformation">
        <template #title>
            Profile Information
        </template>

        <template #description>
            Update your account's profile information and email address.
        </template>

        <template #form>
            <!-- Profile Photo -->
            <div class="col-span-6 sm:col-span-4" v-if="$page.props.jetstream.managesProfilePhotos">
                <!-- Profile Photo File Input -->
                <input type="file" class="hidden"
                       ref="photo"
                       @change="updatePhotoPreview">

                <Label for="photo" value="Photo" />

                <!-- Current Profile Photo -->
                <div class="mt-2" v-show="! photoPreview">
                    <img :src="user.profile_photo_url" :alt="user.name" class="rounded-full h-20 w-20 object-cover">
                </div>

                <!-- New Profile Photo Preview -->
                <div class="mt-2" v-show="photoPreview">
                    <span class="block rounded-full w-20 h-20"
                          :style="'background-size: cover; background-repeat: no-repeat; background-position: center center; background-image: url(\'' + photoPreview + '\');'">
                    </span>
                </div>

                <SecondaryButton class="mt-2 mr-2" type="button" @click.prevent="selectNewPhoto">
                    Select A New Photo
                </SecondaryButton>

                <SecondaryButton type="button" class="mt-2" @click.prevent="deletePhoto" v-if="user.profile_photo_path">
                    Remove Photo
                </SecondaryButton>

                <InputError :message="form.errors.photo" class="mt-2" />
            </div>

            <!-- Name -->
            <div class="col-span-6 sm:col-span-4">
                <Label for="name" value="Name" />
                <Input id="name" type="text" class="mt-1 block w-full" v-model="form.name" autocomplete="name" />
                <InputError :message="form.errors.name" class="mt-2" />
            </div>

            <!-- Email -->
            <div class="col-span-6 sm:col-span-4">
                <Label for="email" value="Email" />
                <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" />
                <InputError :message="form.errors.email" class="mt-2" />
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
