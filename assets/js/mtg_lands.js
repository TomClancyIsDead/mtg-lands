(function($) {
    cards=cards_data;

    function card_colors(card){
        return [...card.color].concat("");
    }
    function color_match(card, checked_colors){
        if (card.land_type === "dual land")
            required_color_matches = checked_colors.length >= 2 ? 2 : 1;
        else
            required_color_matches = 1;
        color_matches = card_colors(card).filter(n => checked_colors.includes(n));
        return (color_matches.length >= required_color_matches);
    }

    function get_cycles(data, land_types, color){
        var colors = color ? [...color] : [""];
        cycles = _.chain(data)
            .filter(function(card) {return _.includes(land_types, card.land_type)})
            .filter(function(card) {return color_match(card, colors);})
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
        colors = "";
        $("input[type=checkbox][name=land-colors]:checked:visible").each(function(){colors += $(this).val()});
        return colors;
    }

    function land_types(){
        types = [];
        $("input[type=checkbox][name=land-types]:checked:visible").each(function(){types.push($(this).val())});
        if (types == false)
            types = ["dual land", "five color", "spell land", "utility land"];
        return types;
    }

    $("input[type=checkbox][name=land-types]").change(function(){
        types = land_types();
        switch (types){
            case ["five color"]:
                $("#land-colors").hide();
                break;
            case ["dual land"]: 
                $("#land-colors").show();
                $("#colorless").hide();
                break;
            default:
                $("#land-colors").show();
                $("#colorless").show();
                break;
        }
        show_cycles(get_cycles(cards, types, land_colors()));
    });

    $("input[type=checkbox][name=land-colors]").change(function(){
        show_cycles(get_cycles(cards, land_types(), land_colors()));
    });

    show_cycles(get_cycles(cards, land_types(), land_colors()));
})(jQuery);