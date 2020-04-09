
function represent(points, fn) {

    var M = 1000;
    var start = points[0].x;
    var end = points[points.length - 1].x
    var ddd = fn.toDataset(start, start + (end - start) * 2, M)

    var options = {};

    var chartData = {
        datasets: [{
            type: "scatter",
            label: "Points to fit",
            data: points,
            showLine: false,
            backgroundColor: 'red'
        }, {
            type: 'line',
            label: 'Line Dataset 1',
            data: ddd,
            fill: false,
            backgroundColor: 'blue'
        }]
    };

    var ctx = document.getElementById("graph").getContext("2d");

    if (!window.myChart) {
        window.myChart = Chart.Scatter(ctx, {
            data: chartData,
            options: options
        });
    } else {
        window.myChart.data = chartData;
        window.myChart.update();
    }


}

function getRandomPoints(n) {
    var ret = [];
    var last = 0;
    for (var i = 0; i < n; i++) {
        ret.push({ x: i, y: last + (0.5 - Math.random()) })
        last = ret[ret.length - 1].y;
    }

    return ret;
}



//polynomial

var getFunctionFromCoeffs = function (coeffs) {
    return function (x) {
        var tot = 0;

        for (var i = 0; i < coeffs.length; i++) {
            tot += coeffs[i] * Math.pow(x, i);
        }

        return tot;
    }
}

var getExp = function (coeff) {
    return function (x) {
        return coeff[0] * Math.exp(coeff[1] * x);
    }
}


var getGauss = function (coeff) {
    return function (x) {
        return coeff[0] * Math.exp(-((x - coeff[1]) * (x - coeff[1])) / (2 * coeff[2] * coeff[2]));
    }
}

var TIMEOUT = 800;


function step() {

    //cf.step()
    cf.fit()

    var f = cf.getCurrentSolution()
    var coeff = cf.getCurrentCoefficients()
    var fit = cf.getCurrentFitness();
    document.getElementById('fit').innerHTML = fit;
    represent(points, f);
    console.log(coeff)

    //setTimeout(step, TIMEOUT);
}

function init(points) {

}


function go() {
    init();
    setTimeout(step, TIMEOUT);
}


var dataset = [{ "x": 1582588800000, "y": 3 }, { "x": 1582675200000, "y": 2 }, { "x": 1582761600000, "y": 5 }, { "x": 1582848000000, "y": 4 }, { "x": 1582934400000, "y": 8 }, { "x": 1583020800000, "y": 5 }, { "x": 1583107200000, "y": 18 }, { "x": 1583193600000, "y": 27 }, { "x": 1583280000000, "y": 28 }, { "x": 1583366400000, "y": 41 }, { "x": 1583452800000, "y": 49 }, { "x": 1583539200000, "y": 36 }, { "x": 1583625600000, "y": 133 }, { "x": 1583712000000, "y": 97 }, { "x": 1583798400000, "y": 168 }, { "x": 1583884800000, "y": 196 }, { "x": 1584057600000, "y": 219.5 }, { "x": 1584144000000, "y": 175 }, { "x": 1584316800000, "y": 358.5 }, { "x": 1584403200000, "y": 345 }, { "x": 1584489600000, "y": 475 }, { "x": 1584576000000, "y": 427 }, { "x": 1584662400000, "y": 627 }, { "x": 1584748800000, "y": 793 }, { "x": 1584835200000, "y": 651 }, { "x": 1584921600000, "y": 601 }, { "x": 1585008000000, "y": 743 }, { "x": 1585094400000, "y": 683 }, { "x": 1585180800000, "y": 712 }, { "x": 1585267200000, "y": 919 }, { "x": 1585353600000, "y": 889 }, { "x": 1585440000000, "y": 756 }, { "x": 1585526400000, "y": 812 }, { "x": 1585612800000, "y": 837 }, { "x": 1585699200000, "y": 727 }, { "x": 1585785600000, "y": 760 }, { "x": 1585872000000, "y": 766 }, { "x": 1585958400000, "y": 681 }, { "x": 1586044800000, "y": 525 }];
dataset = dataset.map(function (e) { return { y: e.y, x: e.x } })
var points = dataset; //getRandomPoints(100);

var cf = GeneticCurveFitter(points, getGauss, 3, {
    RANGES: [
        [1, 2000],
        [1580000000000, 1590000000000],
        [10000000, 1000000000]
    ]
});