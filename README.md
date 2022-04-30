Jetstreams Inertia vue 3 setup... but with typescript

It took me hours to actually get this working... So to save my self future efforts and potentially anyone else, here's everything you need

Easiest way to get started:
- Create a fresh project
  - [laravel](https://laravel.com/docs/9.x/installation)
  - [laravel jetstream](https://jetstream.laravel.com/2.x/installation.html)
- Click the green "Code button" on github > Click download zip
  - Drag and drop all files into your project and allow overwriting any files
- Run `npm install / yarn install`
- Run `npm run dev / yarn dev`
- All done ✔

Latest changes:
 - There was some issues with Inertia's ``this.$inertia.form({})``, so I converted the components which use this, to use vue3's setup script.
 - Created global component for `<inertia-link>` since they removed this global component lately.
 - Updated package versions.
 
Some minor changes I made:
 - Reorganized Jetstream components to be in a more structured fashion
 - Added vues "name" property to all components (this will help some ides find the component to import when working in SFC)
 - Switched all components to vue 3's typescript "defineComponent()" structure
 - Additional minor configuration in webpack.mix.js for typescript compilation
 - Global typedefs for ziggy

I'm not sure if I missed/broken anything, if you find anything, let me know, or kindly submit a pr :) 

I think for the most part, you should be able to directly copy everything into the root of your laravel application... but be sure to manually compare package.json - I included this so you have all necessary packages.
