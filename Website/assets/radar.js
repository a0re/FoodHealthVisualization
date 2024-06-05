// Load the JSON data from the specified file path
d3.json("assets/foodConsumption.json").then(data => {
    let selectedYears = [];             // Array to store the selected years
    let transformedData = transformData(data); // Transform the raw data into a suitable format for the radar chart
    init([transformedData[0]]);     // Initialize the radar chart with the data of the first year
    createYearSelect(transformedData);   // Create the year select input

    /*
     * Purpose: Update the radar chart based on the selected years
     * Parameters: selectedYears - List of selected years
     * Clear existing radar chart
     * Re-render the radar chart with the selected data
    */
    function updateRadarChart(selectedYears) {
        // Retrieve the data for the selected years
        let selectedData = selectedYears.map(year =>
            transformedData.find(d => d.Year === parseInt(year))
        );
        d3.select("#radar").select("svg").remove(); // Clear existing radar chart
        init(selectedData);                         // Initialize the radar chart with the selected data
    }


    /*
     * Purpose: Create a select input for choosing the year
     * Parameters: data - Transformed data for the radar chart
     * Extract the list of years from the transformed data
    */
    function createYearSelect(data) {
        let years = data.map(d => d.Year);
        let selectContainer = d3.select("#year-select-container");

        selectContainer.append("label")
            .text("Choose Years: ");
        for (let i = 0; i < 3; i++) {
            let select = selectContainer.append("select")
                .attr("id", `year-select-${i}`)
                .attr("class", "block appearance-none w-32 text-black bg-white border border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline")
                .on("change", function () {
                    let selectedYear = d3.select(this).property("value");
                    if (!selectedYears.includes(selectedYear)) {
                        selectedYears.push(selectedYear); // Push the selected year directly
                        updateRadarChart(selectedYears);
                    } else {
                        alert("Year already selected in another select!");
                        d3.select(this).property("value", "");
                    }
                });

            select.append("option")
                .attr("value", "")
                .text("Select Year");

            select.selectAll("option.year-option")
                .data(years)
                .enter().append("option")
                .attr("value", d => d)
                .text(d => d)
                .attr("class", "year-option")
                .style("color", "black");
        }
    }
});

/*
 * Purpose: Transform the raw data into a format suitable for the radar chart
 * e.g.
 * Format Output: {Year: 2013, Total Fat Supply: 100, Total Protein Supply: 200, Total Sugar Supply: 300}
 * Create an array of objects where each object represents data for a specific year
*/
function transformData(data) {
    // Extract the list of years from the data of the first variable
    let years = data[0].data.map(d => d.Year);

    // Create an array of objects where each object represents data for a specific year
    let transformedData = years.map(year => {
        let entry = {Year: year}; // Create an entry object with the year
        // Loop through each variable and add the total value for the current year to the entry object
        data.forEach(variable => {
            // Find the total value for the current year for this variable
            let value = variable.data.find(d => d.Year === year)["Total value"];
            entry[variable.Variable] = value;
        });
        return entry;
    });
    return transformedData;
}

// Initialize the radar chart
function init(data) {
    // Define the Labels for the Radar Chart using the original variable names
    const features = ["Total Fat Supply", "Total Protein Supply", "Total Sugar Supply"];
    const width = 950;
    const height = 600;
    const radius = width / 2 - 250; // Radius of the controls the size of the radar chart
    const maxValue = 6000;
    let tickInterval = 750;         // Tick interval for the radar chart
    let ticks = d3.range(0, maxValue + tickInterval, tickInterval); // Generate ticks from 0 to maxValue at the specified interval
    let line = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveCardinalClosed.tension(0.2));        // Create a line for the radar chart, d3.curveCardinalClosed.tension to create a smooth curve
    let colors = ["#1f77b4", "#2ca02c", "#d62728"]; // Color Palette for the Radar Chart

    // Create a tooltip for displaying the feature value
    var tooltip = d3.select("#radar").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Create the SVG element for the radar chart
    var svg = d3.select("#radar")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a linear scale to map the tick values to the radius of the radar chart
    var radialScale = d3.scaleSequential()
        .domain([0, maxValue])
        .range([0, radius]);

    /*
     * Purpose: Create a radial gradient for the radar chart
     * Control Position of circle and radius: cx, cy
     * Stroke: Line color, width
     * Radius: Control the size of the circle based on the tick value (d)
    */
    svg.selectAll("circle")
        .data(ticks)
        .join(enter => enter.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr('fill', 'none')
            .attr("stroke", "gray")
            .attr("stroke-width", 1.3)
            .attr("r", d => radialScale(d))
        );

    /*
     * Purpose: Create the labels for the ticks [e.g. 0, 1000, 2000, 3000, 4000, 5000, 6000]
     * Parameters: .ticklabel for the class of the text element
     * Control Position of the text: x, y
    */
    svg.selectAll(".ticklabel")
        .data(ticks)
        .enter()
        .append("text")
        .attr("class", "ticklabel")
        .attr("x", width / 2 + 5)                        // Control offset by adding (+5)
        .attr("y", d => height / 2 - radialScale(d) - 3) // Control offset by subtracting (-3)
        .text(d => d.toFixed());

    /*
     * Purpose: Create the labels and lines for each feature
     * Angle to coordinate: Convert the angle to coordinates
     * x & y: Control the position of the text
    */
    function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": width / 2 + x, "y": height / 2 - y};
    }

    /*
     * Purpose: Create the labels & lines for each feature
     * Line_coord: Controls length of the line to the feature
     * Label_coord: Controls the position of the label
     * Angle to coordinate: Convert the angle to coordinates
    */
    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            "feature": f,
            "value": angle,
            "line_coord": angleToCoordinate(angle, maxValue), // Control the length of featured lines
            "label_coord": angleToCoordinate(angle, maxValue * 1.16) // Control the distance of the labels from the center
        };
    });

    /*
     * Create the lines for each feature
     * x1, y1: Control the starting position of the line
     * x2, y2: Control the ending position of the line
     * stroke, stroke-width: Control the color and width of the line
    */
    svg.selectAll("line")
        .data(featureData)
        .enter()
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", d => d.line_coord.x)
        .attr("y2", d => d.line_coord.y)
        .attr("stroke", "grey")
        .attr("stroke-width", 1.8);

    /*
     * Create the labels for each feature
     * x & y: Control the position of the text
     * d: Data for the text element
     * text: Feature name
    */
    svg.selectAll(".axislabel")
        .data(featureData)
        .enter()
        .append("text")
        .attr("class", "axislabel")
        .attr("x", d => d.label_coord.x * 1.18 - 150) // Control Offset by * 1.18 - 150
        .attr("y", d => d.label_coord.y) // Control Offset
        .text(d => d.feature);

    /*
     * Purpose: Get the coordinates for the path of a data point
     * for each feature, calculate the angle and convert it to coordinates
    */
    function getPathCoordinates(data_point) {
        let coordinates = [];
        // Loop through each feature and create the line
        for (let i = 0; i < features.length; i++) {
            let ft_name = features[i];                                          // Control the feature name
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);   // Control the angle of the features line
            let coord = angleToCoordinate(angle, data_point[ft_name]);
            coordinates.push({
                x: coord.x,
                y: coord.y,
                value: data_point[ft_name],
                year: data_point.Year,
                feature: ft_name
            });
        }
        return coordinates;
    }

    // Create a legend container inside the SVG element
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 150}, 30)`); // Adjust the position of the legend

    /*
     * Purpose: Loop through each data point and create the radar chart
     * Stroke, Stroke-Width, Fill, Opacity: Control the styling of the radar chart
     *
    */
    data.forEach((d, i) => {
        if (colors.length === 0) return; // Exit if no colors are left
        let randomIndex = Math.floor(Math.random() * colors.length);
        let randomColor = colors.splice(randomIndex, 1)[0];

        // Add legend item
        legend.append("g")
            .attr("class", "legend-item")
            .attr("transform", `translate(0, ${i * 20})`)
            .each(function() {
                d3.select(this).append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", randomColor);

                d3.select(this).append("text")
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .text(d.Year);
            });

        svg.append("path")
            .attr("d", line(getPathCoordinates(d)))
            .attr("stroke-width", 2)
            .attr("stroke-opacity", 1)
            .attr("stroke", randomColor)
            .attr("fill", randomColor)
            .attr("fill-opacity", 0.7)

                // Transition effect for the radar chart
                .on("mouseover", function (event, d) {
                    let selectedYears = data.map(d => d.Year);
                    d3.select(this).transition()
                        .duration(200)
                        .attr("fill-opacity", 0.1)
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);

                    // TODO: Display the data for all selected years in the tooltip and style it with their respective colors
                })
                .on("mouseout", function (d) {
                    d3.select(this).transition()
                        .duration(500)
                        .attr("fill-opacity", .7);
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                });

        /*
         * Purpose: Create dots for the data points
         * cx, cy: Control the position of the dots
         * r: Control the size of the dots
        */
        svg.selectAll(`.dot${i}`)
            .data(getPathCoordinates(d))
            .enter()
            .append("circle")
            .attr("class", `dot${i}`)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 4)
            .attr("fill", randomColor)
            .on("mouseover", function (event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 6);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                // Display the tooltip with the year and feature value
                tooltip.html(`<div id="tooltip-title"> <span style="color: ${randomColor};">&#9632;</span> ${d.year}</div>` +
                    `<div> ${d.feature}: ${d.value}</div>`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            // Transition effect for the dots
            .on("mouseout", function (d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 4);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
    });
}
