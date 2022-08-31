const $prep = $(".prep");
const $main = $(".cont");
const $left = $(".time-left");
const $desc = $(".description");
const $date = $(".date");

$prep.fadeIn(0);
$main.fadeOut(0);

$prep.on('click', main);

function showDate() {
  let d = new Date();
  $date.text(`${p(d.getHours())}:${p(d.getMinutes())}`);
}

showDate();
setInterval(showDate, 1000);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function p(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

async function doWork(w) {
  $desc.text(w.desc)

  let max = w.time * 60;
  let pass = 0;

  while (pass < max) {
    $left.text(`${p(pass / 60)}:${p(pass % 60)} / ${p(max / 60)}:${p(max % 60)}`)
    
    pass++;
    await sleep(1000);
  }
}

async function main() {
  $prep.fadeOut(0);
  $main.fadeIn(0);

  const works = await (await fetch('./data.json')).json();

  for (const [i, work] of works.entries()) {
    await doWork(work);

    if (i == works.length-1) {
      continue;
    }
    $left.text("Ready for next?");
    let a = new Audio("ding.mp3");
    a.play();  
    await sleep(3000);
  }

  $left.text("LETSGOOOOOOOOOOOOOOOOOOOOOOOOO");
  $desc.text("YOU ARE PUMPED FOR TODAY CHAMP 💪💪")
  let a = new Audio("done.mp3");
  a.play();
}