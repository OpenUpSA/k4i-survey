function counts(arr) {
    const count = {};
    arr.forEach(function(i) {
        count[i] = (count[i] || 0) + 1;
    });

    return count
}

var myvar;
class K4ICharts {
    constructor(sheet_url, options) {
        this.url = sheet_url;

        options = {...(options || {})};
        this.options = options;
        this.options.backgroundColor = options.backgroundColor || ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff6345','#36a2gh', '#a6cee3', '#b2df8a', '#fb9a99', '#ff7f00', '#6a3d9a', '#b15928'  ];
        this.options.personalColor = options.personalColor || '#800080';
        this.options.decimalPlaces = options.decimalPlaces || 3;
        this.options.greyColor = options.greyColor || '#ababab';
        this.options.legendDisplay = options.legendDisplay || false;
        this.options.title = options.title || "";
        this.options.titleDisplay = options.titleDisplay || true;
        this.options.maxLabelLength = options.maxLabelLength || 20;
        this.options.showMultiPersonal = options.showMultiPersonal || false;
        this.options.scales = {...(options.scales || {})}
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
    
    calculateAverageWithMapping(col, mapping) {
        const counts = this.extractData(col);
        let numObs = 0;
        let total = 0;
        for (const [k, v] of Object.entries(counts)) {
            numObs += v;
            let asNum = mapping[k] || 0;
            total += asNum * v;
        }

        if (numObs > 0)
            return (total / numObs).toFixed(this.options.decimalPlaces);

        return 0;
    }

    createMultiBarChart(containerId, colNames, mapping, options) {
        const el = document.getElementById(containerId);
        const ctx = el.getContext('2d');
        const self = this;
        const customOptions = {...this.options, ...(options || {})};
        const individualBarConfig = {
            ...{width: 3, color: this.options.personalColor},
            ...customOptions.individualBar
        }
        const individualBar = customOptions.individualBar || 3;

        let values = colNames.map(colName => {
            return this.calculateAverageWithMapping(colName, mapping);
        })

        const domain = {
            min: Math.min(...Object.values(mapping)),
            max: Math.max(...Object.values(mapping))
        }

        const barWidth = customOptions.individualValue

            
        const scale = (rangeMin, rangeMax, domainMin, domainMax) => {
            return function(value) {
                const perc = value / (domainMax - domainMin)
                const rangeValue = (rangeMax - rangeMin) * perc + rangeMin;
                return rangeValue;
            }
        }

        customOptions.scales = {...this.options, ...{
            xAxes: [{
                ticks: {
                    min: domain.min,
                    max: domain.max,
                }
            }],
            yAxes: [{
                ticks: {
                    callback: value => {
                        console.log(value);
                        const l = value.length;
                        const maxLength = this.options.maxLabelLength;
                        if (l > maxLength)
                            return value.substr(0, maxLength) + '...'
                        else
                            return value
                    }
                }
            }]
        }}

        if (this.options.showMultiPersonal) {
            var originalDraw = Chart.controllers.horizontalBar.prototype.draw;
            Chart.controllers.horizontalBar.prototype.draw = function (ease) {
                const xAxis = this.chart.controller.boxes[1];
                const yAxis = this.chart.controller.boxes[2];
                const ctx = this.chart.chart.ctx;
                const barTop = bar => bar._view.y - bar._view.height / 2;
                const barBottom = bar => bar._view.y + bar._view.height / 2;
                const barLabel = bar => bar._view.label;
                
                const xScale = scale(xAxis.left, xAxis.right, domain.min, domain.max);
                
                originalDraw.call(this, ease);

                myvar = this.chart.getDatasetMeta(0);

                this.chart.getDatasetMeta(0).data.forEach(bar => {
                    const individualValue = mapping[self.individualResult[barLabel(bar)]];
                    const xValue = xScale(individualValue);
                    ctx.beginPath();
                    ctx.strokeStyle = individualBarConfig.color;
                    ctx.lineWidth = individualBarConfig.width;
                    ctx.moveTo(xValue, barTop(bar));
                    ctx.lineTo(xValue, barBottom(bar));
                    ctx.stroke();
                })
            };
        }
        
        const chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: colNames,
                datasets: [{
                    backgroundColor: customOptions.backgroundColor,
                    borderColor: 'white',
                    data: values
                }],
            },
            options: customOptions
        });
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

