function counts(arr) {
    const count = {};
    arr.forEach(function(i) {
        count[i] = (count[i] || 0) + 1;
    });

    return count
}

class K4ICharts {
    constructor(sheet_url, options) {
        this.url = sheet_url;

        options = options || {};
        this.options = options;
        this.options.backgroundColor = options.backgroundColor || ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff6345','#36a2gh'];
        this.options.personalColor = options.personalColor || '#800080';
        this.options.greyColor = options.greyColor || '#ababab';
        this.options.legendDisplay = options.legendDisplay || false;
        this.options.title = options.title || "";
        this.options.titleDisplay = options.titleDisplay || true;
    }

    async loadData() {
        const response = await fetch(this.url);
        if (response.ok) {
            this.data = await response.json();
        } else {
            throw Error(response.statusText);
        }

        this.individualResult = this.data.slice(-1)[0]
    }

    get numResponses() {
        return this.data.length;
    }

    extractData(col) {
        const arr = []
        for (let i in this.data) {
            arr.push(this.data[i][col]);
        }
        
        const count = counts(arr)

        return count;
    }

    createPersonalChart(containerId, colName, chartType, options) {
        var options = options || {}
        const count = this.extractData(colName);
        const backgroundColor = Object.keys(count).map(k => {
            const personalValue = this.individualResult[colName];
            if (k == personalValue) {
                return this.options.personalColor;
            }

            return this.options.greyColor;
        })

        options.backgroundColor = backgroundColor;
        options = {...this.options, ...options}

        return this.createChart(containerId, colName, chartType, options)
    }

    createChart(containerId, colName, chartType, options) {
        var options = options || this.options;

        const el = document.getElementById(containerId);
        const ctx = el.getContext('2d');
        const count = this.extractData(colName);

        const chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: Object.keys(count),
                datasets: [{
                    backgroundColor: options.backgroundColor,
                    borderColor: 'white',
                    data: Object.values(count)
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: options.legendDisplay
                }
            }
        });
    }
}

