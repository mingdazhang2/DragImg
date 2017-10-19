/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */
class Controller {
    /**
     * Build up controller with Quiz and View parameters
     * @param {Quiz} newQuiz The quiz object
     * @param {View} newView The view object
     */
  constructor (newQuiz, newView) {
        // Model: Quiz instance
    Controller.myQuiz = newQuiz
        // View: View class
    Controller.myView = newView
        // The array of the labels or the input boxess
    Controller.boxes = []
    Controller.createQuizElements()
    Controller.setUpEventListeners()
  }
    /**
     * @param  {Number} n The start range
     * @param  {Number} m The end range
     * @return {Number} Returns the random number
     */
  static randomNum (n, m) {
    let c = m - n + 1
    return Math.floor(Math.random() * c + n)
  }

    /**
     * Create Quiz elements, create the boxes and answer cards
     * and the index of boxes
     */
  static createQuizElements () {
        // Get the quiz input type
    let quizType = Controller.myQuiz.getQuizType()
        // Create quiz image in the web
    Controller.myView.createQuestionImg()
        // Get all the questionAnswer set
	    var timer = setInterval(function () {
      if (questionImg.complete) {
        // Callback(questionImg)
        clearInterval(timer)
      }
    }, 50)
    let questionImg = document.getElementById('questionImg')

    questionImg.onload = function () {

    let questions = Controller.myQuiz.quiz.map(questionAnswerSet => questionAnswerSet)
      for (let i = 0; i < questions.length; i++) {
        // Create question label
        let box = Controller.myView.createQuestionBoxElement(questions[i], quizType)
      }
        Controller.myQuiz.forAllAnswers(answer => {
        Controller.myView.createAnswerCardElement(answer)
        let checkBtn = document.getElementById('btn-check')
        checkBtn.style.display = 'none'
      })
      Controller.myView.shuffleContents('boxes')
      Controller.myView.shuffleContents('answers')
    }
}
    /**
     * Set up events listeners
     */
  static setUpEventListeners () {
   // window.addEventListener('checkEvent', Controller.checkEventHandler, false) // when "check" button clicked
    window.addEventListener('submitEvent', Controller.submitEventHandler, false) // when "submit" button clicked
    window.addEventListener('tryAgainEvent', Controller.tryAgainEventHandler, false) // when "Try Again" button clicked
    window.addEventListener('scoreUpdateEvent', Controller.scoreUpdateEventHandler, false) // when quiz score is updated
        //   window.addEventListener('resizeIframeEvent', Controller.resizeIframeEventHandler, false) // when an answer card is moved to a correct box
    window.addEventListener('dropEvent', Controller.dropEventHandler, false) // when an answer card is dropped to a box
  }
 

    /**
     * Build up submit button event
     */
  static submitEventHandler (event) {
    let quiztype = Controller.myQuiz.getQuizType()

    let passingScore = Controller.myQuiz.passingScore
   
    Controller.myView.removeDraggableAll()

    let score = Controller.myQuiz.getRoundedQuizScore()

    
    Controller.myView.displayResult(score, passingScore)
    Controller.sleep(3000).then(() => {
    console.log('Score successfully send!')
    // The action after sleeping 
    Controller.myView.sendScoreToMoodle(score)
    })    
    

    
  }
  /**
   * Sleeping function
   * @param  {Number} time The time that system sleep
   * @return {Promise}      Returns a Promise object
   */
  static sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

    /**
     *  Try again event when uses have been marked,the button appears on the prompt window
     */
  static tryAgainEventHandler (event) {
    location.reload()
  }
    /**
     * Update the score when the input type is "drag" in the xml
     */
  static scoreUpdateEventHandler (event) {
    let score = Controller.myQuiz.getRoundedQuizScore()
    Controller.myView.updateCurrentScore(score)
  }
    /**
     * Control the size of the quiz, haven't use this function at the monment
     */
  static resizeIframeEventHandler (event) {
    parent.resizeIframe()
  }
    /**
     * Drop event for dragging the answercards to the labels
     */
  static dropEventHandler (event) {
    let dropped = event.detail.question
    let dragged = event.detail.answer

    let target = Controller.myQuiz.quiz.find(questionAnswerSet => questionAnswerSet.question == dropped)
    let foundAnswer = Controller.myQuiz.findAnswer(dragged)

    if (target.answers.includes(foundAnswer)) {
       
      Controller.myQuiz.addQuizScore(foundAnswer)
      Controller.myView.removeDraggable(dragged)
      Controller.myView.moveAnswerCardToBox(dragged, dropped)
    } else {

      target.answers[0].incorrectAnswerTime++

    }
  }
}
