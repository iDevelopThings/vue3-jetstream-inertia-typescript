require("./bootstrap");

import {createApp, h} from "vue";
import {App as InertiaApp, plugin as InertiaPlugin, Link} from "@inertiajs/inertia-vue3";
import {InertiaProgress} from "@inertiajs/progress";

const el = document.getElementById("app");

const app = createApp({
    render : () =>
        h(InertiaApp, {
            initialPage      : JSON.parse(el.dataset.page),
            resolveComponent : (name) => require(`./Pages/${name}`).default,
        }),
});
app.mixin({methods : {route}});
app.use(InertiaPlugin);
app.component('inertia-link', Link)
app.mount(el);


InertiaProgress.init({color : "#4B5563"});
