function init() {
    // function to generate bar chart
    function barChart(dataset){
        var w = 600;
        var h = 500;
        var padding = 75;
        var countries = dataset.map(d=>d.country)
        var data = dataset.map(d=>d.alcohol_value)
        // generate ordinal scale
        var xScale = d3.scaleBand()
        // calculate range of the domain
                        .domain(countries)
        // specify output range
                        .rangeRound([padding,w-padding])
                        .paddingInner(0.05);
        // generate numerical scale
        var yScale = d3.scaleLinear()
        // calculate range of the domain
                        .domain([0,d3.max(data)])
        // specify output range
                        .range([h-padding,padding])
                                   
        var svg = d3.select("body")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)
                                
                    
                    svg.selectAll("rect")
                        .data(data)
                        .enter()
                        .append("rect")
                        // scale x-attribute
                        .attr("x",function(d,i){
                            return xScale(countries[i])
                        })
                        // scale y-attribute
                        .attr("y",function(d){
                            return yScale(d);
                        })
                        .attr("width",xScale.bandwidth())
                        .attr("height",function(d){
                            return h-padding-yScale(d);
                        })
                        .attr("fill","blue");
        var xAxis = d3.axisBottom()
                    .scale(xScale);
        
        var yAxis = d3.axisLeft()
                    .ticks(15)
                    .scale(yScale)
                    .tickFormat(d3.format(".1f"));

            svg.append("g")
                .attr("transform","translate(0, "+(h - padding) + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");
            svg.append("text")
                .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 7) + ")")
                .style("text-anchor", "middle")
                .text("Country");
            // draw yAxis on the svg
            svg.append("g")
                .attr("transform","translate("+ padding + ",0)")
                .call(yAxis)
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", padding / 3)
                .attr("x", -h / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Alcohol Consumption (in litres per person)");
            // add title
            svg.append("text")
                .attr("x", w / 2)
                .attr("y", padding/1.2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Top 10 nations alcohol consumption (1995 - 2020)");
    }
    // load data and generate bar chart
    d3.csv("alcohol_top10.csv",function(d){
        return {
            // generate Data
            country: d.Country,
            alcohol_value: +d['Value']
        }
    }).then(function(data){
        barChart(data)
    })
}
window.onload = init;