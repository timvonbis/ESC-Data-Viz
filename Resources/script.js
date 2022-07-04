//#region Balkendiagramm Komponisten & Gender 
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

//#endregion
//#region Häufigkeit SPrachen 

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
        .attr("fill", "lightgrey")
        .attr("opacity", "0.2");

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
        .attr("fill", "lightgrey")
        .attr("opacity", "0.2");

//Legende
svg.select("g")
.append("text")
.text("Anzahl Songs")
.attr("transform", "translate(-40,0) rotate(-90)")
.attr("text-anchor", "end")

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

    //Interaktiv
    let langEnter = function (d) {
        d3.select("path.lang.en")
            .style("stroke", "green");
        console.log("test");

    };

    console.log("test2");


});
//#endregion
//#region Sprachanteil/Erfolg: Bubble Diagram
d3.json("./Resources/data/langsuccess.json", function (data) {

    let widthInput = 800;
    let heightInput = 600;

    let margin = { top: 10, right: 30, bottom: 50, left: 60 },
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

        //tooltip

    let tooltip = d3.select("div.fact.null.langsucc span")
        .append("p")
        .style("opacity", 0)
        .attr("class", "fact null langsucc");

    let mouseover = function (d) {
        tooltip
            .style("opacity", 1);
            d3.selectAll(".active-circle").style("fill", "white");
            d3.select(this).style("fill", "red").attr("class", "active-circle")
    }
    let mousemove = function(d) {
        tooltip
          .html(d.Land + "<br>Anteil der Songs in Landessprache:<br>" + d.AnteilSprache +"<br>Durchschnittlicher Platz:<br>" +d.Platz)

      }
    
      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(50)
          .style("opacity", 1)
    
      }

    //Kreise
    svg.append("g")
    .attr("class", "kreise")
    .selectAll("g.kreise")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "kreis")
        .append("circle")
        .attr("cx", function (d) { return xScale(d.Platz); })
        .attr("cy", function (d) { return yScale(d.AnteilSprache); })
        .attr("r", "8")
        .style("fill", "white")
        .attr("opacity", "0.6")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

        //Legende
svg.append("g")
.append("text")
.text("Anteil Songs in Landessprache")
.attr("transform", "translate(-50,0) rotate(-90)")
.attr("text-anchor", "end")

svg.append("g")
.append("text")
.text("Durchschnittlicher Platz")
.attr("transform", "translate(710,580)")
.attr("text-anchor", "end")

//Land-Label
svg.selectAll(".kreis")
.append("g")
.attr("class", "label")
.attr("opacity", "1" )
.append("text")
.text(function(d){return d.Land})
.attr("transform", function(d){return "translate("+ parseInt(15 + parseInt(xScale(d.Platz))) +"," + parseInt(6 + parseInt(yScale(d.AnteilSprache))) + ")"})



})



//#endregion
//#region Langprevalence
d3.json("./Resources/data/spracheanzahl.json", function (data) {

    console.log("3test");
    let widthInput = 600;
    let heightInput = 1200;

    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;

        let svg = d3.select("#langprevalence")
        .append("svg")
        .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Vorbereitung Skala
        let yScale = d3.scaleLinear()
        .domain([25, 10])
        .range([0, height]);

        let yScaleTicks = d3.axisLeft(yScale)
        .ticks(20)

    svg.append("g")
        .attr("class", "axis")
        .call(yScaleTicks);

    //Labels
    svg.selectAll("g")
    .attr("class", "sprachen")
    .data(data)
    .enter()
    .append("g")
    .filter(function(d){return d.Anzahl > 5})
    .attr("transform", function(d){return "translate(30," + yScale(d.Platz) + ")"})
    .append("text")
    .text(function (d) { return d.Sprache})

    //Legende
    svg.select("g")
    .append("text")
    .text("Durchschnittlicher Platz")
    .attr("transform", "translate(-30,-5) rotate(-90)")
    .attr("text-anchor", "end")

    //Korrektur für Lesbarkeit
    svg.selectAll("g")
    .filter(function(d){return d.Sprache === "Russisch"})
    .attr("transform", function(d){return "translate(30," + parseInt(20 + parseInt(yScale(d.Platz))) + ")"});
    svg.selectAll("g")
    .filter(function(d){return d.Sprache === "T\u00fcrkisch"})
    .attr("transform", function(d){return "translate(30," + parseInt(10 + parseInt(yScale(d.Platz))) + ")"});


});
//#endregion
//#region Splash-Screen Animation



let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".panel.splash",
        pin: true,
        start: "top top",
        end: "+=1200",
        scrub: "0.5"
    }
});
tl.to("#buhne", { opacity: 1, duration: 2, ease: Power4.easeout, })
tl.to("#fragez", { opacity: 1, duration: 1,  })
tl.to("#buhne", { opacity: 0.8, duration: 0.5, delay: 6 })

tl.to("#buhne", { opacity: 0.3, duration: 0.5, delay: 0.2})
tl.to("#fragez", { opacity: 0.3, duration: 0.5 })
tl.to("#titeleins", { opacity: 1, duration: 0.5 })
tl.add(frageTl())
tl.to("#titeleins", { y: 0, ease: Power1.easeout, duration: 0.5 })
tl.to("#titeleins", { opacity: 0, duration: 1,  delay: 4})
tl.to("#titelzwei", { opacity: 1, duration: 0.5})
tl.to("#titelzwei", { opacity: 1, duration: 1, delay: 4})


function frageTl() { let tl = gsap.timeline({repeat: -1, repeatDelay: 0});
tl.to("#fragez", {y:5,  ease: Power1.easeOut, duration: 1});
tl.to("#fragez", {y:0, ease: Power1.easeOut, duration: 1.5}); }

//#endregion
//#region Scroll-Zeug

let iconTl = gsap.timeline({repeat: -1, repeatDelay: 0.2});
iconTl.to("#scroll-icon", {y:5,  ease: Power2. easeOut, duration: 0.3});
iconTl.to("#scroll-icon", {y:0, duration: 0.7});

let langEnterDrei = function (d) {
    d3.select("path.lang.de")
        .transition()
        .duration(100)
        .style("stroke", "gold")
        .style("stroke-width", "2px")
    d3.select("path.lang.fr")
        .transition()
        .duration(100)
        .style("stroke", "lightblue")
        .style("stroke-width", "2px")
    d3.select("path.lang.it")
        .transition()
        .duration(300)
        .style("stroke", "green")
        .style("stroke-width", "2px")
};

let langLeaveDrei = function (d) {
    d3.selectAll("path.lang")
        .transition()
        .duration(300)
        .style("stroke", "grey")
        .style("stroke-width", "1px")

};

let langEnterZwei = function (d) {
    d3.select("path.lang.en")
        .transition()
        .duration(300)
        .style("stroke", "red")
        .style("stroke-width", "2px")

};

let langLeaveZwei = function (d) {
    d3.select("path.lang.en")
        .transition()
        .duration(300)
        .style("stroke", "grey")
        .style("stroke-width", "1px")

};
let langEnterEins = function (d) {
    console.log("zweifunzt")
    d3.selectAll("rect.lang-allowed")
        .transition()
        .duration(300)
        .style("fill", "white")
        .style("opacity", "0.9")


};

let langLeaveEins = function (d) {
    d3.selectAll("rect.lang-allowed")
        .transition()
        .duration(300)
        .style("fill", "lightgrey")
        .style("opacity", "0.2")

};


ScrollTrigger.create({
    trigger: "#video-lang",
    start: "top top",
    end: "bottom px",
    pin: "#video-lang",
    markers: false,

});

gsap.from("#title-lang", {
    y: 30,
    opacity: 0.0,
    scrollTrigger: {
        trigger: "#video-lang",
        start: "top top",
        end: "+=300",
        scrub: 0.3,
        markers: false,
    }
});
gsap.to("#video-test", {
    y: -50,
    opacity: 0.6,
    scrollTrigger: {
        trigger: "#video-lang",
        start: "top top",
        end: "+=300",
        scrub: true,
        markers: false

    }
});
ScrollTrigger.create({
    trigger: "section.diagramm.language div.side",
    start: "top top",
    end: "bottom bottom",
    pin: "section.diagramm.language div.object",
    markers: false,

});
ScrollTrigger.create({
    trigger: "section.diagramm.langsuccess div.side",
    start: "top top",
    end: "bottom bottom",
    pin: "section.diagramm.langsuccess div.object",
    markers: false,

});

ScrollTrigger.create({
    trigger: "div.fact.eins.lang",
    start: "top 20%",
    end: "bottom 70%",
    onEnter: langEnterEins,
    onLeave: langLeaveEins,
    onEnterBack: langEnterEins,
    onLeaveBack: langLeaveEins,
    markers: false,
});

ScrollTrigger.create({
    trigger: "div.fact.zwei.lang",
    start: "top 20%",
    end: "bottom 70%",
    onEnter: langEnterZwei,
    onLeave: langLeaveZwei,
    onEnterBack: langEnterZwei,
    onLeaveBack: langLeaveZwei
});
ScrollTrigger.create({
    trigger: "div.fact.drei.lang",
    start: "top 20%",
    end: "bottom top",
    onEnter: langEnterDrei,
    onLeave: langLeaveDrei,
    onEnterBack: langEnterDrei,
    onLeaveBack: langLeaveDrei,
    markers: false
});






  //Video-tile


//#endregion