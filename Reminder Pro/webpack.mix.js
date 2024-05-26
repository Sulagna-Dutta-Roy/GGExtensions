let mix = require('laravel-mix');

mix.setPublibPath('./')
.sass('assets/sass/popup.scss','dist/css')
.options({
    processCssUrls: false
});

