function init() {

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
                            var cValue = cDataExist  // Calculate opacity based on data
                            if (cValue < 85 && cValue > 80) {
                                return '#54278f';
                            } else if (cValue < 80 && cValue > 76) {
                                return '#756bb1';
                            } else if (cValue < 76 && cValue > 74) {
                                return '#9e9ac8';
                            } else if (cValue < 74 && cValue > 72) {
                                return "#cbc9e2";
                            } else if (cValue < 72) {
                                return "#f2f0f7";
                            }
                        } else{
                            return "#969696"
                        }
                    })
                    .attr("fill-opacity", function (d, i) {
                        var cDataExist = countryData[i][2]; // Check if data exists for the country

                        if (cDataExist) {
                            return 1;

                        } else {
                            // If no data available, set opacity to 20%
                            return 0.2;
                        }
                    });

                initiatedMaps = true;
            })
        });
    }
    // Create a year slider
    var slider = d3.select("#slider")
        .append("input")
        .attr("type", "range")
        .attr("min", 1995)
        .attr("max", 2020)
        .attr("step", 1)
        .attr("value", 2020);

    // Select the slider and display elements
    var slider = d3.select("#slider");
    var selectedYear = d3.select("#selected-year");

    // Listen for slider changes
    slider.on("input", function () {
        var year = this.value;

        // Update the displayed year
        selectedYear.text(year);

        // Filter data based on selected year and update the map
        var filteredData = yourData.filter(function (d) {
            return d.year === year;
        });

        // Update the map based on the filtered data
        // Your code to update the chloropleth map goes here
    });


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
window.onload = init;