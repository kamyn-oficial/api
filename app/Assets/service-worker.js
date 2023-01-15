; (function () {
  const cacheFiles = [
    '404.html',
    'about.html',
    'account-addresses.html',
    'account-comments.html',
    'account-create.html',
    'account-details.html',
    'account-forgot.html',
    'account-history.html',
    'account-login.html',
    'account-reset.html',
    'account-wishlist.html',
    'cart-empty.html',
    'cart.html',
    'category.html',
    'checkout.html',
    'contact.html',
    'demo-addtocart-events.html',
    'faq.html',
    'index.html',
    'product.html',
    'css/cross_color.png',
    'css/style.css',
    'css/vendor/bootstrap.min.css',
    'css/vendor/vendor.min.css',
    'fonts/icomoon/icon-foxic-project.json',
    'fonts/icomoon/icon-foxic.svg',
    'fonts/icomoon/icon-foxic.ttf',
    'fonts/icomoon/icon-foxic.woff',
    'fonts/icomoon/icons.css',
    'fonts/icomoon/selection.json',
    'images/favicon.ico',
    'images/favicon.png',
    'images/footer-coupon.png',
    'images/header-banner-02.png',
    'images/header-banner.png',
    'images/hello-image.png',
    'images/loader.svg',
    'images/logo-banner.png',
    'images/logo-footer-white.png',
    'images/logo-footer-white2x.png',
    'images/logo-footer.png',
    'images/logo-footer2x.png',
    'images/logo-no-icon.png',
    'images/logo-popup.png',
    'images/logo-popup2x.png',
    'images/logo-white-sm.png',
    'images/logo-white.png',
    'images/logo-white2x.png',
    'images/logo.png',
    'images/logo2x.png',
    'images/popup-image.png',
    'images/product-description-01.png',
    'images/product-description-02.png',
    'images/pages/about-bg.jpg',
    'images/pages/contact-bg.jpg',
    'images/pages/img-person-01.jpg',
    'images/pages/img-person-02.jpg',
    'images/pages/img-person-03.jpg',
    'images/pages/img-person-04.jpg',
    'images/pages/size-table.png',
    'images/pages/tumbleweed.gif',
    'images/products/product-01-1.jpg',
    'images/products/product-01-2.jpg',
    'images/products/product-01-3.jpg',
    'images/products/product-01.jpg',
    'images/products/product-02.jpg',
    'images/products/product-03.jpg',
    'images/products/product-04.jpg',
    'images/products/product-05.jpg',
    'images/products/product-06.jpg',
    'images/products/product-07.jpg',
    'images/products/product-08.jpg',
    'images/products/product-09.jpg',
    'images/products/product-10.jpg',
    'images/products/product-11.jpg',
    'images/products/product-12.jpg',
    'images/products/product-13.jpg',
    'images/products/product-14.jpg',
    'images/products/product-15.jpg',
    'images/products/product-16.jpg',
    'images/products/product-17.jpg',
    'images/products/product-18.jpg',
    'images/products/product-19.jpg',
    'images/products/product-20.jpg',
    'images/products/product-category-01-hover.png',
    'images/products/product-category-01.png',
    'images/products/product-category-02-hover.png',
    'images/products/product-category-02.png',
    'images/products/product-category-03-hover.png',
    'images/products/product-category-03.png',
    'images/products/product-category-04-hover.png',
    'images/products/product-category-04.png',
    'images/products/product-category-05-hover.png',
    'images/products/product-category-05.png',
    'images/products/product-category-06-hover.png',
    'images/products/product-category-06.png',
    'images/products/product-category-07-hover.png',
    'images/products/product-category-07.png',
    'images/products/product-category-08-hover.png',
    'images/products/product-category-08.png',
    'images/products/product-category-09.png',
    'images/products/product-category-10.png',
    'images/products/product-category-11.png',
    'images/products/product-category-12.png',
    'images/products/product-full-01.png',
    'images/products/product-header-cart-01.jpg',
    'images/products/product-header-cart-02.jpg',
    'images/products/product-promo.jpg',
    'images/skins/fashion/products/product-01-1.jpg',
    'js/app-html.js',
    'js/service-worker.js',
    'js/vendor/anime.min.js',
    'js/vendor/bodyScrollLock.min.js',
    'js/vendor/bootstrap-tabcollapse.js',
    'js/vendor/bootstrap.bundle.min.js',
    'js/vendor/imagesloaded.pkgd.min.js',
    'js/vendor/jquery.cookie.js',
    'js/vendor/jquery.countdown.min.js',
    'js/vendor/jquery.fancybox.min.js',
    'js/vendor/jquery.form.min.js',
    'js/vendor/jquery.validate.min.js',
    'js/vendor/perfect-scrollbar.jquery.min.js',
    'js/vendor/vendor.min.js',
    'js/vendor-special/axios.min.js',
    'js/vendor-special/instafeed.min.js',
    'js/vendor-special/isotope.pkgd.min.js',
    'js/vendor-special/jquery.ez-plus.js',
    'js/vendor-special/jquery.min.js',
    'js/vendor-special/lazysizes.min.js',
    'js/vendor-special/ls.aspectratio.min.js',
    'js/vendor-special/ls.bgset.min.js',
    'js/vendor-special/states.js',
    'js/vendor-special/toastify.min.css',
    'js/vendor-special/toastify.min.js',
    'php/process-contact.php',
    'scss/_mixins.scss',
    'scss/_variables.scss',
    'scss/style.scss'
  ]

  // Update 'version' if you need to refresh the cache
  const staticCacheName = 'static'
  const version = 'v0.0.1::'

  // Store core files in a cache (including a page to display when offline)
  function updateStaticCache() {
    return caches.open(version + staticCacheName).then(function (cache) {
      return cache.addAll(cacheFiles)
    })
  }

  self.addEventListener('install', function (event) {
    event.waitUntil(updateStaticCache())
  })

  self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys().then(function (keys) {
        // Remove caches whose name is no longer valid
        return Promise.all(
          keys
            .filter(function (key) {
              return key.indexOf(version) !== 0
            })
            .map(function (key) {
              return caches.delete(key)
            })
        )
      })
    )
  })

  self.addEventListener('fetch', function (event) {
    let request = event.request
    // Always fetch non-GET requests from the network
    if (request.method !== 'GET') {
      event.respondWith(
        fetch(request).catch(function () {
          return caches.match('/offline.html')
        })
      )
      return
    }

    // For HTML requests, try the network first, fall back to the cache, finally the offline page
    if (request.headers.get('Accept').indexOf('text/html') !== -1) {
      // Fix for Chrome bug: https://code.google.com/p/chromium/issues/detail?id=573937
      if (request.mode !== 'navigate') {
        request = new Request(request.url, {
          method: 'GET',
          headers: request.headers,
          mode: request.mode,
          credentials: request.credentials,
          redirect: request.redirect
        })
      }
      event.respondWith(
        fetch(request)
          .then(function (response) {
            // Stash a copy of this page in the cache
            const copy = response.clone()
            caches.open(version + staticCacheName).then(function (cache) {
              cache.put(request, copy)
            })
            return response
          })
          .catch(function () {
            return caches.match(request).then(function (response) {
              return response || caches.match('/offline.html')
            })
          })
      )
      return
    }

    // For non-HTML requests, look in the cache first, fall back to the network
    event.respondWith(
      caches.match(request).then(function (response) {
        return (
          response ||
          fetch(request).catch(function () {
            // If the request is for an image, show an offline placeholder
            if (request.headers.get('Accept').indexOf('image') !== -1) {
              return new Response(
                '<svg width="400" height="300" role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              )
            }
          })
        )
      })
    )
  })
})()
