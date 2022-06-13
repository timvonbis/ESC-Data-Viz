/* Scrollverhalten */

 $(function () { // wait for document ready
    // init
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "200%" // this works just fine with duration 0 as well
            // However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
            // Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
        }
    });

    // get all slides
    var slides = document.querySelectorAll("section.panel");

    // create scene for every slide
    for (var i=0; i<slides.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
            .setPin(slides[i], {pushFollowers: false})
           // .addIndicators() // add indicators (requires plugin)
            .addTo(controller);
    }
});


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

    console.log("hi");
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // create and append SVG object and append g object within

    let svg = d3.select("#language")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
        .attr("class", "lang-de")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.de) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang-fr")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.fr) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang-it")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.it) }));
    svg.append("path")
        .datum(data)
        .attr("class", "lang-en")
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

    //Legende


    var ordinal = d3.scaleOrdinal()
        .domain(["Englisch", "Deutsch", "Franz\u00f6sisch", "Italienisch"])
        .range(["blue", "gold", "red", "green"]);

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(20,20)");

    var legendOrdinal = d3.legendColor()

        .shape("circle")
        .shapeRadius(6)
        .shapePadding(6)
        .scale(ordinal);

    svg.select(".legendOrdinal")
        .call(legendOrdinal)
        .attr("transform", "translate(610,210)");


    //Erläuterung

   svg.append("foreignObject")
                .attr("x", width*0.35)
                .attr("y", height*0.2)
                .attr("width", "200")
                .attr("height", "400")
                .append("xhtml:body")
                .html('<div style="width: 100%px;"><p class="legende">In den Jahren 1966 bis 1972 durfte nur in der Landes&shy;sprache gesungen werden.</p><p class="legende">Zwischen &apos;83 und &apos;98 mussten nur noch wesent&shy;liche Teile in der Landes&shy;sprache gesungen werden.</p></div>');
            



});

/* Sprachanteil/Erfolg: Bubble Diagram */


