

/* Balkendiagramm Komponisten & Gender */

d3.json("./Resources/data/csvjson.json", function (data) {

    let svgGender = d3.select("svg.compgender"),
        margin = 100,
        width = svgGender.attr("width") - margin,
        height = svgGender.attr("height") - margin,
        heightZehn = height + 10,
        padding = 0.,

        xScale = d3.scaleBand()
            .range([0, width])

            .padding(padding)
            .domain(data.map(function (d) {
                return d.Jahr;
            })),

        xScaleAxis = d3.scaleLinear()

            .range([0, width])
            .domain([d3.min(data, function (d) {
                return d.Jahr
            }),
            d3.max(data, function (d) {
                return d.Jahr;

            })]),
        xAxis = d3.axisBottom(xScaleAxis)
            .ticks(7)
            .tickFormat(d3.format("d")),


        yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, function (d) {
                return d.Geschlecht;
            })]),

        yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(function (d) { return d + "%"; });

    yAxisGrid = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat('')
        .tickSize(700);

    let gGender = svgGender.append("g")
        .attr("class", "compgender");

    gGender.append("g")
        .call(xAxis)
        .attr("transform", "translate(50," + heightZehn
            + ")");

    gGender.append("g")
        .call(yAxis)
        .attr("transform", "translate(50,10)");

    gGender.append("g")
        .call(yAxisGrid)
        .attr("class", "grid")
        .attr("transform", "translate(750,10)");

    gGender.selectAll(".genderBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return 50 + xScale(d.Jahr);
        })
        .attr("y", function (d) {
            return 10 + yScale(d.Geschlecht);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.Geschlecht);
        })

});

/* Scatterplot Sprache, Länder, Punkte & Zeitverlauf */

d3.json("./Resources/data/sprache-alle.json", function (data) {

    let widthInput = 800;
    let heightInput = 400;

    console.log("hi");
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;

    // create and append SVG object and append g object within

    let svg = d3.select("#language")
        .append("svg")
        .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Vorbereitung Skalen
    let xScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.Jahr }),
        d3.max(data, function (d) { return d.Jahr })])
        .range([0, width]);
    let yScale = d3.scaleLinear()
        .domain([d3.max(data, function (d) { return d.en }), 0])
        .range([0, height]);

    // Erläuterung Regeln


    // Bereich 1
    let anfang = 1966,
        ende = 1972,
        breite = xScale(ende) - xScale(anfang);
    svg.append("g")
        .attr("class", "bereich")
        .append("rect")
        .attr("class", "lang-allowed")
        .attr("x", xScale(anfang))
        .attr("y", 0)
        .attr("height", height)
        .attr("width", breite)
        .attr("fill", "lightgrey");

    //Bereich 2
    anfang = 1977;
    ende = 1998;
    breite = xScale(ende) - xScale(anfang);
    svg.select("g.bereich")
        .append("rect")
        .attr("class", "lang-allowed")
        .attr("x", xScale(anfang))
        .attr("y", 0)
        .attr("height", height)
        .attr("width", breite)
        .attr("fill", "lightgrey");


    //Linie


    svg.append("path")
        .datum(data)
        .attr("class", "lang de")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.de) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang fr")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.fr) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang it")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.it) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang en")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.en) })
        );


    // X-Achse (Jahre)
    let xScaleTicks = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.format(""));

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xScaleTicks);


    // Y-Achse (Anzahl Lieder)            
    let yScaleTicks = d3.axisLeft(yScale)
        .ticks(10);

    svg.append("g")
        .attr("class", "axis")
        .call(yScaleTicks);


});

/* Sprachanteil/Erfolg: Bubble Diagram */
d3.json("./Resources/data/langsuccess.json", function (data) {

    let widthInput = 800;
    let heightInput = 400;

    console.log("hi");
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;

    // create and append SVG object and append g object within

    let svg = d3.select("#langsuccess")
        .append("svg")
        .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Vorbereitung Skalen
    let xScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.Platz }),
        d3.max(data, function (d) { return d.Platz })])
        .range([0, width]);
    let yScale = d3.scaleLinear()
        .domain([d3.max(data, function (d) { return d.AnteilSprache }), 0])
        .range([0, height]);


    //Linie

    // X-Achse (Jahre)
    let xScaleTicks = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.format(","));


    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xScaleTicks);


    // Y-Achse (Anzahl Lieder)            
    let yScaleTicks = d3.axisLeft(yScale)
        .ticks(10)
        .tickFormat(d3.format(".0%"));

    svg.append("g")
        .attr("class", "axis")
        .call(yScaleTicks);

    //Kreise
    svg.selectAll(".kreise")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d){return xScale(d.Platz);})
        .attr("cy", function(d){return yScale(d.AnteilSprache);})
        .attr("r", "7")
        .style("fill", "red");
});


//Scroll-Zeug