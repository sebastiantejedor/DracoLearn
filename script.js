var modules = document.querySelectorAll(".module")
var xpBar = document.getElementById("xp")
var levelText = document.getElementById("level")
var achievements = document.getElementById("achievements")
var popup = document.getElementById("popup")

var data = JSON.parse(localStorage.getItem("draco")) || {
  xp: 0,
  level: 1,
  completed: [],
  achievements: 0
}


/*MODULOS*/

function completeModule(id) {

  if (!data.completed.includes(id)) {

    data.completed.push(id)
    data.xp += 25

    showPopup("\uD83C\uDF89 Modulo completado!")
    showWinScreen()

    unlockNext(id)
    checkLevel()
    checkAchievements()
    save()
    updateUI()

    let btn = document.querySelector('[data-id="' + id + '"] .start-btn')

    if (btn) {
      btn.innerText = "Completado"
      btn.classList.add("completed")
      btn.disabled = true
    }

  }

}


/*DESBLOQUEO*/

function unlockNext(id) {

  let next = document.querySelector('[data-id="' + (id + 1) + '"]')

  if (next) {
    next.classList.remove("locked")
  }

}


/*NIVEL*/

function checkLevel() {

  if (data.xp >= 100) {
    data.level++
    data.xp = 0
    showPopup("\uD83D\uDD25 LEVEL UP!")
  }

}


/*LOGROS*/

function checkAchievements() {
  data.achievements = data.completed.length
}


/*UI*/

function updateUI() {

  if (xpBar) xpBar.style.width = data.xp + "%"
  if (levelText) levelText.innerText = data.level
  if (achievements) achievements.innerText = "Logros: " + data.achievements

  modules.forEach(m => {

    let id = parseInt(m.dataset.id)

    if (data.completed.includes(id)) {
      m.classList.remove("locked")
    }

  })

  updateBadges()

}


/*BADGES*/

function updateBadges() {

  var badges = document.getElementById("badges")
  if (!badges) return

  badges.innerHTML = ""

  if (data.completed.length >= 1) {
    badges.innerHTML += "<div class='badge'>Nivel Principiante</div>"
  }

  if (data.completed.length >= 3) {
    badges.innerHTML += "<div class='badge'>Nivel Intermedio</div>"
  }

  if (data.completed.length >= 5) {
    badges.innerHTML += "<div class='badge'>Nivel Pro</div>"
  }

}


/*POPUP*/

function showPopup(text) {

  if (!popup) return

  popup.innerText = text || "Acción realizada"
  popup.classList.add("show")

  setTimeout(() => {
    popup.classList.remove("show")
  }, 2000)

}


/*WIN SCREEN*/

function showWinScreen() {

  var screen = document.getElementById("winScreen")
  if (!screen) return

  screen.classList.add("show")

  setTimeout(() => {
    screen.classList.remove("show")
  }, 2500)

}


/*GUARDAR*/

function save() {
  localStorage.setItem("draco", JSON.stringify(data))
}


/*RESET*/

var resetBtn = document.getElementById("resetBtn")

if (resetBtn) {
  resetBtn.onclick = function () {
    localStorage.removeItem("draco")
    location.reload()
  }
}


/*INTRO */

function startApp() {

  var intro = document.getElementById("introScreen")
  if (!intro) return

  intro.style.opacity = "0"

  setTimeout(() => {
    intro.style.display = "none"
  }, 500)

}


/*ACORDEON*/

function toggleModule(el) {

  document.querySelectorAll(".module").forEach(m => {
    if (m !== el.parentElement) {
      m.classList.remove("active")
    }
  })

  el.parentElement.classList.toggle("active")

}

function toggleTopic(el) {
  el.parentElement.classList.toggle("active")
}


/* Input quiz */
function checkAnswer(inputId, correctAnswer, resultId) {

  let input = document.getElementById(inputId).value.trim().toLowerCase()
  let result = document.getElementById(resultId)

  let correct = correctAnswer.toLowerCase()

  if (input === correct) {

    result.innerHTML = "\u2705 Correcto"
    result.style.color = "green"

    showPopup("\uD83C\uDF89 Bien hecho +10 XP")

    data.xp += 10
    save()
    updateUI()

  } else {

    result.innerHTML = "\u274C Incorrecto"
    result.style.color = "red"

  }

}

/*QUIZ*/

var quizScore = 0

function answerQuiz(q, correct) {

  if (correct) {
    quizScore++
    showPopup("\u2705 Correcto")
  } else {
    showPopup("\u274C Incorrecto")
  }

}

function finishQuiz() {

  if (quizScore >= 2) {

    showPopup("\uD83C\uDF89 Quiz aprobado! + 25 XP!")
    data.xp += 20

  } else {

    showPopup("\u274C Intenta nuevamente")

  }

  quizScore = 0

  save()
  updateUI()

}


updateUI()
