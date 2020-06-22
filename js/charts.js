function counts(arr) {
    const count = {};
    arr.forEach(function(i) {
        count[i] = (count[i] || 0) + 1;
    });

    return count
}

class K4ICharts {
    constructor(sheet_url) {
        this.url = sheet_url;
    }

    async loadData() {
        const response = await fetch(this.url);
        if (response.ok) {
            this.data = await response.json();
        } else {
            throw Error(response.statusText);
        }
    }

    extractData(col) {
        const arr = []
        for (let i in this.data) {
            arr.push(this.data[i][col]);
        }
        
        const count = counts(arr)

        return count;
    }

    createChart(containerId, chartName, chartType) {
        const el = document.getElementById(containerId);
        const ctx = el.getContext('2d');
        const count = this.extractData(chartName);

        const chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: Object.keys(count),
                datasets: [{
                    label: chartName,
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff6345','#36a2gh'],
                    borderColor: 'white',
                    data: Object.values(count)
                }]
            },

            // Configuration options go here
            options: {}
        });
    }
}

