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
        .on("zoom", function (event) {
            if (initiatedMaps) {
                lifeExpecG.attr("transform", event.transform);
            }
        })

    // Select the slider and display elements
    var slider = d3.select("#slider");
    var selectedYear = d3.select("#selected-year");

    var svg = d3.select(".chloro")
        .append("svg")
        .attr("id", "chloro")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "grey")
        .attr("outline", "black")
        .call(zoomHandler);

    // Create tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.on("mousemove", function (event) {
        var target = event.target; // what element the mouse is over (country path)
        // if the target isn't the svg (means mouse moved over a country)
        if (target != svg.node()) {
            target = d3.select(target); // make target d3 version of element
            // show country info
            var name = target.attr("name");
            var year = target.attr("year");
            var percentage = target.attr("percentage");

            // Build tooltip content
            var tooltipContent = `<div id="tooltip-title">${name}</div>`;
            if (percentage) {
                tooltipContent += `<div>${percentage} Years (${year})</div>`;
            } else {
                tooltipContent += `<div>N/A (${year})</div>`;
            }

            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            tooltip.html(tooltipContent)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        } else {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }
    })

    svg.on("mouseleave", function () {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    })

    var loadedCsv

    function loadData() {
        d3.json("assets/countries.json").then(function (json) {
            var countryData = []; // pull data for each country
            json.features.forEach(function (e) {
                countryData.push([e.properties.ADMIN, e.properties.ISO_A3]);
            })

            d3.csv("assets/life_expectancy_cleaned.csv").then(function (csv) {
                // cache loaded csv for later use
                loadedCsv = csv;
                console.log(loadedCsv);

                csv.forEach(function (e) {
                    var name = e.Country;
                    var year = e.Year;
                    countryData.forEach(function (data, i) {
                        // if names match in JSON with CVS file
                        if (data[0] == name) {
                            data[1] = year
                            data[2] = e["Value"]
                            // console.log(data[2])
                        }
                    })
                })

                // create a <g> for each map
                lifeExpecG = createBlankG(countryData, json)

                lifeExpecG.selectAll("path")
                    .attr("percentage", function (d, i) { return countryData[i][2] })
                    .attr("fill", function (d, i) {
                        var cDataExist = countryData[i][2]; // if country has data return purple else
                        if (cDataExist) {
                            var cValue = cDataExist  // Calculate opacity based on data
                            if (cValue > 84) {
                                return '#004529';
                            } else if (cValue <= 84 && cValue > 82) {
                                return "#006837";
                            } else if (cValue <= 82 && cValue > 80) {
                                return "#238443";
                            } else if (cValue <= 80 && cValue > 78) {
                                return "#41ab5d";
                            } else if (cValue <= 78 && cValue > 76) {
                                return '#78c679';
                            } else if (cValue <= 76 && cValue > 74) {
                                return '#addd8e';
                            } else if (cValue <= 74 && cValue > 72) {
                                return "#d9f0a3";
                            } else if (cValue <= 72 && cValue > 70) {
                                return "#f7fcb9";
                            } else if (cValue <= 70) {
                                return "#ffffe5";
                            }
                        } else {
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

    // Listen for slider changes
    slider.on("input", function () {
        var year = this.value; // Convert the value to a number
        // console.log(typeof (year));

        // Update the displayed year
        selectedYear.text(year);
        lifeExpecG.selectAll("path")

            .attr("fill", function (selectedData, index) {
                var sName = selectedData.properties.ADMIN;
                var thisPath = d3.select(this)
                thisPath.attr("year", year)

                // console.log(typeof (loadedCsv[1].Year));
                for (var element of loadedCsv) {
                    if (sName == element.Country && year == element.Year) {
                        var eValue = element.Value;
                        var modEValue = Number(eValue)
                        console.log(modEValue);
                        console.log(typeof (modEValue));
                        thisPath.attr("percentage", modEValue)
                        if (modEValue > 84) {
                            return '#004529';
                        } else if (modEValue <= 84 && modEValue > 82) {
                            return "#006837";
                        } else if (modEValue <= 82 && modEValue > 80) {
                            return "#238443";
                        } else if (modEValue <= 80 && modEValue > 78) {
                            return "#41ab5d";
                        } else if (modEValue <= 78 && modEValue > 76) {
                            return '#78c679';
                        } else if (modEValue <= 76 && modEValue > 74) {
                            return '#addd8e';
                        } else if (modEValue <= 74 && modEValue > 72) {
                            return "#d9f0a3";
                        } else if (modEValue <= 72 && modEValue > 70) {
                            return "#f7fcb9";
                        } else if (modEValue <= 70) {
                            return "#ffffe5";
                        }
                    }
                }
            })

        // console.log(lifeExpecG)
    });



    // creates a new g
    function createBlankG(countryData, json) {
        var g = svg.append("g")

        g.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("name", function (d, i) { return countryData[i][0] })
            .attr("year", 2020)
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