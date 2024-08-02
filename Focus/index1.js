//This ensures that the function is executed as soon as it is defined.
//This part implements a simple module system, allowing the script to manage dependencies if needed. However, in this particular code, it mainly prepares the script for potential modular expansion.
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    // Adds style.css to the document <head>
    window.addEventListener(
      'load',
      (e) => {
        const site1 = {
          id: 'id1',
          name: 'Leetcode Problem Solving Platform',
          url: 'https://leetcode.com/',
        }
        const site2 = {
          id: 'id2',
          name: 'Codeforces',
          url: 'https://codeforces.com/',
        }
        const site3 = {
          id: 'id3',
          name: 'Learn C++',
          url: 'https://cplusplus.com/',
        }
        
        const blockedSite = {
          id: 'idBlocked',
          url: 'https://youtube.com',
        }
        const blockedSite2={
            id:'idBlocked2',
            url:'https://www.instagram.com/accounts/login/?hl=en',
        }
    
        // Add link to style.css
        console.log('using indexDev.js')
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = './style.css'
        document.head.appendChild(link)
    
        // Logic for replacing website body with our app
        var body = document.querySelector('body')
        var main = document.createElement('main')
        body.innerHTML = ''
        document.body.appendChild(main)
        main.innerHTML = `
        <div id=${site1.id} class="btn btn-primary">${site1.name}</div>
        <div id=${site2.id} class="btn btn-primary">${site2.name}</div>
        <div id=${site3.id} class="btn btn-primary">${site3.name}</div>
        <div id=${blockedSite.id} class="btn btn-wide">Continue to Page</div>
        <div id=${blockedSite2.id} class="btn1 btn-wide">Continue to Page</div>`
    
        // Query Selectors
        // select divs by id
        const site1Div = document.querySelector(`#${site1.id}`)
        const site2Div = document.querySelector(`#${site2.id}`)
        const site3Div = document.querySelector(`#${site3.id}`)
        const blockedSiteDiv = document.querySelector(`#${blockedSite.id}`)
        const blockedSite2Div = document.querySelector(`#${blockedSite2.id}`)
    
        // Event Handlers
        // add onclick event to query selected div
        site1Div.addEventListener('click', () => {
          window.location.href = site1.url
        })
        site2Div.addEventListener('click', () => {
          window.location.href = site2.url
        })
        site3Div.addEventListener('click', () => {
          window.location.href = site3.url
        })
        blockedSiteDiv.addEventListener('click', () => {
          window.location.href = blockedSite.url
        })
        blockedSite2Div.addEventListener('click', () => {
          window.location.href = blockedSite2.url
        })
    
      },
      false
    )
    
    },{}]},{},[1]);