function init() {
    // function to generate bar chart
    function barChart(dataset) {
        var w = 900;
        var h = 650;
        var padding = 75;

        // define country flags for tooltip
        const countryFlags = {
            'France': '🇫🇷',
            'Luxembourg': '🇱🇺',
            'Austria': '🇦🇹',
            'Ireland': '🇮🇪',
            'Hungary': '🇭🇺',
            'Germany': '🇩🇪',
            'Lithuania': '🇱🇹',
            'Czech Republic': '🇨🇿',
            'Portugal': '🇵🇹',
            'Denmark': '🇩🇰',
            'Average OECD': '🌐'
        };

        var countries = dataset.map(d => d.country);    // generate bar chart labels
        var data = dataset.map(d => d.alcohol_value);   // retrieve y-axis data

        // Set #bar element to SVG element
        var svg = d3.select("#bar")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // Generate Color Scale
        var colorScale = d3.scaleSequential()
            .domain([d3.min(data), d3.max(data)]) // Set domain to range of data values
            .interpolator(d3.interpolateBlues);

        // Generate Band Scale for X-Axis
        var xScale = d3.scaleBand()
            .domain(countries)
            .rangeRound([padding, w - padding])
            .paddingInner(0.05);

        // Generate Linear Scale for Y-Axis
        var max = Math.ceil(d3.max(data)); // Round up to the nearest number for the y-axis
        var yScale = d3.scaleLinear()
            .domain([0, max])
            .range([h - padding, padding]);


        /*
        * Draw Gridlines for the Bar Chart
        * Gridlines: Horizontal lines to represent the y-axis values
       */
        var gridlines = d3.axisLeft()
            .scale(yScale)
            .ticks(10) // Set the number of ticks
            .tickSize(-w + 2 * padding)
            .tickFormat("");

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + padding + ",0)")
            .call(gridlines)
            .style ("stroke-dasharray", ("5, 5"))
            .style ("color", "#A1A1A1");

        /*
        * Section: Drawing bars for the bar chart
        * Tooltip Display: Added to the bars to display the country's flag and alcohol consumption
        * OECD Average: Highlighted with a different color
        * Onload Animation: Cascading effect for the bars
        */

        const oecdColor = "#7bccc4"; // define color for OECD average
        const tooltip = d3.select("#bar").append("div") // Create a tooltip for the bar chart
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", (d, i) => xScale(d.country))
            .attr("y", d => h - padding)
            .attr("width", xScale.bandwidth() * 0.8)
            .attr("height", 0)
            .attr("fill", d => d.country === "Average OECD" ? oecdColor : colorScale(d.alcohol_value))  // Set OECD average color
            // Mouseover Event: Change color to a lighter shade
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("fill", "#cadef0");
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`<div id="tooltip-title"> ${countryFlags[d.country]} ${d.country}</div>
                <p>${d.alcohol_value} Litres per person</p>
                `)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 70) + "px")
                    .style("font-size", "16px");
            })
            // Mouseout Event: Set the color back to the original color
            .on("mouseout", function(event, d) {
                d3.select(this)
                    // Check if the country is OECD average
                    .attr("fill", d.country === "Average OECD" ? oecdColor : colorScale(d.alcohol_value));  // Revert to the original color
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            // Onload Animation for bar chart - Transition effect
            // Draw each line with a delay of 100ms - Create a cascading effect
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => yScale(d.alcohol_value))
            .attr("height", d => h - padding - yScale(d.alcohol_value));


        /*
        * Create the X-Axis & Y-Axis
        * X-Axis: Country Names
        * Y-Axis: Alcohol Consumption
       */
        var xAxis = d3.axisBottom()
            .scale(xScale);

        // define y-axis
        var yAxis = d3.axisLeft()
            .ticks(15)
            .scale(yScale)
            .tickFormat(d3.format(".1f")); // format ticks to 1 decimal place

        // Draw X-Axis on barchart
        svg.append("g")
            .attr("transform", "translate(0, " + (h - padding) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)")
            .style("font-size", "12px");

        // Draw X-Axis Label [Country]
        svg.append("text")
            .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 20) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "Source Sans Pro")
            .text("Country");

        // Draw Y-Axis on
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis)
            .selectAll("text")
            .style("font-size", "12px")
            .style("font-family", "Source Sans Pro");

        // Draw Y-Axis Label [Alcohol Consumption]
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", padding / 10)
            .attr("x", -h / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "Source Sans Pro")
            .text("Alcohol Consumption (in litres per person)");

        // Add Title to the Bar Chart - Top 10 OECD Nations in Average Alcohol Consumption between (1995 - 2020)
        svg.append("text")
            .attr("x", w / 20)
            .attr("y", padding / 2)
            .attr("text-anchor", "start")
            .style("font-size", "24px")
            .style("font-family", "Playfair Display")
            .text("Top 10 OECD Nations in Average Alcohol Consumption between (1995 - 2020)");
    }

    // Read Data from assets/alcohol_top10.csv File
    d3.csv("assets/alcohol_top10.csv", function (d) {
        return {
            // Parse: Country, Alcohol Value
            country: d.Country,
            alcohol_value: +d['Value']
        }
    }).then(function (data) {
        barChart(data) // Call barChart function
    })
}

window.onload = init;
