class Player {
    constructor(playerId, name) {
        this.signature = Math.random();
        this.playerId = playerId;
        this.displayName = name;

        this.heroes = [];
        this.heroGemType = new Set();
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

    firstAliveHeroCouldReceiveMana(type) {
        const res = this.heroes.find(hero => hero.isAlive() && hero.couldTakeMana(type));
        return res;
    }

    clone() {
        const cloned = new Player(this.playerId, this.displayName);
        cloned.heroes = this.heroes.map(hero => hero.clone());
        cloned.heroGemType = new Set(Array.from(this.heroGemType));
        cloned.signature = this.signature;
        cloned.metrics = this.metrics;
        return cloned;
    }
}