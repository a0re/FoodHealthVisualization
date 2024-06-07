function lineChart(dataset, country) {
    const w = 1200;
    const h = 750;
    var padding = 60;
    const yMax = 500;

    // var yMax = d3.max(dataset, function (d) {
    //     return Math.max(d.fat_supply, d.total_protein_supply, d.sugar_supply);
    // })

    // define svg to draw to div #chart
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    // padding for max y-axis value
    var yPadding = yMax * 0.1

    // setup scales
    var xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, function (d) {
                return d.year;
            }),
            d3.max(dataset, function (d) {
                return d.year;
            })
        ])
        .range([padding, w - padding])

    var yScale = d3.scaleLinear()
        .domain([0, yMax + yPadding])
        .range([h - padding, padding])


    // Generate Line Function - This is easier to scale and maintain than writing line 1-3 separately
    function generateLine(category) {
        return d3.line()
            .x(function (d) {
                return xScale(d.year);
            })
            .y(function (d) {
                return yScale(d[category]);
            });
    }

    // Generate lines for the 3 categories
    var lines = [
        {class: "line fat-supply", d: generateLine("fat_supply"), stroke: "#C15065", label: "Total Fat Supply"},
        {class: "line total-protein-supply", d: generateLine("total_protein_supply"), stroke: "#2C8465", label: "Total Protein Supply"},
        {class: "line sugar-supply", d: generateLine('sugar_supply'), stroke: "#6D3E91", label: "Total Sugar Supply"}
    ];

    lines.forEach(function (line) {
        var path = svg.append("path")
            .datum(dataset)
            .attr("class", line.class)
            .attr("d", line.d)
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", line.stroke);

        var label = svg.append("text")
            .attr("class", line.class + "-label")
            .style("fill", line.stroke)
            .attr("alignment-baseline", "middle");


        //  Add Text Label for each line
        svg.append("text")
            .attr("class", line.class + "-label")
            .style("fill", line.stroke)
            .attr("alignment-baseline", "middle");


        //Add animation to the lines
        var totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .tween("label", function() {
                var i = d3.interpolate(0, totalLength);
                return function(t) {
                    var point = path.node().getPointAtLength(i(t));
                    label
                        .attr("x", point.x + 20)
                        .attr("y", point.y - 20) // Subtract 20 to move the label up
                        .text(Math.round(yScale.invert(point.y)));
                };
            });
    });

    // Function to generate markers for categories - fat, protein, sugar
    // This function is better than writing the .dot 1 - 3 with same attributes
    function generateMarkers(category, color, classDot) {
        svg.selectAll("." + classDot)
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", classDot)
            .attr("cx", function (d) {
                return xScale(d.year);
            })
            .attr("cy", function (d) {
                return yScale(d[category]);
            })
            .attr("r", 4)
            .style("fill", color)
            .on("mouseover", function (event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 8);
                tooltip.transition().duration(200).style("opacity", .9)
            })
            .on("mouseout", function (d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 4);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .append("title")
            .text(function (d) {
                return `${category}\nYear: ${d.year_string}\nConsumption: ${d[category]}`
            });
    }

    // Generate markers for the 3 categories
    generateMarkers('fat_supply', '#C15065', 'dot1');
    generateMarkers('total_protein_supply', '#2C8465', 'dot2');
    generateMarkers('sugar_supply', '#6D3E91', 'dot3');


    // Function to generate gridlines & x-axis and y-axis
    function make_gridlines(axis, scale, ticks) {
        return axis(scale).ticks(ticks);
    }

    // Define gridlines for x-axis and y-axis
    const xAxisTranslate = "translate(0," + (h - padding) + ")";
    const yAxisTranslate = "translate(" + padding + ",0)";
    // Changing the number of ticks on x-axis and y-axis & Gridlines
    const xTicks = 5;       // Number of ticks on x-axis
    const yTicks = 10;      // Number of ticks on y-axis

    // Draw x-axis on svg
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(d3.axisBottom(xScale).ticks(xTicks));

    // Draw y-axis on svg
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .call(d3.axisLeft(yScale).ticks(yTicks));

    // Add x-axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w / 2)
        .attr("y", h - 10)
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -h / 6)
        .attr("y", 20)
        .attr("transform", "rotate(-90)")
        .style("font-size", "16px")
        .text("Consumption (measured in grams per capita per day)");

    // Draw gridlines on x-axis
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", xAxisTranslate)
        .call(make_gridlines(d3.axisBottom, xScale, xTicks)
            .tickSize(-h + 2 * padding)
            .tickFormat(""))
        .style("color", "#5B5B5B");

    // Draw gridlines on y-axis
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", yAxisTranslate)
        .call(make_gridlines(d3.axisLeft, yScale, yTicks)
            .tickSize(-w + 2 * padding)
            .tickFormat(""))
        .style("color", "#5B5B5B");


    // Creating a line element for displaying a vertical line on hover
    var hoverLine = svg.append("line")
        .style("stroke", "#000")        // Setting stroke color
        .style("stroke-width", "0.5px") // Setting stroke width
        .style("opacity", "0");         // Setting initial opacity

    // Creating a tooltip element
    var tooltip = d3.select("#chart").append("div")
        .attr("class", "tooltip")       // Setting class for styling
        .style("opacity", 0);           // Setting initial opacity

    // Event listener for mouse movement on the SVG element
    svg.on("mousemove", function (event) {
        // Extracting the year corresponding to the mouse position
        var year = xScale.invert(d3.pointer(event)[0]);

        // Bisecting the dataset to find the nearest data point to the hovered year
        var bisect = d3.bisector(function (d) {
            return d.year;
        }).left;

        var index = bisect(dataset, year);                  // Index of the nearest data point
        var d0 = dataset[index - 1];                        // Data point before the hovered year
        var d1 = dataset[index];                            // Data point after the hovered year
        var d = year - d0.year > d1.year - year ? d1 : d0;  // Selecting the closer data point

        // Updating position and opacity of the hover line
        hoverLine.attr("x1", xScale(d.year))
            .attr("y1", yScale(0))
            .attr("x2", xScale(d.year))
            .attr("y2", yScale(yMax + yPadding))
            .style("opacity", "1");

        // Transitioning and updating opacity of the tooltip
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);

        // Displaying line data in the tooltip: Year, Fat, Protein, Sugar
        tooltip.html(`<div id="tooltip-title"> Year: ${d.year.getFullYear()}</div>` + "<br/>"
            + `<span style="color: #C15065;">&#9632;</span> Fat: ${d.fat_supply} g/capita/day` + "<br/>"
            + `<span style="color: #2C8465;">&#9632;</span> Protein: ${d.total_protein_supply} g/capita/day` + "<br/>"
            + `<span style="color: #6D3E91;">&#9632;</span> Sugar: ${d.sugar_supply} g/capita/day`)
            .style("left", (d3.pointer(event)[0] + 25) + "px") // Positioning the tooltip horizontally
            .style("top", (d3.pointer(event)[1] - 10) + "px") // Positioning the tooltip vertically
            .style("font-family", "Roboto")
            .style("font-size", "16px");
    })
        // Mouseout - Hide the hover line and tooltip
        .on("mouseout", function () {
            hoverLine.style("opacity", "0");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // add title for chart
    svg.append("text")
        .attr("x", padding)
        .attr("y", padding / 1.2)
        .attr("text-anchor", "start")
        .style("font-size", "28px")
        .style("font-family", "Playfair Display")
        .text("Food Consumption Amongst OECD countries (1995 - 2020)");

    // define svg to draw the labels
    var svglabels = d3.select("#labels")
        .append("svg")
        .attr("width", 250)
        .attr("height", 200)
        .attr("class", "fade-in");

    // Add legend for the 3 categories
    var keys = ["Total Fat supply", "Total Protein supply", "Total Sugar supply"]

    // Add Country name
    svglabels.append("text")
        .attr("x", 5)
        .attr("y", 50)
        .attr("text-anchor", "start")
        .style("font-size", "20px")
        .style("font-family", "Playfair Display")
        .text("Country: " + country)

    // Add Measurement
    svglabels.append("text")
        .attr("x", 5)
        .attr("y", 75) // Adjust the y position to place it under the country name
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .style("font-family", "Roboto")
        .text("Measurement: g/capita/day");

    // Add dots for the legend
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(['#C15065', '#2C8465', '#6D3E91'])
    svglabels.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", 5)
        .attr("cy", function (d, i) {
            return 100 + i * 33
        })
        .attr("r", 4)
        .style("fill", function (d) {
            return color(d)
        })

    // Add one dot in the legend for each name.
    svglabels.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 10)
        .attr("y", function (d, i) {
            return 100 + i * 35
        })
        .style("fill", function (d) {
            return color(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "start")
        .style("font-size", "16px")
        .style("font-family", "Roboto");
}

function updatechart(value) {
    var country = value;
    d3.csv("assets/food_consumption_aggregated_countries.csv", function (d) {
        return {
            // generate object
            country: d.Country,
            year: new Date(+d.Year, 0),
            year_string: d.Year,
            fat_supply: +d['Total fat supply'],
            total_protein_supply: +d['Total protein supply'],
            sugar_supply: +d['Sugar supply']
        }
    }).then(function (data) {
        // Assign dataset globally
        dataset = data.filter(function (d) {
            return d.country === country;
        });

        // Remove existing SVG and labels
        d3.select("#chart").select("svg").remove();
        d3.select("#labels").select("svg").remove();

        // Call the function to generate the line chart with the updated dataset
        lineChart(dataset, country);
    });
}

// define state of chart when page is loaded
var value = "Average OECD";
updatechart(value)


