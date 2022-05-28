class Player {
    constructor(playerId, name) {
        this.signature = Math.random();
        this.playerId = playerId;
        this.displayName = name;

        this.heroes = [];
        this.heroGemType = new Set();
        this.heroGemType1 = new Set();
    }

    getTotalHeroAlive() {
        return this.getHerosAlive().length;
    }

    getHerosAlive() {
        return this.heroes.filter(hero => hero.isAlive());
    }


    getCastableHeros() {
        let arr = this.heroes.filter(hero => hero.isAlive() && hero.isFullMana());
        return arr;
    }

    sameOne(other) {
        return this.signature == other.signature;
    }

    isLose() {
        return !this.firstHeroAlive();
    }

    anyHeroFullMana() {
        let arr = this.heroes.filter(hero => hero.isAlive() && hero.isFullMana());

        let hero = arr != null && arr != undefined && arr.length > 0 ? arr[0] : null;
        return hero;
    }

    firstHeroAlive() {
        let arr = this.heroes.filter(hero => hero.isAlive());

        let hero = arr != null && arr != undefined && arr.length > 0 ? arr[0] : null;
        return hero;
    }

    getRecommendGemType() {
        this.heroGemType = new Set();

        for (let i = 0; i < this.getHerosAlive().length; i++) {
            let hero = this.getHerosAlive()[i];
            if (hero.isFullMana()) {
                continue;
            }

            for (let j = 0; j < hero.gemTypes.length; j++) {
                let gt = hero.gemTypes[j];
                this.heroGemType.add(GemType[gt]);
            }
        }

        this.heroGemType.add(GemType.SWORD)
        return this.heroGemType;
    }

    getRecommendGemType1() {
        this.heroGemType1 = new Set();
        let target1 = ['THUNDER_GOD', 'MERMAID', 'CERBERUS', 'SEA_GOD']
        let target2 = ['FIRE_SPIRIT', 'AIR_SPIRIT', 'DISPATER', 'FATE']
        let target3 = ['MONK', 'SEA_SPIRIT', 'ELIZAH', 'SKELETON']

        for (let i = 0; i < this.getHerosAlive().length; i++) {
            let hero = this.getHerosAlive()[i];

            if (hero.isFullMana()) {
                continue;
            }
            if (!(target1.indexOf(hero.id) != -1)) {
                //ton tai, !la ko tontai
                continue;
            }

            for (let j = 0; j < hero.gemTypes.length; j++) {
                let gt = hero.gemTypes[j];
                this.heroGemType1.add(GemType[gt]);
            }
        }

        return this.heroGemType1;
    }

    firstAliveHeroCouldReceiveMana(type) {
        const res = this.heroes.find(hero => hero.isAlive() && hero.couldTakeMana(type));
        return res;
    }

    clone() {
        const cloned = new Player(this.playerId, this.displayName);
        cloned.heroes = this.heroes.map(hero => hero.clone());
        cloned.heroGemType = new Set(Array.from(this.heroGemType));
        cloned.heroGemType1 = new Set(Array.from(this.heroGemType1));
        cloned.signature = this.signature;
        cloned.metrics = this.metrics;
        return cloned;
    }
}