(function($) {
    cards=cards_data;

    function card_colors(card){
        return [...card.color].concat("");
    }
    function color_match(card, land_type, checked_colors){
        if (land_type === "dual land")
            required_color_matches = checked_colors.length >= 2 ? 2 : 1;
        else
            required_color_matches = 1;
        color_matches = card_colors(card).filter(n => checked_colors.includes(n));
        return (color_matches.length >= required_color_matches);
    }

    function get_cycles(data, land_type, color){
        var colors = color ? [...color] : [""];
        cycles = _.chain(data)
            .filter({type: `${land_type}`})
            .filter(function(card) {return color_match(card, land_type, colors);})
            .groupBy("set")
            .groupBy("cycle")
            .value();

        return(_.valuesIn(cycles));
    }
    function clear_cards(){
        $("#wrapper").empty()
    }
    function show_cycles(cycles) {
        clear_cards();
        // loop through cycles, creating different section for each
        _(cycles).forEach(function(cycle, i){
            $cycle = $("<div>", {class: `wrapper spotlight cycle style${(i%3)+1}` })
            if(i%2===1){
                $cycle.addClass("alt");
            }
            // console.log($div)
            $("#wrapper").append($cycle);
            // loop through sets, creating different subsections and displaying cards
            _(cycle).forEach(function(set){
                $set =$("<div>", {class: "set", id: `${set[0].cycle}-${set[0].set}`})
                $cycle.append($set)
                _(set).forEach(function(card){
                    $card = $(`<span>${card.name}<img src="${card.image_url}"></span>`);
                    $set.append($card);
                });
            });
        });
    }

    function land_colors(){
        color = ""
        $("input[type=checkbox][name=land-colors]:checked:visible").each(function(){color += $(this).val()})
        return color;
    }

    $("input[type=radio][name=land-type]").change(function(){
        switch (this.value){
            case "dual land":
                $("#land-colors").show();
                $("#colorless").hide();
                break;
            case "five color":
                $("#land-colors").hide();
                break;
            case "spell land":
                $("#land-colors").show();
                $("#colorless").show();
                break;
            case "utility land":
                $("#land-colors").show();
                $("#colorless").show();
                break;
        }
        show_cycles(get_cycles(cards, $("input[type=radio][name=land-type]:checked").val(), land_colors()));
    });
    $("input[type=checkbox][name=land-colors]").change(function(){
        show_cycles(get_cycles(cards, $("input[type=radio][name=land-type]:checked").val(), land_colors()));
    })
    show_cycles(get_cycles(cards, "dual land"))
})(jQuery);