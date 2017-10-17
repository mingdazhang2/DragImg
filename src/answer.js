/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, jquery: true */

class Answer {
  /**
   * The constructor function of Answer
   * @param  {String} - Answer Text
   * 
   */
  constructor (newAnswerText,dir,width,height) {
    this.answerText = newAnswerText
    this.answerScore = 0
    this.incorrectAnswerTime = 0
    this.dir =dir
    this.width = width
    this.height = height
  }
		/**
     * Set the score  
     * @param {Number} - Score number  
     */
  setAnswerScore (newScore) {
    this.answerScore = newScore
  }
		/**
     * Calculate the score
     * @param  {Number} - Score number
     * @return {Number} - The score after calulating
     */
  reduceAnswerScore (number) {
    this.answerScore -= number
    return this.answerScore = (this.answerScore < 0) ? 0 : this.answerScore
  }
}
