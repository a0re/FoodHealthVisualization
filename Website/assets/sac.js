function init() {
    // function to generate bar chart
    function lineChart(){
        var w = 600;
        var h = 400;
        var padding = 60;

        // setup scales
        xScale = d3.scaleTime()
                   .domain([
                        d3.min(dataset,function(d) { return d.year; }),
                        d3.max(dataset,function(d) { return d.year; })
                   ])
                   .range([padding,w-padding])
        yScale = d3.scaleLinear()
                   .domain([0,d3.max(dataset,function(d) { return Math.max(d.fat_supply,d.total_protein_supply,d.sugar_supply); })])
                   .range([h-padding,padding])
        // generate line
        line1 = d3.line()
                 .x(function(d) { return xScale(d.year); })
                 .y(function(d) { return yScale(d.fat_supply); })
        line2 = d3.line()
                  .x(function(d) { return xScale(d.year); })
                  .y(function(d) { return yScale(d.total_protein_supply); })
        line3 = d3.line()
                  .x(function(d) { return xScale(d.year); })
                  .y(function(d) { return yScale(d.sugar_supply); })
        
        // generate svg
        var svgLc = d3.select("#sac")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)

            svgLc.append("path")
               .datum(dataset)
               .attr("class","line fat-supply")
               .attr("d",line1)
            
            svgLc.append("path")
               .datum(dataset)
               .attr("class","line total-protein-supply")
               .attr("d",line2)
            
            svgLc.append("path")
               .datum(dataset)
               .attr("class","line sugar-supply")
               .attr("d",line3)
            
            // create xAxis object
            var xAxis = d3.axisBottom()
                        .ticks(10)
                        .scale(xScale)
            // create yAxis object
            var yAxis = d3.axisLeft()
                        .ticks(15)
                        .scale(yScale)
            // draw xAxis on the svg
            svgLc.append("g")
                .attr("transform","translate(0,"+(h-padding)+")")
                .call(xAxis);
            // draw yAxis on the svg
            svgLc.append("g")
                .attr("transform","translate("+ padding + ",0)")
                .call(yAxis)
            // Add x-axis label
            svgLc.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", w / 2)
            .attr("y", h - 10)
            .text("Year");

            // Add y-axis label
            svgLc.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -h/2.5)
                .attr("y", 20)
                .attr("transform", "rotate(-90)")
                .text("Supply");
            var keys = ["Total fat supply","Total protein supply","Sugar supply"]
            var color = d3.scaleOrdinal()
                            .domain(keys)
                            .range(['blue','black','green'])
                            svgLc.selectAll("mydots")
                            .data(keys)
                            .enter()
                            .append("circle")
                              .attr("cx", 100)
                              .attr("cy", function(d,i){ return 30 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                              .attr("r", 7)
                              .style("fill", function(d){ return color(d)})
                          
                          // Add one dot in the legend for each name.
                          svgLc.selectAll("mylabels")
                            .data(keys)
                            .enter()
                            .append("text")
                              .attr("x", 120)
                              .attr("y", function(d,i){ return 30 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                              .style("fill", function(d){ return color(d)})
                              .text(function(d){ return d})
                              .attr("text-anchor", "left")
                              .style("alignment-baseline", "middle")
            
        }
        // load data and generate bar chart
        d3.csv("assets/food_consumption_aggregated.csv",function(d){
            return {
                // generate Date object
                year: new Date(+d.Year,0),
                fat_supply: +d['Total fat supply'],
                total_protein_supply: +d['Total protein supply'],
                sugar_supply: +d['Sugar supply']
            }
        }).then(function(data){
            dataset=data
            lineChart(data)
        })
}
window.onload = init;