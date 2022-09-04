const $prep = $(".prep");
const $main = $(".cont");
const $left = $(".time-left");
const $desc = $(".description");
const $date = $(".date");
const $eta = $(".eta");
const $wos = $(".workouts");
const $begin = $(".begin");

$prep.fadeIn(0);
$main.fadeOut(0);

$date.fadeOut(0); // exp 04/09/2022 -- TOO ANNOYING

$prep.on('click', main);

async function loadWorkouts() {
  const wos = await (await fetch('workouts.json')).json();

  for (let [wo, exs] of Object.entries(wos)) {
    $wos.append(`<option value="${wo}">${wo}</option>`);
  }
}

loadWorkouts()

var workTime;
var workDate;

var eta;

function showDate() {
  let d = new Date();
  $date.text(`${p(d.getHours())}:${p(d.getMinutes())}`);

  if (workDate)
    $eta.text(`${p(workDate.getHours())}:${p(workDate.getMinutes())}`);
}


showDate();
setInterval(showDate, 1000);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function p(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

async function doWork(w, eta) {
  $desc.text(w.desc)

  let max = w.time * 60;
  let pass = 0;

  while (pass < max) {
    $left.text(`${p(pass / 60)}:${p(pass % 60)} / ${p(max / 60)}:${p(max % 60)}`)

    eta--;
    pass++;
    await sleep(1000);
  }

  return eta;
}

async function main() {
  $begin.fadeOut(0);
  $main.fadeIn(0);

  const works = (await (await fetch('./workouts.json')).json())[$wos.find(':selected').val()];
  console.log(works)
  eta = 0;
  for (w of works) eta += w.time*60 + 45;  // plus resting eta

  workTime = eta;  // dont change
  workDate = new Date((new Date()).getTime() + workTime * 1000);

  console.debug(`ETA WO TIME: ${p(eta / 60)}m ${p(eta % 60)}s`);
  
  for (const [i, work] of works.entries()) {
    eta = await doWork(work, eta);

    if (i == works.length-1) {
      continue;
    }


    let a = new Audio("ding.mp3");
    a.play();  

    eta = await doWork({time: 45/60, desc: "Rest! Punch the air"}, eta);
  }

  $left.text("LETSGOOOOOOOOOOOOOOOOOOOO");
  $desc.text("YOU ARE PUMPED FOR TODAY CHAMP 💪💪")
  let a = new Audio("done.mp3");
  a.play();
}