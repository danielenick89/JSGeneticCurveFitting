function GeneticEngineFactory() {

        var GeneticEngine = (function () {
                var POPULATION_SIZE = null;
                var CROSSOVER_PROBABILITY = null;
                var MUTATION_PROBABILITY = null;
                var ELITE_SELECTION_PROBABILITY = null;
                var PARENTS_NUMBER = null;
                var RANDOM_INIDIVIDUAL_RATE = null;

                var configured = false;

                var individualFactory = null;

                var population = [];

                var config = function (options) {
                        if (options.populationSize) {
                                POPULATION_SIZE = options.populationSize;
                        } else {
                                console.log('options.populationSize not set.');
                                return;
                        }

                        if (options.crossoverProbability) {
                                CROSSOVER_PROBABILITY = options.crossoverProbability;
                        } else {
                                console.log('options.crossoverProbability not set.');
                                return;
                        }

                        if (options.mutationProbability) {
                                MUTATION_PROBABILITY = options.mutationProbability;
                        } else {
                                console.log('options.mutationProbability not set.');
                                return;
                        }

                        if (options.eliteSelectionProbability) {
                                ELITE_SELECTION_PROBABILITY = options.eliteSelectionProbability;
                        } else {
                                console.log('options.eliteSelectionProbability not set.');
                                return;
                        }

                        if (options.tournamentSize) {
                                TOURNAMENT_SIZE = options.tournamentSize;
                        } else {
                                console.log('options.tournamentSize not set.');
                                return;
                        }

                        if (options.randomIndividualRate) {
                                RANDOM_INDIVIDUAL_RATE = options.randomIndividualRate;
                        } else {
                                console.log('options.randomIndividualRate not set.');
                                return;
                        }


                        configured = true;
                };

                var setIndividualFactory = function (ifact) {
                        individualFactory = ifact;
                };

                var init = function () {
                        //init random population
                        for (var i = 0; i < POPULATION_SIZE; i++) {
                                var ind = individualFactory.getRandomIndividual();
                                population.push({ individual: ind, fitness: individualFactory.calculateFitness(ind) });
                        }
                        return extractIndividuals(population);
                };

                var iterateGenerations = function (iterations, callback) {
                        for (var i = 0; i < iterations; i++) {
                                var ret = nextGeneration();
                        };
                        callback(ret);
                }

                var extractIndividuals = function (population) {
                        var individuals = [];
                        for (var i = 0; i < population.length; i++) {
                                individuals.push(population[i].individual);
                        }

                        return individuals;
                }

                var nextGeneration = function () {
                        //console.log( "population " + JSON.toString(population))
                        var children = []

                        for (var i = 0; i < POPULATION_SIZE / 2; i++) {

                                var individuals = [];

                                for (var j = 0; j < 2; j++) {
                                        //console.log("Starting tournament " +i +" " + j )
                                        if (Math.random() < RANDOM_INDIVIDUAL_RATE) {
                                                individuals.push({ individual: individualFactory.getRandomIndividual(), fitness: null });
                                        } else {
                                                individuals.push({ individual: makeTournament(TOURNAMENT_SIZE), fitness: null });
                                        }
                                }

                                if (Math.random() < CROSSOVER_PROBABILITY) {
                                        var rawIndividuals = individualFactory.crossover(individuals[0].individual, individuals[1].individual);
                                        individuals[0].individual = rawIndividuals[0];
                                        individuals[1].individual = rawIndividuals[1];
                                }


                                if (Math.random() < MUTATION_PROBABILITY) {
                                        individuals[0].individual = individualFactory.mutate(individuals[0].individual);
                                }

                                if (Math.random() < MUTATION_PROBABILITY) {
                                        individuals[1].individual = individualFactory.mutate(individuals[1].individual);
                                }

                                individuals[0].fitness = individualFactory.calculateFitness(individuals[0].individual);
                                individuals[1].fitness = individualFactory.calculateFitness(individuals[1].individual);

                                children.push(individuals[0]);
                                children.push(individuals[1]);
                                //console.log("Pushed " + individuals[0] + " and " + individuals[1])
                        };
                        children.sort(function (a, b) { return b.fitness - a.fitness });
                        population = children;
                        return extractIndividuals(children);
                };

                var makeTournament = function (n) { //makes a tournament and returns (via callback) the winner

                        //selecting the individuals for this tournament (popping the selected individuals from the population) //TODO: parameterize this

                        var tournamentPopulation = []
                        for (var i = 0; i < n; i++) {
                                var index = Math.floor(Math.random() * population.length)
                                tournamentPopulation.push({ individual: population[index], index: index });
                                //console.log(population)
                        }

                        tournamentPopulation.sort(function (a, b) { return a.individual.fitness - b.individual.fitness; });

                        var rand = Math.random();
                        var p = ELITE_SELECTION_PROBABILITY;
                        i = 1;
                        while (rand > p) {
                                p += p * Math.pow(1 - ELITE_SELECTION_PROBABILITY, i);
                                i++;
                                if (i == tournamentPopulation.length) {
                                        i = 1;
                                        break;
                                }
                        }
                        return tournamentPopulation[i - 1].individual.individual;
                };

                return {
                        config: config,
                        setIndividualFactory: setIndividualFactory,
                        init: init,
                        nextGeneration: nextGeneration,
                        iterateGenerations: iterateGenerations
                };
        })();


        return GeneticEngine;
}