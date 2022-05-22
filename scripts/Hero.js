const HeroIdEnum = {
    THUNDER_GOD: 0, // Zues deal aoe = attack + light gems
    MONK: 1, // Orthur +5 damge to all 
    AIR_SPIRIT: 2, // Nefia deal damge and remove selected gem type 
    SEA_GOD: 3, // Magni + attack and health to 1
    MERMAID: 4, // Poko
    SEA_SPIRIT: 'SEA_SPIRIT', // Terra 
    FIRE_SPIRIT: 6, // Sigmund  deal damge base on enemy attack + red gems
    CERBERUS: 7, //Cerberus deal dame = attack + increase self attack
    DISPATER: 8, //Fate
    ELIZAH: 9, // ELIZAH
    TALOS: 10,
    MONKEY: 11,
    GUTS: 12,

    SKELETON: 100, // Skeleton
    SPIDER: 101,
    WOLF: 102,
    BAT: 103,
    BERSERKER: 104,
    SNAKE: 105,
    GIANT_SNAKE: 106
};

class Hero {
    constructor(objHero) {
        this.objHero = objHero;
        this.playerId = objHero.getInt("playerId");
        this.id = objHero.getUtfString("id");
        //this.name = id.name();
        this.attack = objHero.getInt("attack");
        this.hp = objHero.getInt("hp");
        this.mana = objHero.getInt("mana");
        this.maxMana = objHero.getInt("maxMana");

        this.gemTypes = [];
        this.gems = [];
        let arrGemTypes = objHero.getSFSArray("gemTypes");
        for (let i = 0; i < arrGemTypes.size(); i++) {
            const gemName = arrGemTypes.getUtfString(i);
            this.gemTypes.push(gemName);
            this.gems.push(GemType[gemName]);
        }
    }

    updateHero(objHero, team) {
        let botTurn = isBotTurn()
        let botTeam = team === 'BOT' ? true : false
        let change = false
        let attackChange = objHero.getInt("attack") - this.attack
        let hpChange = objHero.getInt("hp") - this.hp
        let manaChange = objHero.getInt("mana") - this.mana
        let fullMana = objHero.getInt("maxMana") - objHero.getInt("mana")
        if (attackChange != 0) {
            change = true
            if (botTeam) {
                pointBase += 0.1 * attackChange
            } else {
                pointBase -= 0.1 * attackChange
            }
        }

        if (hpChange != 0) {
            change = true
            if (botTeam) {
                if (botTurn) {
                    // bot turn to bot team
                    pointBase += 0.25 * hpChange
                } else {
                    // enemy turn to bot team
                    pointBase += 0.25 * hpChange

                    // dead
                    if (objHero.getInt("hp") == 0) {
                        pointBase -= 1.5
                    }
                }
            } else {
                if (botTurn) {
                    // bot turn to enemy team
                    pointBase -= 0.25 * hpChange

                    if (objHero.getInt("hp") == 0) {
                        pointBase += 1.5
                    }
                } else {
                    // enemy turn to enemy team
                    pointBase -= 0.25 * hpChange
                }
            }
        }

        if (manaChange != 0) {
            change = true
            if (botTeam) {
                pointBase += 0.3 * manaChange
                // get mana to full
                if (fullMana == 0) {
                    pointBase += 1.2
                }
            } else {
                pointBase -= 0.3 * manaChange
                // enemy get mana to full
                if (fullMana == 0) {
                    pointBase -= 1.2
                }
            }
        }
        pointBase = Math.floor(pointBase * 100) / 100

        this.attack = objHero.getInt("attack");
        this.hp = objHero.getInt("hp");
        this.mana = objHero.getInt("mana");
        this.maxMana = objHero.getInt("maxMana");
    }

    isAlive() {
        return this.hp > 0;
    }

    isFullMana() {
        return this.mana >= this.maxMana;
    }

    isHeroSelfSkill() {
        return HeroIdEnum.SEA_SPIRIT == this.id;
    }

    couldTakeMana(type) {
        return this.isAcceptManaType(type) && !this.isFullMana();
    }

    isAcceptManaType(type) {
        return this.gems.includes(type);
    }

    getMaxManaCouldTake() {
        return this.maxMana - this.mana;
    }

    takeDamge(damge) {
        this.hp = this.hp - damge;
    }

    takeMana(value) {
        this.mana += value;
    }

    buffAttack(additionalAttack) {
        this.attack += additionalAttack;
    }

    buffMana(additiionalMana) {
        this.mana += additiionalMana;
        this.mana = Math.max(this.mana, this.maxMana);
    }

    buffHp(additionalHp) {
        this.hp += additionalHp;
    }

    clone() {
        const cloned = new Hero(this.objHero);
        cloned.playerId = this.playerId;
        cloned.id = this.id;
        cloned.attack = this.attack;
        cloned.hp = this.hp;
        cloned.mana = this.mana;
        cloned.maxMana = this.maxMana;
        cloned.gemTypes = this.gemTypes;
        cloned.gems = this.gems;
        cloned.metrics = this.metrics;
        return cloned;
    }
}