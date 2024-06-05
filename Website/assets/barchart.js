function init() {
    // function to generate bar chart
    function barChart(dataset){
        var w = 600;
        var h = 500;
        var padding = 75;

        // generate bar chart labels
        var countries = dataset.map(d=>d.country)

        // retrieve y-axis data
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
        // define svg                         
        var svg = d3.select("#barchart")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)
                                
                    // draw each bar
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
                        // define width of svg according to x-axis scale
                        .attr("width",xScale.bandwidth())
                        // define height of svg after taking padding and scaled y-axis data
                        .attr("height",function(d){
                            return h-padding-yScale(d);
                        })
                        // fill each bar with blue color
                        .attr("fill","blue")
                        // generate tooltip for each bar
                        .append("title")
                        .text(function(d){
                            return d;
                        });

        // define x-axis
        var xAxis = d3.axisBottom()
                    .scale(xScale);

        // define y-axis
        var yAxis = d3.axisLeft()
                    .ticks(15)
                    .scale(yScale)
                    // format ticks to 1 decimal place
                    .tickFormat(d3.format(".1f"));

            // draw x-axis on svg
            svg.append("g")
                .attr("transform","translate(0, "+(h - padding) + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");
            // draw x-axis label on svg
            svg.append("text")
                .attr("transform", "translate(" + (w / 2) + " ," + (h - padding / 7) + ")")
                .style("text-anchor", "middle")
                .text("Country");
            
            // draw y-axis on svg
            svg.append("g")
                .attr("transform","translate("+ padding + ",0)")
                .call(yAxis)
            // draw y-axis label on svg
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", padding / 3)
                .attr("x", -h / 2)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Alcohol Consumption (in litres per person)");

            // add title for chart
            svg.append("text")
                .attr("x", w / 2)
                .attr("y", padding/1.2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Leading 10 OECD Nations in Alcohol Consumption (1995 - 2020)");
    }

    // load data
    d3.csv("assets/alcohol_top10.csv",function(d){
        return {
            // generate data
            country: d.Country,
            alcohol_value: +d['Value']
        }
    }).then(function(data){
        // generate bar chart
        barChart(data)
    })
}
window.onload = init;