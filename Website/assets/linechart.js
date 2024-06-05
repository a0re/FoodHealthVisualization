function lineChart(){
    var w = 600;
    var h = 500;
    var padding = 60;
    // generate maximum value
    var yMax = d3.max(dataset,function(d) { return Math.max(d.fat_supply,d.total_protein_supply,d.sugar_supply); })
    // padding for max y-axis value
    var yPadding = yMax * 0.1
    // setup scales
    xScale = d3.scaleTime()
               .domain([
                    d3.min(dataset,function(d) { return d.year; }),
                    d3.max(dataset,function(d) { return d.year; })
               ])
               .range([padding,w-padding])
    yScale = d3.scaleLinear()
               .domain([0,yMax + yPadding])
               .range([h-padding,padding])
    // generate lines for the 3 different categories
    line1 = d3.line()
             .x(function(d) { return xScale(d.year); })
             .y(function(d) { return yScale(d.fat_supply); })
    line2 = d3.line()
              .x(function(d) { return xScale(d.year); })
              .y(function(d) { return yScale(d.total_protein_supply); })
    line3 = d3.line()
              .x(function(d) { return xScale(d.year); })
              .y(function(d) { return yScale(d.sugar_supply); })
    
    // generate svg for chart
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
        // Add gridlines
        function make_x_gridlines() {       
            return d3.axisBottom(xScale)
                .ticks(5);
        }

        function make_y_gridlines() {       
            return d3.axisLeft(yScale)
                .ticks(10);
        }

        svg.append("g")            
            .attr("class", "grid")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(make_x_gridlines()
                .tickSize(-h + 2 * padding)
                .tickFormat(""));

        svg.append("g")            
            .attr("class", "grid")
            .attr("transform", "translate(" + padding + ",0)")
            .call(make_y_gridlines()
                .tickSize(-w + 2 * padding)
                .tickFormat(""));
        
        svg.append("path")
            .datum(dataset)
            .attr("class","line fat-supply")
            .attr("d",line1)
        
        svg.append("path")
           .datum(dataset)
           .attr("class","line total-protein-supply")
           .attr("d",line2)
           
        
        svg.append("path")
           .datum(dataset)
           .attr("class","line sugar-supply")
           .attr("d",line3)
        
        // Add markers for line1
        svg.selectAll(".dot1")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot1")
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.fat_supply); })
        .attr("r", 3)
        .style("fill", "blue")
        // mouseover effect
        .on("mouseover", function(event, d) {
            d3.select(this).transition()
                .duration(200)
                .attr("r", 6);
            tooltip.transition().duration(200).style("opacity", .9);
        })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .duration(200)
                .attr("r", 3);
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .append("title")
        .text(function(d){
            return `Total fat supply\nYear: ${d.year_string}\nConsumption: ${d.fat_supply}`
        })

        // Add markers for line2
        svg.selectAll(".dot2")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot2")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.total_protein_supply); })
            .attr("r", 3)
            .style("fill", "black")
            // mouseover effect
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 6);
                tooltip.transition().duration(200).style("opacity", .9);
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 3);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .append("title")
            .text(function(d){
                return `Total protein supply\nYear: ${d.year_string}\nConsumption: ${d.total_protein_supply}`
            });

        // Add markers for line3
        svg.selectAll(".dot3")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot3")
            .attr("cx", function(d) { return xScale(d.year); })
            .attr("cy", function(d) { return yScale(d.sugar_supply); })
            .attr("r", 3)
            .style("fill", "green")
            // mouseover effect
            .on("mouseover", function(event, d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 6);
                tooltip.transition().duration(200).style("opacity", .9);
            })
            .on("mouseout", function(d) {
                d3.select(this).transition()
                    .duration(200)
                    .attr("r", 3);
                tooltip.transition().duration(500).style("opacity", 0);
            })
            .append("title")
            .text(function(d){
                return `Sugar supply\nYear: ${d.year_string}\nConsumption: ${d.sugar_supply}`
            });

        // create xAxis object
        var xAxis = d3.axisBottom()
                    .ticks(5)
                    .scale(xScale)
        
        // create yAxis object
        var yAxis = d3.axisLeft()
                    .ticks(10)
                    .scale(yScale)
        
        // draw x-axis on svg
        svg.append("g")
            .attr("transform","translate(0,"+(h-padding)+")")
            .call(xAxis);

        // draw y-axis on svg
        svg.append("g")
            .attr("transform","translate("+ padding + ",0)")
            .call(yAxis)
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
            .attr("x", -h/6)
            .attr("y", 20)
            .attr("transform", "rotate(-90)")
            .style("font-size", "16px")
            .text("Consumption (measured in grams per capita per day)");
        
        // add title for chart
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", padding/1.2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Food consumption among OECD countries (1995 - 2020)");
        
        // define svg to draw the labels
        var svglabels = d3.select("#labels")
                    .append("svg")
                    .attr("width",200)
                    .attr("height",200)
        // define keys
        var keys = ["Total fat supply","Total protein supply","Sugar supply"]
        var color = d3.scaleOrdinal()
                        .domain(keys)
                        .range(['blue','black','green'])
                        svglabels.selectAll("mydots")
                        .data(keys)
                        .enter()
                        .append("circle")
                          .attr("cx", 5)
                          .attr("cy", function(d,i){ return 90 + i*25})
                          .attr("r", 4)
                          .style("fill", function(d){ return color(d)})
                      
                      // Add one dot in the legend for each name.
                      svglabels.selectAll("mylabels")
                        .data(keys)
                        .enter()
                        .append("text")
                          .attr("x", 10)
                          .attr("y", function(d,i){ return 90 + i*25}) 
                          .style("fill", function(d){ return color(d)})
                          .text(function(d){ return d})
                          .attr("text-anchor", "left")
                          .style("alignment-baseline", "middle")
                          .style("font-size", "12px");
        
    }
// function to update chart according dropdown input
function updatechart(value){
    var country = value;
    d3.csv("assets/food_consumption_aggregated_countries.csv",function(d){
        return {
            // generate object
            country: d.Country,
            year: new Date(+d.Year,0),
            year_string: d.Year,
            fat_supply: +d['Total fat supply'],
            total_protein_supply: +d['Total protein supply'],
            sugar_supply: +d['Sugar supply']
        }
    }).then(function(data){
        // filter dataset by the selected country
        dataset = data.filter(function(d){
            return d.country == country;
        })
        // checks if svg are existing or not
        if(d3.select("#chart").select("svg").node() && d3.select("#labels").select("svg").node()){
            d3.select("#chart").select("svg").remove();
            d3.select("#labels").select("svg").remove();
        }
        
        // function will be called to generate the line chart
        lineChart(dataset)
    })
}

// define state of chart when page is loaded
var value = "Average OECD";
updatechart(value)

