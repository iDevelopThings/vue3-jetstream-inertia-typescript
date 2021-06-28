Jetstreams Inertia vue 3 setup... but with typescript

 It took me hours to actually get this working... So to save my self future efforts and potentially anyone else, here's everything you need

 Some minor changes I made:
 - Reorganized Jetstream components to be in a more structured fashion
 - Added vues "name" property to all components (this will help some ides find the component to import when working in SFC)
 - Switched all components to vue 3's typescript "defineComponent()" structure
 - Additional minor configuration in webpack.mix.js for typescript compilation
 - Global typedefs for ziggy

I'm not sure if I missed/broken anything, if you find anything, let me know, or kindly submit a pr :) 

I think for the most part, you should be able to directly copy everything into the root of your laravel application... but be sure to manually compare package.json - I included this so you have all necessary packages.