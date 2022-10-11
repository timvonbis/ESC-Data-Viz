//#region Balkendiagramm Komponisten & Gender 
d3.json("./Resources/data/csvjson.json").then(function (data) {
    //  let widthInput = 800;
    // let heightInput = 500;
    let widthInput = parseInt(d3.select("div.object").style("width"), 10);
    let heightInput = parseInt(d3.select("div.object").style("height"), 10);
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;

    let svg = d3.select("#gender")
        .append("svg")
        .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let xScale = d3.scaleBand()
        .range([0, width])

        .padding(0)
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
            .domain([0, 100])
        // 0 bis max value
        //  .domain([0, d3.max(data, function (d) {  return d.Geschlecht;  })])
        ,

        yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(function (d) { return d + "%"; })


    yAxisGrid = d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat('')
        .tickSize(width);





    let gGender = svg.append("g")
        .attr("class", "compgender");

    gGender.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)

    gGender.append("g")
        .call(yAxis)
        .selectAll("path.domain")
        .remove();



    gGender.append("g")
        .call(yAxisGrid)
        .attr("class", "grid")
        .attr("transform", `translate(${width},0)`)
        .selectAll("path.domain")
        .remove();

    gGender.selectAll(".genderBar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return xScale(d.Jahr);
        })
        .attr("y", function (d) {
            return yScale(d.Geschlecht);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
            return height - yScale(d.Geschlecht);
        })

});

//#endregion
//#region Häufigkeit SPrachen 

d3.json("./Resources/data/sprache-alle.json").then(function (data) {

    //let widthInput = 800;
    //let heightInput = 400;

    let widthInput = parseInt(d3.select("div.object").style("width"), 10);
    let heightInput = parseInt(d3.select("div.object").style("height"), 10);

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
d3.json("./Resources/data/langsuccess.json").then(function (data) {

    // let widthInput = 800;
    // let heightInput = 600;

    let widthInput = parseInt(d3.select("div.object").style("width"), 10);
    let heightInput = parseInt(d3.select("div.object").style("height"), 10);

    let margin = { top: 80, right: 50, bottom: 100, left: 80 },
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

    /*    let tooltip = d3.select("div.fact.null.langsucc span")
            .append("p")
            .style("opacity", 0)
            .attr("class", "fact null langsucc"); 
    
        let mouseover = function (d) {
            tooltip
                .style("opacity", 1);
            d3.selectAll(".active-circle").style("fill", "white");
            d3.select(this).style("fill", "red").attr("class", "active-circle")
        }
        let mousemove = function (d) {
            tooltip
                .html(d.Land + "<br>Anteil der Songs in Landessprache:<br>" + d.AnteilSprache + "<br>Durchschnittlicher Platz:<br>" + d.Platz)
    
        }
    
        var mouseleave = function (d) {
            tooltip
                .transition()
                .duration(50)
                .style("opacity", 1)
    
        }*/

    //Auswahl
    let landAuswahl = "Greece";



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
        .attr("opacity", "0.4")


    //Legende
    svg.append("g")
        .append("text")
        .text("Anteil Songs in Landessprache")
        .attr("transform", "translate(-50,0) rotate(-90)")
        .attr("text-anchor", "end")

    svg.append("g")
        .append("text")
        .text("Durchschnittlicher Platz")
        .attr("transform", `translate(${width},${height + 45})`)
        .attr("text-anchor", "end")

    //Land-Label
    svg.selectAll(".kreis")
        .append("g")
        .attr("class", "label")
        .style("opacity", "0")
        .attr("class", function (d) { return d.Land + " label" })
        .append("text")
        .style("font-size", "0.8em")
        .text(function (d) { return d.LandDE })
        .attr("transform", function (d) { return "translate(" + parseInt(15 + parseInt(xScale(d.Platz))) + "," + parseInt(4.5 + parseInt(yScale(d.AnteilSprache))) + ")" })
        ;

    svg.selectAll(`g.kreis g.${landAuswahl}`)
        .attr("display", "inline")

    //Label Korrektur rechts
    svg.selectAll("g.Montenegro.label,g.San.Marino.label")
        .attr("transform", "translate(-28,0)")
        .attr("text-anchor", "end");

})



//#endregion
//#region Langprevalence
d3.json("./Resources/data/spracheanzahl.json").then(function (data) {

    console.log("3test");
    let widthInput = 300;
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
        .ticks(20);

    let yScaleTicksOnly = d3.axisLeft(yScale)
        .ticks(150)
        .tickFormat("")
        .tickSize(4);

    //Labels
    svg.selectAll("g")
        .attr("class", "labels")
        .data(data.filter(function (d) { return d.Anzahl > 7 }))
        .enter()
        .append("g")
        .attr("class", "labels")
        .attr("transform", function (d) { return "translate(30," + yScale(d.Platz) + ")" })
        .append("text")
        .text(function (d) { return d.Sprache }),

        //achse
        svg.append("g")
            .attr("class", "axis")
            .call(yScaleTicksOnly);

    svg.append("g")
        .call(yScaleTicks);



    //Legende
    svg.append("g")
        .append("text")
        .text("Durchschnittlicher Platz")
        .attr("transform", "translate(-40,-5) rotate(-90)")
        .attr("text-anchor", "end")
        .attr("class", "legende-text")

    //Korrektur für Lesbarkeit
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Russisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(25 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Hebr\u00e4isch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(-20 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "T\u00fcrkisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(10 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Spanisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(20 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Niederl\u00e4ndisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(-8 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Ungarisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(-5 + parseInt(yScale(d.Platz))) + ")" });
    svg.selectAll("g.labels")
        .filter(function (d) { return d.Sprache === "Estnisch" })
        .attr("transform", function (d) { return "translate(30," + parseInt(-5 + parseInt(yScale(d.Platz))) + ")" });


});
//#endregion
//#region langbarcomparison
let langCompData = [{ Sprache: "Landessprache", Platz: 16.8 }, { Sprache: "Andere Sprache", Platz: 19.0 }]

console.log("3test");
let widthInput = 600;
let heightInput = 600;

let margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = widthInput - margin.left - margin.right,
    height = heightInput - margin.top - margin.bottom;

let svg = d3.select("#langbarcomparison")
    .append("svg")
    .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Vorbereitung Skala
let yScale = d3.scaleLinear()
    .domain([40, 0])
    .range([0, height]);

let yScaleTicks = d3.axisLeft(yScale)
    .ticks(3)

/* svg.append("g")
 .attr("class", "axis")
 .call(yScaleTicks);*/

//Balken
svg.append("g")
    .attr("class", "balken")
    .selectAll("g.balken")
    .data(langCompData)
    .enter()
    .append("rect")
    .attr("width", "150")
    .style("fill", "white")
    .attr("height", function (d) {
        return height - yScale(d.Platz);
    })

    .attr("y", function (d) {
        return 10 + yScale(d.Platz);
    })
    .attr("x", function (d) {
        return 50
    })

    .filter(function (d) { return d.Sprache === "Landessprache" })
    .attr("x", function (d) {
        return 400
    })


//#endregion



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
tl.to("#fragez", { opacity: 1, duration: 1, })
tl.to("#buhne", { opacity: 0.8, duration: 0.5, delay: 6 })

tl.to("#buhne", { opacity: 0.3, duration: 0.5, delay: 0.2 })
tl.to("#fragez", { opacity: 0.3, duration: 0.5 })
tl.to("#titeleins", { opacity: 1, duration: 0.5 })
tl.add(frageTl())
tl.to("#titeleins", { y: 0, ease: Power1.easeout, duration: 0.5 })
tl.to("#titeleins", { opacity: 0, duration: 1, delay: 4 })
tl.to("#titelzwei", { opacity: 1, duration: 0.5 })
tl.to("#titelzwei", { opacity: 1, duration: 1, delay: 4 })


function frageTl() {
    let tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
    tl.to("#fragez", { y: 5, ease: Power1.easeOut, duration: 1 });
    tl.to("#fragez", { y: 0, ease: Power1.easeOut, duration: 1.5 });
}

//#endregion
//#region Häufigkeiten Kompnisten und Texter
d3.json("./Resources/data/kompo.json").then(function (data) {

    let widthInput = parseInt(d3.select("div.object").style("width"), 10);
    let heightInput = parseInt(d3.select("div.object").style("height"), 10);

    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;

    // create and append SVG object and append g object within

    let svg = d3.select("#anzahlKompo")
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
        .domain([3, 0])
        .range([0, height]);


    //Legende
    svg.select("g")
        .append("text")
        .text("Anzahl Songs")
        .attr("transform", "translate(-40,0) rotate(-90)")
        .attr("text-anchor", "end")

    //Linie
    svg.append("path")
        .datum(data)
        .attr("class", "kompo texter")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.Texter) }));
    svg.append("path")
        .datum(data)
        .attr("class", "kompo komponisten")
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.Jahr) })
            .y(function (d) { return yScale(d.Komponisten) }));

    // X-Achse (Jahre)
    let xScaleTicks = d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.format(""));

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xScaleTicks);

    // Y-Achse (Anzahl Lieder)            
    let yScaleTicks = d3.axisLeft(yScale)
        .ticks(8);

    svg.append("g")
        .attr("class", "axis")
        .call(yScaleTicks);


});

//#endregion

//#region Video-title
const videoTitle = gsap.utils.toArray('div.video-container');
videoTitle.forEach(videoContainer => {

    let overlay = videoContainer.querySelector("img.overlay"),
        video = videoContainer.querySelector("video"),
        text = videoContainer.querySelector(".video-content")
    tl = gsap.timeline({
        scrollTrigger: {
            trigger: videoContainer,
            scrub: true,
            markers: false,
            pin: true
        }
    });
    //   tl.from(video, {"filter": "grayscale(0%)"}, 1)
    //  tl.from(overlay, {opacity: 0}, 1)
    tl.from(text, { opacity: 0 }, 2)
    tl.to(text, { delay: 1 }, 3)


}
);

//Pinnen von Diagrammen
ScrollTrigger.refresh();
const diagrammBox = gsap.utils.toArray("section.diagramm.pin")
diagrammBox.forEach(box => {
    let pinnedObject = box.querySelector("div.object")
    ScrollTrigger.create({
        trigger: box,
        pin: pinnedObject,
        start: "top top",
        end: "bottom bottom"
    })
})

//#endregion
//#region Scroll-Zeug

let iconTl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
iconTl.to("#scroll-icon", { y: 5, ease: Power2.easeOut, duration: 0.3 });
iconTl.to("#scroll-icon", { y: 0, duration: 0.7 });

let langEnterDrei = function (d) {
    d3.select("path.lang.de")
        .transition()
        .duration(100)
        .style("stroke", "gold")
        .style("stroke-width", "1.2px")
    d3.select("path.lang.fr")
        .transition()
        .duration(100)
        .style("stroke", "lightblue")
        .style("stroke-width", "1.2px")
    d3.select("path.lang.it")
        .transition()
        .duration(300)
        .style("stroke", "green")
        .style("stroke-width", "1.2px")
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
        .style("stroke-width", "1.2px")

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

ScrollTrigger.refresh();

ScrollTrigger
    .create({
        trigger: "div.fact.eins.lang",
        start: "top 20%",
        end: "bottom 70%",
        markers: false,
        onEnter: langEnterEins,
        onLeave: langLeaveEins,
        onEnterBack: langEnterEins,
        onLeaveBack: langLeaveEins,

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

//Bubble

let bubbleEnterEins = function (d) {
    d3.selectAll("g.Italy.label,g.Sweden.label,g.Russia.label,g.Ukraine.label,g.Azerbaijan.label,g.Turkey.label,g.United.Kingdom.label")
        .transition()
        .duration(200)
        .style("opacity", "1")
};

let bubbleLeaveEins = function (d) {
    d3.selectAll("g.Italy.label,g.Sweden.label,g.Russia.label,g.Ukraine.label,g.Azerbaijan.label,g.Turkey.label,g.United.Kingdom.label")
        .transition()
        .duration(200)
        .style("opacity", "0")
};

let bubbleEnterZwei = function (d) {
    d3.selectAll("g.Ireland.label,g.Spain.label,g.France.label,g.Germany.label,g.Austria.label,g.Switzerland.label,g.Portugal.label,g.Latvia.label,g.Armenia.label,g.Moldova.label,g.Slovenia.label")
        .transition()
        .duration(200)
        .style("opacity", "1")
};

let bubbleLeaveZwei = function (d) {
    d3.selectAll("g.Ireland.label,g.Spain.label,g.France.label,g.Germany.label,g.Austria.label,g.Switzerland.label,g.Portugal.label,g.Latvia.label,g.Armenia.label,g.Moldova.label,g.Slovenia.label")
        .transition()
        .duration(200)
        .style("opacity", "0")
};

let bubbleEnterDrei = function (d) {
    d3.selectAll("g.Belarus.label,g.Montenegro.label,g.San.Marino.label,g.North.Macedonia.label")
        .transition()
        .duration(200)
        .style("opacity", "1")
};

let bubbleLeaveDrei = function (d) {
    d3.selectAll("g.Belarus.label,g.Montenegro.label,g.San.Marino.label,g.North.Macedonia.label")
        .transition()
        .duration(200)
        .style("opacity", "0")
};

ScrollTrigger.refresh();

ScrollTrigger
    .create({
        trigger: "div.fact.eins.bubble",
        start: "top 20%",
        end: "bottom 70%",
        markers: false,
        onEnter: bubbleEnterEins,
        onLeave: bubbleLeaveEins,
        onEnterBack: bubbleEnterEins,
        onLeaveBack: bubbleLeaveEins,

    });

ScrollTrigger.create({
    trigger: "div.fact.zwei.bubble",
    start: "top 20%",
    end: "bottom 70%",
    onEnter: bubbleEnterZwei,
    onLeave: bubbleLeaveZwei,
    onEnterBack: bubbleEnterZwei,
    onLeaveBack: bubbleLeaveZwei
});
ScrollTrigger.create({
    trigger: "div.fact.drei.bubble",
    start: "top 20%",
    end: "bottom top",
    onEnter: bubbleEnterDrei,
    onLeave: bubbleLeaveDrei,
    onEnterBack: bubbleEnterDrei,
    onLeaveBack: bubbleLeaveDrei,
    markers: false
});
let kompoEnterZwei = function (d) {
    d3.select("path.kompo.komponisten")
        .transition()
        .duration(300)
        .style("stroke", "white")
        .style("stroke-width", "1.2px")

};

let kompoLeaveZwei = function (d) {
    d3.select("path.kompo.komponisten")
        .transition()
        .duration(300)
        .style("stroke", "grey")
        .style("stroke-width", "1px")

};

let kompoEnterDrei = function (d) {
    d3.select("path.kompo.texter")
        .transition()
        .duration(300)
        .style("stroke", "white")
        .style("stroke-width", "1.2px")

};

let kompoLeaveDrei = function (d) {
    d3.select("path.kompo.texter")
        .transition()
        .duration(300)
        .style("stroke", "grey")
        .style("stroke-width", "1px")

};


ScrollTrigger.create({
    trigger: "div.fact.zwei.kompo",
    start: "top 20%",
    end: "bottom 70%",
    onEnter: kompoEnterZwei,
    onLeave: kompoLeaveZwei,
    onEnterBack: kompoEnterZwei,
    onLeaveBack: kompoLeaveZwei
});
ScrollTrigger.create({
    trigger: "div.fact.drei.kompo",
    start: "top 20%",
    end: "bottom top",
    onEnter: kompoEnterDrei,
    onLeave: kompoLeaveDrei,
    onEnterBack: kompoEnterDrei,
    onLeaveBack: kompoLeaveDrei,

});





//#endregion
//#region Parallax and horizontal scroll

const horizontalscroll = gsap.utils.toArray('.horizontal-scroll');
horizontalscroll.forEach(horizontalscroll => {
    gsap.to(horizontalscroll, {
        xPercent: -80,
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-scroll-container",
            scrub: 0.1,
            markers: false,
            pin: true,
            end: "+=4000"
        }
    })
});





//#endregion

//#region Karte render
//#region karte1


let activeYear = "j1959"
let kartedrei = function (activeYear) {

    // The svg

    let widthInput = parseInt(d3.select("div.object-full").style("width"), 10);
    let heightInput = parseInt(d3.select("div.object-full").style("height"), 10);

    //let widthInput = 1300;
    //let heightInput = 1000;

    let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = widthInput - margin.left - margin.right,
        height = heightInput - margin.top - margin.bottom;


    let svg = d3.select("#figure-karte")
        .append("svg")
        .attr("viewBox", `0 0 ${widthInput} ${heightInput}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    console.log("test-karte");

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoNaturalEarth1()
        .center([0, 5])
        .scale(220)


        .center([0, 0])
        .translate([width / 2, height / 2]);

    // Data and color scale
    let data1956 = new Map()
    let data1960 = new Map()
    let data1970 = new Map()
    let data1980 = new Map()
    let data1990 = new Map()
    let data2000 = new Map()
    let data2010 = new Map()
    let data2020 = new Map()
    const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["MediumAquaMarine", "white"]);

    // Load external data and boot
    Promise.all([
        d3.json("./Resources/map/world.geojson"),
        d3.csv("./Resources/map/readyforjson.csv", function (d) {
            data1956.set(d.code, +d.j1956)
            data1960.set(d.code, +d.j1960)
            data1970.set(d.code, +d.j1970)
            data1980.set(d.code, +d.j1980)
            data1990.set(d.code, +d.j1990)
            data2000.set(d.code, +d.j2000)
            data2010.set(d.code, +d.j2010)
            data2020.set(d.code, +d.j2020)

        })
    ]).then(function (loadData) {
        let topo = loadData[0]

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
        // set the color of each country
        //   .style("stroke", "0")
        //   .style("fill", function (d) {
        //       d.total = data1956.get(d.code) || 0;
        //       return colorScale(d.total);

        //   })


        //   .filter(function(d){return data.get(d.code) === 1})
        //  .attr("class", "funztsiebzehn")

        svg.selectAll("path")
            .classed("dataland", true)
        svg.selectAll("path")
            .filter(function (d) { return data1956.get(d.code) === 1 })
            .classed("data1956", true);
        svg.selectAll("path")
            .filter(function (d) { return data1960.get(d.code) === 1 })
            .classed("data1960", true);
        svg.selectAll("path")
            .filter(function (d) { return data1970.get(d.code) === 1 })
            .classed("data1970", true);
        svg.selectAll("path")
            .filter(function (d) { return data1980.get(d.code) === 1 })
            .classed("data1980", true);
        svg.selectAll("path")
            .filter(function (d) { return data1990.get(d.code) === 1 })
            .classed("data1990", true);
        svg.selectAll("path")
            .filter(function (d) { return data2000.get(d.code) === 1 })
            .classed("data2000", true);
        svg.selectAll("path")
            .filter(function (d) { return data2010.get(d.code) === 1 })
            .classed("data2010", true);
        svg.selectAll("path")
            .filter(function (d) { return data2020.get(d.code) === 1 })
            .classed("data2020", true);

        console.log("karte fertig");
        karteAni()
    })
}



//#region Karte Scroll und ANimation
let ani1956 = function () {
    d3.selectAll(".dataland")
        .style("fill", "purple");
    console.log("purple");
};


let karteAni = function () {
    console.log("purple2");
    let tlMap = gsap.timeline({
        scrollTrigger: {
            trigger: "#section-karte",
            pin: true,
            start: "top top",
            end: "+=2000px",
            scrub: true,
            markers: false,
            snap: {
                snapTo: "labels", // snap to the closest label in the timeline
                duration: { min: 0.1, max: 0.4 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
                delay: 0, // wait 0.2 seconds from the last scroll event before doing the snapping
             
            }
        }
    })  
    tlMap
   
        .to(".data1956", { "fill-opacity": 1, duration: 1 }, "0")
        .to("#karte-1956", { opacity: 1, duration: 1, }, "0")
        .addLabel("Jahr1956", ">1")
       
      
        .to("#karte-1956", { opacity: 0, duration: 1 }, ">1")
        .to(".data1956", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data1960", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-1960", { opacity: 1, duration: 1 }, "<")
          .addLabel("Jahr1960", ">1")

        .to("#karte-1960", { opacity: 0, duration: 1 }, ">1")
        .to(".data1960", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data1970", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-1970", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr1970", ">1")

        .to("#karte-1970", { opacity: 0, duration: 1 }, ">1")
        .to(".data1970", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data1980", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-1980", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr1980", ">1")

        .to("#karte-1980", { opacity: 0, duration: 1 }, ">1")
        .to(".data1980", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data1990", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-1990", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr1990", ">1")

        .to("#karte-1990", { opacity: 0, duration: 1 }, ">1")
        .to(".data1990", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data2000", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-2000", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr2000", ">1")

        .to("#karte-2000", { opacity: 0, duration: 1 }, ">1")
        .to(".data2000", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data2010", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-2010", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr2010", ">1")

        .to("#karte-2010", { opacity: 0, duration: 1 }, ">1")
        .to(".data2010", { "fill-opacity": 0, duration: 1 }, "<")
        .to(".data2020", { "fill-opacity": 1, duration: 1, overwrite: true }, ">")
        .to("#karte-2020", { opacity: 1, duration: 1 }, "<")
        .addLabel("Jahr2020", ">1")


};

kartedrei(activeYear);

//#endregion
ScrollTrigger.refresh();

const parallaxes = gsap.utils.toArray('.parallax');
parallaxes.forEach(parallax => {
    gsap.to(parallax, {
        y: -100,
        scrollTrigger: {
            trigger: parallax,
            scrub: true,
        }
    })
});

const parallaxesweak = gsap.utils.toArray('.parallaxweak');
parallaxesweak.forEach(parallaxweak => {
    gsap.to(parallaxweak, {
        y: -50,
        scrollTrigger: {
            trigger: parallaxweak,
            scrub: true
        }
    })
});
const parallaxesstrong = gsap.utils.toArray('.parallaxstrong');
parallaxesstrong.forEach(parallaxstrong => {
    gsap.to(parallaxstrong, {
        y: -180,
        scrollTrigger: {
            trigger: parallaxstrong,
            scrub: true
        }
    })
});
