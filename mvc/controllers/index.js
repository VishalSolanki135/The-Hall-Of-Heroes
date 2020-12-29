const mongoose = require('mongoose');
const Hero = mongoose.model('Hero');
const Squad = mongoose.model('Squad');

const data = require('../../Default-Heroes');

const heroData = data.heroes;

function getOverall(hero) {
  let {
    strength : str,
    perception : per,
    endurance : end,
    charisma : cha,
    intelligence : int,
    agiltity : agi,
    luck : luc
  } = hero.stats;
  let arr = [str, per, end, cha, int, agi, luc];
  return arr.reduce((acc, value)=> acc + value, 0);
}





getIndex = function(req, res, next) {
    res.render('index', { title: 'Mongoose' });
}

getHeroesIndex = function(req, res) {
  Hero.find({}, "", { lean: true }, (err,heroes)=>{
    if(err){ return res.send({ error: err }); }

    for(hero of heroes){
      hero.overall = getOverall(hero);
      console.log(hero.overall);
    }

    console.log(heroes);
    res.render('heroes', { title: 'Hall Of Heroes', heroes: heroes });
  });
}

getHeroesForms = function(req, res){
  Squad.find((err, squads) =>{
    if(err){ return res.send({ error: err }); }
    res.render('create-a-hero', { title: "Create New Hero", squads: squads });

  });
}

createNewHero = function({body}, res){
  let hero = {
    name: body.name,
    description: body.desc,
    stats: {
      strength: body.strength,
      perception: body.perception,
      endurance: body.endurance,
      charisma: body.charisma,
      intelligence: body.intelligence,
      agiltity: body.agiltity,
      luck: body.strength
    }
  }
  body.origin && (hero.origin = body.origin);
  Hero.create(hero, (err, newHero)=>{
    if(err){ return res.send({ error: err }); }
    res.redirect('/heroes');
  });
}


deleteHero = function({params}, res){
  Hero.findByIdAndRemove(params.heroid, (err, hero)=>{
  if(err){ return res.send({ error: err }); }
  res.redirect('/heroes');
  });
}
getupdateForm = function({params}, res){
  Hero.findById(params.heroid, (err, hero)=>{
  if(err){ return res.send({ error: err }); }
  Squad.find((err, squads) =>{
    res.render("update-hero", { title: "Update Hero", hero: hero, squads: squads });
    });
  });
}

updateForm = function({params, body}, res){
  Hero.findById(params.heroid, (err, hero)=>{
  if(err){ return res.send({ error: err }); }

  hero.name = body.name;
  hero.description = body.desc;
  hero.origin = body.origin;
  hero.stats.strength = body.strength;
  hero.stats.perception = body.perception;
  hero.stats.endurance = body.endurance;
  hero.stats.charisma = body.charisma;
  hero.stats.intelligence = body.intelligence;
  hero.stats.agility = body.agility;
  hero.stats.luck = body.luck;

  hero.squad = undefined;
  body.squad && (hero.squad = body.squad);

  hero.save((err, updatedhero) =>{
    if(err){ return res.send({ error: err }); }
    res.redirect("/heroes");
    });
  });
}

reset = function(req, res){
  Hero.deleteMany({}, (err, info) => {
      if(err){ return res.send({ error: err }); }
      Hero.insertMany(heroData, (err, info) => {
        if(err){ return res.send({ error: err }); }
        res.redirect('/heroes');
      });
  });
}

getSquadsIndex = function(req, res){
  Squad.find({}, null, { lean: true}, (err, squads) =>{
    if(err){ return res.send({ error: err }); }
    Hero.find({squad: { $exists: true } }, "name stats squad", {lean: true},(err, heroes)=>{
      if(err) { return res.send({ error: err }); }
      for(let i=0; i<squads.length; i++){
        squads[i].heroes = [];
        for(let j = 0; j<heroes.length;j++){
          if(heroes[j].squad === squads[i].name){
            heroes[j].overall = getOverall(heroes[j]);
            squads[i].heroes.push(heroes[j]);
            heroes.splice(j,1);
            j--;
          }
        }
      }
      res.render("squads", { title: "Super Squads", squads: squads});
    });
  });
}

getSquadsForm = function(req, res){
  res.render("create-squad", { title: "Create A Squad" });
}


createSquad = function({body}, res){
  let squad = { name: body.name }

  squad.hq = body.hq?body.hq : "Unknown";
  Squad.create(squad, (err, squad) =>{
    console.log("Created New Squad");
    console.log(squad);
  });
  Squad.find({}, (err, squad) => {
     console.log(squad); 
  });
}

deleteSquad = function({params}, res){
  Squad.findByIdAndRemove(params.squadid, (err, squad) =>{
    if(err) { return  res.send({error: err}); }

    Hero.find({squad: { $exists: true }}, "squad", {}, (err, heroes)=>{
      if(err) { return  res.send({error: err}); }
      for(hero of heroes){
        if(hero.squad == squad.name){
          let promises = [];

          hero.squad = undefined;

          let promise = new Promise(function(resolve, reject){

          })
          hero.save((err)=>{
            if(err) { return  res.send({error: err}); }
              console.log("UPDATED HERO BECAUSE SQUAD GOT DELETED");
          });
        }
      }


      Promise.all(promises).then(function() {
        res.redirect("/squads");
      })
    });
  });
}


module.exports = {
    getIndex,
    getHeroesIndex,
    getHeroesForms,
    createNewHero,
    deleteHero,
    getupdateForm,
    updateForm,
    reset,
    getSquadsIndex,
    getSquadsForm,
    createSquad,
    deleteSquad
};
