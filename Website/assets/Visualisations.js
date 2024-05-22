function Chloro() {

    const zoom = d3.zoom()


    var w = 950; //chart width
    var h = 600; //chart height
    const xOrigin = w / 2;
    const yOrigin = h / 2;

    // variables used to setup geopath visuals
    const projection = d3.geoMercator()
        .center([0, 0])
        .translate([xOrigin, yOrigin])

    const path = d3.geoPath().projection(projection);

    // Var initilaised in loadData()
    var lifeExpecG

    var initiatedMaps = false; // whether maps have finished loading

    const zoomHandler = zoom
        .scaleExtent([1.0, 25.0])
        .translateExtent([[0, -200], [w, h + 150]])
        .on("zoom", function () {
            if (initiatedMaps) {
                lifeExpecG.attr("transform", d3.event.transform);
            }
        })

    var svg = d3.select("#chloro")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "grey")
        .attr("outline", "black")
        .call(zoomHandler);

    svg.on("mousemove", function () {
        var e = d3.event; // mouse event

        var target = e.target; // what element the mouse is over (country path)
        // if the target isn't the svg (means mouse moved over a country)
        if (target != svg.node()) {
            target = d3.select(target); // make target d3 version of element
            // show country info
            var padding = 10; // extra position to add to make the tool tip more visible
            var x = e.pageX + (4 * padding * -1);
            var y = e.pageY + 2 * padding;
            // get data stored under country element when it is created
            var name = target.attr("name");
            var ISO = target.attr("ISO");
            var percentage = target.attr("percentage");

            // fill in country info text
            if (percentage) {
                d3.select("#countryPercentage").text(percentage + " Years")
            } else {
                d3.select("#countryPercentage").text("N/A")
            }
            d3.select("#countryName").text(name)
            d3.select("#countryISO").text("(" + ISO + ")")
            // make country info div visible and position it
            d3.select("#countryInfo")
                .style("left", x + "px")
                .style("top", y + "px")
                .style("display", "block")
        } else {
            d3.select("#countryInfo")
                .style("display", "none")
        }
    })
    svg.on("mouseleave", function () {
        d3.select("#countryInfo")
            .style("display", "none")
    })

    function loadData() {
        d3.json("assets/countries.json").then(function (json) {
            var countryData = []; // pull data for each country
            json.features.forEach(function (e) {
                countryData.push([e.properties.ADMIN, e.properties.ISO_A3]);
            })

            d3.csv("assets/2015_life_expectancy_updated.csv").then(function (csv) {
                csv.forEach(function (e) {
                    var name = e.Country;
                    countryData.forEach(function (data, i) {
                        // if names match in JSON with CVS file
                        if (data[0] == name) {
                            data[2] = e["Value"]
                            console.log(data[2])
                        }
                    })
                })

                // create a <g> for each map
                lifeExpecG = createBlankG(countryData, json)
                    .attr("percentage", function (d, i) { return countryData[i][2] })
                    .attr("fill", function (d, i) {
                        var cDataExist = countryData[i][2]; // if country has data return purple else
                        if (cDataExist) {
                            return "purple"
                        } else {
                            // if no data available, make it gray
                            return "gray";
                        }
                    })
                    .attr("fill-opacity", function (d, i) {
                        var cDataExist = countryData[i][2]; // if country has data return purple else
                        if (cDataExist) {

                            var opac = (cDataExist) / 100

                            if (opac < 70){
                                
                            }

                            return opac.toString();
                        } else {
                            // if no data available, 20%
                            return 0.2;
                        }

                    })
                initiatedMaps = true;
            })
        });
    }

    // creates a new g
    function createBlankG(countryData, json) {
        var g = svg.append("g").selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("name", function (d, i) { return countryData[i][0] })
            .attr("ISO", function (d, i) { return countryData[i][1] })
            .style("stroke", "darkgray")
            .style("stroke-width", 0.04)
            .on("mouseenter", function (d, i) {
                // hover over country
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                    .style("stroke-width", 0.5)
                    .style("stroke", "black")


            })
            .on("mouseleave", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("stroke-width", 0.04)
                    .style("stroke", "gray")
            })
        return g;
    }

    function reset() {
        zoom.scaleTo(d3.select("svg"), 1)
        zoom.translateTo(d3.select("svg"), xOrigin, yOrigin)
    }

    document.getElementById("reset").addEventListener("click", reset);

    loadData(); // load map data


}

function Sac() {
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
window.onload = Chloro;
window.onload = Sac;