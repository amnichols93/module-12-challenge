function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    });
    
    buildMetadata('940');
    buildCharts('940');
}

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
  
        PANEL.html("");
        PANEL.append("h6").text("ID: " + result.id);
        PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
        PANEL.append("h6").text("GENDER: " + result.gender);
        PANEL.append("h6").text("AGE: " + result.age);
        PANEL.append("h6").text("LOCATION: " + result.location);
        PANEL.append("h6").text("BBTYPE: " + result.bbtype);
        PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
}

function buildCharts(sample) {
    function buildBar(sample) {
        d3.json("samples.json").then((data) => {
            let sample_set = data.samples;
            let filtered_set = sample_set.filter(sampleObj => sampleObj.id == sample);
    
            let values_set = filtered_set[0].sample_values;
            let sorted_values = values_set.sort((a,b) => a - b);
            let topTenValues = sorted_values.slice(-10);
    
            let names_set = filtered_set[0].otu_ids;
            let topTenIDs = names_set.slice(-10);
            let IDnames = []
            topTenIDs.forEach(element => IDnames.push("OTU ID " + element));
    
            let labels_set = filtered_set[0].otu_labels;
            let topTenLabels = labels_set.slice(-10);
    
            var data = [{
                x: topTenValues,
                y: IDnames,
                type: "bar",
                orientation: 'h',
                text: topTenLabels
            }];
            var layout = {
                xaxis: { title: "OTU Values"},
            };
            Plotly.newPlot('bar', data, layout);
        });
    }
    
    function buildBubble(sample) {
        d3.json("samples.json").then((data) => {
            let sample_set = data.samples;
            let filtered_set = sample_set.filter(sampleObj => sampleObj.id == sample);
    
            let values_set = filtered_set[0].sample_values;
            let id_set = filtered_set[0].otu_ids;
            let labels_set = filtered_set[0].otu_labels;
    
            let bubblesize = []
            values_set.forEach(element => bubblesize.push(element * 0.75))
    
            var data = [{
                x: id_set,
                y: values_set,
                text: labels_set,
                mode: 'markers',
                marker: {
                  color: '#009688',
                  size: bubblesize,
                  opacity: 0.5
                }
            }];
              
            var layout = {
                xaxis: { title: "OTU ID"},
                showlegend: false,
                height: 600,
                width: 1200
            };
            Plotly.newPlot('bubble', data, layout);
        });
    }
    
    function buildGauge(sample) {
        d3.json("samples.json").then((data) => {
            var metadata = data.metadata;
            var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
            var result = resultArray[0];
            var guagevalue = result.wfreq;
    
            var gaugedata = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: guagevalue,
                    title: { text: "Belly Button Washing Frequency" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 10] },
                        bar: { color: "#FFC0CB" },
                        steps: [
                          { range: [0, 1], color: "#e0f2f1" },
                          { range: [1, 2], color: "#b2dfdb" },
                          { range: [2, 3], color: "#80cbc4" },
                          { range: [3, 4], color: "#4db6ac" },
                          { range: [4, 5], color: "#26a69a" },
                          { range: [5, 6], color: "#009688" },
                          { range: [6, 7], color: "#00897b" },
                          { range: [7, 8], color: "#00796b" },
                          { range: [8, 9], color: "#00695c" },
                          { range: [9, 10], color: "#004d40" }
                        ]
                    }
                }
            ];
            
            var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', gaugedata, layout);
        });
    }
    buildBar(sample);
    buildBubble(sample);
    buildGauge(sample);
}