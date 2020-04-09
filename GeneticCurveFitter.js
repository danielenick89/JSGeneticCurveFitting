
var GeneticCurveFitter = function (points, functionGenerator, N, options) {
    var maxX = null;
    var minX = null;
    var normalizedPoints = null;
    var population = null;
    var GeneticEngine = null;


    var init = function () {

        initOptions();

        var GOptions = {
            populationSize: 100,
            crossoverProbability: 1,
            mutationProbability: 1,
            eliteSelectionProbability: 0.8,
            tournamentSize: 3,
            randomIndividualRate: 0.1
        };

        var genomaFactory = ContinuosGenomaFactory({
            LENGTH: N,
            MUTATION_RATE: 0.005,
            MUTATION_RANGES: options.RANGES,
            FITNESS_FUNCTION: fitness
        });

        GeneticEngine = GeneticEngineFactory();
        GeneticEngine.config(GOptions);
        GeneticEngine.setIndividualFactory(genomaFactory);

        //normalizePointsX();

        var currentPopulation = GeneticEngine.init();
    }

    var normalizeX = function (x) {
        return 10 * (x - minX) / (maxX - minX);
    }

    var deNormalizeX = function (x) {
        return x / 10 * (maxX - minX) + minX;
    }

    var normalizePointsX = function () {
        normalizedPoints = [];
        var min = points[0].x;
        var max = points[0].x;

        for (var i = 0; i < points.length; i++) {
            if (points[i].x < min) min = points[i].x;
            if (points[i].x > max) max = points[i].x;
        }

        maxX = max;
        minX = min;


        for (var i = 0; i < points.length; i++) {
            normalizedPoints.push({ y: points[i].y, x: normalizeX(points[i].x) })
        }
    }


    var squaredError = function (a, b) {
        return (a - b) * (a - b);
    }

    var p = function (coeffs, x) {
        return functionGenerator(coeffs)(x);
    }

    var fitness = function (coeffs) {
        var err = 0;
        for (var i = 0; i < points.length; i++) {
            err += squaredError(points[i].y, p(coeffs, points[i].x));
        }

        return err;
    }

    var initOptions = function () {
        options = options || {};

        if (!options.RANGES) {
            var r = [];
            for (var i = 0; i < N; i++) {
                r.push([-1000, 1000]);
            }

            options.RANGES = r;
        }
    }


    var step = function (N) {
        N = N || 1;

        for (var i = 0; i < N; i++) {
            population = GeneticEngine.nextGeneration();
        }

    }

    var fit = function () {
        var last = null, delta;
        var MIN_ITERATIONS = 1000;
        var MAX_ITERATIONS = 100000;
        var STEP_ITERATIONS = 3000;

        step(MIN_ITERATIONS);

        var i = MIN_ITERATIONS;
        do {
            step(STEP_ITERATIONS);
            var curr = getCurrentFitness()
            if (last != null) {
                delta = last - curr;
            } else {
                delta = curr;
            }
            i += STEP_ITERATIONS;
            last = curr;
        } while (delta > 0 && i < MAX_ITERATIONS);
        console.log(i, delta, last)
        return getCurrentSolution();
    }

    var attachToDatasetMethod = function (fn) {
        fn.toDataset = function (xStart, xEnd, sampleCount) {
            var r = [];
            var step = (xEnd - xStart) / sampleCount;
            for (var i = 0; i < sampleCount; i++) {
                r.push({ x: xStart + i * step, y: fn(xStart + i * step) });
            }

            return r;
        }

        return fn;
    }

    var getCurrentSolution = function () {
        var fn = functionGenerator(population[population.length - 1]);
        return attachToDatasetMethod(fn);
    }

    var getCurrentFitness = function () {
        return fitness(population[population.length - 1]);
    }
    var getCurrentCoefficients = function () {
        return population[population.length - 1];
    }

    init();

    return {
        step: step,
        fit: fit,
        getCurrentSolution: getCurrentSolution,
        getCurrentFitness: getCurrentFitness,
        getCurrentCoefficients: getCurrentCoefficients
    }

};