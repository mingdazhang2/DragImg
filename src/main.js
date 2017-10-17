/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */
window.onload = function () {
  let request = new XMLHttpRequest()
  request.open('GET', 'config.xml', true)
  request.onload = function () {
    // Sent request to the moodel server, if the status between 200 to 400, that's a successful request
    if (request.status >= 200 && request.status < 400) {
            // success
      let xml = request.responseXML
      let quiz = new Quiz(xml)
      View.setUp(quiz)
      let controller = new Controller(quiz, View)
      parent.resizeIframe()
            // wait for images to be loaded and do it again
            setTimeout(function() {
                parent.resizeIframe()
            }, 1000)
      // let reload = true
      // if(reload){
      //   window.location.reload()
      //   reload = false
      // }
            
      let flag = window.sessionStorage.getItem('dragImg')
      // if the session exist, doesn't need to reload the page
      if (!flag) {
        setTimeout(function () {
          window.location.reload()
        }, 1000)
      }
      window.sessionStorage.setItem('dragImg', 'true')
    }
  }

  request.onerror = function () {
  // There was a connection erro of some sort
  }

  request.send()
}
