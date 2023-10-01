var ACHIEVEMENTS = [{requirements: { butter: 0, icon: 'textures/ButterPack/gui/shop/intelligentcow.png', name: 'Alpha Tester', given: false, message: 'Thanks for alpha testing Butter Clicker!' }},
  {requirements: { butter: 50, icon: 'textures/ButterPack/item/slot/apple.png', name: 'The Beginning', given: false, message: 'Farm 50 butter' }},
  {requirements: { butter: 200, icon: 'textures/ButterPack/item/slot/shopkeeperfriend.png', name: 'New To The Neighbourhood', given: false, message: 'Farm 200 butter' }},
  {requirements: { butter: 500, icon: 'textures/ButterPack/gui/shop/goldengrass.png', name: 'Farming Novice', given: false, message: 'Farm 500 butter' }}
];

if(localStorage.getItem('achievements') != null){
  ACHIEVEMENTS = JSON.parse(localStorage.getItem('achievements'));
}

var close_button = document.getElementsByClassName('close-button-achievement')[0];
close_button.addEventListener('mousedown', ()=>{
  document.getElementById("snackbar").className = document.getElementById("snackbar").className.replace("show", "");
});

function giveAchievement(butter) {
  var presentedAchievement = findAchievement(butter);
  if (presentedAchievement !== undefined) {
    var achievement_element = document.getElementById("snackbar");
    presentedAchievement.requirements.given = true;
    localStorage.setItem('achievements', JSON.stringify(ACHIEVEMENTS));
    achievement_element.className = "show";

    document.getElementsByClassName('achievement-image')[0].setAttribute('src', `${presentedAchievement.requirements.icon}`);
    document.getElementsByClassName('achievement-text')[0].innerHTML = `<span style='color: #de413f;' class='achievement-static-text'>Achievement Get</span><br> ${presentedAchievement.requirements.name}<br><span style='font-size: 0.75em; color: #f7be44;'>${presentedAchievement.requirements.message}</span>`;
  }
}

function findAchievement(butter) {
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.requirements.butter <= parseInt(butter) && achievement.requirements.given == false) {
      return achievement;
    }
  }
  return undefined;
}

export {giveAchievement}