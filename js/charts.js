async function loadData(url, colName) {
    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        const arr = [];
        for (let i in json) {
            arr.push(json[i][colName]);
        }
        const unique = Array.from(new Set(arr));
        const count = {};
        arr.forEach(function(i) {
            count[i] = (count[i] || 0) + 1;
        });

        return {
            labels: unique,
            counts: count
        }
    } else {
        console.error("Network error")
        console.log(response)
    }
};

function createChart(el, unique, count, chartName, chartType) {
    var arr = [];
    var ctx = el.getContext('2d');

    for (var i in unique) {
        var x = unique[i];
        arr.push(count[x]);
    }
   

    var chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: [...unique],
            datasets: [{
                label: chartName,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff6345','#36a2gh'],
                borderColor: 'white',
                data: arr
            }]
        },

        // Configuration options go here
        options: {}
    });
}

