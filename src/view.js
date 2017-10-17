/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */
/** @class View */
class View {
  
    /**
     * The function of setting up a quiz 
     * @param {Object} quiz Set up the quiz
     */
  static setUp (quiz) {
    View.setUpSubmitBtn('btn-submit')
    View.setUpCheckBtn('btn-check')
    View.setUpTryAgainBtn('btn-try-again')
    View.quiz = quiz
    View.questionLabels = []
  }

    /**
     * Set up fireCustom event
     * @param {String} eventName The name of event
     */
  static fireCustomEvent (eventName) {
    let eventInput = new Event(eventName)
    window.dispatchEvent(eventInput)
  }
    /**
     * Set up try submit button
     * @param {String} tagId The name of tag ID
     */
  static setUpSubmitBtn (tagId) {
    document.getElementById(tagId).onclick = function (event) {
      View.fireCustomEvent('submitEvent')
    }
  }
    /**
     * Set up chect button
     * @param {String} tagId The name of tag ID
     */
  static setUpCheckBtn (tagId) {
    document.getElementById(tagId).onclick = function (event) {
      View.fireCustomEvent('checkEvent')
    }
  }
    /**
     * Set up try again button
     * @param {String} tagId The name of tag ID
     */
  static setUpTryAgainBtn (tagId) {
    document.getElementById(tagId).onclick = function (event) {
      View.fireCustomEvent('tryAgainEvent')
    }
  }

    /**
     * Helper method to create question and answer element
     * @param {String} str The content in the div tag
     */
  static createDivElement (str) {
    let div = document.createElement('div')
    let p = document.createElement('p')

    p.innerHTML = str
    div.appendChild(p)
    return div
  }
    /**
     * Create background image div
     */
  static createQuestionImg () {
    let question = document.getElementById('boxes')
    let imgName = View.quiz.xml.getElementsByTagName('match')[0].attributes.getNamedItem('backgroundimage').value
    let dir = 'images/' + imgName
    if (!document.getElementById('questionImg')) {
      let questionImg = document.createElement('img')
      
      questionImg.setAttribute('id', 'questionImg')
      questionImg.setAttribute('src', dir)
      questionImg.setAttribute('width', '100%')
      questionImg.setAttribute('height', '100%')
      question.appendChild(questionImg)
    }
  }
    /**
     * Create the point indicate the target
     * @param {Object} obj The target point object
     * @param {Object} box The question box object
     * @return {Object} Returns the div dom object
     */
  static createPointElement (obj, box) {
    let boxContainer = document.getElementById('boxes')
    let targetX = obj.targetX
    let targetY = obj.targetY
    let questionImg = document.getElementById('questionImg')
    let naturalWidth = questionImg.naturalWidth
    let naturalHeight = questionImg.naturalHeight
    let top = parseInt(targetY) / parseInt(naturalHeight) * 100
    let left = parseInt(targetX) / parseInt(naturalWidth) * 100
    let div = document.createElement('div')
    let p = document.createElement('p')
    let color = box.style.backgroundColor
    
    p.innerHTML = obj.question + ' '
    div.appendChild(p)
    div.setAttribute('class', 'circle')
    div.setAttribute('style', 'position:absolute')
    div.style.background = color
    div.style.top = top + '%'
    div.style.left = left + '%'
    boxContainer.appendChild(div)
    return div
  }
    /**
     * Get a random number from the range n to m
     * @param  {Number} n The start range
     * @param  {Number} m The end range
     * @return {Number} Returns the random number
     */
  static randomNum (n, m) {
    let c = m - n + 1
    return Math.floor(Math.random() * c + n)
  }
    /** Create question boxes function
     * @param  {Object} obj The question object
     * @param  {String} quizType The quiz type
     * @return {Object} Returns the question box object
     */
  static createQuestionBoxElement (obj, quizType) {
    let boxContainer = document.getElementById('boxes')
    let box = View.createDivElement(obj.question)
    
    boxContainer.setAttribute('style', 'position:relative')
    // boxContainer.setAttribute("style", "background-image: url(" + dir + ");background-repeat: no-repeat;background-size: 100%");
    box.classList.add('question-box')
    box.setAttribute('id', obj.question)
    if (View.quiz.labels.length !== 0) {
      let index = 0
      
      let labelX = View.quiz.labels[index].labelX
      let labelY = View.quiz.labels[index].labelY
      let questionImg = document.getElementById('questionImg')
      let naturalWidth = questionImg.naturalWidth
      let naturalHeight = questionImg.naturalHeight
      let top = parseInt(labelY) / parseInt(naturalHeight) * 100
      let left = parseInt(labelX) / parseInt(naturalWidth) * 100
      let labelWidth = parseInt(View.quiz.labels[index].width)/ 16
      let labelHeight = parseInt(View.quiz.labels[index].height)/ 16
      
      box.setAttribute('dataLeft', left * boxContainer.clientWidth)
      box.setAttribute('dataTop', top * boxContainer.clientHeight)
      box.setAttribute('style', 'position:absolute')
      box.style.width= labelWidth+'em'
      box.style.height= labelHeight+'em'
      box.style.top = top + '%'
      box.style.left = left + '%'
      box.style.backgroundColor = 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'
      
      box.contentEditable = false
       // box.style.backgroundColor = 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'      
      box.style.backgroundColor ='grey'
      box.getElementsByTagName('p')[0].style.display = 'none'
        //box.style.opacity = 0
      

      $(box).droppable({
        accept: '.answer-card',
        hoverClass: 'hovered',
        drop: (event, ui) => {
                    // use CustomEvent to pass data.
          let eventInput = new CustomEvent('dropEvent', {
            'detail': {
              'question': obj.question,
              'answer': ui.draggable[0].children[0].innerHTML
            }
          })
          window.dispatchEvent(eventInput)
        }
      })
      boxContainer.appendChild(box)
      View.quiz.labels.splice(index, 1)
    }
    return box
  }
   


    /**
     * Create AnswerCard function
     */
  static createAnswerCardElement (answer) {
    let answerContainer = document.getElementById('answers')
    let answerCard = View.createDivElement(answer.answerText)
    let questionImg = document.getElementById('questionImg')
    let naturalWidth = questionImg.naturalWidth
    let naturalHeight = questionImg.naturalHeight
    let labelWidth = parseInt(answer.width)/ 16
    let labelHeight = parseInt(answer.height)/ 16
      
    answerCard.style.width= labelWidth + 'em'
    answerCard.style.height=labelHeight+ 'em'
    answerCard.style.backgroundImage="url("+answer.dir+")"
    answerCard.style.backgroundSize="cover"
    answerCard.classList.add('answer-card')
    answerContainer.appendChild(answerCard)
    answerCard.getElementsByTagName('p')[0].style.display = 'none'
    $(answerCard).draggable({
      containment: 'body',
      revert: true
    })
  }

    /**
     * For shuffling question boxes and answer cards
     */
  static shuffleContents (tagId) {
    let target = document.getElementById(tagId)
    let divs = target.getElementsByTagName('div')
    
    for (let i = 0; i < divs.length; i++) {
      let randomDivNumber = Math.floor(Math.random() * divs.length)
      target.appendChild(Array.from(divs).splice(randomDivNumber, 1)[0])
    }
  }

    /**
     * Find a question box or answer card of specific strings
     */
  static findDiv (tagId, str) {
    let divs = document.getElementById(tagId).getElementsByTagName('div')
    let foundDiv = Array.from(divs).find(div => {
      // if(div.children[0].exist()){
      if (div.childNodes.length !== 0) {
        let divContent = div.children[0].innerHTML
        if (divContent == str) {
          return div
        }
      }
    })

    return foundDiv
  }
    /**
     * Move answerCards to the Boxes
     */
  static moveAnswerCardToBox (answer, question) {
    let answerDiv = View.findDiv('answers', answer)
    let questionDiv = View.findDiv('boxes', question)
    
    questionDiv.appendChild(answerDiv)
    questionDiv.setAttribute('class', 'question-box finish')
        // resize iframe to fit height after possible expansion of question box
        // View.fireCustomEvent('resizeIframeEvent')
  }
    /**
     * Remove draggable for the answer card
     * which has already in the right box
     */
  static removeDraggable (answer) {
    let answerDiv = View.findDiv('answers', answer)
        
    $(answerDiv).draggable('option', 'revertDuration', 0)
    $(answerDiv).draggable('disable')
  }
    /**
     * Remove all answers' draggable
     */
  static removeDraggableAll () {
    let divs = document.getElementById('answers').getElementsByTagName('div')
    Array.from(divs).forEach(div => {
      $(div).draggable('disable')
    })
  }
    /**
     * Update the socer
     */
  static updateCurrentScore (score) {
    let currentScoreElement = document.getElementById('current-score')

    currentScoreElement.innerHTML = score
  }
    /**
     * Send the score to Moodle
     */
  static sendScoreToMoodle (score) {
    
    let form = window.parent.document.getElementById('store')

    form.mark.value = score
    form.submit() 
    }
    /**
     * @param {Number} score The score of user get
     * @param {Number} passingScore The passing score
     * Display the result of score
     */
  static displayResult (score, passingScore) {
    let scoreElement = document.getElementById('score')
    scoreElement.innerHTML = score

    let passingScoreElement = document.getElementById('passing-score')
    passingScoreElement.innerHTML = passingScore

    let finalMessage = document.getElementById('final-message')
    if (score >= passingScore) {
      finalMessage.innerHTML = 'Well done! A great result!'
    } else {
      finalMessage.innerHTML = 'Sorry you failed this time, but try again!'
    }
    let resultElement = document.getElementById('result')
    resultElement.style.display = 'block'
  }

}
