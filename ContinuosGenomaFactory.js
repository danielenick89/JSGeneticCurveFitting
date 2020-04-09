var ContinuosGenomaFactory = function (options) {
    var LENGTH = options.LENGTH;
    var MUTATION_RATE = options.MUTATION_RATE;
    var FITNESS_FUNCTION = options.FITNESS_FUNCTION;
    var MUTATION_RANGES = options.MUTATION_RANGES;

    var getRandomIndividual = function () {
        var individual = [];
        for (var i = 0; i < LENGTH; i++) {
            individual.push(Math.random() * (MUTATION_RANGES[i][1] - MUTATION_RANGES[i][0]) + MUTATION_RANGES[i][0]);
        }
        return individual;
    };

    var calculateFitness = FITNESS_FUNCTION;

    var mutate = function (individual) { //don't touch the source!
        var individual_mutated = []

        for (var i = 0; i < LENGTH; i++) {
            if (Math.random() < MUTATION_RATE) {
                individual_mutated.push(Math.random() * (MUTATION_RANGES[i][1] - MUTATION_RANGES[i][0]) + MUTATION_RANGES[i][0]);
            } else {
                individual_mutated.push(individual[i]);
            }
        }

        return individual_mutated;
    };

    var crossover = function (individual1, individual2) {//don't touch the source!
        var individuals_crossed = [[], []];

        for (var i = 0; i < LENGTH; i++) {
            var beta = Math.random();
            individuals_crossed[0].push(individual1[i] * beta + individual2[i] * (1 - beta));
            individuals_crossed[1].push(individual1[i] * (1 - beta) + individual2[i] * (beta))
        }


        return individuals_crossed;
    };

    return {
        LENGTH: LENGTH,
        getRandomIndividual: getRandomIndividual,
        calculateFitness: calculateFitness,
        crossover: crossover,
        mutate: mutate
    };
}